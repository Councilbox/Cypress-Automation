import React from 'react';
import { TabsScreen, CardPageLayout, Scrollbar } from "../../../displayComponents";
import CompanyDraftList from './CompanyDraftList';
import CompanyTags from './companyTags/CompanyTags';
import withSharedProps from '../../../HOCs/withSharedProps';
import MenuSuperiorTabs from '../../dashboard/MenuSuperiorTabs';

const CompanyDraftsPage = ({ translate, ...props }) => {
    const [selecteDraft, setSelecteDraft] = React.useState(translate.drafts);
    return (
        <CardPageLayout title={translate.drafts} disableScroll>
            <div style={{ padding: '1em', height: '100%' }}>
                <div style={{ display: "flex", padding: '1em' }}>
                    <div style={{ fontSize: "13px"}}>
                        <MenuSuperiorTabs
                            items={[translate.drafts, '<Tags>']}
                            setSelect={setSelecteDraft}
                        />
                    </div>
                </div>
                {selecteDraft !== '<Tags>' ?
                    <div style={{ width: '100%', height: '100%', padding: '1em', paddingBottom: "2em" }}><CompanyDraftList /></div>
                    :
                    <div style={{ width: '100%', height: '100%', padding: '1em' }}><CompanyTags /></div>
                }
            </div>
        </CardPageLayout >
    )
}

export default withSharedProps()(CompanyDraftsPage);