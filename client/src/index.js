import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./App";
import "./index.css";

const Root = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));

document.body.removeAttribute("class");
document.querySelector("html").addEventListener("touchstart", () => {
  let { clientHeight, scrollHeight, scrollTop } = this;
  let scroll = scrollHeight - scrollTop;
  let scrollTo;

  if (scroll === clientHeight) scrollTo = scrollTop - 1;
  if (scroll === scrollHeight) scrollTo = scrollTop + 1;

  if (scrollTo) return (this.scrollTop = scrollTo);
});
