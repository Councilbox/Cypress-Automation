import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TabsScreen from '../components/displayComponents/TabsScreen';
import Signatures from '../components/signature/Signatures';

const SignatureContainer = ({ match, company, translate }) => {
    const tabsIndex = {
        drafts: 0,
        live: 1,
        finished: 2
    };

    const tabsInfo = [ {
        text: translate.document_signature_drafts,
        link: `/company/${company.id}/signatures/drafts`,
        component: () => {
            return (<Signatures company={company}
                                translate={translate}
                                title={translate.document_signature_drafts}
                                desc={translate.signature_of_documents_drafts_desc}
                                state={0}
            />)
        }
    }, {
        text: translate.signature_of_documents_sent,
        link: `/company/${company.id}/signatures/live`,
        component: () => {
            return (<Signatures company={company}
                                translate={translate}
                                title={translate.signature_of_documents_sent}
                                desc={translate.signature_of_documents_desc}
                                state={10}
            />)
        }
    }, {
        text: translate.signature_of_documents_completed,
        link: `/company/${company.id}/signatures/finished`,
        component: () => {
            return (<Signatures company={company}
                                translate={translate}
                                title={translate.signature_of_documents_completed}
                                desc={translate.signature_of_documents_completed_desc}
                                state={20}
            />)
        }
    }];


    return (<TabsScreen tabsIndex={tabsIndex} tabsInfo={tabsInfo} selected={match.params.section}/>);
};

const mapStateToProps = (state) => ({
    company: state.companies.list[ state.companies.selected ],
    translate: state.translate
});

export default connect(mapStateToProps)(withRouter(SignatureContainer));