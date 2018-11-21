import React from 'react';
import { CardPageLayout, Scrollbar, BasicButton } from '../../displayComponents';
import PartnerForm from './PartnerForm';
import withSharedProps from '../../HOCs/withSharedProps';
import { getPrimary } from '../../styles/colors';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { bHistory } from '../../containers/App';
import { checkValidEmail } from "../../utils";

class NewPartnerPage extends React.Component {

    state = {
        data: {
            name: '',
            surname: '',
            dni: '',
            nationality: '',
            home: '',
            language: 'es',
            email: '',
            state: 1,
            phone: '',
            landlinePhone: '',
            type: 0,
            address: '',
            city: '',
            observations: '',
            country: 'España',
            countryState: '',
            zipcode: '',
            position: '',
            openDate: null,
            personOrEntity: 0,
            subscribeDate: null,
            unsubscribeDate: null,
            subscribeActDate: null,
            unsubscribeActDate: null,
            subscribeActNumber: '',
            unsubscribeActNumber: ''
        },
        representative: {
            name: '',
            surname: '',
            dni: '',
            nationality: '',
            home: '',
            language: 'es',
            email: '',
            phone: '',
            landlinePhone: '',
            type: 0,
            address: '',
            city: '',
            observations: '',
            country: 'España',
            countryState: '',
            zipcode: '',
            position: '',
        },
        errors: {}
    }

    goBack = () => {
        bHistory.goBack();
    }

    baseState = this.state;

    createPartner = async () => {
        if (!await this.checkRequiredFields()) {
            const response = await this.props.createPartner({
                variables: {
                    participant: {
                        ...this.state.data,
                        companyId: this.props.company.id
                    },
                    ...(this.state.data.personOrEntity === 1? {
                        representative: {
                            ...this.state.representative,
                            companyId: this.props.company.id
                        }
                    } : {})
                }
            });

            if (response.data) {
                if (response.data.createSimpleBookParticipant) {
                    this.goBack();
                }
            }
        }
    }

    checkRequiredFields = async () => {
        let errors = {
            name: '',
            surname: '',
            dni: '',
            home: '',
            language: 'es',
            email: '',
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

        if (!data.name) {
            hasError = true;
            errors.name = translate.required_field;
        }

        if (data.personOrEntity === 0 && !data.surname) {
            hasError = true;
            errors.surname = translate.required_field;
        }

/*         if (!data.dni) {
            hasError = true;
            errors.dni = translate.required_field;
        }

        if (!data.email) {
            hasError = true;
            errors.email = translate.required_field;
        } */

        if (!data.email) {
            hasError = true;
            errors.email = translate.required_field;
        } else {
            if (!checkValidEmail(data.email)) {
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

    updateRepresentative = object => {
        this.setState({
            representative: {
                ...this.state.representative,
                ...object
            }
        })
    }

    render() {
        return (
            <CardPageLayout title={this.props.translate.add_partner} disableScroll>
                <div
                    style={{
                        height: 'calc(100% - 3em)',
                        overflow: 'hidden',
                    }}
                >
                    <Scrollbar>
                        <div style={{ padding: '0.6em 5%' }}>
                            <PartnerForm
                                translate={this.props.translate}
                                representative={this.state.representative}
                                updateRepresentative={this.updateRepresentative}
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
                                textStyle={{ color: 'black', fontWeight: '700', textTransform: 'none' }}
                                onClick={this.goBack}
                                buttonStyle={{ marginRight: '0.8em' }}
                            />
                        }
                        <BasicButton
                            text={this.props.translate.save_changes}
                            color={getPrimary()}
                            textStyle={{ color: 'white', fontWeight: '700', textTransform: 'none' }}
                            onClick={this.createPartner}
                        />
                    </div>
                </div>
            </CardPageLayout>
        )
    }
}

const createPartner = gql`
    mutation CreatePartner($participant: BookParticipantInput!, $representative: BookParticipantInput) {
        createSimpleBookParticipant(participant: $participant, representative: $representative){
            id
        }
    }
`;

export default graphql(createPartner, {
    name: 'createPartner'
})(withSharedProps()(NewPartnerPage));