import 'babel-polyfill'
import React from 'react'
import {render} from 'react-dom'
import App from './containers/App'

import setupImmutableDevtools from 'immutable-devtools'
import Immutable from 'immutable'
setupImmutableDevtools(Immutable);

render(
    <App />,
    document.getElementById("content")
);