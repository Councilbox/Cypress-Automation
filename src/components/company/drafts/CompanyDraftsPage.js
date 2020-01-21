import React from 'react';
import { CardPageLayout } from "../../../displayComponents";
import CompanyDraftList from './CompanyDraftList';
import CompanyTags from './companyTags/CompanyTags';
import withSharedProps from '../../../HOCs/withSharedProps';
import MenuSuperiorTabs from '../../dashboard/MenuSuperiorTabs';
import { isMobile } from 'react-device-detect';

const CompanyDraftsPage = ({ translate, ...props }) => {
    const [selecteDraftPadre, setSelecteDraftPadre] = React.useState(translate.drafts);
    const [mostrarMenu, setMostrarMenu] = React.useState(true);
    
    return (
        <CardPageLayout title={translate.drafts} disableScroll>
            <div style={{ padding: '1em', height: '100%' }}>
                {mostrarMenu &&
                    <div style={{ display: "flex", padding: '1em' }}>
                        <div style={{ fontSize: "13px" }}>
                            <MenuSuperiorTabs
                                items={[translate.drafts, '<Tags>']}
                                setSelect={setSelecteDraftPadre}
                            />
                        </div>
                    </div>
                }
                {selecteDraftPadre !== '<Tags>' ?
                    <div style={{ width: '100%', height: '100%', padding: '1em', paddingBottom: "2em", paddingTop: isMobile && "0em" }}><CompanyDraftList setMostrarMenu={setMostrarMenu} /></div>
                    :
                    <div style={{ width: '100%', height: '100%', padding: '1em' }}><CompanyTags /></div>
                }
            </div>
        </CardPageLayout >
    )
}

export default withSharedProps()(CompanyDraftsPage);