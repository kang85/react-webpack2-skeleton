import React from 'react';

import App from './App';

import { Provider } from 'react-redux';
import BrowserRouter from 'react-router-dom/BrowserRouter'
import configureStore from 'redux/configureStore';

import transit from 'transit-immutable-js';

// deserialize the JSON to Immutable
const preloadedState = window.__PRELOADED_STATE__ ? transit.fromJSON(window.__PRELOADED_STATE__) : undefined;
const store = configureStore(preloadedState);

let path = ""
if(window.location) {
  console.log(window.location)
  path = window.location.pathname
  console.log("path: ", path)
}

console.log(store);
const Root = () => (
  <Provider store={store}>
    <BrowserRouter basename={path}>
      <App/>
    </BrowserRouter>
  </Provider>
);

export default Root