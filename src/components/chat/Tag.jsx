import React, {Component} from 'react';
import autoBind from 'react-autobind';

export default class Tag extends Component {
    constructor(props) {
        super(props);
        autoBind(this);
    }

    onClick() {

    }

    render() {
        return (
            <div className="tag" uri={this.props.uri}
                onClick={this.openTag}>
                {this.props.text}
            </div>
        )
    }

}
