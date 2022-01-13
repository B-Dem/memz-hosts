let initialMenuActiveMenuIdx = 0;
let menuKeys;
let menuLength;
let payloadTimeout;
let rows;

const getIntroSelectables = () => {
  return Array.from($("?.xhost__intro-select")).filter(
    (el) => el.getAttribute("hidden") != ""
  );
};

const xhostMouseUp = () => {
  // alert(1);
  switch (initialMenuActiveMenuIdx) {
    case 0:
      notify("0");
      break;
    case 1:
      notify("1");
      break;
  }
};

document.addEventListener("mouseup", xhostMouseUp);

document.addEventListener("keydown", (e) => {
  e.preventDefault();
  switch (e.keyCode) {
    case 37: // left
      initialMenuActiveMenuIdx -= 1;
      if (initialMenuActiveMenuIdx < 0) {
        // initialMenuActiveMenuIdx = menu[menuKeys[activeMenuIdx]].items.length - 1;
        initialMenuActiveMenuIdx = 0;
      }

      clearTimeout(payloadTimeout);
      break;
    case 39: // right
      initialMenuActiveMenuIdx += 1;
      if (initialMenuActiveMenuIdx >= getIntroSelectables().length) {
        initialMenuActiveMenuIdx = getIntroSelectables().length - 1;
      }

      clearTimeout(payloadTimeout);
      break;
  }
  renderIntroMenu();
});

const renderIntroMenu = () => {
  getIntroSelectables().forEach((el) => {
    el.removeAttribute("active");
  });
  getIntroSelectables()[initialMenuActiveMenuIdx].setAttribute("active", "");
  getIntroSelectables()[initialMenuActiveMenuIdx].scrollIntoView();
};

const main = () => {
  $(".xhost__web-activator__user-slots").innerHTML = `${Array(16)
    .fill(0)
    .map((el, idx) => {
      return `<button
    class="xhost__button xhost__button__payload xhost__intro-select"
    active
  >
    <div>xperiments</div>
    <div class="xhost-payload__desc">User Slot ${idx}</div>
    <div class="xhost__web-activator__id">ID 0000000000000000</div>
    <div class="xhost__web-activator__id">B64ID 0000000000000000</div>
  </button>;`;
    })}`;

  renderIntroMenu();
};

initialMenuActiveMenuIdx = 0;
main();
