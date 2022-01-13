/**
 * Small version of jQuery for easy
 * selecting elements from the DOM
 
 * @author Jan Biasi
 * @version  1.0.1
 * @license MIT
 *
 * @param  {string} selector    CSS selector
 * @return {object}             Single or multiple DOM Nodes
 */
const $ = (selector, root = document) => {
  const matches = {
    "#": "getElementById",
    ".": "getElementsByClassName",
    "@": "getElementsByName",
    "=": "getElementsByTagName",
    "?": "querySelectorAll",
  };
  const rex = /[?=#@.*]/.exec(selector)[0];
  const nodes = root[matches[rex]](selector.split(rex)[1]);
  if (nodes.length == 1) {
    return nodes[0];
  }
  return nodes;
};

const __oldAlert = alert;
window.alert = (text) => {
  document.body.style.opacity = "0";
  setTimeout(() => {
    __oldAlert(text);
    document.body.style.opacity = "1";
  }, 400);
};

const injectPayload = (PLfile, responseTranformer) => {
  fetch("http://127.0.0.1:9090/status", {
    method: "POST",
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.status == "ready") {
        fetch(PLfile)
          .then((response) => response.arrayBuffer())
          .then((buffer) => {
            return responseTranformer ? responseTranformer(buffer) : buffer;
          })
          .then((buffer) => {
            fetch("http://127.0.0.1:9090", {
              method: "POST",
              body: buffer,
            })
              .then(() => {
                notify("Payload Transfer Complete", 0);
              })
              .catch(() => {
                notify("Can't send the payload", 1);
              });
            return buffer;
          })
          .catch(() => {
            notify("Unable to load payload", 1);
          });
        return;
      }
      notify("Cannot Load Payload Because binloader Server Is Busy", 1);
    })
    .catch((error) => {
      notify("Enable binloader server in GoldHEN settings", 1);
    });
};

let binaryLoaderStatus = false;
const getBinaryLoaderStatus = () => {
  binaryLoaderStatus = false;
  return fetch("http://127.0.0.1:9090/status", {
    method: "POST",
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.status == "ready") {
        binaryLoaderStatus = true;
        return;
      }
      notify("Cannot Load Payload Because binloader Server Is Busy", 1);
    });
};

const notify = (text, level = 0, delay = 0) => {
  const notifyLevel = { 0: "", 1: " -error" };
  setTimeout(() => {
    $(
      "?.xhost__notification-container"
    ).innerHTML = `<div class="xhost__notification ${notifyLevel[level]}">${text}</div>`;
  }, delay);

  setTimeout(() => {
    $("?.xhost__notification-container").innerHTML = "";
  }, delay + 5000);
};
