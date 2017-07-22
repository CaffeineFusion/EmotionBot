import React, {Component} from 'react';
import autoBind from 'react-autobind';
import ToneMeter from './ToneMeter.jsx';

export default class Tone extends Component {
    constructor(props) {
        super(props);
        autoBind(this);
    }


    render() {
        //Sentiment: {this.getSentiment()}
        return (
            <div className='ds-tile ds-tile-2'>
                <div className='ds-person-top-bar'>
                    <div className='ds-person-title'>
                        Emotion
                    </div>
                </div>

                <ToneMeter tone='anger' disabled="true" colour="red" emotion="anger" image='../../img/smiley.png' score={this.props.tones['anger']}/>
                <ToneMeter tone='joy' colour="yellow" emotion="joy" image='../../img/smiley.png' score={this.props.tones['joy']} />
                <ToneMeter tone='fear' colour="green" emotion="fear" image='../../img/smiley.png' score={this.props.tones['fear']} />
                <ToneMeter tone='disgust' colour="purple" emotion="disgust" image='../../img/smiley.png' score={this.props.tones['disgust']} />
                <ToneMeter tone='sadness' colour="blue" emotion="sadness" image='../../img/smiley.png' score={this.props.tones['sadness']} />
            </div>
        );
    }
}
