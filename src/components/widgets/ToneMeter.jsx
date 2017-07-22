import React, {Component} from 'react';
import autoBind from 'react-autobind';

export default class ToneMeter extends Component {
    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentDidUpdate() {
        document.getElementById( this.props.emotion + '-bar' ).style.width = (100 * this.props.score) + '%';
    }

    render() {
        var disabled = (this.props.score < 0.5 ? ' ds-chart-grey' : '');

        //document.getElementById( barIds[i] ).style.width = newWidth + '%';
        return (
            <div className='ds-chart-group'>
                <img className='ds-chart-image' src={'img/' + this.props.emotion + '.png'} />
                <div className='ds-chart-actual'>
                    <div className='ds-chart-title'>{this.props.emotion.toUpperCase()}</div>
                    <div className={'ds-chart-bar ds-chart-' +
                        this.props.colour + disabled}
                        width={(100 * this.props.score)+'%'} id={this.props.emotion + '-bar'}>
                    </div>
                </div>
            </div>
        );
    }
}
