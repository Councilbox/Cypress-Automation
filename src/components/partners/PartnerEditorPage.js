import React from 'react';
import { CardPageLayout, LoadingSection, Scrollbar, BasicButton } from '../../displayComponents';
import withTranslations from '../../HOCs/withTranslations';
import { bHistory } from '../../containers/App';
import { getPrimary } from '../../styles/colors';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import PartnerForm from './PartnerForm';

class PartnerEditorPage extends React.PureComponent {

    state = {
        data: {},
        errors: {}
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(!nextProps.data.loading){
            const { __typename, ...bookParticipant } = nextProps.data.bookParticipant;
            return {
                data: {
                    ...bookParticipant
                }
            }
        }

        return null;
    }

    goBack = () => {
        bHistory.goBack();
    }

    updateBookParticipant = async () => {
        if(!await this.checkRequiredFields()){
            const response = await this.props.updateBookParticipant({
                variables: {
                    participant: this.state.data
                }
            });

            console.log(response);
        }
    }

    checkRequiredFields = async () => {
        return false;
    }

    updateState = object => {
        this.setState({
            data: {
                ...this.state.data,
                ...object
            }
        })
    }

    render(){

        if(this.props.data.loading){
            return <LoadingSection />;
        }

        return(
            <CardPageLayout title={this.props.translate.edit_partner} disableScroll>
                <div
                    style={{
                        height: 'calc(100% - 3em)',
                        overflow: 'hidden',
                        padding: '2%'
                    }}
                >
                    <Scrollbar>
                        <div style={{padding: '3px'}}>
                            <PartnerForm
                                translate={this.props.translate}
                                updateState={this.updateState}
                                participant={this.state.data}
                                errors={this.state.errors}
                            />
                        </div>
                    </Scrollbar>
                </div>
                <div
                    style={{
                        height: '3em',
                        display: 'flex',
                        flexDirection: 'row',
                        paddingRight: '1.2em',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        borderTop: '1px solid gainsboro'
                    }}
                >
                    <div>
                        {bHistory.length > 0 &&
                            <BasicButton
                                text={this.props.translate.back}
                                color={'white'}
                                textStyle={{ color: 'black', fontWeight: '700', textTransform: 'none'}}
                                onClick={this.goBack}
                                buttonStyle={{marginRight: '0.8em'}}
                            />
                        }
                        <BasicButton
                            text={this.props.translate.save_changes}
                            color={getPrimary()}
                            textStyle={{ color: 'white', fontWeight: '700', textTransform: 'none'}}
                            onClick={this.updateBookParticipant}
                        />
                    </div>
                </div>
            </CardPageLayout>
        )
    }
}

const getBookParticipant = gql`
    query GetBookParticipant($participantId: Int!){
        bookParticipant(participantId: $participantId){
            name
            surname
            dni
            nationality
            home
            language
            email
            id
            phone
            landlinePhone
            type
            address
            state
            city
            observations
            country
            countryState
            zipcode
            position
            openDate
            personOrEntity
            subscribeDate
            unsubscribeDate
            subscribeActDate
            unsubscribeActDate
        }
    }
`;

const updateBookParticipant = gql`
    mutation updateBookParticipant($participant: BookParticipantInput!){
        updateBookParticipant(participant: $participant){
            success
            message
        }
    }
`;

export default compose(
    graphql(getBookParticipant, {
        options: props => ({
            variables: {
                participantId: props.match.params.id
            }
        })
    }),
    graphql(updateBookParticipant, {
        name: 'updateBookParticipant'
    })
)(withTranslations()(withRouter(PartnerEditorPage)));