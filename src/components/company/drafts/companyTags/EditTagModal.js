import React from 'react';
import { AlertConfirm } from '../../../../displayComponents';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import CompanyTagForm from './CompanyTagForm';

const mutation = gql`
    mutation updateCompanyTag($tag: CompanyTagInput!){
        updateCompanyTag(tag: $tag){
            success
            message
        }
    }
`;

const EditTagModal = ({ tag: initialValue, open, translate, refetch, client, requestClose, ...props }) => {
    const [tag, setTag] = React.useState(initialValue? initialValue : { key: '', value: '' });
    const [errors, setErrors] = React.useState({});

    const updateTagData = object => {
        setTag({
            ...tag,
            ...object
        });
    }

    const updateTag = async () => {
        const { __typename, ...data } = tag;
        const response = await client.mutate({
            mutation,
            variables: {
                tag: data
            }
        });


        refetch();
        requestClose();
        console.log(response);
    }

    const renderBody = () => {
        return (
            <CompanyTagForm
                errors={errors}
                tag={tag}
                setTag={updateTagData}
                translate={translate}
            />
        )
    }

    return (
        <AlertConfirm
            title="Editar etiqueta" //TRADUCCION
            buttonAccept={translate.save}
            open={open}
            bodyText={renderBody()}
            acceptAction={updateTag}
            requestClose={requestClose}
            buttonCancel={translate.cancel}
        />
    )
}

export default withApollo(EditTagModal);