import React, {Component} from 'react';
import autoBind from 'react-autobind';

import ReactDOM from 'react-dom';
//import CONFIG from '../../config.json';//from ('../config/config.json');

import ChatHistory from './chat/ChatHistory.jsx';
import QuestionBox from './chat/QuestionBox.jsx';

//import Thumb from './widgets/Thumb.jsx';
//import Tone from './widgets/Tone.jsx';
//import Alchemy from './speech/Alchemy.js';
import Speech from './speech/Speech.js';
//import ToneAnalyser from './speech/ToneAnalyser.js';

const BOT_NAME = 'bot';
const USER_NAME = 'user';

export default class ChatBot extends Component {
    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            chatHistory: [], content: {}, demoPage: {}, liveAgent: 'No', transferText:'', loading:false,
            speech: new Speech(), sentiment:0, tones:{anger:{}, disgust:{}, fear:{}, joy:{}, sadness:{}}
        };
    }

    scroll() {
        var height = 0;
        $('.chat-content .messages-container').each(function(i, value){
          height += parseInt($(this).height());
        });

        height += '';
        $('.chat-content').animate({scrollTop: height});
    }

    receiveAnswer(answer) {
        let messages = [];
        let self = this;
        if(answer.response.length === 0)
            messages.push({ body:"Sorry, I didn't understand that. Could you rephrase that for me?", intents:answer.intents, user: BOT_NAME })
        answer.response.forEach((response) => messages.push({ body:response, intents:answer.intents, user: BOT_NAME }));


        messages.forEach((message, index) => {
            if(message.body !== '')
                setTimeout(function() { self.pushMessage(message);  self.scroll(); }, (index) * 1500)});

        this.setState({loading:false});

        this.scroll();
    }

    receiveQuestion(question) {
        this.pushMessage({
            body: question,
            direction: 'sent',
            user: USER_NAME
        });
        //this.updateSentiment(question);
        this.setState({loading:true});

        this.scroll();
    }

    pushMessage(message) {
        var updatedHistory = this.state.chatHistory;
        updatedHistory.push(message);
        this.setState({chatHistory: updatedHistory});
    }

    render() {
        return (
            <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
                <header className="mdl-layout__header mdl-layout__header--scroll mdl-color-primary">

                    <div className="mdl-layout--large-screen-only mdl-layout__header-row">
                        <div className="logo-center text-center">
                            <img src="img/trans-logo.png" height="30px" />
                        </div>
                    </div>
                    <div className="mdl-layout__tab-bar mdl-js-ripple-effect mdl-color--primary-dark">
                        <a href="#overview" className="mdl-layout__tab is-active">Chatbot</a>

                        <div className="mdl-layout-spacer"></div>
                        <nav className="mdl-navigation">
                        </nav>
                    </div>
                </header>
                <main className="mdl-layout__content">
                    <div className="mdl-layout__tab-panel is-active no-padding" id="overview">
                        <div className="mdl-grid no-padding">

                            <div className="mdl-cell mdl-cell--6-col chat-box-container">
                                <ChatHistory ref="chatHistory" chatHistory={this.state.chatHistory} liveAgent={this.state.liveAgent}
                                    onTransferClick={this.onTransferClick} transferText={this.state.transferText} loading={this.state.loading}
                                    maps={this.props.maps}/>
                                <QuestionBox ref="questionBox" api={this.state.api} onAnswer={this.receiveAnswer}
                                    onQuestion={this.receiveQuestion} speech={this.state.speech} defaultText='Ask Servian a question...'/>
                            </div>

                            <div className="mdl-cell mdl-cell--6-col "></div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}
