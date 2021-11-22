'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var SETTINGS = {
  id: "render_message_container",
  options: {
    mode: "auto",
    duration: 3e3,
    position: "top_right"
  },
  styles: {
    container: {
      position: "fixed",
      width: "250px",
      height: "auto",
      flexDirection: "column",
      listStyle: "none",
      padding: "5px 0",
      margin: "0",
      display: "flex",
      alignItems: "center"
    },
    message: {
      width: "250px",
      height: "auto",
      border: "1px solid gray",
      borderRadius: "3px",
      boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)",
      background: "white",
      padding: "10px",
      margin: "5px 0",
      fontSize: "13px",
      boxSizing: "border-box",
      opacity: 0,
      transform: "translate(0, 0)",
      transition: "transform ease-in-out 250ms, opacity ease-in-out 250ms",
      display: "flex",
      alignItems: "center"
    },
    button: {
      fontSize: "13px",
      padding: "3px 6px",
      background: "none",
      border: "1px solid gray",
      borderRadius: "25px",
      cursor: "pointer"
    },
    progress: {
      position: "absolute",
      bottom: "1px",
      left: "1px",
      width: "0",
      height: "1px",
      background: "blue"
    },
    centered: {
      width: "100%"
    }
  }
};

const POSITIONS = [
  "top",
  "top_left",
  "top_right",
  "bottom",
  "bottom_left",
  "bottom_right"
];
const ANIMATION_SIZE = 10;
function setDOM(element, styles, attrs) {
  for (let key in styles) {
    element.style[key] = styles[key];
  }
  for (let key in attrs) {
    element.setAttribute(key, attrs[key]);
  }
  return element;
}
function setPosition(position) {
  if (!POSITIONS.includes(position)) {
    throw new Error(`Position value must be: ${POSITIONS.join(", ")}.`);
  }
  let currentPosition = {};
  const positions_values = position.split("_");
  for (let key of positions_values) {
    currentPosition[key] = 0;
  }
  return positions_values.length === 1 ? { ...currentPosition, ...SETTINGS.styles.centered } : currentPosition;
}
function setTranslate(effect, position) {
  switch (position) {
    case "top":
      return effect === "in" ? [0, ANIMATION_SIZE] : [0, -ANIMATION_SIZE];
    case "bottom":
      return effect === "in" ? [0, -ANIMATION_SIZE] : [0, ANIMATION_SIZE];
    case "top_right":
    case "bottom_right":
      return effect === "in" ? [-ANIMATION_SIZE, 0] : [ANIMATION_SIZE, 0];
    case "top_left":
    case "bottom_left":
      return effect === "in" ? [ANIMATION_SIZE, 0] : [-ANIMATION_SIZE, 0];
    default:
      return [0, 0];
  }
}

class Message {
  constructor(text, options) {
    this.text = text;
    this.options = options;
    this.text = text;
    this.options = {
      duration: options?.duration ? options.duration * 1e3 : SETTINGS.options.duration,
      position: options?.position || SETTINGS.options.position,
      extend: options?.extend || {}
    };
    this.animate = this.animate.bind(this);
    this.observer = new MutationObserver((mutationsList) => this.mutationObserverCB(mutationsList, this.animate));
  }
  init() {
    this.$container = document.getElementById(SETTINGS.id) || setDOM(document.createElement("ol"), {
      ...SETTINGS.styles.container,
      ...setPosition(this.options.position)
    });
    this.$message = setDOM(document.createElement("li"), {
      ...SETTINGS.styles.message,
      ...this.options.extend
    });
    this.observer.observe(document, {
      attributes: true,
      childList: true,
      subtree: true
    });
    if (!document.getElementById(SETTINGS.id)) {
      this.$container.id = SETTINGS.id;
      document.body.append(this.$container);
    }
    const messageTxt = setDOM(document.createElement("span"), {
      flex: 1
    });
    messageTxt.textContent = this.text;
    this.$message.append(messageTxt);
    this.$container.append(this.$message);
  }
  animate(effect) {
    this.$message.dataset.animation = effect;
    const [x, y] = setTranslate(effect, this.options.position);
    setTimeout(() => {
      this.$message.style.transform = `translate(${x}px, ${y}px)`;
      this.$message.style.opacity = effect === "in" ? "1" : "0";
    });
    this.observer.disconnect();
  }
  destroy() {
    this.$message.remove();
  }
  mutationObserverCB(mutationsList, cb) {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.target?.id === SETTINGS.id) {
        cb("in");
      }
    }
  }
}

class Auto extends Message {
  constructor(text, options) {
    super(text, options);
    this.endTransitionEventListener = () => this.destroy();
  }
  render() {
    this.init();
    this.$progress = setDOM(document.createElement("div"), {
      ...SETTINGS.styles.progress
    });
    this.$message.addEventListener("transitionend", this.endTransitionEventListener);
    this.$message.appendChild(this.$progress);
    window.requestAnimationFrame(this.progress.bind(this));
    setTimeout(() => this.animate("out"), this.options.duration);
  }
  progress(current_time_progress) {
    if (!this.start_time_progress) {
      this.start_time_progress = current_time_progress;
    }
    const elapsed = current_time_progress - this.start_time_progress;
    if (this.previous_time_progress !== current_time_progress) {
      const count = elapsed / this.options.duration * 99;
      this.$progress.style.width = `${count}%`;
    }
    if (elapsed < this.options.duration) {
      this.previous_time_progress = current_time_progress;
      window.requestAnimationFrame(this.progress.bind(this));
    }
  }
  destroy() {
    if (this.$message.dataset.animation === "out") {
      super.destroy();
      this.$message.removeEventListener("transitionend", this.endTransitionEventListener);
    }
  }
}

class Static extends Message {
  constructor(text, options) {
    super(text, options);
    this.$close = setDOM(document.createElement("button"), {
      ...SETTINGS.styles.button
    });
    this.clickEventListener = () => this.destroy();
  }
  render() {
    this.init();
    this.$close.textContent = "Close";
    this.$message.appendChild(this.$close);
    this.$close.addEventListener("click", this.clickEventListener);
  }
  destroy() {
    super.destroy();
    this.$close.removeEventListener("click", this.clickEventListener);
  }
}

function auto(msg, options = {}) {
  const newAuto = new Auto(msg, options);
  newAuto.render();
}
function close(msg, options = {}) {
  const newStatic = new Static(msg, options);
  newStatic.render();
}
const notijs = {
  auto,
  close
};

exports.notijs = notijs;
//# sourceMappingURL=index.js.map
