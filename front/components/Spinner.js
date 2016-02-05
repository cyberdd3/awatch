import React, { Component, PropTypes } from 'react'

export default class Spinner extends Component {
    render() {
        return (
            <div className={this.props.visible ? 'spinner' : 'spinner hidden'}>
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
            </div>
        )
    }
}