import React from 'react';
import { CardPageLayout, TextInput, LoadingSection, BasicButton, DropDownMenu } from "../../../displayComponents";
import CompanyDraftList, { useTags } from './CompanyDraftList';
import CompanyTags from './companyTags/CompanyTags';
import withSharedProps from '../../../HOCs/withSharedProps';
import MenuSuperiorTabs from '../../dashboard/MenuSuperiorTabs';
import { isMobile } from '../../../utils/screen';
import { Icon, Table, TableRow, TableCell } from 'material-ui';
import { DropdownEtiquetas } from './LoadDraft';
import { DRAFTS_LIMITS } from '../../../constants';
import { companyDrafts as query, deleteDraft, getCompanyDraftDataNoCompany } from "../../../queries/companyDrafts.js";
import { withApollo } from 'react-apollo';
import folder from '../../../assets/img/folder.png';
import { getPrimary, primary, getSecondary } from '../../../styles/colors';
import group from '../../../assets/img/group-2.png';
import upload from '../../../assets/img/upload.png';



const CompanyDraftsPage = ({ translate, client, ...props }) => {
    const [data, setData] = React.useState({});
    const [selecteDraftPadre, setSelecteDraftPadre] = React.useState(translate.dasboard_documentation);
    const [mostrarMenu, setMostrarMenu] = React.useState(true);
    const [inputSearch, setInputSearch] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const { testTags, vars, setVars, removeTag, addTag, filteredTags, setTagText, tagText } = useTags(translate);

    const getDrafts = async variables => {
        const response = await client.query({
            query,
            variables: {
                companyId: props.company.id,
                options: {
                    limit: DRAFTS_LIMITS[0],
                    offset: 0
                },
                ...variables
            }

        });

        setData(response.data);
    }

    React.useEffect(() => {
        // console.log(Object.keys(testTags).map(key => testTags[key].name))
        getDrafts({
            companyId: props.company.id,
            ...(search ? {
                filters: [
                    {
                        field: "title",
                        text: search
                    },
                ]
            } : {}),
            tags: Object.keys(testTags).map(key => testTags[key].name),
        })
    }, [testTags, search]);


    const getData = async () => {
        const response = await client.query({
            query: getCompanyDraftDataNoCompany,
            variables: {
                companyId: props.company.id
            }
        });
        setVars(response.data);
    };

    React.useEffect(() => {
        getData();
    }, [props.company.id]);



    return (
        <CardPageLayout title={translate.drafts} disableScroll>
            <div style={{ padding: '1em', height: '100%', paddingTop: "0px" }}>
                {mostrarMenu &&
                    <div style={{ display: "flex", padding: '1em', justifyContent: "space-between", paddingTop: "0px" }}>
                        <div style={{ fontSize: "13px", }}>
                            <MenuSuperiorTabs
                                items={[translate.dasboard_documentation, translate.drafts, '<Tags>']}
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
                    selecteDraftPadre === translate.dasboard_documentation ?
                        <div style={{ width: '100%', height: '100%', padding: '1em', paddingBottom: "2em", paddingTop: isMobile && "0em" }}>
                            <div>
                                <div style={{ display: "flex", borderBottom: "1px solid" + getPrimary(), alignItems: "center", justifyContent: "space-between" }}>
                                    <div style={{ display: "flex", alignItems: "center", }}>
                                        <DropDownMenu
                                            color="transparent"
                                            styleComponent={{ width: "" }}
                                            Component={() =>
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0.5em", paddingRight: "1em", position: "relative" }}>
                                                    <div
                                                        style={{
                                                            cursor: "pointer"
                                                        }}
                                                    >
                                                        <span style={{ color: getPrimary(), fontWeight: "bold" }}>Mi Documentación</span>
                                                    </div>
                                                    <i className={"fa fa-sort-desc"}
                                                        style={{
                                                            cursor: 'pointer',
                                                            color: getPrimary(),
                                                            paddingLeft: "5px",
                                                            fontSize: "20px",
                                                            position: "absolute",
                                                            top: "5px",
                                                            right: "0px"
                                                        }}></i>
                                                </div>
                                            }
                                            textStyle={{ color: primary }}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            }}
                                            type="flat"
                                            items={
                                                <div style={{ padding: "1em" }}>
                                                    <div style={{ display: "flex", color: "black", padding: ".5em 0em", cursor: "pointer" }}>
                                                        <div style={{ width: "15px" }}>
                                                            <img src={group} style={{ width: "100%" }} ></img>
                                                        </div>
                                                        <div style={{ paddingLeft: "10px" }}>
                                                            Nuevo archivo
                                                    </div>
                                                    </div>
                                                    <div style={{ display: "flex", color: "black", padding: ".5em 0em", cursor: "pointer" }}>
                                                        <div style={{ width: "15px" }}>
                                                            <img src={folder} style={{ width: "100%" }}></img>
                                                        </div>
                                                        <div style={{ paddingLeft: "10px" }}>
                                                            Nueva carpeta
                                                    </div>
                                                    </div>
                                                    <div style={{ display: "flex", color: "black", padding: ".5em 0em", borderTop: "1px solid" + getPrimary(), cursor: "pointer" }}>
                                                        <div style={{ width: "15px" }}>
                                                            <img src={upload} style={{ width: "100%" }}></img>
                                                        </div>
                                                        <div style={{ paddingLeft: "10px" }}>
                                                            Subir archivo
                                                    </div>
                                                    </div>
                                                </div>
                                            }
                                        />
                                        <div style={{ color: 'black', fontStyle: "italic", marginLeft: "2em" }} >
                                            Inicio > Legal > Estatutos > <span style={{ color: getPrimary() }}>2020</span>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", alignContent: "center" }}>
                                        <div style={{ padding: "0px 8px", fontSize: "24px", color: "#c196c3", display: "flex", alignContent: "center" }}>
                                            <i className="fa fa-filter"></i>
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
                                </div>
                            </div>
                            <div style={{ marginTop: "2em" }}>
                                <Table style={{ width: '100%', minWidth: "100%" }}>
                                    <TableRow>
                                        <TableCell style={{
                                            color: "#a09aa0",
                                            fontWeight: "bold",
                                            borderBottom: "1px solid #979797"
                                        }}>
                                            {translate.name}
                                        </TableCell>
                                        <TableCell style={{
                                            color: "#a09aa0",
                                            fontWeight: "bold",
                                            borderBottom: "1px solid #979797"
                                        }}>
                                            {translate.type}
                                        </TableCell>
                                        <TableCell style={{
                                            color: "#a09aa0",
                                            fontWeight: "bold",
                                            borderBottom: "1px solid #979797"
                                        }}>
                                            {translate.last_edit}
                                        </TableCell>
                                        <TableCell style={{
                                            color: "#a09aa0",
                                            fontWeight: "bold",
                                            borderBottom: "1px solid #979797"
                                        }}>
                                            Tamaño
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            Estatutos revisados
                                        </TableCell>
                                        <TableCell>
                                            PDF
                                        </TableCell>
                                        <TableCell>
                                            01/09/2019
                                        </TableCell>
                                        <TableCell>
                                            5MB
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            Estatutos en constucción
                                        </TableCell>
                                        <TableCell>
                                            JPEG
                                        </TableCell>
                                        <TableCell>
                                            01/09/2019
                                        </TableCell>
                                        <TableCell>
                                            5MB
                                        </TableCell>
                                    </TableRow>
                                </Table>
                            </div>
                        </div>
                        :
                        <div style={{ width: '100%', height: '100%', padding: '1em', paddingBottom: "2em", paddingTop: isMobile && "0em" }}><CompanyDraftList setMostrarMenu={setMostrarMenu} searchDraft={search} /></div>
                    :
                    <div style={{ width: '100%', height: '100%', padding: '1em' }}><CompanyTags /></div>
                }
            </div>
        </CardPageLayout>
    )
}

export default withApollo(withSharedProps()(CompanyDraftsPage));