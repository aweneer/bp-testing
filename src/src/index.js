import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from "react-router-dom";
import './index.css';
import App from "./components/app/App";
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Router><App /></Router>, document.getElementById('root'));
serviceWorker.register();
//serviceWorker.unregister();
