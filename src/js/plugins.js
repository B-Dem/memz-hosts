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
  injectBinaryPayloadPOST(`src/pl/${payloadUrl}`);
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
