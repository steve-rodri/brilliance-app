import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { loadState, saveState } from "./localStorage";
import logger from "redux-logger";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import throttle from "lodash/throttle";

import rootReducer from "./reducers";

const middleware = applyMiddleware(logger, thunk, promise);

const configureStore = () => {
  const persistedState = loadState();
  const store = createStore(
    rootReducer,
    persistedState,
    composeWithDevTools(middleware)
  );
  store.subscribe(
    throttle(() => {
      saveState(store.getState());
    }),
    1000
  );
  return store;
};
export default configureStore();
