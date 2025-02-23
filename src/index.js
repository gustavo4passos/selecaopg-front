import React from 'react'
import ReactDOM from 'react-dom'

import './assets/css/index.css'
import App from './components/App'

import * as serviceWorker from './services/serviceWorker'

ReactDOM.render(<App />, document.getElementById('root'));


serviceWorker.unregister();
