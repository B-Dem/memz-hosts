const queryParams = new URLSearchParams(window.location.search);

window.XHOST_USB_DELAY = window.parent.XHOST_USB_DELAY || "10000";
window.XHOST_USB_MODE = window.parent.XHOST_USB_MODE || "manual";

/* HELPERS */
const ᗢalert = window.alert;
window.alert = (str) => {
  return new Promise((resolve) => {
    ᗢalert(str);
    resolve();
  });
};

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const waitForUSB = () => {
  return window.XHOST_USB_MODE === "auto"
    ? sleep(parseInt(window.XHOST_USB_DELAY, 10))
    : alert(
        `

    
    💡 Insert the USB stick.💾       
    ⏰ Wait until the 🎫 notificacion Popsup ⚠
    ❌ Close this window.`
      );
};

let needsReload = false;
const allset = () => {
  if (window.XHOST_USB_MODE === "auto") {
    window.parent.notify(
      "Please Close & Reload your Browser<br/>before running another payload"
    );
  } else {
    alert(
      `\n\nPlease 🔥 Close & Reload your 🌐 Browser before running another payload`
    );
  }
  needsReload = true;
};

const checkNeedsReload = () => {
  if (needsReload) {
    alert(
      `\n\nPlease 🔥 Close & Reload your 🌐 Browser before running another payload`
    );
    return true;
  }
  return false;
};

const action__loadBinaryLoader = () => {
  if (!checkNeedsReload()) {
    out_jb = "BinLD";
    poc();
  }
};

const action__loadMiraJailbreak = () => {
  if (!checkNeedsReload()) {
    out_jb = "JB";
    poc();
  }
};

const action__loadMira = (file, responseTranformer) => {
  if (!checkNeedsReload()) {
    out_jb = "MLD";
    fetch(file)
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        if (responseTranformer) {
          buffer = responseTranformer(buffer);
        }
        PLS = buffer;
        poc();
      });
  }
};

const action__postBinaryPayload = (file, responseTranformer) => {
  if (!checkNeedsReload()) {
    out_jb = "AllPL";
    fetch(file)
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        if (responseTranformer) {
          buffer = responseTranformer(buffer);
        }
        PLS = buffer;
        poc();
      });
    return true;
  }
};

window.action__postBinaryPayload = action__postBinaryPayload;
window.action__loadBinaryLoader = action__loadBinaryLoader;
window.action__loadMira = action__loadMira;
window.action__loadMiraJailbreak = action__loadMiraJailbreak;
let kernelContext = {};
window.setKernelContext = (ctx) => {
  kernelContext = ctx;
};
window.checkNeedsReload = checkNeedsReload;

function Binset() {
  alert("\n\n🏴‍☠️ Payload Loaded.\n📡 Send payloads to port 9020");
}

function LoaderPL() {
  if (out_jb == "AllPL") {
    var payload_buffer = chain.syscall(477, 0, 0x300000, 7, 0x1002, -1, 0);
    var pl = p.array_from_address(payload_buffer, PLS.byteLength * 4);
    var buf = new Uint32Array(PLS);
    pl.set(buf, 0);
    var pthread = p.malloc(0x10);
    chain.call(
      libKernelBase.add32(OFFSET_lk_pthread_create),
      pthread,
      0x0,
      payload_buffer,
      0
    );
    allset();
  } else if (out_jb == "MLD") {
    var payload_buffer = chain.syscall(477, 0, 0x300000, 7, 0x1002, -1, 0);
    var pl = p.array_from_address(payload_buffer, PLS.byteLength * 4);
    var buf = new Uint32Array(PLS);
    pl.set(buf, 0);
    var pthread = p.malloc(0x10);
    chain.call(
      libKernelBase.add32(OFFSET_lk_pthread_create),
      pthread,
      0x0,
      payload_buffer,
      0
    );
    Mset();
  } else if (out_jb == "JB") {
    allset();
  } else if (out_jb == "BinLD") {
    var payload_buffer = chain.syscall(
      477,
      0x0,
      0x300000,
      0x7,
      0x1000,
      0xffffffff,
      0
    );
    var payload_loader = p.malloc32(0x1000);

    var loader_writer = payload_loader.backing;
    loader_writer[0] = 0x56415741;
    loader_writer[1] = 0x83485541;
    loader_writer[2] = 0x894818ec;
    loader_writer[3] = 0xc748243c;
    loader_writer[4] = 0x10082444;
    loader_writer[5] = 0x483c2302;
    loader_writer[6] = 0x102444c7;
    loader_writer[7] = 0x00000000;
    loader_writer[8] = 0x000002bf;
    loader_writer[9] = 0x0001be00;
    loader_writer[10] = 0xd2310000;
    loader_writer[11] = 0x00009ce8;
    loader_writer[12] = 0xc7894100;
    loader_writer[13] = 0x8d48c789;
    loader_writer[14] = 0xba082474;
    loader_writer[15] = 0x00000010;
    loader_writer[16] = 0x000095e8;
    loader_writer[17] = 0xff894400;
    loader_writer[18] = 0x000001be;
    loader_writer[19] = 0x0095e800;
    loader_writer[20] = 0x89440000;
    loader_writer[21] = 0x31f631ff;
    loader_writer[22] = 0x0062e8d2;
    loader_writer[23] = 0x89410000;
    loader_writer[24] = 0x2c8b4cc6;
    loader_writer[25] = 0x45c64124;
    loader_writer[26] = 0x05ebc300;
    loader_writer[27] = 0x01499848;
    loader_writer[28] = 0xf78944c5;
    loader_writer[29] = 0xbaee894c;
    loader_writer[30] = 0x00001000;
    loader_writer[31] = 0x000025e8;
    loader_writer[32] = 0x7fc08500;
    loader_writer[33] = 0xff8944e7;
    loader_writer[34] = 0x000026e8;
    loader_writer[35] = 0xf7894400;
    loader_writer[36] = 0x00001ee8;
    loader_writer[37] = 0x2414ff00;
    loader_writer[38] = 0x18c48348;
    loader_writer[39] = 0x5e415d41;
    loader_writer[40] = 0x31485f41;
    loader_writer[41] = 0xc748c3c0;
    loader_writer[42] = 0x000003c0;
    loader_writer[43] = 0xca894900;
    loader_writer[44] = 0x48c3050f;
    loader_writer[45] = 0x0006c0c7;
    loader_writer[46] = 0x89490000;
    loader_writer[47] = 0xc3050fca;
    loader_writer[48] = 0x1ec0c748;
    loader_writer[49] = 0x49000000;
    loader_writer[50] = 0x050fca89;
    loader_writer[51] = 0xc0c748c3;
    loader_writer[52] = 0x00000061;
    loader_writer[53] = 0x0fca8949;
    loader_writer[54] = 0xc748c305;
    loader_writer[55] = 0x000068c0;
    loader_writer[56] = 0xca894900;
    loader_writer[57] = 0x48c3050f;
    loader_writer[58] = 0x006ac0c7;
    loader_writer[59] = 0x89490000;
    loader_writer[60] = 0xc3050fca;
    chain.syscall(74, payload_loader, 0x4000, 0x1 | 0x2 | 0x4);

    var pthread = p.malloc(0x10);
    //
    {
      chain.fcall(window.syscalls[203], payload_buffer, 0x300000);
      chain.fcall(
        libKernelBase.add32(OFFSET_lk_pthread_create),
        pthread,
        0x0,
        payload_loader,
        payload_buffer
      );
    }
    chain.run();
    Binset();
  }
}

const enableUSB = () => {
  if (window.XHOST_USB_MODE === "manual") {
    return;
  }
  window.parent.notify("Loading exfathax..<br/>Please Wait");
  return fetch("/xhost/usb/on");
};
const disableUSB = () => {
  if (window.XHOST_USB_MODE === "manual") {
    return;
  }
  return fetch("/xhost/usb/off");
};
