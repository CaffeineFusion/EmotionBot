import React, {Component} from 'react';
import autoBind from 'react-autobind';


export default class Thumb extends Component {
    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    getClass() {
        if(this.props.sentiment < -0.8) return 'thumb180';
        else if(this.props.sentiment < -0.6) return 'thumb180';
        else if(this.props.sentiment < -0.4) return 'thumb225';
        else if(this.props.sentiment < -0.2) return 'thumb225';
        else if(this.props.sentiment < -0) return 'thumb270';
        else if(this.props.sentiment < 0.2) return 'thumb270';
        else if(this.props.sentiment < 0.4) return 'thumb315';
        else if(this.props.sentiment < 0.6) return 'thumb315';
        else if(this.props.sentiment < 0.8) return 'thumb';
        else if(this.props.sentiment <= 1) return 'thumb';
        else return 'thumb270';
    }


    render() {
        return (
            <span id='injectable-thumb'>
                {/*<img src="../../img/thumb.svg" id='ds-thumb-icon' className={this.getClass() + " ds-thumb-icon"} height="80"></img>*/}
            </span>
        );
    }
}
