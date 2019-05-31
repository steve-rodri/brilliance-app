import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

document.body.removeAttribute("class")
document.querySelector('html').addEventListener("touchstart", function() {

        var clientHeight = this.clientHeight;
        var scrollHeight = this.scrollHeight;
        var scrollTop = this.scrollTop;
        var scroll = scrollHeight - scrollTop;
        var scrollTo;

        if( scroll === clientHeight ) scrollTo = scrollTop - 1;
        if( scroll === scrollHeight ) scrollTo = scrollTop + 1;

        if(scrollTo) return this.scrollTop = scrollTo;

    });

ReactDOM.render(<App />, document.getElementById('root'));
