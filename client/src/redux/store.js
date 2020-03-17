import { createStore, applyMiddleware } from "redux";
import { composeWithDevtools } from "redux-devtools-extension";
import logger from "redux-logger";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import { loadState, saveState } from "./localStorage";
import throttle from "lodash/throttle";

import rootReducer from "./reducers";

const middleware = applyMiddleware(logger, thunk, promise);

const configureStore = () => {
  const persistedState = loadState();
  const store = createStore(
    rootReducer,
    persistedState,
    composeWithDevtools(middleware)
  );
  store.subscribe(
    throttle(() => {
      saveState(store.getState());
    }),
    1000
  );
};

export default configureStore();
