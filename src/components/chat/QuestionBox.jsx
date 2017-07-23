import React, {Component} from 'react';
import autoBind from 'react-autobind';
import CONFIG from '../../../config.json';//from ('../config/config.json');

const API = CONFIG.api.uri;

export default class QuestionBox extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
        this.state = {value: '', chatID:'', recording:false};
        this.props.speech.bindListener('onresult', this.onSpeechResult());
        this.props.speech.bindListener('onend', this.onSpeechExit());
        this.props.speech.bindListener('onerror', (err) => {
            console.log('Warning: error occured using HTML5 Speech Library', err);
            this.onSpeechExit();
        });
    }

    componentDidMount() {
        this.loadChatID();
        $('#recording').click(function () {
            $('.mdl-button-record').toggleClass('active');
        });

    }

    componentDidUpdate() {
        //var chatHistory = document.querySelector('.chat-history');
        //chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    toggleRecord() {
        if(this.state.recording === true) this.stop();
        else this.record();
    }

    record() {
       this.props.speech.record();
       this.setState({recording:true});
    }

    stop() {
        this.props.speech.stop();
        this.setState({recording:false});
    }

    onSpeechExit() {
        var self = this;
        console.log('speech ended!');
        return function(event) {
            self.setState({recording:false});
        }
    }

    //generates a callback function
    onSpeechResult() {
       var self = this;
       return function(event) {
           //console.log('callback: onSpeechResult, context:', self);
           var final_transcript = '';
           var interim_transcript = '';
           for (var i = event.resultIndex; i < event.results.length; ++i) {
             if (event.results[i].isFinal) {
                   final_transcript = event.results[i][0].transcript;
                   self.askServian(final_transcript);
             } else {
                 interim_transcript += event.results[i][0].transcript;
                 self.setState({value: interim_transcript});
                 console.log('interim_transcript', interim_transcript);
             }
           }
           console.log('final_transcript', final_transcript);
       };
    }

    loadChatID() {
        $.get(API + '/chat',
            function (data, status) {
                this.state.chatID = data.chatID;
                this.props.onAnswer(data);
            }.bind(this)
        );
    }

    askServian(text) {
        //event.preventDefault();
        // prevent submitting a blank message
        if (text === '') {
            return;
        }
        //console.log(text);

        this.props.onQuestion(text);//this.state.value.trim());//(this.refs.subQuestionBox.value);

        this.setState({value: ''});

        let self = this;

        $.post(API + '/chat',
            {text: text.trim(),//this.state.value.trim(),
            chatID: this.state.chatID})
            .done(self.props.onAnswer)
            //.fail((xhr, status, error) => {console.log(xhr); console.log(status); console.log(error);});
            .fail((xhr, status, error) => self.props.onAnswer({
                response:[JSON.stringify(xhr.responseJSON.err.error.error ? xhr.responseJSON.err.error.error : error)]
            }));

        //TODO: Error handling //'http://localhost:3003/chat/'
        /*$.post(API + this.props.api + '/chat', // + this.state.chatID,
            {text: this.state.value.trim(),
            chatID: this.state.chatID},
            function (data, status) {
                //this.props.onAnswer(data.body);
                console.log(status);
                console.log(data);
                this.props.onAnswer(data);
            }.bind(this)
        );*/
    }


    handleSubmit(event) {
        event.preventDefault();
        this.askServian(this.state.value.trim());
    }

    handleQuestionBoxChange(event) {
        this.setState({value: event.target.value});
    }

    get sampleQuestion() {
        return this.state.value !== '' ? '' : this.props.defaultText;
    }

    submitForm(e) {
        if (e.keyCode == 13)
        {
            this.handleSubmit(e);
            return false;
        }
    }

    render() {
        return (
            <div className="chat-input">
                <button className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button-record mdl-shadow--4dp " id="recording" onClick={this.toggleRecord}>
                 <i className="material-icons">mic</i>
                </button>
              <button type="submit" className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button-blue mdl-shadow--4dp " id="send" onClick={this.handleSubmit}>
               <i className="material-icons">send</i>
              </button>
              <div className="input-wrapper p-l-lg">
                <form action="#">
                  <div className="mdl-textfield mdl-js-textfield input-field ">
                    <textarea className="mdl-textfield__input" type="text" rows= "5" id="sample5"
                        onKeyDown={this.submitForm}
                        onChange={this.handleQuestionBoxChange} value={this.state.value} ></textarea>
                    <label className="mdl-textfield__label" htmlFor="sample5">{this.sampleQuestion}.</label>
                  </div>
                </form>
              </div>

            </div>
        );
    }
}
