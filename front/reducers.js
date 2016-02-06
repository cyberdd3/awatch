import { combineReducers} from 'redux'

import {
    REQUEST_SEARCH, RECEIVE_SEARCH_RESULT, CLEAR_SEARCH_RESULTS, CHOOSE_MOVIE,
    REQUEST_LOADING_SIMILAR, RECEIVE_SIMILAR, OFFER_MOVIE
} from './actions/actionTypes'


const SUGGESTION_POSTER_PLACEHOLDER = "/front/public/images/placeholder.png";

function searchMovies(state = {results: [], isSearching: false, chosenMovie: null}, action) {
    switch (action.type) {
        case REQUEST_SEARCH:
            return Object.assign({}, state, {
                isSearching: true
            });
        case RECEIVE_SEARCH_RESULT:
            let results = state.results;
            if (state.isSearching)
                results = resolvePosterPaths(action);

            return Object.assign({}, state, {
                isSearching: false,
                results: results
            });
        case CLEAR_SEARCH_RESULTS:
            return Object.assign({}, state, {
                results: []
            });
        case CHOOSE_MOVIE:
            return Object.assign({}, state, {
                isSearching: false,
                chosenMovie: action.chosenMovie
            });
        default:
            return state
    }
}

function discoverMovies(state = {results: [], isLoading: false}, action) {
    switch (action.type) {
        case REQUEST_LOADING_SIMILAR:
            return Object.assign({}, state, {
                isLoading: true
            });
        case RECEIVE_SIMILAR:
            let results = state.results.slice();
            console.log(results);
            if (state.isLoading)
                results = results.concat(resolvePosterPaths(action));
            return Object.assign({}, state, {
                isLoading: false,
                results: results
            });
        case OFFER_MOVIE:
            return  Object.assign({}, state, {
                results: state.results.slice(1)
            });
        default:
            return state
    }
}

const rootReducer = combineReducers({
    searchMovies,
    discoverMovies
});

function resolvePosterPaths(action) {
    return action.movies.map(function (movie) {
        if (!movie.poster_path)
            movie.poster_path = SUGGESTION_POSTER_PLACEHOLDER;
        else
            movie.poster_path = action.base_url + action.poster_size + movie.poster_path;
        return movie;
    });
}

export default rootReducer