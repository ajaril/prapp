console.log("popup.js cargado");
let checkboxOcultaRubricas = document.getElementById("checkboxOcultaRubricas");
let checkboxClonar= document.getElementById("checkboxClonar");
let checkboxOcultaCriterios = document.getElementById("checkboxOcultaCriterios");
checkboxOcultaCriterios.checked = true;
console.log("checkboxOcultaCriterios: "+checkboxOcultaCriterios);
checkboxOcultaRubricas.addEventListener("change", () => {
    console.log(checkboxOcultaRubricas.checked+" change");
    chrome.storage.local.set({OcultaRubricas: checkboxOcultaRubricas.checked});
    console.log(checkboxOcultaRubricas.checked+" set");
    chrome.tabs.query({}, tabs=> {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {OcultaRubricas: checkboxOcultaRubricas.checked})
        })
    });
});
checkboxOcultaCriterios.addEventListener("change", () => {
    chrome.storage.local.set({OcultaCriterios: checkboxOcultaCriterios.checked});
    chrome.tabs.query({}, tabs=> {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {OcultaCriterios: checkboxOcultaCriterios.checked})
        })
    });
});
checkboxClonar.addEventListener("change", () => {
    if (checkboxClonar.checked==false){
        checkboxPasa.checked = false;
        chrome.storage.local.set({Pasar: checkboxPasa.checked});
        chrome.tabs.query({}, tabs=> {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, {Pasar: checkboxPasa.checked})
            })
        });
    }
    console.log(checkboxClonar.checked+" change");
    chrome.storage.local.set({Clonar: checkboxClonar.checked});
    console.log(checkboxClonar.checked+" set");
    //update_checkbox()
    chrome.tabs.query({}, tabs=> {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {Clonar: checkboxClonar.checked})
        })
    });
});

checkboxPasa.addEventListener("change", () => {
    if ((checkboxPasa.checked==true)&&(checkboxClonar.checked==false)){
        checkboxPasa.checked = false;}
    else
    {console.log(checkboxPasa.checked+" change");
    chrome.storage.local.set({Pasar: checkboxPasa.checked});
    console.log(checkboxPasa.checked+" set");
    //update_checkbox()
    chrome.tabs.query({}, tabs=> {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {Pasar: checkboxPasa.checked})
        })
    });
}
});    
var ocultaRubricasEnStorage = chrome.storage.local.get(["OcultaRubricas"], data => {
    checkboxOcultaRubricas.checked = data.OcultaRubricas;
    if (data.OcultaRubricas==undefined){
        checkboxOcultaRubricas.checked = true;
        chrome.tabs.query({}, tabs=> {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, {OcultaRubricas: checkboxOcultaRubricas.checked})
            })
        });
        //console.log(checkboxOcultaRubricas.checked+" get undefined");
    }
    else{
        checkboxOcultaRubricas.checked = data.OcultaRubricas;
    }
    console.log(checkboxOcultaRubricas.checked+" get");

});

if (ocultaRubricasEnStorage==undefined){
    checkboxOcultaRubricas.checked = true;
};
var ocultaCriteriosEnStorage = chrome.storage.local.get(["OcultaCriterios"], data => {
    checkboxOcultaCriterios.checked = data.OcultaCriterios;
    if (data.OcultaCriterios==undefined){
        console.log("a1");
        checkboxOcultaCriterios.checked = true;
        chrome.tabs.query({}, tabs=> {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, {OcultaCriterios: checkboxOcultaCriterios.checked})
            })
        });
    }
    else{
        checkboxOcultaCriterios.checked = data.OcultaCriterios;
    }
    console.log(checkboxOcultaCriterios.checked+" get");
});
console.log("ocultaCriteriosEnStorage: "+ocultaCriteriosEnStorage);
if (ocultaCriteriosEnStorage==undefined){
    checkboxOcultaCriterios.checked = true;
    console.log ("checkboxOcultaCriterios checked1: "+checkboxOcultaCriterios.checked);
};

var clonadoActivadoEnStorage = chrome.storage.local.get(["Clonar"], data => {
    checkboxClonar.checked = data.Clonar;
    console.log(checkboxClonar.checked+" get checkboxClonar.checked");
    if (data.Clonar==undefined){
        checkboxClonar.checked = true;
        chrome.tabs.query({}, tabs=> {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, {Clonar: checkboxClonar.checked})
            })
        });
    }
    else{
        checkboxClonar.checked = data.Clonar;
    }
});
if (clonadoActivadoEnStorage==undefined){
    checkboxClonar.checked = true;
}
var pasaAlumnoEnStorage = chrome.storage.local.get(["Pasar"], data => {
    checkboxPasa.checked = data.Pasar;
    console.log(checkboxPasa.checked+" get checkboxPasa.checked");
    if (data.Pasar==undefined){
        checkboxPasa.checked = true;
        chrome.tabs.query({}, tabs=> {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, {Pasar: checkboxPasa.checked})
            })
        });
    }
    else{
        checkboxPasa.checked = data.Pasar;
    }
});
if (pasaAlumnoEnStorage==undefined){
    checkboxPasa.checked = true;
}
document.addEventListener('DOMContentLoaded', () => {
    const checkboxPRA = document.getElementById('checkboxPRA');
    const botonMenuSeleccion = document.getElementById('botonMenuSeleccion');
  
    chrome.storage.local.get(['checkboxPRAState'], (result) => {
        if (result.checkboxPRAState === undefined) {
            chrome.storage.local.set({ checkboxPRAState: true });
            checkboxPRA.checked = true;
            return;
        }else checkboxPRA.checked = result.checkboxPRAState;
    });
    // Manejar el cambio del checkbox
    checkboxPRA.addEventListener('change', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.storage.local.set({ checkboxPRAState: checkboxPRA.checked });
            chrome.tabs.reload(tabs[0].id);
          });            
    });
  
    // Manejar el clic del botón
    botonMenuSeleccion.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "botonMenuSeleccionClickado" });
          });
    });
  });
  
