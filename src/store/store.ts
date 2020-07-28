import { createStore, combineReducers, compose, Store, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import thunk from "redux-thunk";
import userReducer, { UserState } from "../reducers/user.reducer";
import basketReducer, { BasketState } from "../reducers/basket.reducer";
import productReducer, { ProductState } from "../reducers/products.reducer";

declare global {
  interface Window {
    // eslint-disable-next-line no-undef
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

export interface AppState {
  basket: BasketState;
  user: UserState;
  products: ProductState;
}

const persistConfig = {
  key: "root",
  storage: storageSession,
};

const rootReducer = combineReducers({
  basket: basketReducer,
  user: userReducer,
  products: productReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default (): any => {
  const store: Store<AppState> = createStore(
    persistedReducer,
    composeEnhancers(applyMiddleware(thunk)),
  );
  const persistor = persistStore(store);
  return { store, persistor };
};
