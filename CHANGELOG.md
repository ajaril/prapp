# Changelog — PRApp

## [0.1.1] — 2026-06-17

### Cambios

#### Notas criteriales ocultas — solo PRA visible
PRApp es exclusivamente un asistente PRA. Toda la funcionalidad de importación
de notas criteriales ha sido deshabilitada:

- **popup.html**: secciones "Visualización" (ocultar rúbricas/criterios) y
  "Comportamiento" (clonar notas, pasar alumno) ocultas con `display:none`.
  El popup muestra únicamente el checkbox "Activa asistente PRA" y el botón
  "Menú de selección". Subtítulo actualizado a "Asistente PRA".
- **content.js**: `MuestraCuadroDeImportación` devuelve inmediatamente al inicio;
  la ventana de importación de notas nunca aparece aunque se detecte el cuaderno
  de calificaciones.

---

### Bugs corregidos

#### Bug — Ventana PRA bloqueante con formulario vacío
**Síntoma:** la ventana "¿Qué deseas hacer?" aparecía al entrar en el formulario
de texto de un alumno cuyo PRA estaba vacío, bloqueando toda interacción con
la página.

**Causa:** `VG.formularioConDatos` se establecía a `true` cuando un alumno tenía
texto en su PRA, pero nunca se reseteaba al navegar al siguiente alumno. El
siguiente alumno (con formulario vacío) heredaba el `true` del anterior, disparando
el popup incorrectamente.

**Solución:** añadida línea `VG.formularioConDatos = false;` justo antes de la
comprobación de contenido del formulario, de modo que se evalúa siempre sobre el
estado real del alumno actual.

---

#### Rediseño — Ventana de conservar texto PRA
La ventana emergente "¿Qué deseas hacer?" (que aparece cuando el alumno ya tiene
texto propio en Séneca y hay también texto guardado del alumno anterior) ha sido
rediseñada con el estilo visual de PRApp:

- Fondo: gradiente azul oscuro `#1a3a5c → #2471a3`
- Etiqueta "PRApp" en azul claro sobre el mensaje
- Dos botones de acción: "Conservar el texto actual" (transparente con borde) y
  "Usar texto del PRA anterior" (blanco con texto azul)

---

### Comportamiento del auto-relleno (recordatorio)
| Situación | Qué ocurre |
|-----------|-----------|
| Primera vez (storage vacío) | No pasa nada — formulario tal como lo deja Séneca |
| Alumno con formulario vacío + hay texto guardado | Auto-relleno silencioso con el texto del PRA anterior |
| Alumno con texto propio + hay texto guardado | Aparece la ventana para elegir entre conservar o sustituir |
| Alumno pulsa Aceptar | El texto actual se guarda en storage para el siguiente alumno |

---

## [0.1.0] — 2026-06-17

### Origen
PRApp es una extensión independiente creada a partir de Criteriapp, enfocada
exclusivamente en el asistente PRA (Plan de Refuerzo y Apoyo) de Séneca.

### Funcionalidades activas
- **Pantalla principal PRA** ("PROCESO DE ELABORACIÓN"): reorganiza la tabla
  eliminando `rowSpan` y muestra menú de selección por curso / alumno / asignatura.
- **Pantalla de apartados** ("APARTADOS A CUMPLIMENTAR"): oculta las filas que
  no corresponden a la asignatura seleccionada en el filtro.
- **Pantalla de elementos curriculares** ("ELEMENTOS CURRICULARES A REFORZAR"):
  activa todos los criterios automáticamente.
- **Formulario de contenido PRA** ("Elementos curriculares a reforzar"): guarda
  el texto introducido al pulsar Aceptar y lo ofrece como plantilla para el
  siguiente alumno.

---

## Historial previo (heredado de Criteriapp / Séneca Fácil)

## [0.0.8.0] — 2026-05-24

### Nuevas funcionalidades

#### Importación multicolumna de notas
La ventana de importación ahora soporta **múltiples columnas de notas**, una por criterio, en orden:

```
Apellidos, Nombre   7   8   6
```

- **1 columna de nota** → comportamiento original: clona la nota a todos los criterios
- **2 o más columnas** → cada columna va al criterio correspondiente en orden (`inputNota[j].value`)

---

### Bugs corregidos

#### Bug 1 — Velocidad excesiva: algunos alumnos no recibían la nota
**Síntoma:** al importar, el proceso iba tan rápido que a veces no escribía la nota
antes de pasar al siguiente alumno.

**Causa:** el `setInterval` (300ms) disparaba varias veces mientras el `setTimeout`
(para pulsar "siguiente") aún no había llegado. Los inputs podían no estar cargados.

**Solución:**
- Intervalo aumentado de 300ms → 500ms
- `EscribeLasNotas()` devuelve `false` si `inputNota.length === 0` (reintenta sin avanzar)
- Delay antes de pulsar "siguiente": 700ms → 900ms

---

#### Bug 2 — Pillado en el primer alumno (contador inflado)
**Síntoma:** el proceso escribía el primer alumno y se paraba.

**Causa:** entre la escritura de la nota (t=0) y el click en "siguiente" (t=900ms),
el `setInterval` disparaba 1-2 veces más sobre el mismo alumno.
Cada disparo incrementaba `contadorAlumnosProcesados`, que llegaba a `totalAlumnos`
prematuramente → `clearInterval` → parada.

**Solución:** añadido flag `esperandoCambioDeAlumno`. En cuanto se escribe la nota
se activa; solo se desactiva cuando el nombre del alumno en Séneca cambia realmente.
Mientras está activo, el intervalo hace `return` sin procesar nada.

---

#### Bug 3 — Parado en el segundo alumno (checkbox "Pasa a alumno siguiente")
**Síntoma:** con múltiples criterios (varias columnas), escribía el primer alumno
y nunca avanzaba al siguiente.

**Causa:** la función `PasaSiguienteAlumno()` contiene `if(pasaAlumno)` donde
`pasaAlumno` es la variable local ligada al checkbox **"Pasa a alumno siguiente"**
del popup. Si ese checkbox estaba desmarcado, la función no hacía nada y la
importación quedaba esperando eternamente un cambio de alumno que nunca llegaba.

**Solución:** la importación ya no llama a `PasaSiguienteAlumno()`. En su lugar
hace click directo sobre el botón, sin depender del estado del checkbox:
```javascript
const btn = document.querySelector("button[class='btn btn-sm btn-primary m-0 ml-1 btnAlumnoSiguiente']");
if (btn) btn.click();
```

---

#### Bug 4 — Todas las notas iguales (conflicto con ClonaPrimeraNota)
**Síntoma:** al importar con múltiples criterios, todos los criterios recibían
la nota del primer criterio, ignorando el resto de columnas.

**Causa:** se había añadido `dispatchEvent(new Event('change', { bubbles: true }))`
tras escribir cada valor para que Séneca lo registrase. El evento `change` sobre
`inputNota[0]` activaba el listener de `vigilaPrimeraNota`, que llama a
`ClonaPrimeraNota` y copia el valor de `inputNota[0]` a **todos** los demás inputs,
machacando los valores ya escritos para criterio 2, 3, etc.

**Solución:** eliminado el `dispatchEvent`. Los valores escritos directamente en
`.value` son recogidos correctamente por Séneca al navegar al siguiente alumno
(mismo comportamiento que ya funcionaba con 1 sola nota).

---

#### Bug 5 — Parada inmediata tras el primer alumno (condición de parada prematura)
**Síntoma:** el proceso escribía el primer alumno y se paraba instantáneamente,
sin llegar al segundo.

**Causa:** la condición de parada "hemos vuelto al primer alumno" se evaluaba
en el tick justo después de escribir (500ms), cuando el nombre en Séneca **seguía
siendo el del primer alumno** porque el click en "siguiente" aún no había ocurrido
(tarda 900ms). La condición veía `VG.primerAlumno == nombre_actual` y detenía
el proceso creyendo que se había completado el círculo.

**Solución:** añadido flag `haAbandonadoPrimerAlumno`. La condición de parada por
"primer alumno otra vez" solo se activa cuando este flag es `true`, que se marca
únicamente cuando el nombre en Séneca **cambia realmente** por primera vez:
```javascript
if (VG.primerAlumno != "") haAbandonadoPrimerAlumno = true;
if (haAbandonadoPrimerAlumno && VG.primerAlumno == nombreActual && VG.primerAlumno != "")
    clearInterval(...)
```

---

#### Bug 6 — Error de sintaxis: extensión completamente rota
**Síntoma:** tras una refactorización del bloque del `setInterval`, la extensión
dejó de funcionar por completo: no ocultaba rúbricas, no mostraba la ventana de
importación, nada.

**Causa:** una llave `}` sobrante cerraba el callback del `setInterval` antes de
tiempo. La función `EscribeLasNotas` quedaba definida fuera del intervalo,
produciendo un `SyntaxError` que impedía que se ejecutara todo el `content.js`.

**Solución:** eliminar la llave sobrante. Verificación con `node --check content.js`
antes de cada subida para detectar este tipo de errores.

---

### Estado del timing (v0.0.8.0)
| Parámetro | Valor |
|-----------|-------|
| Intervalo de comprobación | 500ms |
| Ticks de estabilidad necesarios | 2 (= 1s estable) |
| Delay antes de pulsar "siguiente" | 900ms |
| Bloqueo post-navegación | 1500ms |
| **Tiempo total aprox. por alumno** | **~3-4 segundos** |
