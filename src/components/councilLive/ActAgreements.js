import React, { Component } from 'react';
import { CollapsibleSection, RichTextInput, Icon } from '../displayComponents';
import { darkGrey } from '../../styles/colors';

class ActAgreements extends Component {

    _button = () => {
        const { translate } = this.props;

        return(
            <div style={{height: '3em', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{width: '25%', height: '3em', display: 'flex', alignItems: 'center', paddingLeft: '1.5em'}}>
                    <Icon className="material-icons" style={{color: 'grey'}}>edit</Icon>
                    <span style={{marginLeft: '0.7em', color: darkGrey, fontWeight: '700'}}>{`${translate.comments_and_agreements}` }</span>
                </div>
                <div style={{width: '25%', display: 'flex', justifyContent: 'flex-end', paddingRight: '2em'}}>
                    <Icon className="material-icons" style={{color: 'grey'}}>keyboard_arrow_down</Icon>
                </div>
            </div>
        )
    }

    _section = () => {
        const { agenda } = this.props;

        return(
            <RichTextInput
                value={agenda.comment || ''}
            />
        );
    }

    render(){
        
        return(
            <div
                style={{
                    width: '100%',
                    backgroundColor: 'lightgrey',
                    position: 'relative'
                }}
            >
                <CollapsibleSection trigger={this._button} collapse={this._section} />
            </div>
        );
    }
}

export default ActAgreements;