import React, {Component} from 'react';
import autoBind from 'react-autobind';

import Tag from './Tag.jsx';

export default class Message extends Component {
    constructor(props) {
        super(props);
        autoBind(this);
    }

    render() {
        var tags;
        if(this.props.tags !== undefined) {
            tags = this.props.tags.map(function(tag, index) {
                return (
                    <Tag
                    key={index}
                    text={tag.text}
                    uri={tag.uri}
                    />
                )
            });

        }

        return (
            <div className="messages-container">
                <div className= { "message " + this.props.user + " " + this.props.id } >
                    { (this.props.user === 'bot') ?
                        (
                            <div className="bot-message-container mdl-grid">
                                <div className="bot-icon mdl-cell mdl-cell--2-col">
                                        <img className="bot-icon-float" src="img/robot.svg" height="60px"/>
                                </div>
                                <div className="bot-message mdl-cell mdl-cell--10-col">
                                    <span>
                                        { this.props.body }
                                        { this.props.tags !== undefined ? (
                                            <div className="message-tags">
                                                {tags}
                                            </div>
                                        ) : ( undefined ) }
                                    </span>
                                </div>
                            </div>
                        ) :
                        (
                            <div className="bot-message-container ">
                                <div className="bot-message">
                                    <span>
                                        { this.props.body}
                                        { this.props.tags !== undefined ? (
                                            <div className="message-tags">
                                                {tags}
                                            </div>
                                        ) : ( undefined ) }
                                    </span>
                                </div>
                            </div>
                        )

                    }

                </div>
            </div>

        );

    }
}
