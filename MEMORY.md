---
name: project-senecamasfacil
description: "Extensión Chrome \"Séneca Fácil\" — automatiza el cuaderno de calificaciones de Séneca (Junta de Andalucía)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 3490490f-0a6e-4081-8c14-2531abfbb237
---

# Séneca Fácil — Extensión Chrome

**Ruta:** `/var/www/senecamasfacil/`  
**Versión actual:** 0.0.7.0  
**Funciona en:** `https://seneca.juntadeandalucia.es/seneca/*`

## Ficheros principales

| Fichero | Qué hace |
|---------|----------|
| `manifest.json` | MV3, permisos: `storage` |
| `content.js` | ~77KB — toda la lógica que manipula el DOM de Séneca |
| `content.css` | Estilos inyectados (ocultar rúbricas/criterios) |
| `popup.html` + `popup.js` | Interfaz del icono de extensión |
| `background.js` | Actualmente todo comentado, sin lógica activa |

## Funcionalidades implementadas

### 1. Ocultar rúbricas
- Añade/quita clase `OcultaRubricasActivado` al `<body>`
- CSS oculta `div.s-prose`, `div.itemRespuesta`, `div.modal-calificacion`

### 2. Ocultar criterios (`OcultaCriteriosActivado`)
- Oculta `label.mr-2` (texto largo del criterio) y `hr.modalcuaderno`
- Llama a `abreviaCriterios()`: crea etiquetas cortas (`label.abreviada`) con solo los primeros caracteres hasta el 4º punto (ej: `"1.1.2.3."`)
- Estado guardado en `chrome.storage.local` clave `OcultaCriterios`

### 3. Clonar notas criteriales (`Clonar`)
- Detecta inputs `input[id^='X_CRIEVACOMBAS_']`
- Al cambiar el primer input, `ClonaPrimeraNota()` copia el valor a todos los demás
- Estado en `chrome.storage.local` clave `Clonar`

### 4. Pasar al alumno siguiente (`Pasar`)
- Si la nota cambia >1 punto o estaba vacía, pulsa `button.btnAlumnoSiguiente`
- Requiere que "Clonar" esté activo
- Estado en `chrome.storage.local` clave `Pasar`

### 5. Ventana de importación de notas desde Excel
- Aparece **automáticamente** al cargar el cuaderno de Séneca
- El usuario pega datos (nombre TAB nota1 TAB nota2...) copiados de hoja de cálculo
- **1 columna de nota** → clona a todos los criterios
- **Varias columnas** → cada nota va a su criterio en orden (`inputNota[j].value = notasAlumnoImportacion[j]`)
- Función: `BuscaCadaAlumnoYRellenaNota()` con `setInterval` de 400ms
- Espera 700ms tras escribir antes de pasar al siguiente alumno (`setTimeout`)
- Si los inputs no están aún en el DOM → devuelve `false` y reintenta (no avanza)
- Normaliza nombres: sin tildes, minúsculas (`normalizaTexto()`)

### 6. Asistente PRA
- Gestiona ventanas de PRA (Plan de Refuerzo y Apoyo)
- Conserva textos entre alumnos (`T_ACT_TAREAS`, `T_METODOLOGIA`, etc.)
- Checkbox en popup: `checkboxPRA` — al cambiar recarga la pestaña

### 7. Menú de selección
- Filtra por Cursos / Situaciones del alumno / Asignaturas
- Se activa con botón "Menu de selección" del popup o automáticamente
- Guarda selecciones en `chrome.storage.local`

## Variables globales (`VG`)
Objeto creado por `VariablesGlobales()`. Las más importantes:
- `VG.gestionandoCuadernoDeSeneca` — evita entrar dos veces
- `VG.entrarEnCuadernoDeSeneca` — flag para reiniciar al cambiar de alumno
- `VG.primerAlumno` — nombre del primer alumno procesado en importación (para detectar vuelta al inicio)
- `VG.UsarAsistentePRA` — activa/desactiva asistente PRA
- `window.__ventanaExcelMostrada` — evita mostrar la ventana de importación dos veces

## Detector principal (setInterval cada 1s)
El content.js usa un `setInterval` de 1s que comprueba qué página de Séneca está cargada y llama a la función correspondiente:
- Si hay `<input id="X_CRIEVACOMBAS_"` → cuaderno de calificaciones → `MuestraCuadroDeImportación()` + lógica de criterios/clonar
- Si hay texto "Elementos curriculares a reforzar" → PRA
- Si hay tabla con cursos/alumnos → Menú de selección

## Historial de cambios recientes
- **Importación multicolumna**: soporte para pegar varias columnas de notas (una por criterio)
- **Fix velocidad**: intervalo 300→400ms, retardo 700ms antes de PasaSiguienteAlumno, reintento si inputs no cargados
- **Fix pillado en primer alumno**: añadido flag `esperandoCambioDeAlumno` — evita que el intervalo (400ms) procese el mismo alumno varias veces mientras el setTimeout(700ms) no ha disparado aún
- **Fix parado en segundo alumno (muchos criterios)**: `PasaSiguienteAlumno()` tenía `if(pasaAlumno)` que dependía del checkbox "Pasa a alumno siguiente" — si estaba desmarcado, la importación nunca avanzaba. Ahora el import llama directamente al botón sin esa guarda. También se añade `dispatchEvent(change)` tras escribir cada valor para que Séneca lo registre correctamente
- **Fix saltos de alumnos**: rediseño del timing con 3 capas de seguridad: (1) `ticksEstable` — el nombre debe llevar 2 ticks×500ms=1s estable antes de escribir; (2) `noActuarHasta` — bloqueo de 1500ms tras click en "siguiente" para que Séneca cargue; (3) click retrasado 900ms. Ritmo resultante: ~3-4s por alumno, fiable
