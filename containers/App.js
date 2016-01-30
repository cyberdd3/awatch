import React, {Component} from 'react'
import {Provider} from 'react-redux'
import configureStore from '../configureStore'
import Awatch from './Awatch'

const store = configureStore({searchMovies: {results: []}});

//console.log(store.getState());

export default class App extends Component {
    render() {
        //console.log(store);
        return (
            <Provider store={store}>
                <Awatch />
            </Provider>
        )
    }
}
