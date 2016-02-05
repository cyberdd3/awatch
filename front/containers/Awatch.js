import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {performSearch} from '../actions/searchActions'
import Discover from '../components/Discover'
import Search from '../components/Search'

import * as SearchActionCreators from '../actions/searchActions'
import * as DiscoverActionCreators from '../actions/discoverActions'

class Awatch extends Component {
    render() {
        const {searchResults, chosenMovie, isSearching, discoverResults, isLoading, dispatch} = this.props;
        let searchActionCreators = bindActionCreators(SearchActionCreators, dispatch);
        let discoverActionCreators = bindActionCreators(DiscoverActionCreators, dispatch);
        let mockChosenMovie = {
            id: 776
        };
        return (
            <div id="layout">
                {chosenMovie ?
                    <Discover chosenMovie={chosenMovie} discoverResults={discoverResults} isLoading={isLoading} {...discoverActionCreators} /> :
                    <Search searchResults={searchResults} isSearching={isSearching} {...searchActionCreators} />}
                {/*<Discover chosenMovie={mockChosenMovie} discoverResults={discoverResults} isLoading={isLoading} {...discoverActionCreators} />*/}
            </div>
        );
    }
}

Awatch.propTypes = {
    chosenMovie: PropTypes.object,
    searchResults: PropTypes.array,
    isSearching: PropTypes.bool,
    dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        chosenMovie: state.searchMovies.chosenMovie,

        searchResults: state.searchMovies.results,
        isSearching: state.searchMovies.isSearching,

        discoverResults: state.discoverMovies.results,
        isLoading: state.discoverMovies.isLoading

    }
}

export default connect(mapStateToProps)(Awatch)