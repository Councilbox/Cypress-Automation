import React from 'react';
import { AlertConfirm } from '../../../../displayComponents';
import CompanyDocumentsPage from './CompanyDocumentsPage';
import { isMobile } from '../../../../utils/screen';


const CompanyDocumentsBrowser = ({ company, translate, action, open, requestClose, trigger }) => {
    const renderBody = () => (
            <CompanyDocumentsPage
                translate={translate}
                company={company}
                trigger={trigger}
                hideUpload={true}
                action={action}
            />
        )

    return (
        <AlertConfirm
            open={open}
            PaperProps={{
                style: {
                    width: isMobile ? '100%' : '80vw',
                    height: '70vh'
                }
            }}
            requestClose={requestClose}
            title={translate.my_documentation}
            bodyText={renderBody()}
        />
    )
}

export default CompanyDocumentsBrowser;
