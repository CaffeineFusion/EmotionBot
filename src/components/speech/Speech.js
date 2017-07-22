'strict mode';

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

function initialise(speech) {
    speech.continuous = true;
    speech.interimResults = true;
    speech.lang = 'en-US';
    return speech;
}

module.exports = class Speech {
    constructor() {
        this.speech = initialise(new SpeechRecognition());
        //this.bindListener('onspeechend', () => {console.log('End of speech');});
        this.bindListener('onnomatch', () => {console.log('No speech matched');});
        //this.bindListener('onerror', (err) => console.log('end of speech', err));
    }

    record() {
        this.speech.start();
        console.log('Receiving Mic Input');
    }

    stop() {
        this.speech.stop();
        console.log('Mic Input Stopped');
    }

    bindListener(listener, cb) {
        //console.log(listener, 'bound!');
        this.speech[listener] = cb;
    }
}
