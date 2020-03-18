import React from "./web_modules/react.js";
import ReactDOM from "./web_modules/react-dom.js";

class Hello extends React.Component {
  render() {
    return React.createElement("h1", null, `Hello ${this.props.toWhat}`);
  }
}

ReactDOM.render(
  React.createElement(Hello, { toWhat: "World" }, null),
  document.getElementById("main")
);
