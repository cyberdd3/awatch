import expect from 'expect'
import * as discoverActions from '../../front/actions/discoverActions'
import * as types from '../../front/actions/actionTypes'

describe('discover actions', () => {
    it('should create an action to request loading similar', () => {
        expect(discoverActions.requestLoadingSimilar(1)).toEqual({
            type: types.REQUEST_LOADING_SIMILAR,
            movieId: 1
        })
    });

    it('should create an action to receive similar', () => {
        const json = {
            results: [{id: 1}, {id: 2}],
            base_url: "base_url",
            poster_size: "poster_size"
        };
        expect(discoverActions.receiveSimilar(json)).toEqual({
            type: types.RECEIVE_SIMILAR,
            movies: json.results,
            base_url: json.base_url,
            poster_size: json.poster_size
        })
    });

    it('should create an action to offer movie', () => {
        expect(discoverActions.offerMovie()).toEqual({
            type: types.OFFER_MOVIE
        })
    });
});

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

const mockStore = configureMockStore([thunk]);
import {HOSTNAME} from '../test_config'

describe("discover async actions", () => {
    afterEach(() => {
        nock.cleanAll();
    });

    it('creates RECEIVE_SEARCH_RESULT when fetching similar movies has been done', (done) => {
        const discoverResult = {
            "results": [{
                "id": 1,
                "original_title": "Discover result 1"
            }, {
                "id": 2,
                "original_title": "Discover result 2"
            }], "base_url": "http://image.tmdb.org/t/p/", "poster_size": "w92"
        };
        const movieId = 330;
        nock(HOSTNAME)
            .get('/api/discover/')
            .query({id: movieId})
            .reply(200, discoverResult);

        const expectedActions = [
            {
                type: types.REQUEST_LOADING_SIMILAR,
                movieId
            },
            {
                type: types.RECEIVE_SIMILAR,
                movies: discoverResult.results,
                base_url: discoverResult.base_url,
                poster_size: discoverResult.poster_size
            }
        ];

        const store = mockStore({}, expectedActions, done);
        store.dispatch(discoverActions.loadSimilar(movieId, HOSTNAME));
    })
});
