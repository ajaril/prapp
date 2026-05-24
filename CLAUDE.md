# CLAUDE.md — Séneca Fácil

Guía de contexto para sesiones de desarrollo con Claude Code.

## Qué es este proyecto

Extensión Chrome (Manifest V3) que automatiza el cuaderno de calificaciones de
**Séneca** (plataforma educativa de la Junta de Andalucía).
URL objetivo: `https://seneca.juntadeandalucia.es/seneca/*`

## Estructura de ficheros

| Fichero | Descripción |
|---------|-------------|
| `manifest.json` | MV3, permisos: `storage` |
| `content.js` | ~77KB — toda la lógica DOM. Es el fichero principal |
| `content.css` | Estilos inyectados (ocultar rúbricas/criterios) |
| `popup.html` | Interfaz del icono de extensión |
| `popup.js` | Lógica del popup (checkboxes → storage → mensajes a content.js) |
| `background.js` | Actualmente todo comentado, sin lógica activa |
| `CHANGELOG.md` | Historial de bugs y soluciones |

## Funcionalidades principales

### 1. Ocultar rúbricas / criterios
- Añade/quita clases CSS (`OcultaRubricasActivado`, `OcultaCriteriosActivado`) al `<body>`
- `abreviaCriterios()`: crea etiquetas cortas con los primeros chars hasta el 4º punto
- Estado persistido en `chrome.storage.local`

### 2. Clonar notas criteriales
- Detecta `input[id^='X_CRIEVACOMBAS_']`
- Al cambiar el primer input, `ClonaPrimeraNota()` copia el valor a todos los demás
- Controlado por checkbox "Clona notas criteriales" (clave storage: `Clonar`)

### 3. Pasar al alumno siguiente
- Si la nota cambia >1 punto o estaba vacía → pulsa `button.btnAlumnoSiguiente`
- **Depende de** checkbox "Pasa a alumno siguiente" (clave: `Pasar`)
- ⚠️ La importación NO usa esta función para no depender del checkbox

### 4. Ventana de importación desde Excel
Aparece automáticamente al cargar el cuaderno. Permite pegar datos con formato:
```
Apellidos Nombre    nota1   nota2   nota3
```
- Separador: tabulador o punto y coma
- 1 columna de nota → clona a todos los criterios (`ClonaPrimeraNota`)
- Varias columnas → cada nota a su criterio en orden (`inputNota[j].value`)
- Normaliza nombres: sin tildes, minúsculas (`normalizaTexto()`)

#### Timing del bucle de importación
```
nombre estable 2 ticks (1s) → escribe notas → espera 900ms → click siguiente
→ bloqueo 1500ms → nuevo alumno → nombre estable 1s → escribe...
```
~3-4 segundos por alumno. Lento a propósito para no saltarse alumnos.

#### Flags críticos del bucle
| Flag | Tipo | Propósito |
|------|------|-----------|
| `esperandoCambioDeAlumno` | bool | Bloquea reprocesar el mismo alumno |
| `ticksEstable` | int | Contador de ticks con nombre estable |
| `noActuarHasta` | timestamp | Bloqueo mínimo post-navegación (1500ms) |
| `haAbandonadoPrimerAlumno` | bool | Evita parada prematura por condición de fin |

### 5. Asistente PRA
- Gestiona ventanas del Plan de Refuerzo y Apoyo
- Conserva textos entre alumnos (`T_ACT_TAREAS`, `T_METODOLOGIA`, etc.)

### 6. Menú de selección
- Filtra por Cursos / Situaciones del alumno / Asignaturas
- Se activa con botón "Menu de selección" del popup

## Variables globales (objeto `VG`)

Creado por `VariablesGlobales()` al inicio del script. Las más relevantes:

| Variable | Uso |
|----------|-----|
| `VG.gestionandoCuadernoDeSeneca` | Evita entrar dos veces en el cuaderno |
| `VG.entrarEnCuadernoDeSeneca` | Flag para reiniciar al cambiar de alumno |
| `VG.primerAlumno` | Nombre del primer alumno procesado en importación |
| `VG.UsarAsistentePRA` | Activa/desactiva asistente PRA |
| `window.__ventanaExcelMostrada` | Evita mostrar la ventana de importación dos veces |

## Detector principal

`content.js` tiene un `setInterval` de 1s que comprueba qué está cargado en Séneca:
- `<input id="X_CRIEVACOMBAS_"` → cuaderno de calificaciones → muestra ventana importación
- "Elementos curriculares a reforzar" → PRA
- Tabla con cursos/alumnos → Menú de selección

## Verificación antes de subir

Siempre verificar sintaxis antes de recargar la extensión:
```bash
node --check content.js
```

## Desarrollo local

1. Editar ficheros en `/var/www/senecamasfacil/`
2. `node --check content.js` para verificar sintaxis
3. En Chrome: `chrome://extensions` → recargar la extensión
4. Probar en `https://seneca.juntadeandalucia.es/seneca/`
