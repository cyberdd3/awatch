import expect from 'expect'
import * as searchActions from '../../front/actions/searchActions'
import * as discoverActions from '../../front/actions/discoverActions'
import * as types from '../../front/actions/actionTypes'


describe('search actions', () => {
    it('should create an action to request search', () => {
        const query = "Awatch";
        const expectedAction = {
            type: types.REQUEST_SEARCH,
            query
        };
        expect(searchActions.requestSearch(query)).toEqual(expectedAction);
    });

    it('should create an action to receive search result', () => {
        const json = {
            results: [{'id': 1}, {'id': 2}],
            base_url: "base_url",
            poster_size: "poster_size"
        };
        expect(searchActions.receiveSearchResult(json)).toEqual({
            type: types.RECEIVE_SEARCH_RESULT,
            movies: json.results,
            base_url: json.base_url,
            poster_size: json.poster_size
        });
    });

    it('should create an action to clear search results', () => {
        expect(searchActions.clearSearchResults()).toEqual({
            type: types.CLEAR_SEARCH_RESULTS
        });
    });

    it('should create an action to choose movie', () => {
        const movie = {'id': 345};
        expect(searchActions.chooseMovie(movie)).toEqual({
            type: types.CHOOSE_MOVIE,
            chosenMovie: movie
        })
    });
});

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

const mockStore = configureMockStore([thunk]);
const HOSTNAME = "http://127.0.0.1:3000";

describe("search async actions", () => {
    afterEach(() => {
        nock.cleanAll();
    });

    it('creates RECEIVE_SEARCH_RESULT when fetching searchResults has been done', (done) => {
        const searchResult = {
            "results": [{
                "id": 30767,
                "original_title": "Eternal"
            }, {
                "id": 38,
                "original_title": "Eternal Sunshine of the Spotless Mind"
            }], "base_url": "http://image.tmdb.org/t/p/", "poster_size": "w92"
        };
        const query = 'Eternal';
        nock(HOSTNAME)
            .log(console.log)
            .get('/api/search/')
            .query({query})
            .reply(200, searchResult);

        const expectedActions = [
            {
                type: types.REQUEST_SEARCH,
                query
            },
            {
                type: types.RECEIVE_SEARCH_RESULT,
                movies: searchResult.results,
                base_url: searchResult.base_url,
                poster_size: searchResult.poster_size
            }
        ];

        const store = mockStore({}, expectedActions, done);
        store.dispatch(searchActions.performSearch(query, HOSTNAME));
    })
});

