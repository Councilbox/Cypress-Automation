import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { AlertConfirm, BasicButton, Grid, GridItem } from '../../displayComponents';
import { primary } from '../../styles/colors';
import { store } from '../../containers/App';
import { setUserData } from '../../actions/mainActions';
import { TRIAL_DAYS } from '../../config';

class PremiumModal extends React.Component {
    state = {
        step: 1,
        success: false
    }

    activateTrial = async () => {
        this.setState({
            loading: true,
        });
        const response = await this.props.activateTrial({
            variables: {
                userId: this.props.user.id
            }
        });
        if (!response.error) {
            this.setState({
                success: true,
                loading: false,
                step: 3
            });
            store.dispatch(setUserData(response.data.activateUserFreeTrial));
        }
    }

    showActivateTrialPage = () => {
        this.setState({
            step: 2
        });
    }

    render() {
        const { translate } = this.props;
        const modalWidth = window.innerWidth > 650 ? 650 : window.innerWidth;

        return (
            <AlertConfirm
                open={this.props.open}
                hideAccept
                buttonCancel={translate.close}
                requestClose={this.props.requestClose}
                title={translate.premium_service}
                bodyText={
                    <div style={{ width: `${modalWidth}px` }}>
                        {this.state.step === 1
                            && <React.Fragment>
                                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                    <div style={{ marginBottom: '0.6em' }}>
                                        {`${translate.you_need}`} <strong>{`${translate.subscribe_to_councilbox}`}</strong>
                                    </div>
                                    <BasicButton
                                        text={translate.free_trial}
                                        color={primary}
                                        textStyle={{ fontWeight: '700', color: 'white', fontSize: '18px', }}
                                        onClick={this.activateTrial}
                                    />
                                </div>
                            </React.Fragment>
                        }
                        {this.state.step === 2
                            && <React.Fragment>
                                {/* <div style={{display: 'flex', flexDirection: 'column'}}>
                                    {translate.trial_begin_first_company}
                                </div>
                                <Grid style={{width: '100%', display: 'flex'}}>
                                    <GridItem xs={5} lg={5} md={5} style={{fontWeight: '700', padding: '0.6em'}}>
                                        {translate.max_own_companies}
                                    </GridItem>
                                    <GridItem xs={7} lg={7} md={7} style={{padding: '0.6em'}}>
                                        1
                                    </GridItem>
                                    <GridItem xs={5} lg={5} md={5} style={{fontWeight: '700', padding: '0.6em'}}>
                                        {translate.cbx_functions}
                                    </GridItem>
                                    <GridItem xs={7} lg={7} md={7} style={{padding: '0.6em'}}>
                                        {translate.full_access}
                                    </GridItem>
                                    <GridItem xs={5} lg={5} md={5} style={{fontWeight: '700', padding: '0.6em'}}>
                                        {translate.duration}
                                    </GridItem>
                                    <GridItem xs={7} lg={7} md={7} style={{padding: '0.6em'}}>
                                        {`${TRIAL_DAYS} ${translate.input_group_days}`}
                                    </GridItem>
                                    <GridItem xs={12} lg={12} md={12} style={{padding: '0.6em'}}>
                                        {translate.when_the_trial_ends.replace('{{TRIAL_DAYS}}', TRIAL_DAYS)}
                                    </GridItem>
                                </Grid> */}
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                    <div>
                                        <BasicButton
                                            text={translate.start_trial}
                                            loading={this.state.loading}
                                            success={this.state.success}
                                            color={primary}
                                            textStyle={{ fontWeight: '700', color: 'white', fontSize: '18px', }}
                                            onClick={this.activateTrial}
                                        />
                                    </div>
                                </div>
                            </React.Fragment>
                        }
                        {this.state.step === 3
                            && <div>
                                {translate.trial_started_can_create_company}
                            </div>
                        }
                    </div>
                }
            />
        );
    }
}

const activateTrial = gql`
    mutation ActivateTrial($userId: Int!){
        activateUserFreeTrial(userId: $userId){
            name
			surname
			id
			type
			actived
			roles
			phone
			email
			preferredLanguage
        }
    }
`;

export default graphql(activateTrial, {
    name: 'activateTrial'
})(PremiumModal);
