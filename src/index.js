import React from 'react';
import ReactDOM from 'react-dom';
import ChatBot from './components/ChatBot.jsx';

//console.log(google);
ReactDOM.render(
    <ChatBot maps={window.google} />,
    document.getElementById('chat-bot')
);
