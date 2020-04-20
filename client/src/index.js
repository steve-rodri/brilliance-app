import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import store from "./redux/store";
import App from "./App";
import "./index.css";

const Root = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <DndProvider backend={HTML5Backend}>
          <App />
        </DndProvider>
      </BrowserRouter>
    </Provider>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));
