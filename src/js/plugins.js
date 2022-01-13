const setFan = ({ data }) => {
  injectPayload(`src/pl/fan.bin`, function (arrayBuffer) {
    const arr = new Uint8Array(arrayBuffer);
    arr[0x1d28] = data;
    return arr.buffer;
  });
};

const loadLinux = ({ data }) => {
  injectPayload(`src/pl/linux-loader.bin`, function (arrayBuffer) {
    const arr = new Uint8Array(arrayBuffer);
    arr[0x409e] = data;
    arr[0x40b6] = data;
    return arr.buffer;
  });
};

const loadUrl = (url) => {
  $("=iframe").setAttribute("src", url);
  $("=iframe").style.display = "block";
  $("=iframe").focus();
};

const actions = { setFan, loadLinux, loadUrl };
