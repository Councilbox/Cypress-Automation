import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import folder from '../../../../assets/img/folder.png';
import { getPrimary, getSecondary } from '../../../../styles/colors';
import group from '../../../../assets/img/group-2.png';
import upload from '../../../../assets/img/upload.png';
import { isMobile } from '../../../../utils/screen';
import { Icon, Table, TableRow, TableCell } from 'material-ui';
import { CardPageLayout, TextInput, LoadingSection, BasicButton, DropDownMenu, FileUploadButton } from "../../../../displayComponents";

const CompanyDocumentsPage = ({ translate, company, client }) => {
    const [inputSearch, setInputSearch] = React.useState(false);
    const [breadCrumbs, setBreadCrumbs] = React.useState([{
        value: '-1',
        label: 'home'
    }]);
    const [search, setSearch] = React.useState("");
    const primary = getPrimary();

    const handleFile = async event => {
		const file = event.nativeEvent.target.files[0];
		if (!file) {
			return;
		}
		let reader = new FileReader();
		reader.readAsBinaryString(file);

		reader.onload = async event => {
			let fileInfo = {
				name: file.name,
				filetype: file.type,
				filesize: event.loaded,
                base64: btoa(event.target.result),
                companyId: company.id
            };

            const response = await client.mutate({
                mutation: gql`
                    mutation CreateCompanyDocument($companyDocument: CompanyDocumentInput){
                        createCompanyDocument(companyDocument: $companyDocument){
                            id
                            name
                        }
                    }
                `,
                variables: {
                    companyDocument: fileInfo
                }
            });

            console.log(response);

			// setUploading(true);
			// const response = await props.addAttachment({
			// 	variables: {
			// 		attachment: fileInfo
			// 	}
			// });
			// if (response) {
			// 	getData();
			// 	setUploading(false);
			// }
		};
	};

    return (
        <div style={{ width: '100%', height: '100%', padding: '1em', paddingBottom: "2em", paddingTop: isMobile && "0em" }}>
            <div>
                <div style={{ display: "flex", borderBottom: "1px solid" + getPrimary(), alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", }}>
                        <DropDownMenu
                            color="transparent"
                            persistent
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
                                    <FileUploadButton
                                        trigger= {() => (
                                            <div style={{ display: "flex", color: "black", padding: ".5em 0em", cursor: "pointer" }}>
                                                <div style={{ width: "15px" }}>
                                                    <img src={upload} style={{ width: "100%" }}></img>
                                                </div>
                                                <div style={{ paddingLeft: "10px" }}>
                                                    Subir archivo
                                                </div>
                                            </div>
                                        )}
                                        text={translate.new_add}
                                        flat
                                        style={{
                                            paddingLeft: '10px 0px',
                                            width: "100%"
                                        }}
                                        buttonStyle={{ width: "100%" }}
                                        //loading={uploading}
                                        onChange={handleFile}
                                    />
                                    <div style={{ display: "flex", color: "black", padding: ".5em 0em", borderTop: "1px solid" + getPrimary(), cursor: "pointer" }}>
                                        <div style={{ width: "15px" }}>
                                            <img src={folder} style={{ width: "100%" }}></img>
                                        </div>
                                        <div style={{ paddingLeft: "10px" }}>
                                            Nueva carpeta
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                        <div style={{ color: 'black', fontStyle: "italic", marginLeft: "2em" }}>
                            {breadCrumbs.map((item, index) => (
                                <>
                                    {index > 0 &&
                                        ` > `
                                    }
                                    <span style={{ color: index === breadCrumbs.length? primary : 'inherit' }}>{item.label}</span>
                                </>
                            ))}
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

                </Table>
            </div>
        </div>
    )
}

export default withApollo(CompanyDocumentsPage);

/*

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
*/