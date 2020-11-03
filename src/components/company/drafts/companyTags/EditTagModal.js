import React from 'react';
import { AlertConfirm, UnsavedChangesModal } from '../../../../displayComponents';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import CompanyTagForm from './CompanyTagForm';
import { checkUsedKey } from './AddCompanyTag';

const mutation = gql`
    mutation updateCompanyTag($tag: CompanyTagInput!){
        updateCompanyTag(tag: $tag){
            success
            message
        }
    }
`;

const EditTagModal = ({ tag: initialValue, open, translate, company, refetch, client, requestClose, ...props }) => {
    const [tag, setTag] = React.useState(initialValue ? initialValue : { key: '', value: '', description: "" });
    const [errors, setErrors] = React.useState({});
    const [initInfo, setInitInfo] = React.useState(tag)
    const [unsavedAlert, setUnsavedAlert] = React.useState(false)
    
    const updateTagData = object => {
        setTag({
            ...tag,
            ...object
        });
    }

    const updateTag = async () => {
        if (!await checkRequiredFields()) {
            const { __typename, ...data } = tag;
            await client.mutate({
                mutation,
                variables: {
                    tag: data
                }
            });

            refetch();
            requestClose();
        }

    }

    const checkRequiredFields = async () => {
        let errors = {}

        if (!tag.key) {
            errors.key = translate.required_field;
        } else {
            const response = await client.query({
                query: checkUsedKey,
                variables: {
                    companyId: company.id,
                    key: tag.key
                }
            });

            if (response.data.companyTagKeyUsed && tag.key !== initialValue.key) {
                errors.key = translate.key_already_used;
            }
        }

        if (!tag.value) {
            errors.value = translate.required_field;
        }

        setErrors(errors);

        return Object.keys(errors).length > 0;
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

    const comprobateChanges = () => {
        let unsavedAlert = JSON.stringify(initInfo) !== JSON.stringify(tag)
        setUnsavedAlert(unsavedAlert)
        return unsavedAlert
    };

    const closeModal = () => {
        let equals = comprobateChanges();
        if (!equals) {
            requestClose()
        }
    }

    return (
        <div>
            <AlertConfirm
                title={translate.edit_tag}
                buttonAccept={translate.save}
                open={open}
                bodyText={renderBody()}
                acceptAction={updateTag}
                requestClose={closeModal}
                buttonCancel={translate.cancel}
            />
            <UnsavedChangesModal
                requestClose={() => setUnsavedAlert(false) }
                open={unsavedAlert}
            />
        </div>
    )
}

export default withApollo(EditTagModal);