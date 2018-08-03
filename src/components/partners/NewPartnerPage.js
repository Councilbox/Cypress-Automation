import React from 'react';
import { CardPageLayout, Scrollbar, BasicButton } from '../../displayComponents';
import PartnerForm from './PartnerForm';
import withSharedProps from '../../HOCs/withSharedProps';
import { getPrimary, getSecondary } from '../../styles/colors';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { bHistory } from '../../containers/App';

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
            phone: '',
            landlinePhone: '',
            type: 0,
            address: '',
            state: '',
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
            unsubscribeActDate: null
        },
        errors: {}
    }

    goBack = () => {
        bHistory.goBack();
    }

    baseState = this.state;

    createPartner = async () => {
        if(!await this.checkRequiredFields()){
            const response = await this.props.createPartner({
                variables: {
                    participant: {
                        ...this.state.data,
                        companyId: this.props.company.id
                    }
                }
            });

            console.log(response)
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
        console.log(bHistory);

        return(
            <CardPageLayout title={this.props.translate.add_partner} disableScroll>
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
                            onClick={this.createPartner}
                        />
                    </div>
                </div>
            </CardPageLayout>
        )
    }
}

const createPartner = gql`
    mutation CreatePartner($participant: BookParticipantInput!) {
        createSimpleBookParticipant(participant: $participant){
            id
        }
    }
`;

export default graphql(createPartner, {
    name: 'createPartner'
})(withSharedProps()(NewPartnerPage));