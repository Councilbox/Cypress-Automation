import React from 'react';
import { BasicButton, AlertConfirm, ButtonIcon } from '../../../../displayComponents';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { getSecondary, getPrimary } from '../../../../styles/colors';
import CompanyTagForm from './CompanyTagForm';
import { sendGAevent } from '../../../../utils/analytics';

const addTag = gql`
    mutation CreateCompanyTag($tag: CompanyTagInput!){
        createCompanyTag(tag: $tag){
            id
            key
            value
        }
    }
`;

export const checkUsedKey = gql`
    query CompanyTagKeyUsed($companyId: Int!, $key: String!){
        companyTagKeyUsed(companyId: $companyId, key: $key){
            id
        }
    }
`;


const AddCompanyTag = ({ company, translate, refetch, client, ...props }) => {
    const [modal, setModal] = React.useState(false);
    const [errors, setErrors] = React.useState({
        key: '',
        value: ''
    });
    const secondary = getSecondary();
    const primary = getPrimary();
    const [tag, setTag] = React.useState({
        key: '',
        value: ''
    });



    const createCompanyTag = async () => {
        if(!await checkRequiredFields()){
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
                sendGAevent({
                    category: 'Etiquetas',
                    action: `Crear etiqueta`,
                    label: company.businessName
                });
                refetch();
                setModal(false);
                setTag({
                    key: '',
                    value: ''
                })
            }
        }

    }

    const checkRequiredFields = async() => {
        let errors = {}

        if(!tag.key){
            errors.key = translate.required_field;
        } else {
            const response = await client.query({
                query: checkUsedKey,
                variables: {
                    companyId: company.id,
                    key: tag.key
                }
            });

            if(response.data.companyTagKeyUsed){
                errors.key = 'Clave ya usada en otra etiqueta' //TRADUCCION
            }
        }

        if(!tag.value){
            errors.value = translate.required_field;
        }

        setErrors(errors);

        return Object.keys(errors).length > 0;
    }

    const updateTag = object => {
        setTag({
            ...tag,
            ...object
        });
    }

    const openModal = React.useCallback(() => {
        setModal(true);
    });

    const closeModal = React.useCallback(() => {
        setModal(false);
    })

    const renderModalBody = () => {
        return (
            <CompanyTagForm
                translate={translate}
                tag={tag}
                errors={errors}
                setTag={updateTag}
            />
        )
    }

    return (
        <React.Fragment>
            <BasicButton
                onClick={openModal}
                color={primary}
                icon={<ButtonIcon type="add" color="white" />}
                text="Añadir"
                textStyle={{
                    color: 'white',
                    fontWeight: '700'
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