import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { AlertConfirm, UnsavedChangesModal } from '../../../../displayComponents';
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
    const [tag, setTag] = React.useState(initialValue || { key: '', value: '', description: '' });
    const [errors, setErrors] = React.useState({});
    const [initInfo, setInitInfo] = React.useState(tag);
    const [unsavedAlert, setUnsavedAlert] = React.useState(false);

    const updateTagData = object => {
        setTag({
            ...tag,
            ...object
        });
    };

    const checkRequiredFields = async () => {
        const checkErrors = {};

        if (!tag.key) {
            checkErrors.key = translate.required_field;
        } else {
            const response = await client.query({
                query: checkUsedKey,
                variables: {
                    companyId: company.id,
                    key: tag.key
                }
            });

            if (response.data.companyTagKeyUsed && tag.key !== initialValue.key) {
                checkErrors.key = translate.key_already_used;
            }
        }

        if (!tag.value) {
            checkErrors.value = translate.required_field;
        }

        setErrors(checkErrors);

        return Object.keys(checkErrors).length > 0;
    };

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
    };

    const renderBody = () => (
        <CompanyTagForm
            errors={errors}
            tag={tag}
            setTag={updateTagData}
            translate={translate}
        />
    );

    const comprobateChanges = () => {
        const isUnsavedAlert = JSON.stringify(initInfo) !== JSON.stringify(tag);
        setUnsavedAlert(isUnsavedAlert);
        return isUnsavedAlert;
    };

    const closeModal = () => {
        const equals = comprobateChanges();
        if (!equals) {
            requestClose();
        }
    };

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
                acceptAction={updateTag}
                cancelAction={requestClose}
                requestClose={() => setUnsavedAlert(false)}
                open={unsavedAlert}
            />
        </div>
    );
};

export default withApollo(EditTagModal);
