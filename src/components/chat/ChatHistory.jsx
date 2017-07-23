import React, {Component} from 'react';
import autoBind from 'react-autobind';

import Message from './Message.jsx';

export default class ChatHistory extends Component {
    constructor(props) {
        super(props);
        autoBind(this);
    }

    render() {
        var self = this;
        var chat = this.props.chatHistory.map(function (message, index) {
            return (
                <Message
                    key={index}
                    id={index}
                    user={message.user}
                    body={message.body}
                    tags={message.tags === undefined ? undefined : message.tags }
                    map={message.map === undefined ? undefined : message.map}
                />
            )
        });

        return (

            <div className="chat-content">
                { /*this.props.liveAgent !== undefined && this.props.liveAgent === 'Yes' ? (
                        <div className='greyout'>
                            <div className='transfer' onclick={this.props.onTransferClick}>
                                <div className='transferText'>{this.props.transferText}</div>
                            </div>
                        </div>
                    ) : ({chat})*/
                }
                {chat}
                {
                    this.props.loading === true ? (
                        <div className="loader ">
                          <div className="loader-dots ball-pulse is-active">
                            <div></div>
                            <div></div>
                            <div></div>
                          </div>
                        </div>
                    ) : (undefined)
                }

            </div>
        );
    }
}
