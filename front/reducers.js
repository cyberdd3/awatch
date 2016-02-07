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
            return state.update('isSearching', true);
        case RECEIVE_SEARCH_RESULT:
            state = state.update('isSearching', false);

            if (state.get('isSearching'))
                return state.update('results', List(resolveMoviesWithPosters(action)));

            return state;
        case CLEAR_SEARCH_RESULTS:
            return state.update('results', List());
        case CHOOSE_MOVIE:
            return state.update('isSearching', false).update('chosenMovie', action.chosenMovie);
        default:
            return state
    }
}

export function discover(state = Map({results: List(), isLoading: false}), action) {
    switch (action.type) {
        case REQUEST_LOADING_SIMILAR:
            return state.update('isLoading', true);
        case RECEIVE_SIMILAR:
            let results = state.results.slice();
            if (state.isLoading)
                results = results.concat(resolveMoviesWithPosters(action));
            return Object.assign({}, state, {
                isLoading: false,
                results: results
            });
        case OFFER_MOVIE:
            return Object.assign({}, state, {
                results: state.results.slice(1)
            });
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