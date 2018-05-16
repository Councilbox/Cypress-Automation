import React, { Component } from 'react';
import { darkGrey, mediumGrey, getSecondary, lightGrey, getPrimary } from '../../../styles/colors';
import { CollapsibleSection, LoadingSection, Icon } from '../../../displayComponents';
import { graphql, compose } from 'react-apollo';
import { videoParticipants, changeRequestWord } from '../../../queries';
import Scrollbar from 'react-perfect-scrollbar';
 
class ParticipantsLive extends Component {

    changeWordState = async (id, value) => {
        this.props.data.loading = true;
        const object = {
            wordState: {
                councilId: this.props.councilID,
                requestWord: value,
                id: id
            } 
        };
        console.log(object);
        const response = await this.props.changeRequestWord({
            variables: {
                wordState: {
                    councilId: this.props.councilID,
                    requestWord: value,
                    id: id
                }
            }
        });

        if(response){
            this.props.data.refetch();
        }
    };

    _participantEntry = (participant) => {
        return(
            <div key={`participant${participant.id}`} style={{display: 'flex', flexDirection: 'row', height: '3em', padding: '0.5em', alignItems: 'center'}}>
                <Icon className="material-icons" style={{fontSize: '1.1em', marginRight: '0.3em', color: getSecondary() }}>language</Icon>
                <div style={{color: 'white', fontSize: '0.85em', marginLeft: '0.5em', width: '45%'}} className="truncate">{`${participant.name} ${participant.surname}`}</div>
                <div style={{width: '20%', color: lightGrey, marginLeft: '1em', fontSize: '0.8em'}} className="truncate">{participant.position}</div>
                {participant.requestWord === 2 &&
                    <div onClick={() => this.changeWordState(participant.id, 0)} style={{width: '1.6em', height: '1.6em', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.1em', backgroundColor: getPrimary()}}>
                        <Icon className="material-icons" style={{fontSize: '0.9em', marginRight: '0.3em', color: 'white' }}>pan_tool</Icon>
                    </div>

                }
                {participant.requestWord === 1 &&
                    <div onClick={() => this.changeWordState(participant.id, 2)} style={{width: '1.6em', height: '1.6em', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.1em', backgroundColor: getSecondary()}}>
                        <Icon className="material-icons" style={{fontSize: '0.92em', marginRight: '0.3em', color: 'white' }} >pan_tool</Icon>
                    </div>

                }
            </div>
        )
    };

    _button = () => {
        const { participants } = this.props;
        const videoParticipants = this.props.data.loading? [] : this.props.data.videoParticipants.list;

        return(
            <div style={{height: '3em', display: 'flex', backgroundColor: mediumGrey, alignItems: 'center'}} className="withShadow">
                <div style={{marginLeft: '1em', marginRight: '0.5em', height: '100%', display: 'flex', alignItems: 'center'}}>
                    <Icon className="material-icons" style={{fontSize: '1.1em', marginRight: '0.3em', color: lightGrey }} >person</Icon>
                </div>
                <div style={{marginLeft: '1em', marginRight: '0.5em', height: '100%', display: 'flex', alignItems: 'center'}}>
                    <Icon className="material-icons" style={{fontSize: '1.1em', marginRight: '0.3em', color: getSecondary() }}>language</Icon>
                    <span style={{fontWeight: '700', color: 'white', fontSize: '0.8em'}}>{videoParticipants.length}</span>
                </div>
            </div>
        )
    };

    _section = () => {
        const { videoParticipants } = this.props.data;

        if(this.props.data.loading){
            return(
                <LoadingSection />
            );
        }

        return(
            <div style={{backgroundColor: darkGrey, width: '100%', height: 'calc(100vh - 45vh - 6em)', padding: '0.75em', position: 'relative', overflow: 'hidden'}}>
                <Scrollbar option={{suppressScrollX: true}}>
                    {videoParticipants.list.map((participant) => {
                        return this._participantEntry(participant)
                    })}
                </Scrollbar>
            </div>
        );
    };

    render(){

        return(
            <div>
                <CollapsibleSection trigger={this._button} collapse={this._section} open={true} /> 
            </div>
        );
    }
}

export default compose(
    graphql(videoParticipants, {
        name: "data",
        options: (props) => ({
            variables: {
                councilId: props.councilID
            },
        })
    }),

    graphql(changeRequestWord, {
        name: 'changeRequestWord'
    })
)(ParticipantsLive);