import React, { Component, Fragment } from 'react';
import { startCouncil } from '../../../queries';
import { graphql } from 'react-apollo';
import { BasicButton, AlertConfirm, Icon } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import ParticipantSelector from './ParticipantSelector';


class StartCouncilButton extends Component {

    constructor(props){
        super(props);
        this.state = {
            alert: false,
            selecting: 0,
            data: {
                president: '',
                presidentId: ''
            }
        }
    }

    startCouncil = async () => {
        const { council } = this.props;
        const response = await this.props.startCouncil({
            variables: {
                council: {
                    ...this.state.data,
                    id: council.id,
                    companyId: council.companyId,
                    neededQuorum: council.neededQuorum || 2,
                    currentQuorum: council.currentQuorum || 0,
                    satisfyQuorum: council.satisfyQuorum || 0,
                    firstOrSecondConvene: council.firstOrSecondConvene
                }
            }
        });
        if(response){
            this.props.refetch();
        }
    };

    actionSwitch = () => {
        switch(this.state.selecting){
            case 1:
                return (id, name) => {
                    this.setState({
                        data: {
                            ...this.state.data,
                            president: name,
                            presidentId: id,
                        },
                        selecting: 0
                    })
                };

            case 2: 
                return (id, name) => {
                    this.setState({
                        data: {
                            ...this.state.data,
                            secretary: name,
                            secretaryId: id,
                        },
                        selecting: 0
                    })
                };
            
            case 3:
                return (id, name) => {
                    this.setState({
                        data: {
                            ...this.state.data,
                            qualityVoteName: name,
                            qualityVoteId: id,
                        },
                        selecting: 0
                    })
                };

            default: 
                return;
        }
    };

    _startCouncilForm = () => {
        const { translate } = this.props;

        if(this.state.selecting !== 0){
            return(
                <ParticipantSelector
                    participants={this.props.participants}
                    translate={translate}
                    action={this.actionSwitch()}
                />
            )
        }
        
        return(
            <Fragment>
                {translate.president}<button onClick={() => this.setState({selecting: 1})}>{translate.select_president}</button>{this.state.data.president}<br/>
                {translate.secretary}<button onClick={() => this.setState({selecting: 2})}>{translate.select_secretary}</button>{this.state.data.secretary}<br/>
                {translate.quality_vote}<button onClick={() => this.setState({selecting: 3})}>{translate.select_quality_vote}</button>{this.state.data.quality_vote_name}<br/>
            </Fragment>
        );
    };


    render(){
        const { translate } = this.props;
        const primary = getPrimary();

        return(
            <Fragment>
                <BasicButton
                    text={translate.start_council}
                    color={primary}
                    textPosition="before"
                    onClick={() => this.setState({
                        alert: true
                    })}
                    icon={<Icon className="material-icons" style={{fontSize: '1.1em', color: 'white' }}>play_arrow</Icon>}                                    
                    buttonStyle={{width: '11em'}}                                    
                    textStyle={{color: 'white', fontSize: '0.7em', fontWeight: '700', textTransform: 'none'}}
                />
                <AlertConfirm 
                    title={translate.start_council}
                    bodyText={
                        this._startCouncilForm()
                    }
                    open={this.state.alert}
                    buttonAccept={translate.accept}
                    buttonCancel={translate.cancel}
                    hideAccept={this.state.selecting !== 0}
                    modal={true}
                    acceptAction={this.startCouncil}
                    requestClose={this.state.selecting === 0? () => this.setState({ alert: false}): () => this.setState({selecting: 0})}
                />
            </Fragment>
        )
    }
}

export default graphql(startCouncil, {name: 'startCouncil'})(StartCouncilButton);