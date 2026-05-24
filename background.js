/* chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "initialize"});
  }); */

/*  chrome.commands.onCommand.addListener((command) => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

        chrome.tabs.sendMessage(tabs[0].id, {tipo: "print", mensaje: tabs[0].id});
        console.log(tabs[0].url);
    });      
    console.log("tecla capturada");
}); 
console.log("background.js");

chrome.runtime.onInstalled.addListener(() => {
    tab = chrome.tabs.query({active: true, currentWindow: true});

}); */

/* chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "reload_tab") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs.length > 0) {
        chrome.tabs.reload(tabs[0].id, () => {
          sendResponse({ status: "success" });
        });
      } else {
        sendResponse({ status: "error", message: "No se encontró ninguna pestaña activa." });
      }
    });

    // Devuelve true para usar sendResponse de forma asíncrona
    return true;
  }
}); */
