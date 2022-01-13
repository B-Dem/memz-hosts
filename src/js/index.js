const $hostMain = $(".xhost__main");
const $hostAutoloadProgress = $(".xhost__payload-autoload");
const $hostIntro = $(".xhost__intro");
const autoloadTime = 8000;

let activeMenuIdx = 1;
let activeSubmenuIndex = 0;
let initialMenu = true;
let initialMenuActiveMenuIdx = 0;
let lastMouseDown = 0;
let lastWindowWidth = window.innerWidth;
let menu;
let menuKeys;
let menuLength;
let payloadTimeout;
let rows;

const loadMenu = () => {
  return fetch("menu.json")
    .then((r) => r.json())
    .then((m) => {
      menu = m;
      return m;
    });
};

const getIntroSelectables = () => {
  return Array.from($("?.xhost__intro-select")).filter(
    (el) => el.getAttribute("hidden") != ""
  );
};

const xhostMouseUp = () => {
  if (initialMenu) {
    switch (initialMenuActiveMenuIdx) {
      case 0:
        if (binaryLoaderStatus) {
          notify("GoldHEN already loaded", 1);
          return;
        }
        gotoKernelExploit();
        break;
      case 1:
        initialMenu = false;
        $hostMain.style.opacity = 0;
        $hostIntro.setAttribute("hidden", "");
        $hostMain.removeAttribute("hidden");
        document.body.webkitRequestFullscreen();
        setTimeout(() => {
          $hostMain.style.opacity = 1;
        }, 1000);
        break;
    }

    return;
  }

  const targetEl = menu[menuKeys[activeMenuIdx]].items[activeSubmenuIndex];

  if (targetEl.action) {
    notify(`Running Payload: ${targetEl.name}`);
    setTimeout(() => {
      const { action, actionParams } = targetEl;
      notify(`${action} ${JSON.stringify(actionParams)}`);
      actions[action].call(null, actionParams);
    }, 2000);
    return;
  }
  if (targetEl.payload) {
    notify(`Running Payload: ${targetEl.name}`);
    setTimeout(() => {
      injectPayload(`src/pl/${targetEl.file}`);
    }, 5000);
    return;
  }
};

document.addEventListener("mouseup", xhostMouseUp);

document.addEventListener("mousedown", () => {
  lastMouseDown = +new Date();
});

document.addEventListener("keydown", (e) => {
  e.preventDefault();
  if (initialMenu) {
    switch (e.keyCode) {
      case 37: // left
        initialMenuActiveMenuIdx -= 1;
        if (initialMenuActiveMenuIdx < 0) {
          initialMenuActiveMenuIdx = 0;
        }
        $hostAutoloadProgress.setAttribute("hidden", "");
        clearTimeout(payloadTimeout);
        break;
      case 39: // right
        initialMenuActiveMenuIdx += 1;
        if (initialMenuActiveMenuIdx >= getIntroSelectables().length) {
          initialMenuActiveMenuIdx = getIntroSelectables().length - 1;
        }
        $hostAutoloadProgress.setAttribute("hidden", "");
        clearTimeout(payloadTimeout);
        break;
    }
    renderIntroMenu();
    return;
  }

  switch (e.keyCode) {
    case 37: // left
      activeSubmenuIndex -= 1;
      if (activeSubmenuIndex < 0) {
        activeSubmenuIndex = 0;
      }
      break;
    case 39: // right
      activeSubmenuIndex += 1;
      if (activeSubmenuIndex >= menu[menuKeys[activeMenuIdx]].items.length) {
        activeSubmenuIndex = menu[menuKeys[activeMenuIdx]].items.length - 1;
      }
      break;
    case 38: // up
      activeMenuIdx -= 1;
      if (activeMenuIdx < 0) {
        activeMenuIdx = rows.length - 1;
      }
      activeSubmenuIndex = 0;
      break;
    case 40: // down
      activeMenuIdx += 1;
      if (activeMenuIdx > rows.length - 1) {
        activeMenuIdx = 0;
      }
      activeSubmenuIndex = 0;
      break;
  }
  renderMenu();
  e.preventDefault();
});

const generateMenu = () => {
  const outputHTML = Object.keys(menu).reduce((acc, key, idx) => {
    const items = menu[key].items
      .map((item) => {
        return `<button class="xhost__button xhost__button__payload ${
          menu[key].smallButtons ? "xhost__button__small" : ""
        }"><div>${item.name}</div><div class="xhost-payload__desc">${
          item.desc ? item.desc : ""
        }</div></button>`;
      })
      .join("");
    return `${acc}<section row="${idx}" ${
      idx === activeMenuIdx ? "" : "disabled"
    } class="${
      idx === activeMenuIdx ? "active" : ""
    }"><button active class="xhost__button xhost__button__menu xhost__button__secondary xhost__button__payload"><div>${key}</div></button><div class="xhost__selectable-items">${items}</div></section>`;
  }, "");

  $(".section-container").innerHTML =
    $(".section-container").innerHTML + outputHTML;
  rows = $(`?[row]`);
};

const fullScreenChange = () => {
  if (window.innerWidth === 1920) {
    $hostMain.style.opacity = 0;
    $hostIntro.setAttribute("hidden", "");
    $hostMain.removeAttribute("hidden");
    setTimeout(() => {
      $hostMain.style.opacity = 1;
    }, 1000);
  } else {
    $hostIntro.style.opacity = 0;
    $hostMain.setAttribute("hidden", "");
    $hostIntro.removeAttribute("hidden");
    initialMenuActiveMenuIdx = binaryLoaderStatus ? 1 : 0;
    initialMenu = true;
    renderIntroMenu();
    setTimeout(() => {
      $hostIntro.style.opacity = 1;
    }, 1000);
  }
};

const renderIntroMenu = () => {
  getIntroSelectables().forEach((el) => {
    el.removeAttribute("active");
  });
  getIntroSelectables()[initialMenuActiveMenuIdx].setAttribute("active", "");
  getIntroSelectables()[initialMenuActiveMenuIdx].scrollIntoView();
};

const renderMenu = () => {
  rows.forEach((e) => {
    e.setAttribute("disabled", "");
    e.classList.remove("active");
  });
  const activeRow = $(`?[row="${activeMenuIdx}"]`);
  activeRow.removeAttribute("disabled");
  activeRow.classList.add("active");

  $("?.xhost__selectable-items button").forEach((el) => {
    el.removeAttribute("active");
  }, rows[activeMenuIdx]);

  const target = $("?.xhost__selectable-items button", rows[activeMenuIdx])[
    activeSubmenuIndex
  ];
  target.setAttribute("active", "");
  target.scrollIntoView({ behavior: "smooth", block: "center" });
};

const gotoKernelExploit = () => {
  $("=iframe").setAttribute("src", "kernel.html");
  $("=iframe").style.display = "block";
};

const setupResize = () => {
  setInterval(() => {
    if (lastWindowWidth === window.innerWidth) {
      return;
    }
    lastWindowWidth = window.innerWidth;
    fullScreenChange();
  }, 1000);
};

const setupAutoload = () => {
  payloadTimeout = setTimeout(() => {
    clearTimeout(payloadTimeout);
    $hostAutoloadProgress.setAttribute("hidden", "");
    gotoKernelExploit();
  }, autoloadTime);
};

const main = () => {
  generateMenu();
  setupResize();
  renderMenu();
  renderIntroMenu();
  fullScreenChange();
};

loadMenu().then(() => {
  menuKeys = Object.keys(menu);
  menuLength = menuKeys.length;

  getBinaryLoaderStatus()
    .then(() => {
      if (getBinaryLoaderStatus) {
        $hostAutoloadProgress.setAttribute("hidden", "");
        initialMenuActiveMenuIdx = 1;
        main();
        return;
      }
      main();
      setupAutoload();
    })
    .catch(() => {
      main();
      setupAutoload();
    });
});
