import fetch from 'isomorphic-fetch'
import {
    REQUEST_SEARCH, RECEIVE_SEARCH_RESULT, CLEAR_SEARCH_RESULTS, CHOOSE_MOVIE
} from './actionTypes'

export function requestSearch(query) {
    return {
        type: REQUEST_SEARCH,
        query
    }
}

export function receiveSearchResult(json) {
    return {
        type: RECEIVE_SEARCH_RESULT,
        movies: json.results,
        base_url: json.base_url,
        poster_size: json.poster_size
    }
}

export function clearSearchResults() {
    return {
        type: CLEAR_SEARCH_RESULTS
    }
}

export function chooseMovie(movie) {
    return {
        type: CHOOSE_MOVIE,
        chosenMovie: movie
    }
}


export function performSearch(query, hostname = "") {
    return function (dispatch) {
        dispatch(requestSearch(query));
        return fetch(`${hostname}/api/search/?query=${query}`)
            .then(response =>  response.json())
            .then(json =>
                dispatch(receiveSearchResult(json))
            )
            .catch(err => {
                //TODO error catch
            })
    }
}
