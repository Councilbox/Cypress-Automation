import React from 'react';
import { BasicButton, AlertConfirm, TextInput } from '../../../displayComponents';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { getSecondary } from '../../../styles/colors';

const addTag = gql`
    mutation CreateCompanyTag($tag: CompanyTagInput!){
        createCompanyTag(tag: $tag){
            id
            key
            value
        }
    }
`;


const AddCompanyTag = ({ company, translate, refetch, client, ...props }) => {
    const [modal, setModal] = React.useState(false);
    const secondary = getSecondary();
    const [tag, setTag] = React.useState({
        key: '',
        value: ''
    });

    const createCompanyTag = async () => {
        const response = await client.mutate({
            mutation: addTag,
            variables: {
                tag: {
                    value: tag.value,
                    key: tag.key,
                    companyId: company.id
                }
            }
        });

        if(response.data.createCompanyTag){
            refetch();
            setModal(false);
            setTag({
                key: '',
                value: ''
            })
        }

    }

    const openModal = React.useCallback(() => {
        setModal(true);
    });

    const closeModal = React.useCallback(() => {
        setModal(false);
    })

    const renderModalBody = () => {
        return (
            <React.Fragment>
                <TextInput
                    value={tag.key}
                    floatingText={'Clave'}
                    onChange={event => setTag({
                        ...tag,
                        key: event.target.value
                    })}
                />

                <TextInput
                    value={tag.value}
                    floatingText={'Valor'}
                    onChange={event => setTag({
                        ...tag,
                        value: event.target.value
                    })}
                />
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            <BasicButton
                onClick={openModal}
                color="white"
                text="Añadir"
                textStyle={{
                    color: secondary
                }}
                buttonStyle={{
                    border: `1px solid ${secondary}`
                }}
            />
            <AlertConfirm
                open={modal}
                title={'Añadir etiqueta'}
                requestClose={closeModal}
                acceptAction={createCompanyTag}
                bodyText={renderModalBody()}
                buttonAccept={translate.accept}
                buttonCancel={translate.cancel}
            />
        </React.Fragment>
    )
}

export default withApollo(AddCompanyTag);