import React, { Component, Fragment } from 'react';
import { urlParser } from '../../utils';
import { graphql } from 'react-apollo';
import { endCouncil } from '../../queries';
import { BasicButton, AlertConfirm, Icon } from '../displayComponents';
import { getPrimary } from '../../styles/colors';
import { bHistory } from '../../containers/App';

class EndCouncilButton extends Component {

    constructor(props){
        super(props);
        this.state = {
            confirmModal: false
        }
    }

    endCouncil = async () => { 
        const { council } = this.props;
        const response = await this.props.endCouncil({
            variables: {
                councilId: council.id
            }
        });
        if(response){
            if(response.data.endCouncil.id){
                bHistory.push(`/company/${council.companyId}/council/${council.id}/writing-act`);
                //this.props.refetch();
            }
        }
    }

    getUnclosedPoints = () => {
        const { agendas } = this.props.council;
        const unclosed = agendas.filter((agenda) => agenda.votingState !==2 || agenda.pointState !==2);
        return unclosed;
    }

    render(){
        const { translate } = this.props;
        const unclosed = this.getUnclosedPoints();
        const primary = getPrimary();

        return(
            <Fragment>
                <div className="col-lg-6 col-md-12 col-xs-12">
                    <BasicButton
                        text={translate.finish_council}
                        color={primary}
                        onClick={() => this.setState({ confirmModal: true})}
                        textPosition="before"
                        icon={<Icon className="material-icons" style={{fontSize: '1.1em', color: 'white' }}>play_arrow</Icon>}                                    
                        buttonStyle={{width: '11em'}}                                    
                        textStyle={{color: 'white', fontSize: '0.65em', fontWeight: '700', textTransform: 'none'}}
                    />
                </div>
                <AlertConfirm 
                    title={translate.finish_council}
                    bodyText={
                        <Fragment>
                            {unclosed.length > 0?
                                <Fragment>
                                    <div>{translate.unclosed_points_desc}</div>
                                    <ul>
                                        {unclosed.map((agenda) => {
                                            return <li key={`unclosed${agenda.id}`}>{agenda.agendaSubject}</li>
                                        })}
                                    </ul>
                                </Fragment>
                            :
                                <div>{translate.council_will_be_end}</div>
                            }
                        </Fragment>
                    }
                    open={this.state.confirmModal}
                    buttonAccept={translate.accept}
                    buttonCancel={translate.cancel}
                    modal={true}
                    acceptAction={this.endCouncil}
                    requestClose={() => this.setState({ confirmModal: false})}
                />
            </Fragment>

        );
    }

}

export default graphql(endCouncil, {
    name: 'endCouncil'
}) (EndCouncilButton);