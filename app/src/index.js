import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import './assets/styles/main.css';
import App from './scenes/App';
import * as ServiceWorker from './services/ServiceWorker';
import MainStore from './stores/MainStore';

ReactDOM.render(
    <Provider store={MainStore}>
        <App />
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
ServiceWorker.unregister();
