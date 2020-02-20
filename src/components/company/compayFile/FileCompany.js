import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { CardPageLayout } from '../../../displayComponents';
import MenuSuperiorTabs from '../../dashboard/MenuSuperiorTabs';
import withTranslations from '../../../HOCs/withTranslations';



const FileCompany = ({ translate, ...props }) => {
    const [modal, setModal] = React.useState(false);
    // necesito council
    console.log(props)
    return (
        <CardPageLayout title={'Ficha de council'} disableScroll avatar={'asdasd'}>
            {/* company.icon */}
            <div style={{ padding: '1em', height: '100%', paddingTop: "0px" }}>
                <div style={{ display: "flex", padding: '1em', justifyContent: "space-between", paddingTop: "0px" }}>
                    <div style={{ fontSize: "13px", }}>
                        <MenuSuperiorTabs
                            items={[translate.drafts, '<Tags>']}
                        // setSelect={setSelecteDraftPadre}
                        // selected={selecteDraftPadre}
                        />
                    </div>
                </div>
            </div>
        </CardPageLayout>
    )
}

export default withTranslations()(withApollo(FileCompany));