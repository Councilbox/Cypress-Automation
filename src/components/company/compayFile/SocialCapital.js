import React from 'react';
import { CardPageLayout, TextInput, Scrollbar, DateTimePicker, SelectInput, BasicButton } from '../../../displayComponents';
import MenuSuperiorTabs from '../../dashboard/MenuSuperiorTabs';
import withTranslations from '../../../HOCs/withTranslations';
import { Icon, MenuItem, Card, CardHeader, IconButton } from 'material-ui';
import { getPrimary } from '../../../styles/colors';
import { Collapse } from 'material-ui';
import ContentEditable from 'react-contenteditable';


const ShareCapital = ({ translate, updateFileData, updateCompany, data, ...props }) => {
    const primary = getPrimary();
    const shareowners = (data.file && data.file.shareowners)? data.file.shareowners : []; 

    const addRow = () => {
        const newOwners = [...shareowners, { aqui: 'otro'}];
        updateFileData({
            shareowners: newOwners
        })
    }

    const deleteRow = index => {
        let newOwners = [...shareowners];
        newOwners.splice(index, 1);
        updateFileData({
            shareowners: newOwners
        })
    }

    const updateShareowner = (newData, index) => {
        const list = [...shareowners];
        list[index] = {
            ...list[index],
            ...newData
        }

        updateFileData({
            shareowners: [...list]
        })
    }

    return (
        <div style={{ height: "100%" }}>
            <div style={{ padding: '0px 1em 1em', height: '100%', }}>
                <div style={{ height: "100%", }}>
                    <div style={{ padding: "0 1em", fontWeight: "bold", color: primary, display: "flex", justifyContent: "space-between", paddingLeft: '24px', paddingRight: '24px' }}>
                        <div style={{ width: '33%', display: "flex", cursor: 'pointer' }} onClick={addRow}>
                            <div style={{ border: "1px solid" + primary, padding: "0.6em 5px", display: 'flex' }}>
                                {translate.add}
                                <div>
                                    <i className="fa fa-plus-circle" style={{ color: primary, paddingRight: "5px", marginLeft: '5px', fontSize: "16px" }}></i>
                                </div>
                            </div>
                        </div>
                        <div style={{ width: '33%' }}>{translate.total_social_capital}</div>
                        <div style={{ width: '33%' }}>{translate.percentage}</div>
                    </div>
                    <Scrollbar>
                        <div style={{ width: "100%", height: "calc( 100% - 3em )", padding: "0 1em" }}>
                            {shareowners.length > 0?
                                shareowners.map((owner, index) => (
                                    <div key={`book_${index}`}>
                                        <Card style={{ marginTop: "1em" }}>
                                            <div style={{ position: "relative" }}>
                                                <div style={{ color: 'black', display: "flex", justifyContent: "space-between", color: "black", fontSize: "15px", paddingLeft: '24px', paddingRight: '24px', paddingTop: "3em", paddingBottom: "3em" }}>
                                                    <div style={{ width: '33%' }}>
                                                        <ContentEditable
                                                            style={{ color: 'black', minWidth: '10em'}}
                                                            html={owner.name || ''}
                                                            onChange={event => {
                                                                updateShareowner({
                                                                    name: event.target.value
                                                                }, index)
                                                            }}
                                                        />

                                                    </div>
                                                    <div style={{ width: '33%', display: 'flex' }}>
                                                        <ContentEditable
                                                            style={{ color: 'black', minWidth: '90%'}}
                                                            html={owner.totalShares || ''}
                                                            onChange={event => {
                                                                updateShareowner({
                                                                    totalShares: event.target.value
                                                                }, index)
                                                            }}
                                                        />
                                                    </div>
                                                    <div style={{ width: '33%', display: 'flex' }}>
                                                        <ContentEditable
                                                            style={{ color: 'black', minWidth: '90%'}}
                                                            html={owner.percentage || ''}
                                                            onChange={event => {
                                                                updateShareowner({
                                                                    percentage: event.target.value
                                                                }, index)
                                                            }}
                                                        />
                                                        <IconButton
                                                            onClick={() => deleteRow(index)}
                                                            aria-label="Show more"
                                                            className={"expandButtonModal"}
                                                        >
                                                            <i
                                                                className={"fa fa-times-circle"}
                                                                style={{
                                                                    color: primary,
                                                                    transition: "all 0.3s"
                                                                }}
                                                            />
                                                        </IconButton>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                ))
                            :
                                <div style={{marginTop: '1em'}}>
                                    {translate.no_results}
                                </div>
                                
                            }
                            <BasicButton
                                text={translate.save}
                                color={primary}
                                loading={props.updateState === 'LOADING'}
                                success={props.updateState === 'SUCCESS'}
                                textStyle={{
                                    color: 'white',
                                    fontWeight: '700',
                                    marginTop: '1em'
                                }}
                                onClick={updateCompany}
                                floatRight={true}
                            />
                        </div>

                    </Scrollbar>
                </div>
            </div>
        </div>
    )
}


export default withTranslations()(ShareCapital);