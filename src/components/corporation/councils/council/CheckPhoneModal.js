import React from 'react';
import { AlertConfirm, BasicButton, TextInput } from '../../../../displayComponents';
import { withApollo } from 'react-apollo';
import { getSecondary } from '../../../../styles/colors';
import gql from 'graphql-tag';


const CheckPhoneModal = ({ translate, client }) => {
    const [modal, setModal] = React.useState(false);
    const [phone, setPhone] = React.useState('');
    const [result, setResult] = React.useState(null);
    const secondary = getSecondary();

    const checkPhone = async () => {
        const response = await client.query({
            query: gql`
                query PhoneLookup($phone: String!){
                    phoneLookup(phone: $phone){
                        success
                        message
                    }
                }
            `,
            variables: {
                phone
            }
        });
        setResult(JSON.parse(response.data.phoneLookup.message));
    }

    return (
        <>
            <BasicButton
                text={'Comprobar número de teléfono'}
                onClick={() => setModal(true)}
                color={secondary}
                textStyle={{
                    color: 'white',
                    fontWeight: '700'
                }}
            />
            <AlertConfirm
                title={'Comprobar número de teléfono'}
                open={modal}
                acceptAction={checkPhone}
                buttonAccept={translate.send}
                buttonCancel={translate.close}
                requestClose={() => setModal(false)}
                bodyText={
                    <>
                        <TextInput
                            value={phone}
                            floatingText={translate.phone}
                            onChange={event => setPhone(event.target.value)}
                        />
                        {result && 
                            <div>
                                {Object.keys(result).map((key, index) => (
                                    <div key={`${key}_${index}`}>
                                        {key} - {result[key]}
                                    </div>
                                ))}
                            </div>
                        }
                    </>
                }
            />
        </>
    )
}

export default withApollo(CheckPhoneModal)