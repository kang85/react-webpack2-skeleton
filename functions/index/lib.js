import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import transit from 'transit-immutable-js';
import * as _ from 'lodash'

import configureStore from '../../src/redux/configureStore';
import reducer from '../../src/redux/modules';
import App      from '../../src/containers/App';

import { asset, redirect, logout } from '../scripts';

const renderApp = (context, store, location) => ReactDOMServer.renderToString(
        <Provider store={store}>
            <StaticRouter location={location} context={context}>
                <App/>
            </StaticRouter>
        </Provider>
    )

const renderPage = (html, preloadedState) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.9/semantic.min.css"/>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.9/semantic.min.js"></script>

            <link href="assets/main.css" rel="stylesheet">
            <style>
            *, *::after, *::before {
                box-sizing: initial !important;
            }
            </style>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>쿨에스엠에스</title>
        </head>
        <body>
            <div id="root">${html}</div>
            <script>
                // WARNING: See the following for security issues around embedding JSON in HTML:
                // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
                window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
            </script>
            <script src="assets/vendor.js"></script>
            <script src="assets/main.bundle.js"></script>
        </body>
        </html>
    `;
}

export default function render(event, callback) {
    var path = event.path;
    var Location = `https://solapi.com${path}`
    console.log("Location: ", Location);
    console.log("Path: ", event.path);

    let pathArr = _.split(path, "/")
    console.log("pathArr : ", pathArr)

    let assetIndex = _.indexOf(pathArr, "assets")
    if(assetIndex != -1) {
        console.log("calling bundle.js");
        console.log("assetIndex : ", pathArr[assetIndex])
        console.log("file name: ", pathArr[assetIndex + 1])
        asset(pathArr[assetIndex + 1], callback)
        return;
    }

    // text/html 타입으로 리턴시 App.js 에 Route 로 추가 
    const logger = createLogger();
    //const store = createStore( reducer, composeWithDevTools( applyMiddleware(thunk, logger)));
    const store = configureStore()
    const context = {}
    let markup = renderApp(context, store, path)
    console.log("Context: ", context)

    if (context.url) {
        return response("301", 
        {
            "Location": result.redirect.pathname, 
            "Content-type": "text/html",
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : true
        }); 
    } else {
        // status 로 변경 처리 (나중에)
        if (context.missed) {
            return response("302", 
                {
                    "Location": Location, 
                    "Content-type": "text/html",
                    "Access-Control-Allow-Origin" : "*",
                    "Access-Control-Allow-Credentials" : true
                });
        }

        Promise.all(store.getState().promise).then(() => {

            // serialize the store, except the promise reducer (transit cannot handle it)
            store.getState().promise = [];
            var serialized = transit.toJSON(store.getState());
            var html_template = renderPage(markup, serialized);
            //console.log(html_template);
            return response(200, 
                    {
                        "Content-type": "text/html",
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true
                    }, html_template, callback);

        }).catch((error) => {

            console.log(error);
            return response(400, 
                    {
                        "Content-type": "text/html",
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true
                    }, `페이지 처리중에 에러가 발생하였습니다. \n${error}`, callback);
        })

    }
}

function response(statusCode, headers, body, callback) {
    console.log("response - statusCode: ", statusCode);
    console.log("response - headers : ", headers);
    console.log("response - body : ", body);
    callback(null, {
        statusCode: statusCode,
        headers: headers,
        body: body
    });
}