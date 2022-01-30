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
      $(".iframe").contentWindow.action__postBinaryPayload(
        PLfile,
        responseTranformer
      );
    });
};

const action__loadUrl = (url) => {
  window.location.href = url;
};

const action__setTheme = (themeColors) => {
  const root = document.documentElement;

  root.style.setProperty("--color-black", themeColors[0]);
  root.style.setProperty("--color-cod-gray", themeColors[1]);
  root.style.setProperty("--color-primary-rgba", themeColors[2]);
  root.style.setProperty("--color-primary", themeColors[3]);
  root.style.setProperty("--color-secondary-rgba", themeColors[4]);
  root.style.setProperty("--color-secondary", themeColors[5]);
  root.style.setProperty("--color-white", themeColors[6]);
  root.style.setProperty("--color-error", themeColors[7]);
};

const action__setFan = ({ data }) => {
  const transformer = (arrayBuffer) => {
    const arr = new Uint8Array(arrayBuffer);
    arr[0x1d28] = data;
    return arr.buffer;
  };
  if (navigator.onLine) {
    injectBinaryPayloadPOST(`pl/fan.bin`, transformer);
    return;
  }

  $(".iframe").contentWindow.action__postBinaryPayload(
    `pl/fan.bin`,
    transformer
  );
};

const action__loadLinux = ({ data }) => {
  const transformer = (arrayBuffer) => {
    const arr = new Uint8Array(arrayBuffer);
    arr[0x409e] = data;
    arr[0x40b6] = data;
    return arr.buffer;
  };

  if (navigator.onLine) {
    injectBinaryPayloadPOST(`pl/linux-loader.bin`, transformer);
    return;
  }
  $(".iframe").contentWindow.action__postBinaryPayload(
    `pl/linux-loader.bin`,
    transformer
  );
};

const action__postBinaryPayload = (payloadUrl) => {
  if (navigator.onLine) {
    injectBinaryPayloadPOST(`pl/${payloadUrl}`);
    return;
  }
  $(".iframe").contentWindow.action__postBinaryPayload(`pl/${payloadUrl}`);
};

const action__showPayloads = () => {
  const $hostMain = $(".xhost__main");

  $hostMain.style.opacity = 0;
  $hostMain.removeAttribute("hidden");
  $hostMain.style.opacity = 1;
};

const action__contextMenu = (items) => {
  contextMenuItems = [
    {
      name: "back",
      action: "contextMenuClose",
      class: "xhost__button__secondary",
      silent: true,
    },
    ...items,
  ];
  showContextMenu = true;
  generateContextMenu(contextMenuItems);
  contextMenuActiveMenuIndex = 0;
  renderContextMenu();
  $(".xhost__context").style.display = "block";
};

const action__contextMenuClose = () => {
  showContextMenu = false;

  renderMainMenu();
  $(".xhost__context").style.display = "none";
};

const action__loadBinaryLoader = () => {
  $(".iframe").contentWindow.action__loadBinaryLoader();
};

const action__loadMiraJailbreak = () => {
  $(".iframe").contentWindow.action__loadMiraJailbreak();
};

const action__loadMira = () => {
  $(".iframe").contentWindow.action__loadMira();
};

const select__color = (option) => {
  // alert(option.innerText + "," + option.value);
};

const select__usbDelay = (option) => {
  // alert(option.innerText + " USB DELAY ," + option.value);
};

const action__selectParams = {};
const action__select = () => {};

const selects = {
  select__color,
  select__usbDelay,
};

$(".xhost__select").addEventListener("change", () => {
  selects["select__" + action__selectParams.params.onchange](
    $(".xhost__select").options[$(".xhost__select").selectedIndex]
  );

  selectStores[action__selectParams.params.store] =
    $(".xhost__select").options[$(".xhost__select").selectedIndex].value;
});

const actions = {
  action__contextMenu,
  action__contextMenuClose,
  action__loadBinaryLoader,
  action__loadLinux,
  action__loadMira,
  action__loadMiraJailbreak,
  action__loadUrl,
  action__postBinaryPayload,
  action__setFan,
  action__setTheme,
  action__showPayloads,
  action__select,
};
