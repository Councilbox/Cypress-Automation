import React from 'react';
import { withApollo } from 'react-apollo';
import { Scrollbar, BasicButton } from '../../../displayComponents';
import withTranslations from '../../../HOCs/withTranslations';
import GoverningBodyForm from '../settings/GoverningBodyForm';
import { getPrimary } from '../../../styles/colors';



const FileOrgAdm = ({ translate, data, updateCompanyData, updateCompany, ...props }) => {
    return (
        <div style={{ height: "100%" }}>
            <div style={{ padding: '0px 1em 1em', height: '100%', }}>
                <div style={{ height: "100%", }}>
                    <Scrollbar>
                        <div style={{ width: "100%", padding: "0 1em" }}>
                            <GoverningBodyForm translate={translate} state={data} updateState={updateCompanyData} />
                        </div>
                        <BasicButton
                            text={translate.save}
                            color={getPrimary()}
                            textStyle={{
                                color: 'white',
                                fontWeight: '700',
                                marginTop: '1em'
                            }}
                            onClick={updateCompany}
                            floatRight={true}
                        />
                    </Scrollbar>
                </div>
            </div>
        </div>
    )
}


export default withTranslations()(withApollo(FileOrgAdm));


/*
<div style={{ height: "10em", boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)", padding: "1em", width: "100%" }}>
                                
                            </div>

                            <div style={{ marginTop: "2em", height: "100%" }}>
                                

*/