import React from 'react';
import { CardPageLayout, TextInput } from "../../../displayComponents";
import CompanyDraftList, { useTags } from './CompanyDraftList';
import CompanyTags from './companyTags/CompanyTags';
import withSharedProps from '../../../HOCs/withSharedProps';
import MenuSuperiorTabs from '../../dashboard/MenuSuperiorTabs';
import { isMobile } from 'react-device-detect';
import { Icon } from 'material-ui';
import { DropdownEtiquetas } from './LoadDraft';


const CompanyDraftsPage = ({ translate, ...props }) => {
    const [selecteDraftPadre, setSelecteDraftPadre] = React.useState(translate.drafts);
    const [mostrarMenu, setMostrarMenu] = React.useState(true);
    const [inputSearch, setInputSearch] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const { testTags, vars, setVars, removeTag, addTag, filteredTags, setTagText, tagText } = useTags(translate);

    return (
        <CardPageLayout title={translate.drafts} disableScroll>
            <div style={{ padding: '1em', height: '100%' }}>
                {mostrarMenu &&
                    <div style={{ display: "flex", padding: '1em', justifyContent: "space-between" }}>
                        <div style={{ fontSize: "13px", }}>
                            <MenuSuperiorTabs
                                items={[translate.drafts, '<Tags>']}
                                setSelect={setSelecteDraftPadre}
                                selected={selecteDraftPadre}
                            />
                        </div>
                        {isMobile && selecteDraftPadre !== '<Tags>' &&
                            < div style={{ marginRight: '0.8em', display: "flex", justifyContent: isMobile ? "space-between" : 'flex-end', alignItems: "center" }}>
                                <div style={{ marginRight: isMobile ? "0.5em" : "3em" }}>
                                    <DropdownEtiquetas
                                        translate={translate}
                                        search={tagText}
                                        setSearchModal={setTagText}
                                        matchSearch={filteredTags}
                                        company={props.company}
                                        vars={vars}
                                        testTags={testTags}
                                        addTag={addTag}
                                        styleBody={{ minWidth: '50vw' }}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        removeTag={removeTag}
                                        stylesMenuItem={{ padding: "3px 3px", marginTop: isMobile && '0', width: isMobile && "" }}
                                        soloIcono={true}
                                    />
                                </div>
                                <div>
                                    <TextInput
                                        className={isMobile && !inputSearch ? "openInput" : ""}
                                        disableUnderline={true}
                                        styleInInput={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.54)", background: "#f0f3f6", padding: isMobile && inputSearch && "4px 5px", paddingLeft: !isMobile && "5px" }}
                                        stylesAdornment={{ background: "#f0f3f6", marginLeft: "0", paddingLeft: isMobile && inputSearch ? "8px" : "4px" }}
                                        adornment={<Icon onClick={() => setInputSearch(!inputSearch)} >search</Icon>}
                                        floatingText={" "}
                                        type="text"
                                        value={search}
                                        styles={{ marginTop: "-16px" }}
                                        stylesTextField={{ marginBottom: "0px" }}
                                        placeholder={isMobile ? "" : translate.search}
                                        onChange={event => {
                                            setSearch(event.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                        }
                    </div>
                }
                {selecteDraftPadre !== '<Tags>' ?
                    <div style={{ width: '100%', height: '100%', padding: '1em', paddingBottom: "2em", paddingTop: isMobile && "0em" }}><CompanyDraftList setMostrarMenu={setMostrarMenu} searchDraft={search} /></div>
                    :
                    <div style={{ width: '100%', height: '100%', padding: '1em' }}><CompanyTags /></div>
                }
            </div>
        </CardPageLayout >
    )
}

export default withSharedProps()(CompanyDraftsPage);