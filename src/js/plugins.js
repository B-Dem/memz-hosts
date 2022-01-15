var getPayload = function (payload, onLoadEndCallback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", payload);
  xhr.send();
  xhr.responseType = "arraybuffer";
  xhr.onload = function (event) {
    if (onLoadEndCallback) onLoadEndCallback(xhr, event);
  };
};

var sendPayload = function (url, data, onLoadEndCallback) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.send(data);

  xhr.onload = function (event) {
    if (onLoadEndCallback) onLoadEndCallback(xhr, event);
  };
};

function LoadviaGoldhen(PLfile) {
  var PS4IP = "127.0.0.1";
  var xhr = new XMLHttpRequest();
  xhr.open("POST", `http://${PS4IP}:9090/status`, true);
  xhr.send();
  xhr.onerror = function (err) {
    alert("Load Error , first Enable binloader server from Setting GoldHEN");
    return;
  };
  xhr.onload = function () {
    var responseJson = JSON.parse(xhr.responseText);
    if (responseJson.status == "ready") {
      getPayload(PLfile, function (xhr) {
        if ((xhr.status === 200 || xhr.status === 304) && xhr.response) {
          //Sending bins via IP POST Method
          sendPayload(`http://${PS4IP}:9090`, xhr.response, function (xhr) {
            if (xhr.status === 200) {
              alert("Payload Loaded");
            } else {
              alert("Can't send the payload");
              return;
            }
          });
        }
      });
    } else {
      alert("Cannot Load Payload Because binloader Server Is Busy");
      return;
    }
  };
}

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

const injectBinaryPayloadPOST = (PLfile, responseTranformer) => {
  fetch("http://127.0.0.1:9090/status")
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

const action__setFan = ({ data }) => {
  injectBinaryPayloadPOST(`src/pl/fan.bin`, function (arrayBuffer) {
    const arr = new Uint8Array(arrayBuffer);
    arr[0x1d28] = data;
    return arr.buffer;
  });
};

const action__loadLinux = ({ data }) => {
  injectBinaryPayloadPOST(`src/pl/linux-loader.bin`, function (arrayBuffer) {
    const arr = new Uint8Array(arrayBuffer);
    arr[0x409e] = data;
    arr[0x40b6] = data;
    return arr.buffer;
  });
};

const action__postBinaryPayload = (payloadUrl) => {
  // injectBinaryPayloadPOST(`src/pl/${payloadUrl}`);
  LoadviaGoldhen(`src/pl/${payloadUrl}`);
};

const action__loadUrl = (url) => {
  window.location.href = url;
};

const actions = {
  action__setFan,
  action__loadLinux,
  action__loadUrl,
  action__postBinaryPayload,
};
