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

// const __oldAlert = alert;
// window.alert = (text) => {
//   document.body.style.opacity = "0";
//   setTimeout(() => {
//     __oldAlert(text);
//     document.body.style.opacity = "1";
//   }, 400);
// };

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
