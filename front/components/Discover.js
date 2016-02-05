import React, { Component, PropTypes } from 'react'
import Spinner from './Spinner'

export default class Discover extends Component {
    componentDidMount() {
        this.props.loadSimilar(this.props.chosenMovie.id);
    }

    loadNextMovie() {
        if (this.props.discoverResults.length <= 4) {
            this.props.loadSimilar(this.props.discoverResults[0].id);
        }
        this.props.offerMovie();

    }

    render() {
        return (
            <div className="discoverLayout">
                <Spinner visible={this.props.isLoading}/>
                {this.props.discoverResults[0] ?
                    <Movie nextMovieClick={this.loadNextMovie.bind(this)} {...this.props.discoverResults[0]} /> : ''}
            </div>
        )
    }
}


var Movie = React.createClass({
    render: function () {
        let yearText = " (" + this.props.release_date.substring(0, 4) + ")";
        return (
            <div className="movie">

                <div className="poster">
                    <img src={this.props.poster_path}/>
                    <h2>{this.props.original_title}<span className="year">{yearText}</span></h2>
                </div>

                <div className="overview">
                    {this.props.overview}
                </div>
                <div className="button discover-next" onClick={this.props.nextMovieClick}>
                    Something else
                </div>
            </div>
        );
    }
});