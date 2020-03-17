import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import store from "./redux/store";
import Router from "./Router";
import "./index.css";

const Root = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <DndProvider backend={HTML5Backend}>
          <Router />
        </DndProvider>
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
