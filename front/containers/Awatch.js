import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Discover from '../components/Discover'
import Search from '../components/Search'

import {performSearch, clearSearchResults, chooseMovie} from '../actions/searchActions'
import {loadSimilar, offerMovie} from '../actions/discoverActions'

class Awatch extends Component {
    render() {
        const {searchResults, chosenMovie, isSearching, discoverResults, isLoading, dispatch} = this.props;
        let searchActionCreators = bindActionCreators({performSearch, clearSearchResults, chooseMovie}, dispatch);
        let discoverActionCreators = bindActionCreators({loadSimilar, offerMovie}, dispatch);

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