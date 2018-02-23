import React, { Component, Fragment } from 'react';
import { urlParser } from '../../utils';
import { graphql } from 'react-apollo';
import { endCouncil } from '../../queries';
import { BasicButton, AlertConfirm } from '../displayComponents';
import { primary } from '../../styles/colors';
import { FontIcon } from 'material-ui';
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
                data: urlParser({
                    data: {
                        id: council.id
                    }
                })
            }
        });
        if(response){
            if(response.data.endCouncil.code === 200){
                bHistory.push(`/company/${council.company_id}/council/${council.id}/writing-act`);
                //this.props.refetch();
            }
        }
    }

    getUnclosedPoints = () => {
        const { agendas } = this.props.council;
        const unclosed = agendas.filter((agenda) => agenda.voting_state !==2 || agenda.point_state !==2);
        return unclosed;
    }

    render(){
        const { translate } = this.props;
        const unclosed = this.getUnclosedPoints();

        return(
            <Fragment>
                <div className="col-lg-6 col-md-12 col-xs-12">
                    <BasicButton
                        text={translate.finish_council}
                        color={primary}
                        onClick={() => this.setState({ confirmModal: true})}
                        textPosition="before"
                        icon={<FontIcon className="material-icons" style={{fontSize: '1.1em' }} color={'white'}>play_arrow</FontIcon>}                                    
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
                                            return <li key={`unclosed${agenda.id}`}>{agenda.agenda_subject}</li>
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