import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import folder from '../../../../assets/img/folder.png';
import folderIcon from '../../../../assets/img/folder.svg';
import { getPrimary, getSecondary } from '../../../../styles/colors';
import upload from '../../../../assets/img/upload.png';
import { isMobile } from '../../../../utils/screen';
import { Icon, Table, TableRow, TableCell } from 'material-ui';
import { CardPageLayout, TextInput, LoadingSection, BasicButton, DropDownMenu, FileUploadButton, AlertConfirm } from "../../../../displayComponents";
import { moment } from '../../../../containers/App';
import CreateDocumentFolder from './CreateDocumentFolder';

const CompanyDocumentsPage = ({ translate, company, client }) => {
    const [inputSearch, setInputSearch] = React.useState(false);
    const [breadCrumbs, setBreadCrumbs] = React.useState([{
        value: '-1',
        label: 'home'
    }]);
    const [deleting, setDeleting] = React.useState(false);
    const [documents, setDocuments] = React.useState(null);
    const [folderModal, setFolderModal] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [deleteModal, setDeleteModal] = React.useState(null);
    const primary = getPrimary();

    const actualFolder = breadCrumbs[breadCrumbs.length - 1].value;

    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: gql`
                query CompanyDocuments($companyId: Int!, $folderId: Int){
                    companyDocuments(companyId: $companyId, folderId: $folderId){
                        name
                        filesize
                        type
                        id
                        filetype
                        date
                        lastUpdated
                    }
                }
            `,
            variables: {
                companyId: company.id,
                folderId: breadCrumbs.length > 1? actualFolder : null
            }
        });
        setDocuments(response.data.companyDocuments);
    }, [company.id, breadCrumbs])

    React.useEffect(() => {
        getData();
    }, [getData])

    const navigateTo = folder => {
        breadCrumbs.push({
            value: folder.id,
            label: folder.name
        });

        setBreadCrumbs([...breadCrumbs]);
    }

    const deleteDocument = async () => {
        setDeleting(true);
        const response = await client.mutate({
            mutation: gql`
                mutation DeleteCompanyDocument($documentId: Int!){
                    deleteCompanyDocument(documentId: $documentId){
                        success
                    }
                }
            `,
            variables: {
                documentId: deleteModal.id
            }
        });
        getData();
        setDeleting(false);
        setDeleteModal(false);
    }


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
                companyId: company.id,
                ...(breadCrumbs.length > 1?
                    {
                        parentFolder: actualFolder
                    }
                : {})
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
            getData();

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
                <AlertConfirm
                    open={deleteModal}
                    title={translate.warning}
                    loadingAction={deleting}
                    requestClose={() => setDeleteModal(false)}
                    bodyText={
                        <div>
                            ¿Esta seguro de que quiere eliminar el documento <strong>{deleteModal? deleteModal.name : ''}</strong>?
                        </div>
                    }
                    buttonAccept={translate.accept}
                    buttonCancel={translate.cancel}
                    acceptAction={deleteDocument}
                />
                <CreateDocumentFolder
                    requestClose={() => setFolderModal(false)}
                    open={folderModal}
                    translate={translate}
                    refetch={getData}
                    company={company}
                    parentFolder={breadCrumbs.length > 1? actualFolder : null}
                />
                <div style={{ display: "flex", borderBottom: "1px solid" + primary, alignItems: "center", justifyContent: "space-between" }}>
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
                                        <span style={{ color: primary, fontWeight: "bold" }}>Mi Documentación</span>
                                    </div>
                                    <i className={"fa fa-sort-desc"}
                                        style={{
                                            cursor: 'pointer',
                                            color: primary,
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
                                    <div
                                        style={{
                                            display: "flex",
                                            color: "black",
                                            padding: ".5em 0em",
                                            borderTop: "1px solid" + primary,
                                            cursor: "pointer"
                                        }}
                                        onClick={() => setFolderModal(true)}
                                    >
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
                                    <span
                                        style={{
                                            ...(index === breadCrumbs.length - 1? {
                                                color: (index === breadCrumbs.length - 1)? primary : 'inherit'
                                            }: {
                                                cursor: 'pointer'
                                            })}}
                                        onClick={() => {
                                            breadCrumbs.splice(index + 1);
                                            setBreadCrumbs([...breadCrumbs]);
                                        }}
                                    >{item.label}</span>
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
                            Tamaño {/*TRADUCCION*/}
                        </TableCell>
                        <TableCell style={{
                            color: "#a09aa0",
                            fontWeight: "bold",
                            borderBottom: "1px solid #979797"
                        }} />
                    </TableRow>
                    {documents && documents.map(doc => (
                        doc.type === 0?
                            <TableRow onClick={() => navigateTo(doc)} style={{ cursor: 'pointer'}}>
                                <TableCell>
                                    <img src={folderIcon} style={{ marginRight: '0.6em' }} />
                                    {doc.name}
                                </TableCell>
                                <TableCell>
                                    {'Carpeta' /*TRADUCCION*/}
                                </TableCell>
                                <TableCell>
                                    {moment(doc.lastUpdated).format('LLL')}
                                </TableCell>
                                <TableCell/>
                                <TableCell>
                                    <div onClick={() => setDeleteModal(doc)} style={{
                                        cursor: 'pointer',
                                        color: primary,
                                        background: 'white',
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: "0.3em",
                                        width: "100px"
                                    }}>
                                        {translate.delete}
                                    </div>
                                </TableCell>
                            </TableRow>
                        :
                            <TableRow>
                                <TableCell>
                                    {doc.name}
                                </TableCell>
                                <TableCell>
                                    {doc.name.split('.').pop().toUpperCase()}
                                </TableCell>
                                <TableCell>
                                    {moment(doc.lastUpdated).format('LLL')}
                                </TableCell>
                                <TableCell>
                                    {doc.filesize}
                                </TableCell>
                                <TableCell>
                                    <div onClick={() => setDeleteModal(doc)} style={{
                                        cursor: 'pointer',
                                        color: primary,
                                        background: 'white',
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: "0.3em",
                                        width: "100px"
                                    }}>
                                        {translate.delete}
                                    </div>
                                </TableCell>
                            </TableRow>
                    ))}
                </Table>
            </div>
        </div>
    )
}

export default withApollo(CompanyDocumentsPage);