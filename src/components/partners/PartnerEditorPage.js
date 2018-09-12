import React from 'react';
import { CardPageLayout, LoadingSection, Scrollbar, BasicButton } from '../../displayComponents';
import withTranslations from '../../HOCs/withTranslations';
import { bHistory } from '../../containers/App';
import { getPrimary } from '../../styles/colors';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import PartnerForm from './PartnerForm';
import { checkValidEmail } from "../../utils";

class PartnerEditorPage extends React.PureComponent {

    state = {
        data: {},
        loading: false,
        errors: {},
        success: false
    }

    componentDidMount(){
        this.props.data.refetch();
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
            this.setState({
                loading: true
            });
            const response = await this.props.updateBookParticipant({
                variables: {
                    participant: this.state.data
                }
            });

            if(response.data){
                if(response.data.updateBookParticipant.success){
                    this.setState({
                        success: true,
                        loading: false
                    })
                }
            }
        }
    }

    resetButtonStates = () => {
        this.setState({
            success: false,
            loading: false
        })
    }

    checkRequiredFields = async () => {
        let errors = {
            name: '',
            surname: '',
            dni: '',
            home: '',
            language: 'es',
            email: '',
            phone: '',
            landlinePhone: '',
            address: '',
            state: '',
            city: '',
            observations: '',
            country: 'España',
            countryState: '',
            zipcode: ''
        };

        let hasError = false

        const { data } = this.state;
        const { translate } = this.props;

        if(!data.name){
            hasError = true;
            errors.name = translate.required_field;
        }

        if(!data.surname){
            hasError = true;
            errors.surname = translate.required_field;
        }

        if(!data.dni){
            hasError = true;
            errors.dni = translate.required_field;
        }

        if(!data.phone){
            hasError = true;
            errors.phone = translate.required_field;
        }

        if(!data.email){
            hasError = true;
            errors.email = translate.required_field;
        }

        if(!data.email){
            hasError = true;
            errors.email = translate.required_field;
        } else {
            if(!checkValidEmail(data.email)){
                hasError = true;
                errors.email = translate.valid_email_required;
            }
        }

        this.setState({
            errors
        });

        return hasError;
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
                    }}
                >
                    <Scrollbar>
                        <div style={{padding: '0.6em 5%'}}>
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
                        paddingTop: '0.5em',
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
                                type="flat"
                                textStyle={{ color: 'black', fontWeight: '700', textTransform: 'none'}}
                                onClick={this.goBack}
                                buttonStyle={{marginRight: '0.8em'}}
                            />
                        }
                        <BasicButton
                            text={this.props.translate.save_changes}
                            color={getPrimary()}
                            success={this.state.success}
                            loading={this.state.loading}
                            reset={this.resetButtonStates}
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
            subscribeActNumber
            unsubscribeActNumber
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
            },
            notifyOnNetworkStatusChange: true
        })
    }),
    graphql(updateBookParticipant, {
        name: 'updateBookParticipant'
    })
)(withTranslations()(withRouter(PartnerEditorPage)));