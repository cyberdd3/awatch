import { combineReducers} from 'redux'

import {
    REQUEST_SEARCH, RECEIVE_SEARCH_RESULT
} from './actions'

const SUGGESTION_POSTER_PLACEHOLDER = "/public/images/placeholder.png";

function searchMovies(state = {results: []}, action) {
    console.log(action);
    switch (action.type) {
        case REQUEST_SEARCH:
            return Object.assign({}, state, {
                isSearching: true
            });
        case RECEIVE_SEARCH_RESULT:
            console.log(action);
            var results = action.movies.map(function (movie) {
                if (!movie.poster_path)
                    movie.poster_path = SUGGESTION_POSTER_PLACEHOLDER;
                else
                    movie.poster_path = action.base_url + action.poster_size + movie.poster_path;
                return movie;
            });
            return Object.assign({}, state, {
                isSearching: false,
                results: results
            });
        default:
            return state
    }
}

const rootReducer = combineReducers({
    searchMovies
});
export default rootReducer