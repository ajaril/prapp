VariablesGlobales();
const VG = VariablesGlobales();
function VariablesGlobales() {
    let primeraDeteccionCeldasNoOcultadas = true;
    let primeMenuConservarTextoPRA = true;
    let saltaVentanaApartados = true;
    let primerPase = true;
    let enMenuNecesario= true;
    let UsarAsistentePRA = false;
    let forzarMenuSeleccion = false;
    let limpiarMenuSeleccion = false;
    let refrescar = false;
    let celdasPRAPrincipalOcultadas = false;
    let celdasPRAPrincipalRedistribuidas = false;
    let conservarContenidoPRA = true;
    let formularioConDatos = false;
    let datosEnStorage = false;
    let entrarEnContenidoPRA = true;
    let entrarEnApartadosPRA = true;
    let entrarEnVentanaPrincipalPRA = true;
    let entrarEnCuadernoDeSeneca = true;
    let entrarEnElementosCurricularesAReforzar = true;
    let gestionandoPaginaPrincipalPRA = false;
    let gestionandoPaginaApartadosPRA = false;
    let gestionandoPaginaContenidoPRA = false;
    let gestionandoCuadernoDeSeneca = false;
    let gestionandoElementosCurricularesAReforzar = false;
    let mostrandoMenuSeleccion = false;
    let T_ACT_TAREASvalorAnterior = "";
    let T_METODOLOGIAvalorAnterior = "";
    let T_RECURSOSvalorAnterior = "";
    let T_AGRDISTESPTIEvalorAnterior = "";
    let T_INSEVALvalorAnterior = "";
    let listenerAñadido = false;
    let nombreAlumnoAnterior = "";
    let primerAlumno = "";
    return { primeraDeteccionCeldasNoOcultadas,
        primeMenuConservarTextoPRA,primerPase, mostrandoMenuSeleccion,
        enMenuNecesario, saltaVentanaApartados,
        UsarAsistentePRA, forzarMenuSeleccion, 
        celdasPRAPrincipalOcultadas, 
        conservarContenidoPRA: conservarContenidoPRA, 
        formularioConDatos, datosEnStorage, 
        entrarEnContenidoPRA, entrarEnApartadosPRA, 
        entrarEnVentanaPrincipalPRA,entrarEnElementosCurricularesAReforzar, 
        T_ACT_TAREASvalorAnterior, 
        T_METODOLOGIAvalorAnterior, T_RECURSOSvalorAnterior, 
        T_AGRDISTESPTIEvalorAnterior, T_INSEVALvalorAnterior, 
        limpiarMenuSeleccion, refrescar,
        gestionandoPaginaPrincipalPRA, gestionandoPaginaApartadosPRA,
        gestionandoPaginaContenidoPRA, gestionandoElementosCurricularesAReforzar,
        celdasPRAPrincipalRedistribuidas,
        entrarEnCuadernoDeSeneca, gestionandoCuadernoDeSeneca,
        nombreAlumnoAnterior, listenerAñadido, primerAlumno};
}
//console.log ("VG.primeMenuConservarTextoPRA",VG.primeMenuConservarTextoPRA);
function InicializarEventos() {
    //console.log("Inicializando eventos.");
    EntrandoEnCuadernoDeSeneca();
    function isExtensionContextValid() {
        return document && document.body && chrome.runtime && chrome.runtime.id;
    }
    function EntrandoEnCuadernoDeSeneca() {
        if(isExtensionContextValid()) chrome.storage.local.get("entrarEnCuadernoDeSeneca", (data) => {
            if (data.entrarEnCuadernoDeSeneca === undefined) {
                chrome.storage.local.set({ entrarEnCuadernoDeSeneca: true });
            } else {
                VG.entrarEnCuadernoDeSeneca = data.entrarEnCuadernoDeSeneca;
            }
            CuadernoDeSenecaDespuesDeStorage();
        });
        function CuadernoDeSenecaDespuesDeStorage()
        {
            //console.log("CuadernoDeSenecaDespuesDeStorage");
            let bodyTextPrevio = document.body.innerHTML;
            let searchTextPrevio = '<input id="X_CRIEVACOMBAS_';
            if (!bodyTextPrevio.includes(searchTextPrevio))
            {
                VG.entrarEnCuadernoDeSeneca = true;
                chrome.storage.local.set({ entrarEnCuadernoDeSeneca: true });
                //console.log("return1");
                window.__ventanaExcelMostrada = false;
                return;
            }
            /* else
            {
                VG.entrarEnCuadernoDeSeneca = false;
                chrome.storage.local.set({ entrarEnCuadernoDeSeneca: false });   
                //console.log("ñNo return1");         
            } */
            //console.log ("return if despues");
            if (!(!VG.gestionandoCuadernoDeSeneca  && 
                document && document.body && 
                VG.entrarEnCuadernoDeSeneca))
                {
                    //console.log("ñVG.gestionandoCuadernoDeSeneca",VG.gestionandoCuadernoDeSeneca);
                    //console.log("ñdocument",document !== undefined);
                    //console.log("ñdocument.body",document.body !== undefined);
                    //console.log("ñVG.entrarEnCuadernoDeSeneca",VG.entrarEnCuadernoDeSeneca);
                    //console.log("return2");
                    return;
                }
           (function MuestraCuadroDeImportación() {

                // --- Utilidades compartidas ---
                function normalizaTexto(texto) {
                    return texto
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .toLowerCase()
                        .replace(/\s+/g, " ")
                        .replace(/\s*,\s*/g, ", ")
                        .trim();
                }
                let mapaManualNombres = {};

                // --- Para evitar mostrar varias veces la ventana ---
                if (window.__ventanaExcelMostrada) return;
                window.__ventanaExcelMostrada = true;

                // --- Crear fondo oscuro ---
                const fondo = document.createElement("div");
                fondo.style.position = "fixed";
                fondo.style.top = "0";
                fondo.style.left = "0";
                fondo.style.width = "100%";
                fondo.style.height = "100%";
                fondo.style.backgroundColor = "rgba(0,0,0,0.4)";
                fondo.style.zIndex = "999999";

                // --- Crear ventana flotante ---
                const ventana = document.createElement("div");
                ventana.style.position = "fixed";
                ventana.style.top = "50%";
                ventana.style.left = "50%";
                ventana.style.transform = "translate(-50%, -50%)";
                ventana.style.background = "white";
                ventana.style.padding = "20px";
                ventana.style.borderRadius = "10px";
                ventana.style.minWidth = "420px";
                ventana.style.maxWidth = "90vw";
                ventana.style.maxHeight = "85vh";
                ventana.style.overflowY = "auto";
                ventana.style.boxShadow = "0 0 10px rgba(0,0,0,0.4)";
                ventana.style.zIndex = "1000000";
                ventana.style.boxSizing = "border-box";

                // --- Título ---
                const titulo = document.createElement("h3");
                titulo.textContent = "Criteriapp — Importar notas";
                titulo.style.marginTop = "0";
                titulo.style.marginBottom = "12px";
                titulo.style.color = "#1a5276";
                ventana.appendChild(titulo);

                // --- Textarea ---
                const entrada = document.createElement("textarea");
                entrada.style.width = "100%";
                entrada.style.height = "90px";
                entrada.style.boxSizing = "border-box";
                entrada.style.fontFamily = "monospace";
                entrada.style.fontSize = "12px";
                entrada.style.border = "1px solid #aaa";
                entrada.style.borderRadius = "4px";
                entrada.style.padding = "6px";
                entrada.style.resize = "vertical";
                entrada.placeholder = "Pega aquí los datos copiados de la hoja de cálculo.\nFormato: Apellidos, Nombre TAB nota1 TAB nota2 ...\nSi pegas una sola nota se copia a todos los criterios.\nSi pegas varias, cada una va a su criterio en orden.";
                ventana.appendChild(entrada);

                // --- Vista previa en tabla ---
                const previsualizacion = document.createElement("div");
                previsualizacion.style.marginTop = "10px";
                previsualizacion.style.overflowX = "auto";
                ventana.appendChild(previsualizacion);

                // --- Panel mapeo de nombres ---
                const panelMapeo = document.createElement("div");
                panelMapeo.style.marginTop = "8px";
                ventana.appendChild(panelMapeo);

                function actualizaMapeoNombres(filas) {
                    panelMapeo.innerHTML = "";
                    const selectAlumnado = document.querySelector("#selecbuscadoralumnado");
                    if (!selectAlumnado) return;
                    const nombresEnSeneca = Array.from(selectAlumnado.options)
                        .map(o => o.textContent.trim()).filter(t => t);
                    if (nombresEnSeneca.length === 0) return;
                    const nombresImportacion = filas.map(f => f.split(/\t|;/)[0].trim()).filter(t => t);
                    const noCoinciden = nombresImportacion.filter(n =>
                        !nombresEnSeneca.some(ns => normalizaTexto(ns) === normalizaTexto(n)) && !mapaManualNombres[n]);
                    const yaAsignados = nombresImportacion.filter(n => mapaManualNombres[n]);
                    const totalCoinciden = nombresImportacion.length - noCoinciden.length - yaAsignados.length;
                    if (noCoinciden.length === 0 && yaAsignados.length === 0) {
                        const ok = document.createElement("div");
                        ok.style.fontSize = "12px"; ok.style.color = "#27ae60"; ok.style.marginBottom = "4px";
                        ok.textContent = "\u2713 Todos los nombres coinciden autom\u00e1ticamente";
                        panelMapeo.appendChild(ok); return;
                    }
                    const resumen = document.createElement("div");
                    resumen.style.fontSize = "12px"; resumen.style.marginBottom = "6px";
                    resumen.style.color = noCoinciden.length > 0 ? "#c0392b" : "#e67e22";
                    let txt = "";
                    if (totalCoinciden > 0) txt += totalCoinciden + " coinciden \u2713  ";
                    if (yaAsignados.length > 0) txt += yaAsignados.length + " asignados manualmente \u2713  ";
                    if (noCoinciden.length > 0) txt += noCoinciden.length + " sin coincidencia \u26a0";
                    resumen.textContent = txt.trim();
                    panelMapeo.appendChild(resumen);
                    function creaFilaMapeo(nombre, color) {
                        const fila = document.createElement("div");
                        fila.style.cssText = "display:flex;align-items:center;gap:6px;margin-bottom:5px;font-size:12px;";
                        const etiq = document.createElement("span");
                        etiq.textContent = nombre; etiq.title = nombre;
                        etiq.style.cssText = "color:" + color + ";flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;";
                        const flecha = document.createElement("span");
                        flecha.textContent = "\u2192"; flecha.style.flexShrink = "0";
                        const sel = document.createElement("select");
                        sel.style.cssText = "flex:2;font-size:12px;min-width:0;";
                        const optVacia = document.createElement("option");
                        optVacia.value = ""; optVacia.textContent = "\u2014 omitir este alumno \u2014";
                        sel.appendChild(optVacia);
                        nombresEnSeneca.forEach(ns => {
                            const opt = document.createElement("option");
                            opt.value = ns; opt.textContent = ns;
                            if (mapaManualNombres[nombre] === ns) opt.selected = true;
                            sel.appendChild(opt);
                        });
                        sel.addEventListener("change", () => {
                            if (sel.value) mapaManualNombres[nombre] = sel.value;
                            else delete mapaManualNombres[nombre];
                            actualizaMapeoNombres(filas);
                        });
                        fila.appendChild(etiq); fila.appendChild(flecha); fila.appendChild(sel);
                        panelMapeo.appendChild(fila);
                    }
                    noCoinciden.forEach(n => creaFilaMapeo(n, "#c0392b"));
                    yaAsignados.forEach(n => creaFilaMapeo(n, "#e67e22"));
                }

                function actualizaVistaPrev() {
                    const texto = entrada.value.trim();
                    previsualizacion.innerHTML = "";
                    if (!texto) return;
                    const filas = texto.split("\n").filter(f => f.trim() !== "");
                    const maxCols = Math.max(...filas.map(f => f.split(/\t|;/).length));
                    const tabla = document.createElement("table");
                    tabla.style.borderCollapse = "collapse";
                    tabla.style.width = "100%";
                    tabla.style.fontSize = "13px";
                    // Cabecera
                    const thead = document.createElement("thead");
                    const trHead = document.createElement("tr");
                    for (let c = 0; c < maxCols; c++) {
                        const th = document.createElement("th");
                        th.textContent = c === 0 ? "Nombre" : "C" + c;
                        th.style.background = "#2471a3";
                        th.style.color = "white";
                        th.style.padding = "5px 10px";
                        th.style.textAlign = c === 0 ? "left" : "center";
                        th.style.whiteSpace = "nowrap";
                        trHead.appendChild(th);
                    }
                    thead.appendChild(trHead);
                    tabla.appendChild(thead);
                    // Filas de datos
                    const tbody = document.createElement("tbody");
                    filas.forEach((fila, idx) => {
                        const celdas = fila.split(/\t|;/);
                        const tr = document.createElement("tr");
                        tr.style.background = idx % 2 === 0 ? "#ffffff" : "#eaf4fb";
                        for (let c = 0; c < maxCols; c++) {
                            const td = document.createElement("td");
                            td.textContent = (celdas[c] || "").trim();
                            td.style.border = "1px solid #d5d8dc";
                            td.style.padding = "4px 10px";
                            td.style.textAlign = c === 0 ? "left" : "center";
                            tr.appendChild(td);
                        }
                        tbody.appendChild(tr);
                    });
                    tabla.appendChild(tbody);
                    previsualizacion.appendChild(tabla);
                    actualizaMapeoNombres(filas);
                }
                entrada.addEventListener("input", actualizaVistaPrev);
                entrada.addEventListener("paste", () => setTimeout(actualizaVistaPrev, 0));

                // --- Separador ---
                const separador = document.createElement("hr");
                separador.style.margin = "12px 0";
                separador.style.border = "none";
                separador.style.borderTop = "1px solid #ddd";
                ventana.appendChild(separador);

                // --- Checkbox mínimo 1 (ESO) ---
                const labelMinimo = document.createElement("label");
                labelMinimo.style.display = "block";
                labelMinimo.style.marginBottom = "10px";
                labelMinimo.style.cursor = "pointer";
                labelMinimo.style.fontSize = "13px";
                const checkMinimo = document.createElement("input");
                checkMinimo.type = "checkbox";
                checkMinimo.style.marginRight = "6px";
                labelMinimo.appendChild(checkMinimo);
                labelMinimo.appendChild(document.createTextNode("Mínimo 1 (ESO) — sube a 1 las notas inferiores"));
                ventana.appendChild(labelMinimo);

                // --- Fila botones principales ---
                const filaBotones = document.createElement("div");
                filaBotones.style.display = "flex";
                filaBotones.style.gap = "8px";
                filaBotones.style.flexWrap = "wrap";

                // --- Botón rellenar ---
                const botonRellenar = document.createElement("button");
                botonRellenar.textContent = "Rellenar";
                botonRellenar.style.padding = "8px 18px";
                botonRellenar.style.cursor = "pointer";
                botonRellenar.style.background = "#2471a3";
                botonRellenar.style.color = "white";
                botonRellenar.style.border = "none";
                botonRellenar.style.borderRadius = "5px";
                botonRellenar.style.fontWeight = "bold";
                filaBotones.appendChild(botonRellenar);

                // --- Botón cerrar ---
                const botonCerrar = document.createElement("button");
                botonCerrar.textContent = "Cerrar";
                botonCerrar.style.padding = "8px 18px";
                botonCerrar.style.cursor = "pointer";
                botonCerrar.style.background = "#eee";
                botonCerrar.style.border = "1px solid #bbb";
                botonCerrar.style.borderRadius = "5px";
                filaBotones.appendChild(botonCerrar);

                ventana.appendChild(filaBotones);

                // --- Separador borrar ---
                const sepBorrar = document.createElement("hr");
                sepBorrar.style.margin = "10px 0 8px";
                sepBorrar.style.border = "none";
                sepBorrar.style.borderTop = "1px solid #ddd";
                ventana.appendChild(sepBorrar);

                // --- Fila botones borrar ---
                const filaBorrar = document.createElement("div");
                filaBorrar.style.display = "flex";
                filaBorrar.style.gap = "8px";
                filaBorrar.style.flexWrap = "wrap";

                const botonBorrarActual = document.createElement("button");
                botonBorrarActual.textContent = "Borrar este alumno";
                botonBorrarActual.style.padding = "7px 14px";
                botonBorrarActual.style.cursor = "pointer";
                botonBorrarActual.style.background = "#e8e8e8";
                botonBorrarActual.style.border = "1px solid #bbb";
                botonBorrarActual.style.borderRadius = "5px";
                botonBorrarActual.style.fontSize = "12px";
                filaBorrar.appendChild(botonBorrarActual);

                const botonBorrarSiguientes = document.createElement("button");
                botonBorrarSiguientes.textContent = "Borrar este y siguientes";
                botonBorrarSiguientes.style.padding = "7px 14px";
                botonBorrarSiguientes.style.cursor = "pointer";
                botonBorrarSiguientes.style.background = "#fdecea";
                botonBorrarSiguientes.style.border = "1px solid #e57373";
                botonBorrarSiguientes.style.borderRadius = "5px";
                botonBorrarSiguientes.style.color = "#c0392b";
                botonBorrarSiguientes.style.fontSize = "12px";
                filaBorrar.appendChild(botonBorrarSiguientes);

                ventana.appendChild(filaBorrar);

                // --- Insertar en DOM ---
                fondo.appendChild(ventana);
                document.body.appendChild(fondo);

                // === LÓGICA DE PROCESAMIENTO DE DATOS ===

                botonRellenar.addEventListener("click", () => {
                    const texto = entrada.value.trim();
                    if (!texto) return alert("No has pegado ningún dato.");
                    //array con n filas y dos columnas
                    arrayImportacion = [];
                    // separa por líneas
                    const filas = texto.split("\n");

                    filas.forEach((fila, i) => {
                        // separa columnas por TAB o ;
                        const columnas = fila.split(/\t|;/);
                        arrayImportacion.push(columnas);
                        /* // EJEMPLO de asignación (cambia a tu web):
                        document.querySelector("#campoNombre").value = columnas[0] || "";
                        document.querySelector("#campoApellido").value = columnas[1] || "";
                        document.querySelector("#campoEdad").value = columnas[2] || ""; */
                    });
                    VG.primerAlumno = ""
                    BuscaCadaAlumnoYRellenaNota(arrayImportacion);
                    function BuscaCadaAlumnoYRellenaNota(arrayImportacion){
                        let contadorAlumnosProcesados = 0;
                        let totalAlumnos = arrayImportacion.length;
                        const tituloNombreAlumno = document.querySelector("#select2-selecbuscadoralumnado-container");
                        if (tituloNombreAlumno) var textoNombreAlumnoActual = tituloNombreAlumno.textContent;

                        let esperandoCambioDeAlumno = false;
                        // Cuántos ticks seguidos lleva el mismo nombre (necesitamos estabilidad antes de escribir)
                        let ticksEstable = 0;
                        const TICKS_PARA_ESCRIBIR = 2; // nombre estable 2×500ms = 1s antes de actuar
                        // Timestamp mínimo para volver a actuar (bloqueo tras pulsar "siguiente")
                        let noActuarHasta = 0;
                        // Solo parar por "primer alumno otra vez" cuando ya nos hayamos alejado de él
                        let haAbandonadoPrimerAlumno = false;

                        const esperaSiguienteAlumno = setInterval(() => {
                            // Bloqueo post-navegación: esperar a que Séneca cargue el nuevo alumno
                            if (Date.now() < noActuarHasta) return;

                            const tituloNombreAlumno = document.querySelector("#select2-selecbuscadoralumnado-container");
                            if (!tituloNombreAlumno) return;

                            if (textoNombreAlumnoActual == tituloNombreAlumno.textContent) {
                                // Condición de parada: hemos vuelto al primero (círculo completo)
                                // o hemos procesado todos los alumnos de la lista
                                if ((haAbandonadoPrimerAlumno && VG.primerAlumno == tituloNombreAlumno.textContent && VG.primerAlumno != "") ||
                                    (contadorAlumnosProcesados >= totalAlumnos)) {
                                    clearInterval(esperaSiguienteAlumno);
                                    return;
                                }
                                // Ya escribimos, esperando que Séneca cambie de alumno
                                if (esperandoCambioDeAlumno) return;

                                // Acumular ticks de estabilidad — no escribir hasta que el nombre
                                // lleve TICKS_PARA_ESCRIBIR ticks seguidos sin cambiar
                                ticksEstable++;
                                if (ticksEstable < TICKS_PARA_ESCRIBIR) return;

                                // Intentar escribir (si los inputs aún no están, reintenta el siguiente tick)
                                const escritoOk = EscribeLasNotas();
                                if (escritoOk) {
                                    esperandoCambioDeAlumno = true;
                                    setTimeout(() => {
                                        const btn = document.querySelector("button[class='btn btn-sm btn-primary m-0 ml-1 btnAlumnoSiguiente']");
                                        if (btn) {
                                            btn.click();
                                            // Bloquear el intervalo 1500ms tras el click para que Séneca cargue
                                            noActuarHasta = Date.now() + 1500;
                                        }
                                    }, 900);
                                }
                            } else {
                                // El alumno ha cambiado: resetear todo y esperar estabilidad
                                textoNombreAlumnoActual = tituloNombreAlumno.textContent;
                                esperandoCambioDeAlumno = false;
                                ticksEstable = 0;
                                // Marcar que ya nos alejamos del primer alumno
                                if (VG.primerAlumno != "") haAbandonadoPrimerAlumno = true;
                            }
                                function EscribeLasNotas(){
                                    //console.log("EscribeLasNotas");
                                    if (VG.primerAlumno== "") {VG.primerAlumno = textoNombreAlumnoActual;}
                                    function aplicaMinimo(valor) {
                                        const normalizado = valor.replace(",", ".");
                                        if (!checkMinimo.checked) return normalizado;
                                        const num = parseFloat(normalizado);
                                        return (!isNaN(num) && num < 1) ? "1" : normalizado;
                                    }
                                    for (let i = 0; i < arrayImportacion.length; i++) {
                                        const nombreAlumnoImportacion = arrayImportacion[i][0].trim();
                                        // Todas las columnas a partir de la 1\u00aa son notas (puede haber 1 o varias)
                                        const notasAlumnoImportacion = arrayImportacion[i].slice(1).map(n => n.trim());
                                        const nombreParaComparar = mapaManualNombres[nombreAlumnoImportacion] || nombreAlumnoImportacion;
                                        if (normalizaTexto(textoNombreAlumnoActual) === normalizaTexto(nombreParaComparar)) {
                                            const inputNota = document.querySelectorAll("input[id^='X_CRIEVACOMBAS_']");
                                            // Si los inputs aún no están en el DOM, devuelve false para reintentar
                                            if (inputNota.length === 0) return false;
                                            contadorAlumnosProcesados++;
                                            if (notasAlumnoImportacion.length === 1) {
                                                // Una sola nota: la copia a todos los criterios
                                                inputNota[0].value = aplicaMinimo(notasAlumnoImportacion[0]);
                                                ClonaPrimeraNota(inputNota);
                                            } else {
                                                // Varias notas: cada una va a su criterio en orden
                                                for (let j = 0; j < notasAlumnoImportacion.length && j < inputNota.length; j++) {
                                                    if (notasAlumnoImportacion[j] !== "") {
                                                        inputNota[j].value = aplicaMinimo(notasAlumnoImportacion[j]);
                                                    }
                                                }
                                            }
                                            return true;
                                        }
                                    }
                                    return false;
                                }
                        }, 500);

                    }  
                    fondo.remove();
                });

                botonCerrar.addEventListener("click", () => {
                    fondo.remove();
                });

                botonBorrarActual.addEventListener("click", () => {
                    const inputs = document.querySelectorAll("input[id^='X_CRIEVACOMBAS_']");
                    inputs.forEach(input => { input.value = ""; });
                    // Guardar: navegar siguiente y volver
                    setTimeout(() => {
                        const btnSig = document.querySelector("button.btnAlumnoSiguiente");
                        if (!btnSig) return;
                        btnSig.click();
                        setTimeout(() => {
                            const btnAnt = document.querySelector("button.btnAlumnoAnterior");
                            if (btnAnt) btnAnt.click();
                        }, 1500);
                    }, 400);
                });

                botonBorrarSiguientes.addEventListener("click", () => {
                    let primerAlumnoBorrado = "";
                    let nombreEnBucle = "";
                    let haAbandonadoPrimero = false;
                    let esperandoCambio = false;
                    let noActuarHasta = 0;
                    fondo.remove();
                    const bucle = setInterval(() => {
                        if (Date.now() < noActuarHasta) return;
                        const el = document.querySelector("#select2-selecbuscadoralumnado-container");
                        if (!el) return;
                        const nombreVisto = el.textContent;
                        if (!nombreVisto) return;
                        if (nombreEnBucle === "") nombreEnBucle = nombreVisto;
                        if (nombreVisto === nombreEnBucle) {
                            // mismo alumno
                            if (haAbandonadoPrimero && nombreVisto === primerAlumnoBorrado) {
                                clearInterval(bucle);
                                return;
                            }
                            if (esperandoCambio) return;
                            const inputs = document.querySelectorAll("input[id^='X_CRIEVACOMBAS_']");
                            if (inputs.length === 0) return;
                            if (primerAlumnoBorrado === "") primerAlumnoBorrado = nombreVisto;
                            inputs.forEach(input => { input.value = ""; });
                            esperandoCambio = true;
                            setTimeout(() => {
                                const btn = document.querySelector("button[class='btn btn-sm btn-primary m-0 ml-1 btnAlumnoSiguiente']");
                                if (btn) {
                                    btn.click();
                                    noActuarHasta = Date.now() + 1500;
                                }
                            }, 900);
                        } else {
                            // alumno ha cambiado: actualizar y esperar siguiente tick
                            nombreEnBucle = nombreVisto;
                            esperandoCambio = false;
                            if (primerAlumnoBorrado !== "") haAbandonadoPrimero = true;
                        }
                    }, 500);
                });

            })();
            //console.log("ñEntrandoEnCuadernoDeSeneca despues de if polemico");
            /* VG.entrarEnCuadernoDeSeneca = false;
            chrome.storage.local.set({ entrarEnCuadernoDeSeneca: false }); */
            VG.gestionandoCuadernoDeSeneca = true;
            //console.log("Entrando en el cuaderno de Séneca.");
            var clonadoActivado = false;
            var pasaAlumno = false;
            var ocultaRubricasActivado = false;
            var ocultaCriteriosActivado = false;
            var ocultaRubricasEnStorage = chrome.storage.local.get("OcultaRubricas", data => {
            if(data.OcultaRubricas!=undefined){
                if (data.OcultaRubricas==true){
                document.getElementsByTagName("body")[0].classList.add("OcultaRubricasActivado")
                ocultaRubricasActivado = true;
                }
                else{
                document.getElementsByTagName("body")[0].classList.remove("OcultaRubricasActivado")
                ocultaRubricasActivado = false;
                }
            }
            else{
                document.getElementsByTagName("body")[0].classList.add("OcultaRubricasActivado");
                ocultaRubricasActivado = true;
            }
            });
            if (ocultaRubricasEnStorage==undefined){
            document.getElementsByTagName("body")[0].classList.add("OcultaRubricasActivado")
            /* document.addEventListener("DOMContentLoaded", function () {
                let body = document.getElementsByTagName("body")[0];
                if (body) {
                    body.classList.add("OcultaRubricasActivado");
                } else {
                    console.error("El elemento <body> no está disponible.");
                }
            }); */
            ocultaRubricasActivado = true;
            };
            //debugger;
            var ocultaCriteriosEnStorage = chrome.storage.local.get("OcultaCriterios", data => {
            if(data.OcultaCriterios!=undefined){
                if (data.OcultaCriterios==true){
                document.getElementsByTagName("body")[0].classList.add("OcultaCriteriosActivado")
                ocultaCriteriosActivado = true;
                abreviaCriterios();;
                }
                else{
                document.getElementsByTagName("body")[0].classList.remove("OcultaCriteriosActivado")
                ocultaCriteriosActivado = false;
                }
            }
            else{
                document.getElementsByTagName("body")[0].classList.add("OcultaCriteriosActivado")
                ocultaCriteriosActivado = true;
                abreviaCriterios();;
            }
            });
            if (ocultaCriteriosEnStorage==undefined){
            document.getElementsByTagName("body")[0].classList.add("OcultaCriteriosActivado")
            /* document.addEventListener("DOMContentLoaded", function () {
                let body = document.getElementsByTagName("body")[0];
                if (body) {
                    body.classList.add("OcultaCriteriosActivado");
                } else {
                    console.error("El elemento <body> no está disponible.");
                }
            }); */
            ocultaCriteriosActivado = true;
            };
            var clonadoActivadoEnStorage = chrome.storage.local.get("Clonar", data => {
            if(data.Clonar==undefined){
                clonadoActivado = true;
            }else{
                clonadoActivado = data.Clonar;
            }
            });
            if (clonadoActivadoEnStorage==undefined){
            clonadoActivado = true;
            };
            var pasaAlumnoEnStorage = chrome.storage.local.get("Pasar", data => {
            if(data.Pasar==undefined){
                pasaAlumno = true;
            }else{
                pasaAlumno = data.Pasar;
            }
            });
            if (pasaAlumnoEnStorage==undefined){
            pasaAlumno = true;
            };
            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if(request.OcultaRubricas===true){
                document.getElementsByTagName("body")[0].classList.add("OcultaRubricasActivado")
                ocultaRubricasActivado = true;
            }else if(request.OcultaRubricas===false){
                document.getElementsByTagName("body")[0].classList.remove("OcultaRubricasActivado")
                ocultaRubricasActivado = false;
            }
            });
            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if(request.OcultaCriterios===true){
                document.getElementsByTagName("body")[0].classList.add("OcultaCriteriosActivado")
                ocultaCriteriosActivado = true;
                abreviaCriterios();;
            }else if(request.OcultaCriterios===false){
                document.getElementsByTagName("body")[0].classList.remove("OcultaCriteriosActivado")
                ocultaCriteriosActivado = false;
            }
            });
            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if(request.Clonar===true){
                clonadoActivado = true;
            }else if(request.Clonar===false){
                clonadoActivado = false;
            }
            });
            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if(request.Pasar===true){
                pasaAlumno = true;
            }else if(request.Pasar===false){
                pasaAlumno = false;
            }
            });
            chrome.runtime.onMessage.addListener(function(message) {
                if (message.tipo === "print") {
                var listaBotones = document.getElementsByClassName("btn btn-primary");
                listaBotones[3].addEventListener('click', function() {
                    //console.log('¡Botón clicado!');
                    setTimeout(function(){
                    escribeSegundaNota();
                    }, 1000);
                });
                }
            });
            function escribeSegundaNota(primeraNota){
            const checkInput = setInterval(function() {
                const input = document.querySelector("input[id='X_CRIEVACOMBAS_15098']");
                if (input) {
                //console.log('¡Input detectado!');
                clearInterval(checkInput);
                debugger;
                input.value = primeraNota;      }
            }, 1000);
            };
            function ClonaPrimeraNota(arrayInputs){
                //console.log("ClonaPrimeraNota",arrayInputs.length);
            for (let i = 1; i < arrayInputs.length; i++) {
                const input = arrayInputs[i];
                if (input) {
                input.value = arrayInputs[0].value;
                }
            }  
            }
            var cuentaCuadernoNoDetectado = 0;
            //console.log('¡buscando cuadro nota!');
            var cuadroNotaEncontrado = false;
            const intervaloNTR = setInterval(function() {
            let bodyText = document.body.innerHTML;
            let searchText = '<input id="X_CRIEVACOMBAS_';
            if (bodyText.includes(searchText)){
                if(!cuadroNotaEncontrado) {
                vigilaPrimeraNota();
                abreviaCriterios(!ocultaCriteriosActivado);
                }
                cuadroNotaEncontrado = true;
            }
            else{
            }
            },1000);
            function vigilaPrimeraNota(){
            //console.log('vigilaPrimeraNota');
            //var nombreAlumnoAnterior="";
            const intervaloPrimeraNota = setInterval(function() {
                const input = document.querySelectorAll("input[id^='X_CRIEVACOMBAS_']");
                let bodyTextParaCortar = document.body.innerHTML;
                let searchTextParaCortar = '<input id="X_CRIEVACOMBAS_';
                //if (!bodyTextParaCortar.includes(searchTextParaCortar))
                if (input)
                {
                    clearInterval(intervaloPrimeraNota);
                    //console.log('clearInterval');                       
                }
                if (input.length>0) {clearInterval(intervaloPrimeraNota);}
                const tituloNombreAlumno = document.querySelector("#select2-selecbuscadoralumnado-container");
                if (!tituloNombreAlumno) return;
                const textoNombreAlumnoActual = tituloNombreAlumno.textContent;
                if ((input.length>0) && (VG.nombreAlumnoAnterior != textoNombreAlumnoActual)) {
                    //console.log("aaa=",VG.nombreAlumnoAnterior, "tna=",textoNombreAlumnoActual);
                    //console.log('¡Input detectado con alumno nuevo!');
                    var valorPrimeraNota = input[0].value;
                    input[0].focus();
                    input[0].type="text";
                    let lengthOfInputValue = input[0].value.length;
                    //console.log(lengthOfInputValue);
                    input[0].setSelectionRange(lengthOfInputValue, lengthOfInputValue);
                    input[0].type="number";
                    input[0].addEventListener('change', function() {
                        //console.log('¡Input cambiado! '+input[0].value);
                        if(clonadoActivado){
                        //console.log("clonado activando");
                        ClonaPrimeraNota(input);
                        if((Math.abs(input[0].value-valorPrimeraNota)>1)||(valorPrimeraNota=="")){
                        //if((Math.abs(input[0].value-valorPrimeraNota)>1)){
                            //console.log("diferencia de 1",Math.abs(input[0].value-valorPrimeraNota)>1);
                            //console.log("valorPrimeraNota ''",valorPrimeraNota=="");
                            VG.entrarEnCuadernoDeSeneca = true;
                            chrome.storage.local.set({ entrarEnCuadernoDeSeneca: true });
                            //console.log (textoNombreAlumnoActual,"antes de PasaSiguienteAlumno");
                            PasaSiguienteAlumno();
                            
                        };
                        valorPrimeraNota = input[0].value;
                        };
                    },{ once: true });
                }    
                VG.nombreAlumnoAnterior = textoNombreAlumnoActual; 
            }, 1000);
            };
            
            function PasaSiguienteAlumno(){
                if(pasaAlumno){
                    const botonSiguienteAlumno = document.querySelector("button[class='btn btn-sm btn-primary m-0 ml-1 btnAlumnoSiguiente']");
                    //console.log(botonSiguienteAlumno);
                    if (botonSiguienteAlumno) {
                    //console.log('¡boton siguiente alumno detectado!');
                    botonSiguienteAlumno.click();
                    //console.log ("botonSiguienteAlumno.click");
                    }
                }
            };
            function abreviaCriterios(){
    
            var etiquetaAbreviada = document.querySelector('label.abreviada');
            if (etiquetaAbreviada==undefined){
                var etiquetasOriginales = document.querySelectorAll('label[for="MODALTAREA01"]');
                //console.log(etiquetasOriginales);
                //debugger;
                var abreviatura = 0;
                for (let i = 0; i < etiquetasOriginales.length; i++) {
                var etiquetaAbreviada = document.createElement('label');
                if (i==0){
                abreviatura = encontrarCuartoPunto(etiquetasOriginales[i].textContent)+1;
                }
                etiquetaAbreviada.textContent = etiquetasOriginales[i].textContent.substring(0, abreviatura)+" ";
                etiquetaAbreviada.classList.add("abreviada");
                etiquetasOriginales[i].parentNode.insertBefore(etiquetaAbreviada, etiquetasOriginales[i]);
                }
            }
            
            };
            function encontrarCuartoPunto(cadena) {
            var contador = 0;
            for (var i = 0; i < cadena.length; i++) {
                if (cadena.charAt(i) === ".") {
                contador++;
                if (contador === 4) {
                    return i;
                }
                }
            }
            return -1;
            }
            VG.gestionandoCuadernoDeSeneca = false;
        }
    }
    EntramosEnVentanaContenidoPRA();
    function EntramosEnVentanaContenidoPRA() {
        if (document && document.body && document.body.textContent.replace(/\s+/g, " ").includes("Elementos curriculares a reforzar")) 
            { //console.log("VG.entrarEnContenidoPRA",VG.entrarEnContenidoPRA);
            if (VG.entrarEnContenidoPRA && !VG.gestionandoPaginaContenidoPRA) {
                //console.log("1EntramosEnVentanaContenidoPRA.");
                VG.entrarEnContenidoPRA = false;
                VG.gestionandoPaginaContenidoPRA = true;
                let T_ACT_TAREAS = document.querySelector("textarea[id='T_ACT_TAREAS']");
                let T_METODOLOGIA = document.querySelector("textarea[id='T_METODOLOGIA']");
                let T_RECURSOS = document.querySelector("textarea[id='T_RECURSOS']");
                let T_AGRDISTESPTIE = document.querySelector("textarea[id='T_AGRDISTESPTIE']");
                let T_INSEVAL = document.querySelector("textarea[id='T_INSEVAL']");
                if (T_ACT_TAREAS && T_METODOLOGIA && T_RECURSOS && T_AGRDISTESPTIE && T_INSEVAL &&
                    (T_ACT_TAREAS.value.trim() !== "" || T_METODOLOGIA.value.trim() !== "" || T_RECURSOS.value.trim() !== "" ||
                        T_AGRDISTESPTIE.value.trim() !== "" || T_INSEVAL.value.trim() !== "")) {
                    //console.log("El formulario ya contiene datos.");
                    VG.formularioConDatos = true;
                }
                //AnadirElementosCurriculares();
                function AnadirElementosCurriculares(){
                    //console.log("Añadiendo elementos curriculares.");
                    // Selecciona el elemento con un selector que coincida con su clase y atributos
                    const botonAgregar = document.querySelector('a.btn[aria-label="Añadir elementos curriculares"]');

                    // Verifica si el elemento existe y realiza el clic
                    if (botonAgregar) {
                        //console.log("Botón encontrado:", botonAgregar);
                        botonAgregar.click(); // Simula el clic en el elemento
                    } else {
                        console.error("No se encontró el botón para añadir elementos curriculares.");
                    }
                }
                chrome.storage.local.get(
                    [
                        "T_ACT_TAREASvalorAnterior",
                        "T_METODOLOGIAvalorAnterior",
                        "T_RECURSOSvalorAnterior",
                        "T_AGRDISTESPTIEvalorAnterior",
                        "T_INSEVALvalorAnterior",
                    ],
                    function (result) {
                        if (result.T_ACT_TAREASvalorAnterior && T_ACT_TAREAS) {
                            VG.T_ACT_TAREASvalorAnterior = result.T_ACT_TAREASvalorAnterior;
                        }
                        if (result.T_METODOLOGIAvalorAnterior && T_METODOLOGIA) {
                            VG.T_METODOLOGIAvalorAnterior = result.T_METODOLOGIAvalorAnterior;
                        }
                        if (result.T_RECURSOSvalorAnterior && T_RECURSOS) {
                            VG.T_RECURSOSvalorAnterior = result.T_RECURSOSvalorAnterior;
                        }
                        if (result.T_AGRDISTESPTIEvalorAnterior && T_AGRDISTESPTIE) {
                            VG.T_AGRDISTESPTIEvalorAnterior = result.T_AGRDISTESPTIEvalorAnterior;
                        }
                        if (result.T_INSEVALvalorAnterior && T_INSEVAL) {
                            VG.T_INSEVALvalorAnterior = result.T_INSEVALvalorAnterior;
                        }
                        DespuesDeRecuperarDatos();
                    }
                );
                function DespuesDeRecuperarDatos() {
                    function VentanaConservarTextoPRA() {
                        //console.log("VentanaConservarTextoPRA");                        
                        const fondo = document.createElement("div");
                        fondo.style.position = "fixed";
                        fondo.style.top = "0";
                        fondo.style.left = "0";
                        fondo.style.width = "100%";
                        fondo.style.height = "100%";
                        fondo.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                        fondo.style.zIndex = "9999";

                        // Crear el contenedor de la ventana emergente
                        const ventana = document.createElement("div");
                        ventana.style.position = "fixed";
                        ventana.style.top = "50%";
                        ventana.style.left = "50%";
                        ventana.style.transform = "translate(-50%, -50%)";
                        ventana.style.backgroundColor = "white";
                        ventana.style.borderRadius = "8px";
                        ventana.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
                        ventana.style.padding = "20px";
                        ventana.style.textAlign = "center";
                        ventana.style.zIndex = "10000";

                        // Crear el texto de la ventana emergente
                        const mensaje = document.createElement("p");
                        mensaje.textContent = "El formulario ya contiene datos. ¿Qué deseas hacer?";
                        mensaje.style.marginBottom = "20px";

                        // Crear el botón "Conservar el texto"
                        const botonConservar = document.createElement("button");
                        botonConservar.textContent = "Conservar el texto";
                        botonConservar.style.marginRight = "10px";
                        botonConservar.style.padding = "10px 20px";
                        botonConservar.style.border = "none";
                        botonConservar.style.backgroundColor = "#007BFF";
                        botonConservar.style.color = "white";
                        botonConservar.style.borderRadius = "4px";
                        botonConservar.style.cursor = "pointer";
                        botonConservar.addEventListener("click", () => {
                            //console.log("Se ha seleccionado 'Conservar el texto'.");
                            VG.conservarContenidoPRA = true;
                            fondo.remove(); // Eliminar la ventana emergente
                        });

                        // Crear el botón "Recuperar el texto del PRA anterior"
                        const botonRecuperar = document.createElement("button");
                        botonRecuperar.textContent = "Recuperar el texto del PRA anterior";
                        botonRecuperar.style.marginLeft = "10px";
                        botonRecuperar.style.padding = "10px 20px";
                        botonRecuperar.style.border = "none";
                        botonRecuperar.style.backgroundColor = "#28A745";
                        botonRecuperar.style.color = "white";
                        botonRecuperar.style.borderRadius = "4px";
                        botonRecuperar.style.cursor = "pointer";
                        botonRecuperar.addEventListener("click", () => {
                            //console.log("Se ha seleccionado 'Recuperar el texto del PRA anterior'.");
                            VG.conservarContenidoPRA = false;
                            if (!VG.conservarContenidoPRA) {
                                if (T_ACT_TAREAS) {
                                    T_ACT_TAREAS.value = VG.T_ACT_TAREASvalorAnterior;
                                }
                                if (T_METODOLOGIA) {
                                    T_METODOLOGIA.value = VG.T_METODOLOGIAvalorAnterior;
                                }
                                if (T_RECURSOS) {
                                    T_RECURSOS.value = VG.T_RECURSOSvalorAnterior;
                                }
                                if (T_AGRDISTESPTIE) {
                                    T_AGRDISTESPTIE.value = VG.T_AGRDISTESPTIEvalorAnterior;
                                }
                                if (T_INSEVAL) {
                                    T_INSEVAL.value = VG.T_INSEVALvalorAnterior;
                                }
                            }
                            fondo.remove(); // Eliminar la ventana emergente
                        });

                        // Agregar los elementos al contenedor de la ventana
                        ventana.appendChild(mensaje);
                        ventana.appendChild(botonConservar);
                        ventana.appendChild(botonRecuperar);

                        // Agregar la ventana y el fondo al body
                        fondo.appendChild(ventana);
                        document.body.appendChild(fondo);
                    }
                    if (VG.T_ACT_TAREASvalorAnterior != "" || VG.T_METODOLOGIAvalorAnterior != "" || VG.T_RECURSOSvalorAnterior != "" || VG.T_AGRDISTESPTIEvalorAnterior != "" || VG.T_INSEVALvalorAnterior != "") {
                        VG.datosEnStorage = true;
                    }
                    //console.log("formularioConDatos:", VG.formularioConDatos);
                    //console.log("datosEnStorage:", VG.datosEnStorage);
                    if (VG.datosEnStorage) {
                        if (VG.formularioConDatos) {
                            if (VG.primeMenuConservarTextoPRA) {
                                VG.primeMenuConservarTextoPRA = false;
                                VentanaConservarTextoPRA();
                            }
                        }
                        else
                        {
                            if (T_ACT_TAREAS) {
                                T_ACT_TAREAS.value = VG.T_ACT_TAREASvalorAnterior;
                            }
                            if (T_METODOLOGIA) {
                                T_METODOLOGIA.value = VG.T_METODOLOGIAvalorAnterior;
                            }
                            if (T_RECURSOS) {
                                T_RECURSOS.value = VG.T_RECURSOSvalorAnterior;
                            }
                            if (T_AGRDISTESPTIE) {
                                T_AGRDISTESPTIE.value = VG.T_AGRDISTESPTIEvalorAnterior;
                            }
                            if (T_INSEVAL) {
                                T_INSEVAL.value = VG.T_INSEVALvalorAnterior;
                            }
                        }
                    }
                    else { VG.conservarContenidoPRA = true; }
                    //console.log("VG.conservarContenidoPRA:", VG.conservarContenidoPRA);
                    
                }
                let botonAceptar = document.querySelector("a.btn[aria-label='Aceptar']");
                if (botonAceptar) {
                    botonAceptar.addEventListener(
                        "click",
                        function () {
                            VG.T_ACT_TAREASvalorAnterior = T_ACT_TAREAS.value;
                            VG.T_METODOLOGIAvalorAnterior = T_METODOLOGIA.value;
                            VG.T_RECURSOSvalorAnterior = T_RECURSOS.value;
                            VG.T_AGRDISTESPTIEvalorAnterior = T_AGRDISTESPTIE.value;
                            VG.T_INSEVALvalorAnterior = T_INSEVAL.value;

                            try {
                                chrome.storage.local.set(
                                    {
                                        T_ACT_TAREASvalorAnterior: VG.T_ACT_TAREASvalorAnterior,
                                        T_METODOLOGIAvalorAnterior: VG.T_METODOLOGIAvalorAnterior,
                                        T_RECURSOSvalorAnterior: VG.T_RECURSOSvalorAnterior,
                                        T_AGRDISTESPTIEvalorAnterior: VG.T_AGRDISTESPTIEvalorAnterior,
                                        T_INSEVALvalorAnterior: VG.T_INSEVALvalorAnterior,
                                    },
                                    function () {
                                        //console.log("Valor almacenado correctamente.");
                                    }
                                );
                            } catch (error) {
                                console.error("Error al intentar almacenar el valor en chrome.storage:", error);
                            }
                        },
                        true
                    );
                }
            }
            else { 
                VG.conservarContenidoPRA = true;
            }
        }
        else { 
            if (!document.body.textContent.replace(/\s+/g, " ").includes("Elementos curriculares a reforzar"))
                {VG.primeMenuConservarTextoPRA = true;
                VG.entrarEnContenidoPRA = true; }
        }
        VG.gestionandoPaginaContenidoPRA = false;
    }
    EntramosEnVentanaPrincipalPRA();
    function EntramosEnVentanaPrincipalPRA() {
        let celdasNoOcultadas;
        function DetectaCeldasNoOcultadasPRA(){
            if (VG.primeraDeteccionCeldasNoOcultadas) {
                VG.primeraDeteccionCeldasNoOcultadas = false;
            }
            else return false;
            // Encuentra la tabla que contiene la fila con clase 'menuContextual'
            const tablaEspecifica = document.querySelector('.menuContextual')?.closest('table');

            // Asegúrate de que la tabla existe antes de buscar celdas dentro de ella
            if (tablaEspecifica) {
                // Busca todas las celdas (td y th) dentro de la tabla específica
                const celdas = tablaEspecifica.querySelectorAll('td, th');
                const existeCeldaConRowSpan = Array.from(celdas).some(celda => celda.rowSpan > 1);
                if (existeCeldaConRowSpan) 
                    {
                        //console.log("DetectaCeldasNoOcultadasPRA: true");
                        return true;
                    }
                else return false;
            }
        }
        //console.log("EntramosEnVentanaPrincipalPRA.");
        try {
            if (document.body.textContent.replace(/\s+/g, " ").includes("PROCESO DE ELABORACIÓN DEL PROGRAMA DE REFUERZO")) 
                {
                    
                    chrome.storage.local.get("checkboxPRAState", (data) => {
                        if (chrome.runtime.lastError) {
                            console.error("Error en chrome.storage.local.get:", chrome.runtime.lastError);
                            return;
                        }
                        if (data.checkboxPRAState === undefined) {
                            chrome.storage.local.set({ checkboxPRAState: true });
                            VG.UsarAsistentePRA = false;
                            return;
                        } else {
                            VG.UsarAsistentePRA = false;
                        }
                        //console.log(VG.entrarEnVentanaPrincipalPRA);
                        celdasNoOcultadas = DetectaCeldasNoOcultadasPRA();
                        if ((( VG.UsarAsistentePRA && (document.readyState === "complete" && (VG.entrarEnVentanaPrincipalPRA || celdasNoOcultadas)))&& !VG.gestionandoPaginaPrincipalPRA )
                            //|| VG.refrescar
                        ) {
                            //console.log("1VG.entrarEnVentanaPrincipalPRA:", VG.entrarEnVentanaPrincipalPRA);
                            //console.log("2VG.UsarAsistentePRA:", VG.UsarAsistentePRA);
                            //console.log("3VG document.readyState:", document.readyState);
                            //console.log("4VG.gestionandoPaginaPrincipalPRA:", VG.gestionandoPaginaPrincipalPRA);
                            //console.log("5VG DetectaCeldasNoOcultadasPRA():", DetectaCeldasNoOcultadasPRA());
                            VG.gestionandoPaginaPrincipalPRA = true;
                            //VG.refrescar = false;
                            VG.entrarEnVentanaPrincipalPRA = false;
                            VentanaPrincipalPRA();
                        }
                    });
                } else {
                    VG.entrarEnVentanaPrincipalPRA = true;
                    VG.primeraDeteccionCeldasNoOcultadas = true;
                    VG.celdasPRAPrincipalOcultadas = false;
            }
        } catch (error) {
            console.error("Error en EntramosEnVentanaPrincipalPRA:", error);
        }
        function VentanaPrincipalPRA() {
            //console.log("VentanaPrincipalPRA.");
            //console.log("VG.entraEnVentanaPrincipalPRA:", VG.entrarEnVentanaPrincipalPRA);
            //console.log("celdasNoOcultadas", celdasNoOcultadas);
            const VVP = VariablesVentanaPrincipalPRA();
            function VariablesVentanaPrincipalPRA() {
                let seleccionadosColumna1 = [];
                let seleccionadosColumna2 = [];
                let seleccionadosColumna3 = [];
                let seleccionadosColumna1Guardados = [];
                let seleccionadosColumna2Guardados = [];
                let seleccionadosColumna3Guardados = [];
                let columna1Guardados = [];
                let columna2Guardados = [];
                let columna3Guardados = [];
                return { seleccionadosColumna1, seleccionadosColumna2, seleccionadosColumna3, seleccionadosColumna1Guardados, seleccionadosColumna2Guardados, seleccionadosColumna3Guardados, columna1Guardados, columna2Guardados, columna3Guardados };
            }
            RecargaVentanaPrincipalPRA();
            function RecargaVentanaPrincipalPRA() {
                VG.celdasPRAPrincipalRedistribuidas = false;
                //console.log("Recargando la ventana principal.");
                chrome.storage.local.get(
                    ["seleccionadosColumna1", "seleccionadosColumna2", "seleccionadosColumna3", "columna1HTML", "columna2HTML", "columna3HTML"],
                    function (result) {
                        if (result.seleccionadosColumna1 && result.seleccionadosColumna2 && result.seleccionadosColumna3) {
                            VVP.columna1Guardados = result.columna1HTML;
                            VVP.columna2Guardados = result.columna2HTML;
                            VVP.columna3Guardados = result.columna3HTML;
                            VVP.seleccionadosColumna1Guardados = result.seleccionadosColumna1;
                            VVP.seleccionadosColumna2Guardados = result.seleccionadosColumna2;
                            VVP.seleccionadosColumna3Guardados = result.seleccionadosColumna3;
                            menu = null;
                        }
                        ReorganizaLasCeldasYMuestraMenuDeSeleccion();
                    });
                    function ReorganizaLasCeldasYMuestraMenuDeSeleccion() {
                        //console.log("ReorganizaLasCeldasYMuestraMenuDeSeleccion de selección.");
                        const filas = Array.from(document.querySelectorAll("table tr"));
                        // Contenedor para las columnas
                        let columnas = document.createElement("div");
                        columnas.className = "menu-columnas";
                        const valoresPrimeraColumna = [];
                        const valoresSegundaColumna = [];
                        const valoresTerceraColumnaSinEspacios = [];
                        const valoresTerceraColumnaConEspacios = [];
                        let rowSpan;
                        let cuentaRowSpan = 0;
                        let celdaRepetida;
                        let primeraFila = true;
                        //if (DetectaCeldasNoOcultadasPRA())
                        RedistribuyeCeldasPRAPrincipal();
                        function RedistribuyeCeldasPRAPrincipal()
                        {
                            //console.log("RedistribuyeCeldasPRAPrincipal");
                            //console.log("RedistribuyeCeldasPRAPrincipal");
                            //if (VG.celdasPRAPrincipalRedistribuidas) {//console.log("no redistribuye");return;}
                            filas.forEach(fila => {
                            if (primeraFila) {
                                primeraFila = false;
                                return;
                            }
                            const celdas = fila.cells;
                            if (celdas.length > 0) {
                                if (celdas[0].rowSpan > 1) {
                                    rowSpan = celdas[0].rowSpan;
                                    celdas[0].rowSpan = 1;
                                    cuentaRowSpan = rowSpan;
                                } else {
                                    if (cuentaRowSpan == 0) {
                                        rowSpan = 1;
                                        cuentaRowSpan = rowSpan;
                                    }
                                }
                                if ((rowSpan - cuentaRowSpan + 1) == 1) {
                                    celdaRepetida = celdas[0].cloneNode(true);
                                } else {
                                    let celdaNueva = fila.insertCell(0);
                                    fila.replaceChild(celdaRepetida, celdaNueva);
                                }
                                if (!valoresPrimeraColumna.includes(celdas[1]?.textContent?.trim())) {
                                    valoresPrimeraColumna.push(celdas[1]?.textContent?.trim());
                                }
                                if (celdas.length > 1 && !valoresSegundaColumna.includes(celdas[4]?.textContent?.trim())) {
                                    valoresSegundaColumna.push(celdas[4]?.textContent?.trim());
                                }
                                const elementosLI = celdas[5]?.querySelectorAll('li');
                                const asignaturas = Array.from(elementosLI).map(li => li.textContent.trim());
                                asignaturas.forEach(asignatura => {
                                    if (!valoresTerceraColumnaSinEspacios.includes(asignatura.replace(/\s+/g, ""))) {
                                        valoresTerceraColumnaSinEspacios.push(asignatura.replace(/\s+/g, ""));
                                        valoresTerceraColumnaConEspacios.push(asignatura);
                                    }
                                });
                            }
                            cuentaRowSpan -= 1;
                            }
                        );
                        VG.celdasPRAPrincipalRedistribuidas = true;
                    }
                        //console.log("VG.forzarMenuSeleccion:", VG.forzarMenuSeleccion);
                        let columna1 = document.createElement("div");
                        let columna2 = document.createElement("div");
                        let columna3 = document.createElement("div");
                        //console.log("previo");                
                        const menuPrevio = ConstruyeMenuDeSeleccion();
                        /* if (!VG.mostrandoMenuSeleccion)
                        {VG.mostrandoMenuSeleccion = true;
                        document.body.appendChild(menuPrevio);} */
                        
                        //VG.UsarAsistentePRA=false;
                        VVP.seleccionadosColumna1 = VVP.seleccionadosColumna1Guardados;
                        VVP.seleccionadosColumna2 = VVP.seleccionadosColumna2Guardados;
                        VVP.seleccionadosColumna3 = VVP.seleccionadosColumna3Guardados;
                        if (columna1.innerHTML === VVP.columna1Guardados &&
                            columna2.innerHTML === VVP.columna2Guardados &&
                            columna3.innerHTML === VVP.columna3Guardados &&
                            VVP.seleccionadosColumna1Guardados.length > 0 &&
                            VVP.seleccionadosColumna2Guardados.length > 0 &&
                            VVP.seleccionadosColumna3Guardados.length > 0 && !VG.forzarMenuSeleccion && !VG.refrescar) //aqui obligo a salir al menu seleccion
                        {
                            columna1.innerHTML = VVP.columna1Guardados;
                            columna2.innerHTML = VVP.columna2Guardados;
                            columna3.innerHTML = VVP.columna3Guardados;
                           
                            //console.log("Valores recuperados de la memoria caché.");
                            //console.log("VG.celdasPRAPrincipalOcultadas ",VG.celdasPRAPrincipalOcultadas);
                            OcultaFilas();
                            menu = null;
                        }
                        else {
                            if (!VG.refrescar) {
                                //console.log("despues de comprobar que no esta grabado");
                                VG.enMenuNecesario= true;
                                const menuNecesario = ConstruyeMenuDeSeleccion();
                                if (!VG.mostrandoMenuSeleccion)
                                {
                                    VG.mostrandoMenuSeleccion = true;
                                    document.body.appendChild(menuNecesario);
                                }
                            }
                                
                                else 
                                {   
                                    //console.log("refrescar",VG.refrescar);
                                    VG.refrescar = false;
                                }
                        }
                        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                            if (message.action === "botonMenuSeleccionClickado") {
                                //console.log("Botón 'Menú de selección' clickado.");
                                VG.forzarMenuSeleccion = true;
                                VG.celdasPRAPrincipalOcultadas = true;
                                // Envía un mensaje al background script
        /*                         chrome.runtime.sendMessage({ action: "reload_tab" }, (response) => {
                                    if (response?.status === "success") {
                                        //console.log("La pestaña se recargó correctamente.");
                                    } else {
                                        console.error("Error al recargar la pestaña.");
                                    }
                                }); */
                                const menuPorBotonPopup = ConstruyeMenuDeSeleccion();
                                if (!VG.mostrandoMenuSeleccion)
                                {VG.mostrandoMenuSeleccion = true;
                                document.body.appendChild(menuPorBotonPopup);}
                            }
                        });
                        function ConstruyeMenuDeSeleccion()
                        {        
                            //console.log("Construyendo el menú de selección.");
                            //menu.remove();
                            while (columna1.firstChild) {
                                columna1.removeChild(columna1.firstChild);
                            }
                            while (columna2.firstChild) {
                                columna2.removeChild(columna2.firstChild);
                            }
                            while (columna3.firstChild) {
                                columna3.removeChild(columna3.firstChild);
                            }       
                            let menu = document.createElement("div");
                            menu.style.maxWidth = "80%"; // Limitar el ancho máximo al 80% del viewport
                            menu.style.maxHeight = "80%"; // Limitar la altura máxima al 80% del viewport
                            menu.style.overflowY = "auto"; // Agregar un scroll vertical si el contenido excede la altura
                            menu.style.overflowX = "hidden"; // Desactivar el scroll horizontal
                            menu.id = "menu-seleccion";
                            menu.style.position = "fixed";
                            menu.style.flexDirection = "column";
                            //menu.style.position = "absolute";
                            /*         menu.style.top = "0px";
                                    menu.style.left = "0px"; */
                            menu.style.top = "0%";
                            menu.style.left = "10%";
                            //menu.style.transform = "translate(-50%, -50%)";
                            menu.style.backgroundColor = "rgb(46, 138, 65)";
                            menu.style.padding = "20px";
                            menu.style.border = "1px solid #ccc";
                            menu.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
                            menu.style.zIndex = "10000";
                            menu.style.borderRadius = "8px";
                            // Título del menú
                            let titulo = document.createElement("div");
                            titulo.className = "menu-titulo";
                            titulo.textContent = "Selecciona";
                            titulo.style.fontSize = "30px";
                            menu.appendChild(titulo);
                            // Crear columna para la primera columna de la tabla
        
                            columna1.className = "menu-columna";
                            let tituloColumna1 = document.createElement("h4");
                            tituloColumna1.textContent = "Cursos";
                            columna1.appendChild(tituloColumna1);
                            //ordena los valores de la primera columna
                            valoresPrimeraColumna.sort();
                            //console.log(valoresPrimeraColumna);
                            valoresPrimeraColumna.forEach(valor => {
                                let label = document.createElement("label");
                                let checkbox = document.createElement("input");
                                checkbox.type = "checkbox";
                                checkbox.value = valor;
                                if (VG.limpiarMenuSeleccion)
                                    {checkbox.checked = false;}
                                    else
                                    {
                                        if (VVP.seleccionadosColumna1.includes(valor))
                                        {
                                            checkbox.checked = true;
                                        }
                                        else
                                        {
                                            checkbox.checked = false;
                                        }
                                    }
                                label.appendChild(checkbox);
                                label.appendChild(document.createTextNode(valor));
                                columna1.appendChild(label);
                            });
        
                            columnas.appendChild(columna1);
        
                            // Crear columna para la segunda columna de la tabla
                            
                            columna2.className = "menu-columna";
                            let tituloColumna2 = document.createElement("h4");
                            tituloColumna2.textContent = "Situaciones del alumno";
                            columna2.appendChild(tituloColumna2);
                            valoresSegundaColumna.sort();
                            valoresSegundaColumna.forEach(valor => {
                                let label = document.createElement("label");
                                let checkbox = document.createElement("input");
                                checkbox.type = "checkbox";
                                checkbox.value = valor;
                                if (VG.limpiarMenuSeleccion)
                                {checkbox.checked = false;}
                                else
                                {
                                    if (VVP.seleccionadosColumna2.includes(valor))
                                    {
                                        checkbox.checked = true;
                                    }
                                    else
                                    {
                                        checkbox.checked = false;
                                    }
                                }
                                label.appendChild(checkbox);
                                label.appendChild(document.createTextNode(valor));
                                columna2.appendChild(label);
                            });
        
                            columnas.appendChild(columna2);
                            
                            columna3.className = "menu-columna";
                            let tituloColumna3 = document.createElement("h4");
                            tituloColumna3.textContent = "Asignaturas";
                            columna3.appendChild(tituloColumna3);
                            valoresTerceraColumnaSinEspacios.sort();
                            valoresTerceraColumnaConEspacios.sort();
                            for (let i = 0; i < valoresTerceraColumnaSinEspacios.length; i++) {
                                let label = document.createElement("label");
                                let checkbox = document.createElement("input");
                                checkbox.type = "checkbox";
                                checkbox.value = valoresTerceraColumnaSinEspacios[i];
                                if (VG.limpiarMenuSeleccion)
                                    {checkbox.checked = false;}
                                    else
                                    {
                                        if (VVP.seleccionadosColumna3.includes(valoresTerceraColumnaSinEspacios[i]))
                                        {
                                            checkbox.checked = true;
                                        }
                                        else
                                        {
                                            checkbox.checked = false;
                                        }
                                    }
                                label.appendChild(checkbox);
                                label.appendChild(document.createTextNode(valoresTerceraColumnaConEspacios[i]));
                                columna3.appendChild(label);
                            }
                            columnas.appendChild(columna3);
                            let botonAceptar = document.createElement("button");
                            botonAceptar.textContent = "Aceptar";
                            botonAceptar.style.marginTop = "10px";
                            botonAceptar.onclick = () => {
                                VVP.seleccionadosColumna1 = Array.from(columna1.querySelectorAll("input:checked")).map(input => input.value);
                                VVP.seleccionadosColumna2 = Array.from(columna2.querySelectorAll("input:checked")).map(input => input.value);
                                VVP.seleccionadosColumna3 = Array.from(columna3.querySelectorAll("input:checked")).map(input => input.value);
                                chrome.storage.local.set(
                                    {
                                        seleccionadosColumna1: VVP.seleccionadosColumna1,
                                        seleccionadosColumna2: VVP.seleccionadosColumna2,
                                        seleccionadosColumna3: VVP.seleccionadosColumna3,
                                        columna1HTML: columna1.innerHTML,
                                        columna2HTML: columna2.innerHTML,
                                        columna3HTML: columna3.innerHTML
                                    },
                                    function () {
                                        //console.log("Valores almacenados correctamente.");
                                    }
                                );
                                OcultaFilas();
                                menu.remove();
                                VG.mostrandoMenuSeleccion = false;
                            };
                            menu.appendChild(botonAceptar);
                            menu.appendChild(columnas);                            
                            return menu;
                        }
                        function OcultaFilas() {
                            //console.log ("OcultaFilas:");
                            if (VG.celdasPRAPrincipalOcultadas) return;
                            const filas = Array.from(document.querySelectorAll("table tr"));
                            let primeraFila = true;
                            filas.forEach(fila => {
                                if (primeraFila) {
                                    primeraFila = false;
                                    return;
                                }
                                const elementosLI = fila.cells[5]?.querySelectorAll('li');
                                const asignaturas = Array.from(elementosLI);
                                let algunaAsignaturaSeleccionada = false;
                                for (let i = 0; i < asignaturas.length; i++) {
                                    if (VVP.seleccionadosColumna3.includes(asignaturas[i].textContent.replace(/\s+/g, ""))) {
                                        algunaAsignaturaSeleccionada = true;
                                    }
                                    else asignaturas[i].style.display = "none";
                                }
                                const valorPrimeraColumna = fila.cells[1]?.textContent?.trim();
                                const valorSegundaColumna = fila.cells[4]?.textContent?.trim();
                                //console.log("columna 1 include")
                                if (VVP.seleccionadosColumna1.includes(valorPrimeraColumna) &&
                                    VVP.seleccionadosColumna2.includes(valorSegundaColumna) &&
                                    algunaAsignaturaSeleccionada) {
                                    fila.style.display = "";
                                    
                                } else {
                                    fila.style.display = "none";
                                    //console.log("fila.style.display")
                                }
                            });
                            VG.celdasPRAPrincipalOcultadas = true;
                            const celdas = document.querySelectorAll("table td, table th");
                            const existeCeldaConRowSpan = Array.from(celdas).some(celda => celda.rowSpan > 1);
                            //console.log("existeCeldaConRowSpan",existeCeldaConRowSpan);
                        }
                        function ArraysSonIguales(arr1, arr2) {
                            if (arr1 == null || arr2 == null || arr1.length !== arr2.length) return false;
                            for (let i = 0; i < arr1.length; i++) {
                                if (arr1[i] !== arr2[i]) return false;
                            }
                            return true; // Si pasa todas las verificaciones, son iguales
                        }
                    }
            }
            const botonRefrescar = document.getElementById("BOTON_REFRESCAR");
            if (botonRefrescar) {
                //console.log("botonRefrescar encontrado.");
                botonRefrescar.addEventListener('click', () => { 
                    VG.entrarEnVentanaPrincipalPRA = true; 
                    VG.refrescar = true;
                    VG.celdasPRAPrincipalOcultadas = false;
                    VG.celdasPRAPrincipalRedistribuidas = false;
/*                     chrome.runtime.sendMessage({ action: "reload_tab" }, (response) => {
                        if (response?.status === "success") {
                            //console.log("La pestaña se recargó correctamente.");
                        } else {
                            console.error("Error al recargar la pestaña.");
                        }
                    }); */

                    //RecargaVentanaPrincipalPRA();
                    //console.log("botonRefrescar pulsado."); 
                    });;
            }
            // Seleccionar el elemento <select> por su ID
            const selectElement = document.getElementById('X_OFERTAMATRIC');
            selectElement.addEventListener('change', function () {
                //entrandoEnVentanaPrincipalPRA = true;
                //console.log("Oferta matriculada cambiada.");
            });
        }
        VG.gestionandoPaginaPrincipalPRA = false;
        //console.log("VG.XXXgestionandoPaginaPrincipalPRA:", VG.gestionandoPaginaPrincipalPRA);
    }
    EntramosEnApartadosPRA();
    function EntramosEnApartadosPRA() {
        //console.log("EntramosEnApartadosPRA.");
        if (document && document.body && document.body.textContent.replace(/\s+/g, " ").includes("APARTADOS A CUMPLIMENTAR") && VG.entrarEnApartadosPRA && !VG.gestionandoPaginaApartadosPRA) {
            VG.entrarEnApartadosPRA = false;
            VG.gestionandoPaginaApartadosPRA = true;
            GestionaApartados();}

        else { VG.entrarEnApartadosPRA = true; }
        function GestionaApartados() {
            //console.log("GestionaApartados.");
             {
                VG.entrarEnApartadosPRA = false;
                //console.log("pasado el if")
                let seleccionadosColumna3 = [];
                chrome.storage.local.get(
                    ["seleccionadosColumna3"],
                    function (result) {
                        if (result.seleccionadosColumna3) {
                            seleccionadosColumna3 = result.seleccionadosColumna3;
                            //console.log("seleccionadosColumna3:", seleccionadosColumna3);
                            OcultarApartados();
                            //ClickEnDetalle();
                        }
                    });
                function OcultarApartados() {
                    const filas = Array.from(document.querySelectorAll("table tr"));
                    let primeraFila = true;
                    filas.forEach(fila => {
                        if (primeraFila) {
                            primeraFila = false;
                            return;
                        }
                        if (seleccionadosColumna3.includes(fila.cells[0].textContent.replace(/\s+/g, "").split(".")[1]))
                            fila.style.display = "";
                        else fila.style.display = "none";
                    });
                }
                function ClickEnDetalle(){
                    //console.log("ClickEnDetalle");
                    if(VG.saltaVentanaApartados){
                        // Busca todas las filas <tr> con la clase "menuContextual"
                        const filas = document.querySelectorAll('tr.menuContextual');
                        //const filas = document.querySelectorAll('td.enlaceTabla');

        
                        // Filtra las filas que tienen la asignatura específica (en este caso, "Francés (Segundo Idioma)")
                        const filasConAsignatura = Array.from(filas).filter(fila => {
                            const textoAsignatura = fila.querySelector('td.celdaConEnlaces span b')?.textContent || ''; // Obtiene el texto dentro del <b>
                            return seleccionadosColumna3.includes(textoAsignatura.replace(/\s+/g, ""))
                        });
                        // Itera sobre las filas encontradas y realiza acciones
                        filasConAsignatura.forEach(fila => {
                            //console.log("td b", fila.querySelector('td.celdaConEnlaces span b')?.textContent);
                            //console.log("Fila encontrada:", fila); 
                            const tdElement = fila.querySelector('td.celdaConEnlaces');
                            //console.log("tdElement:", tdElement);
                            /* const clickEvent = new MouseEvent('click', {
                                bubbles: true,
                                cancelable: true,
                                view: window,
                            });
                            tdElement.dispatchEvent(clickEvent); */
                            if (tdElement && tdElement.onclick) {
                                tdElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                                tdElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                                tdElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                            } else {
                                console.error('No se encontró el <td> especificado.');
                            }
                            //console.log("Click en el detalle de la asignatura.");
                            let enlaceDetalles = document.getElementById('menuItemmenuContainer_0');
                            if (enlaceDetalles && enlaceDetalles.onclick) {
                                enlaceDetalles.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                                enlaceDetalles.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                                enlaceDetalles.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                            }
                        });
                    }
        
                }
            }
        }

        VG.gestionandoPaginaApartadosPRA = false;
    }
    EntramosEnElementosCurricularesAReforzarPRA();
    function EntramosEnElementosCurricularesAReforzarPRA() {
        //console.log("EntramosEnElementosCurricularesAReforzarPRA.");
        if (document && document.body && document.body.textContent.replace(/\s+/g, " ").includes("ELEMENTOS CURRICULARES A REFORZAR") && 
            VG.entrarEnElementosCurricularesAReforzar && !VG.gestionandoElementosCurricularesAReforzar) 
            {
                VG.entrarEnElementosCurricularesAReforzar = false;
                VG.gestionandoElementosCurricularesAReforzar= true;
                ActivaTodosLosCriterios();
            }

        else { VG.entrarEnElementosCurricularesAReforzar = true; }

        function ActivaTodosLosCriterios(){
            //console.log("ActivaTodosLosCriterios");
            const botonTodos = document.getElementById("rightallX_CRITERIO");

            // Verifica si el botón existe y realiza el clic
            if (botonTodos) {
                botonTodos.click();
                //console.log("Botón clicado exitosamente.");
            } else {
                console.error("No se encontró el botón con id 'rightallX_CRITERIO'.");
            }
        }
        VG.gestionandoElementosCurricularesAReforzar = false;
    }
}
// Función para observar cambios dinámicos en el DOM
function observarCambiosEnDOM() {
    //console.log("observarCambiosEnDOM");
    const observer = new MutationObserver(() => {
        InicializarEventos();
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Lógica de inicialización principal
document.addEventListener("DOMContentLoaded", function () {
    if (VG.primerPase){
        VG.primerPase = false;
   
        }
    //VG.entrarEnContenidoPRA = true;
    InicializarEventos();
    observarCambiosEnDOM();


});

window.addEventListener("load", function () {
    //console.log("Todos los recursos de la página se han cargado.");
    
    // Puedes realizar operaciones seguras sobre imágenes, estilos, y más.
});
// Mostrar ventana emergente "Hola" solo una vez al día