import React from 'react';
import { withApollo } from 'react-apollo';
import { Scrollbar, BasicButton } from '../../../displayComponents';
import withTranslations from '../../../HOCs/withTranslations';
import GoverningBodyForm from '../settings/GoverningBodyForm';



const FileOrgAdm = ({ translate, data, updateCompanyData, updateCompany, ...props }) => {
    return (
        <div style={{ height: "100%" }}>
            <div style={{ padding: "0.5em", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                {/* <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                    <div style={{ padding: "0px 8px", fontSize: "24px", color: "#c196c3" }}>
                        <i className="fa fa-filter"></i>
                    </div>
                    <TextInput
                        placeholder={translate.search}
                        adornment={<Icon style={{ background: "#f0f3f6", paddingLeft: "5px", height: '100%', display: "flex", alignItems: "center", justifyContent: "center" }}>search</Icon>}
                        type="text"
                        value={state.filterText || ""}
                        styleInInput={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.54)", background: "#f0f3f6", marginLeft: "0", paddingLeft: "8px" }}
                        disableUnderline={true}
                        stylesAdornment={{ background: "#f0f3f6", marginLeft: "0", paddingLeft: "8px" }}
                        onChange={event => {
                            setState({
                                ...state,
                                filterText: event.target.value
                            })
                        }}
                    />
                </div> */}
            </div>
            <div style={{ padding: '0px 1em 1em', height: '100%', }}>
                <div style={{ height: "100%", }}>
                    <Scrollbar>
                        <div style={{ width: "100%", padding: "0 1em" }}>
                            <GoverningBodyForm translate={translate} state={data} updateState={updateCompanyData} />
                        </div>
                        <BasicButton
                            text={translate.save}
                            onClick={updateCompany}
                            buttonStyle={{
                                marginTop: '1em'
                            }}
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