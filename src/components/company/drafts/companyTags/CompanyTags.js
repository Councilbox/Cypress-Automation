import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { CloseIcon, SectionTitle, Scrollbar, Grid, GridItem, TextInput } from '../../../../displayComponents';
import withSharedProps from '../../../../HOCs/withSharedProps';
import { useHoverRow } from '../../../../hooks';
import { getPrimary } from '../../../../styles/colors';
import { Table, TableHead, TableRow, TableCell, TableBody, IconButton, Icon, Divider } from 'material-ui';
import AddCompanyTag from './AddCompanyTag';
import EditTagModal from './EditTagModal';
import { sendGAevent } from '../../../../utils/analytics';
import RichTextInput from '../../../../displayComponents/RichTextInput';

export const query = gql`
    query companyTags($companyId: Int!, $filters: [FilterInput]){
        companyTags(companyId: $companyId, filters: $filters){
            id
            key
            value
            description
        }
    }
`;

const deleteCompanyTag = gql`
    mutation DeleteCompanyTag($tagId: Int!){
        deleteCompanyTag(tagId: $tagId){
            success
            message
        }
    }
`;

const CompanyTags = ({ client, translate, company, ...props }) => {
    const [data, setData] = React.useState(null);
    const [editTag, setEditTag] = React.useState(null);
    const [buscar, setBuscar] = React.useState("");
    const [buscarTags, setBuscarTags] = React.useState("");
    const [toggleText, setToggleText] = React.useState(true);
    const primary = getPrimary();

    const getData = async () => {
        console.log(buscarTags)
        const response = await client.query({
            query,
            variables: {
                companyId: company.id,
                ...(buscarTags ? {
                    filters: [
                        {
                            field: "key",
                            text: buscarTags
                        },
                    ]
                } : {}),
            }
        });
        setData(response.data.companyTags);
    }

    React.useEffect(() => {
        // if (!data) {
        getData();
        // }
    }, [company.id, buscarTags]);

    React.useEffect(() => {
        sendGAevent({
            category: 'Etiquetas',
            action: `Entrada al listado`,
            label: company.businessName
        });
    }, [sendGAevent]);

    const openEditTag = tag => {
        setEditTag(tag);
    }

    const closeEditTag = () => {
        setEditTag(null);
    }


    const deleteTag = async id => {
        await client.mutate({
            mutation: deleteCompanyTag,
            variables: {
                tagId: id
            }
        });
        getData();
    }

    return (
        <div style={{ height: "calc( 100% - 5em )" }}>
            <SectionTitle
                color={primary}
                title="Etiquetas de compañía" //TRADUCCION
            />

            <AddCompanyTag
                translate={translate}
                company={company}
                refetch={getData}
            />
            {!!editTag &&
                <EditTagModal
                    tag={editTag}
                    company={company}
                    open={!!editTag}
                    requestClose={closeEditTag}
                    translate={translate}
                    refetch={getData}
                />
            }
            {data &&
                <Grid style={{ width: "100%", height: "100%", marginTop: "1em" }}>
                    <GridItem xs={12} md={12} lg={12} style={{ width: "100%", height: "100%" }}>
                        <div style={{ display: "flex", alignItems: "center", color: "#969696", minHeight: "42px", marginBottom: "0.5em" }}>
                            {/* TRADUCCION */}
                            <div style={{}} onClick={() => setToggleText(!toggleText)}>
                                <i className="material-icons" style={{ color: getPrimary(), fontSize: '14px', paddingRight: "0.3em", cursor:"pointer"  }} >
                                    help
										</i></div>
                            <div style={{ height: "100%"}}>
                                {toggleText &&
                                    <div>Los &lt;tags&gt; son marcas inteligentes que añaden el nombre o elemento personalizado al documento. En el lado derecho podrás ver un preview.</div>
                                }
                            </div>
                        </div>
                        <div style={{ border: `1px solid ${getPrimary()}`, boxShadow: " 0 2px 4px 0 rgba(0, 0, 0, 0.5)", borderRadius: "2px", height: '390px', overflow: "hidden", paddingBottom: "4em" }}>
                            <div style={{ width: "100%" }}>
                                <div style={{ maxWidth: "10em", marginLeft: "1em" }}>
                                    {/* Cambiar lupa */}
                                    <TextInput
                                        disableUnderline={true}
                                        styleInInput={{ fontSize: "12px", color: getPrimary(), }}
                                        stylesAdornment={{}}
                                        adornment={<Icon style={{ color: getPrimary() }}>search</Icon>}
                                        type="text"
                                        value={""}
                                        value={buscarTags}
                                        placeholder={"Buscar tags"}
                                        onChange={event => {
                                            setBuscarTags(event.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                            <Divider />
                            <div style={{ height: '100%' }}>
                                <div style={{ height: '100%' }}>
                                    <Scrollbar>
                                        <div style={{ height: '100%' }}>
                                            {data.length > 0 ?
                                                <Table style={{ maxWidth: "100%", width: "100%" }}>
                                                    <TableHead>
                                                        <TableRow style={{ color: "black" }}>
                                                            {/* TRADUCCION */}
                                                            <TableCell style={{ color: "black", fontSize: "16px" }}>
                                                                Clave
                                                     </TableCell>
                                                            <TableCell style={{ color: "black", fontSize: "16px" }}>
                                                                Valor
                                                    </TableCell>
                                                            <TableCell style={{ color: "black", fontSize: "16px" }}>
                                                                Descripcion
                                                    </TableCell>
                                                            <TableCell style={{ width: "2em" }} />
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {data.map(tag => {
                                                            return (
                                                                <HoverableRow
                                                                    key={`tag_${tag.id}`}
                                                                    tag={tag}
                                                                    editTag={openEditTag}
                                                                    translate={translate}
                                                                    deleteTag={deleteTag}
                                                                />
                                                            )
                                                        })}
                                                    </TableBody>
                                                </Table>
                                                :
                                                translate.no_results
                                            }
                                        </div>
                                    </Scrollbar>
                                </div>
                            </div>
                        </div>
                    </GridItem>

                </Grid>
            }
        </div>
    )
}

const HoverableRow = ({ translate, tag, deleteTag, editTag }) => {
    const [show, handlers] = useHoverRow();
    const primary = getPrimary();

    return (
        <TableRow
            {...handlers}
            style={{
                background: show && "rgba(0, 0, 0, 0.07)"
            }}
        >
            <TableCell style={{ color: "black" }}>
                {tag.key}
            </TableCell>
            <TableCell style={{ color: getPrimary() }}>
                {tag.value}
            </TableCell>
            <TableCell style={{ color: getPrimary() }}>
                {tag.description}
            </TableCell>
            <TableCell>
                <div style={{ width: '4em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {show &&
                        <React.Fragment>
                            <IconButton
                                onClick={event => {
                                    event.stopPropagation();
                                    editTag(tag);
                                }}
                                style={{
                                    width: '32px',
                                    height: '32px'
                                }}
                            >
                                <i className="fa fa-edit"
                                    style={{
                                        cursor: "pointer",
                                        fontSize: '22px',
                                        color: primary
                                    }}
                                />
                            </IconButton>
                            <CloseIcon
                                style={{ color: primary }}
                                onClick={event => {
                                    deleteTag(tag.id);
                                    event.stopPropagation();
                                }}
                            />
                        </React.Fragment>

                    }
                </div>
            </TableCell>
        </TableRow>
    )
}

export default withSharedProps()(withApollo(CompanyTags));