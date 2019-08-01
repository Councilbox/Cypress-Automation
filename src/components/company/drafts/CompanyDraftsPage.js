import React from 'react';
import { TabsScreen, CardPageLayout } from "../../../displayComponents";
import CompanyDraftList from './CompanyDraftList';
import CompanyTags from './companyTags/CompanyTags';
import withSharedProps from '../../../HOCs/withSharedProps';

const CompanyDraftsPage = ({ translate }) => {
    return (
        <CardPageLayout title={"Plantillas"}>{/*TRADUCCION*/}
            <TabsScreen
                uncontrolled={true}
                tabsInfo={[{
                    text: translate.drafts,
                    component: () => {
                        return <div style={{width: '100%', height: '100%', padding: '1em'}}><CompanyDraftList /></div>;
                    },
                },{
                    text: 'Etiquetas',
                    component: () => {
                        return <div style={{width: '100%', height: '100%', padding: '1em'}}><CompanyTags /></div>;
                    },
                }]}
            />
        </CardPageLayout>
    )
}

export default withSharedProps()(CompanyDraftsPage);