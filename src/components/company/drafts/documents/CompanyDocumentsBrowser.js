import React from 'react';
import { AlertConfirm } from '../../../../displayComponents';
import CompanyDocumentsPage from './CompanyDocumentsPage';
import { isMobile } from '../../../../utils/screen';


const CompanyDocumentsBrowser = ({ company, translate, action, open, requestClose }) => {

    const renderBody = () => {
        return (
            <CompanyDocumentsPage
                translate={translate}
                company={company}
            />
        )
    }

    return (
        <AlertConfirm
            open={open}
            PaperProps={{
                style: {
                    width: isMobile? '100%' : '80vw',
                    height: '70vh'
                }
            }}
            requestClose={requestClose}
            title={'Mi documentación'}//TRADUCCION
            bodyText={renderBody()}
        />
    )
} 

export default CompanyDocumentsBrowser;