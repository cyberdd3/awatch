import React, { Component, PropTypes } from 'react'
import PureComponent from 'react-pure-render/component'

export default class Spinner extends PureComponent {
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