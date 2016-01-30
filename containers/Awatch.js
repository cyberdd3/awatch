import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {performSearch} from '../actions'
//import Discover from '../components/Discover'
import Search from '../components/Search'

import * as ActionCreators from '../actions'

class Awatch extends Component {
    render() {
        const {searchResults, chosenMovieId, dispatch} = this.props;
        let boundActionCreators = bindActionCreators(ActionCreators, dispatch);
        return (
            <div id="layout">
                <Search searchResults={searchResults} {...boundActionCreators} />
            </div>
        );
    }
}
/*
Awatch.propTypes = {
    chosenMovieId: PropTypes.number,
    dispatch: PropTypes.func.isRequired
};*/

function mapStateToProps(state) {
    return {
        chosenMovieId: state.chosenMovieId,
        searchResults: state.searchMovies.results
    }
}

export default connect(mapStateToProps)(Awatch)