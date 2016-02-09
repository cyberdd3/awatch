import { combineReducers} from 'redux'
import {List, Map} from 'immutable'

import {
    REQUEST_SEARCH, RECEIVE_SEARCH_RESULT, CLEAR_SEARCH_RESULTS, CHOOSE_MOVIE,
    REQUEST_LOADING_SIMILAR, RECEIVE_SIMILAR, OFFER_MOVIE
} from './actions/actionTypes'


const SUGGESTION_POSTER_PLACEHOLDER = "/front/public/images/placeholder.png";

export function search(state = Map({results: List(), isSearching: false, chosenMovie: null}), action) {
    switch (action.type) {
        case REQUEST_SEARCH:
            return state.set('isSearching', true);
        case RECEIVE_SEARCH_RESULT:
            if (state.get('isSearching'))
                state = state.set('results', List(resolveMoviesWithPosters(action))).set('isSearching', false);

            return state;
        case CLEAR_SEARCH_RESULTS:
            return state.set('results', List());
        case CHOOSE_MOVIE:
            return state.set('isSearching', false).set('chosenMovie', action.chosenMovie);
        default:
            return state
    }
}

export function discover(state = Map({results: List(), isLoading: false}), action) {
    switch (action.type) {
        case REQUEST_LOADING_SIMILAR:
            return state.set('isLoading', true);
        case RECEIVE_SIMILAR:
            if (state.get('isLoading'))
                state = state.update('results', results => results.concat(resolveMoviesWithPosters(action))).set('isLoading', false);

            return state;
        case OFFER_MOVIE:
            return state.update('results', results => results.shift());
        default:
            return state
    }
}

const rootReducer = combineReducers({
    search,
    discover
});

function resolveMoviesWithPosters(action) {
    return action.movies.map(function (movie) {
        if (!movie.poster_path)
            movie.poster_path = SUGGESTION_POSTER_PLACEHOLDER;
        else
            movie.poster_path = action.base_url + action.poster_size + movie.poster_path;
        return movie;
    });
}

export default rootReducer