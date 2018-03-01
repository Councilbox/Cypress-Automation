import React, { Component, Fragment } from 'react';
import { darkGrey, mediumGrey, getSecondary, lightGrey, getPrimary } from '../../styles/colors';
import { CollapsibleSection, LoadingSection } from '../displayComponents';
import { FontIcon } from 'material-ui';
import { graphql, compose } from 'react-apollo';
import { liveParticipants, changeRequestWord } from '../../queries';
 
class ParticipantsLive extends Component {

    changeWordState = async (id, value) => {
        this.props.data.loading = true;
        const object = {
            wordState: {
                council_id: this.props.councilID,
                request_word: value,
                id: id
            } 
        }
        console.log(object);
        const response = await this.props.changeRequestWord({
            variables: {
                wordState: {
                    council_id: this.props.councilID,
                    request_word: value,
                    id: id
                }
            }
        })

        if(response){
            this.props.data.refetch();
        }
    }

    _participantEntry = (participant) => {
        return(
            <div key={`participant${participant.id}`} style={{display: 'flex', flexDirection: 'row', height: '3em', padding: '0.5em', alignItems: 'center'}}>
                <FontIcon className="material-icons" style={{fontSize: '1.1em', marginRight: '0.3em' }} color={getSecondary()}>language</FontIcon>
                <div style={{color: 'white', fontSize: '0.85em', marginLeft: '0.5em', width: '45%'}} className="truncate">{`${participant.name} ${participant.surname}`}</div>
                <div style={{width: '20%', color: lightGrey, marginLeft: '1em', fontSize: '0.8em'}} className="truncate">{participant.position}</div>
                {participant.request_word === 2 &&
                    <div onClick={() => this.changeWordState(participant.id, 0)} style={{width: '1.6em', height: '1.6em', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.1em', backgroundColor: getPrimary()}}>
                        <FontIcon className="material-icons" style={{fontSize: '0.9em', marginRight: '0.3em' }} color={'white'}>pan_tool</FontIcon>
                    </div>

                }
                {participant.request_word === 1 &&
                    <div onClick={() => this.changeWordState(participant.id, 2)} style={{width: '1.6em', height: '1.6em', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.1em', backgroundColor: getSecondary()}}>
                        <FontIcon className="material-icons" style={{fontSize: '0.92em', marginRight: '0.3em' }} color={'white'}>pan_tool</FontIcon>
                    </div>

                }
            </div>
        )
    } 

    _button = () => {
        const { participants } = this.props;
        const liveParticipants = this.props.data.loading? [] : this.props.data.liveParticipants;

        return(
            <div style={{height: '3em', display: 'flex', backgroundColor: mediumGrey, alignItems: 'center'}} className="withShadow">
                <div style={{marginLeft: '1em', marginRight: '0.5em', height: '100%', display: 'flex', alignItems: 'center'}}>
                    <FontIcon className="material-icons" style={{fontSize: '1.1em', marginRight: '0.3em' }} color={lightGrey}>person</FontIcon>
                    <span style={{fontWeight: '700', color: 'white', fontSize: '0.8em'}}>{participants.length}</span>
                </div>
                <div style={{marginLeft: '1em', marginRight: '0.5em', height: '100%', display: 'flex', alignItems: 'center'}}>
                    <FontIcon className="material-icons" style={{fontSize: '1.1em', marginRight: '0.3em' }} color={getSecondary()}>language</FontIcon>
                    <span style={{fontWeight: '700', color: 'white', fontSize: '0.8em'}}>{liveParticipants.length}</span>
                </div>
            </div>
        )
    }

    _section = () => {
        const { translate } = this.props;
        const { liveParticipants } = this.props.data;

        if(this.props.data.loading){
            return(
                <LoadingSection />
            );
        }

        return(
            <div style={{backgroundColor: darkGrey, width: '100%', height: '30em', padding: '0.75em'}}>
                {liveParticipants.map((participant) => {
                    return this._participantEntry(participant)
                })}
            </div>
        );
    }

    render(){

        return(
            <CollapsibleSection trigger={this._button} collapse={this._section} open={true} />
        );
    }
}

export default compose(
    graphql(liveParticipants, {
        name: "data",
        options: (props) => ({
            variables: {
                councilID: props.councilID
            }, 
            pollInterval: 5000
        })
    }),

    graphql(changeRequestWord, {
        name: 'changeRequestWord'
    })
)(ParticipantsLive);