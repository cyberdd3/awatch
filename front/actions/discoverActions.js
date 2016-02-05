import fetch from 'isomorphic-fetch'
export const REQUEST_LOADING_SIMILAR = 'REQUEST_LOADING_SIMILAR';
function requestLoadingSimilar(movieId) {
    return {
        type: REQUEST_LOADING_SIMILAR,
        movieId
    }
}

export const RECEIVE_SIMILAR = "RECEIVE_SIMILAR";
function receiveSimilar(json) {
    console.log(json);
    return {
        type: RECEIVE_SIMILAR,
        movies: json.results,
        base_url: json.base_url,
        poster_size: json.poster_size
    }
}

export const OFFER_MOVIE = "OFFER_MOVIE";
export function offerMovie() {
    return {
        type: OFFER_MOVIE
    }
}

export function loadSimilar(movieId) {
    return function (dispatch) {
        dispatch(requestLoadingSimilar(movieId));

        return fetch(`/api/discover?id=${movieId}`)
            .then(response => response.json())
            .then(json => dispatch(receiveSimilar(json)));
    }
}