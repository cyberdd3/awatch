import React, { Component, PropTypes } from 'react'

export default class Search extends Component {
    search(query) {/*
        //In order to save api usage, we don't search for the more lengthy query, if the shorter one don't yield anything.
        if (this.state.lastQuery && this.state.suggestions.length == 0 && query.length > this.state.lastQuery.length) {
            return;
        }*/
        this.props.performSearch(query);
    }

    clear() {
       // this.setState({suggestions: []})
    }

    click(suggestion) {
        //this.props.onSuggestionClick(suggestion.id);
    }

    render() {
        return (
            <div className="searchLayout">
                <SearchField search={this.search.bind(this)} clear={this.clear}/>
                <SuggestionsContainer suggestions={this.props.searchResults} onSuggestionClick={this.click}/>
            </div>
        );
    }
}

Search.propTypes = {
    searchResults: PropTypes.array.isRequired
};

const MIN_QUERY_LENGTH = 3;
const MAX_QUERY_LENGTH = 20;

var SearchField = React.createClass({
    handleSearch: function (e) {
        var query = e.target.value.trim();
        if (query.length < MIN_QUERY_LENGTH) {
            this.props.clear();
            return;
        }
        if (query.length > MAX_QUERY_LENGTH) {
            return;
        }
        this.props.search(query);
    },
    render: function () {
        return (
            <div className="searchField">
                <input type="text" id="searchField" onChange={this.handleSearch} placeholder="What have you watched?"/>
            </div>
        )
    }

});

var SuggestionsContainer = React.createClass({
    handleClick: function (data) {
        this.props.onSuggestionClick(data);
    },
    render: function () {
        var suggestionNodes = this.props.suggestions.map(function (suggestion, suggestionIndex) {
            return (
                <SuggestionRow poster_url={suggestion.poster_path} title={suggestion.original_title}
                               year={suggestion.release_date} id={suggestion.id}
                               onClick={this.handleClick.bind(this, suggestion)} key={suggestionIndex}/>
            )
        }, this);
        return (
            <div className="suggestionsContainer">
                {suggestionNodes}
            </div>
        );
    }
});

var SuggestionRow = React.createClass({
    render: function () {
        return (
            <div className="suggestionRow row" onClick={this.props.onClick}>
                <div className="col-md-2 suggestion-poster">
                    <div className="suggestion-thumbnail"><img src={this.props.poster_url}/></div>
                </div>
                <div className="col-md-8 suggestion-title">{this.props.title}</div>
                <div className="col-md-2 suggestion-year">{this.props.year}</div>
            </div>
        )
    }
});
