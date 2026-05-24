# Changelog — Séneca Fácil

## [0.0.8.0] — 2026-05-24

### Nuevas funcionalidades

#### Importación multicolumna de notas
La ventana de importación (que ya existía para pegar nombre + 1 nota desde Excel)
ahora soporta **múltiples columnas de notas**, una por criterio, en orden:

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
// Solo marca al alejarse del primer alumno
if (VG.primerAlumno != "") haAbandonadoPrimerAlumno = true;

// Condición de parada corregida
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
