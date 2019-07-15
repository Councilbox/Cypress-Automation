import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { CloseIcon, SectionTitle, AlertConfirm } from '../../../../displayComponents';
import withSharedProps from '../../../../HOCs/withSharedProps';
import { useHoverRow } from '../../../../hooks';
import { getPrimary } from '../../../../styles/colors';
import { Table, TableHead, TableRow, TableCell, TableBody, IconButton } from 'material-ui';
import AddCompanyTag from './AddCompanyTag';
import EditTagModal from './EditTagModal';
import { sendGAevent } from '../../../../utils/analytics';


const query = gql`
    query companyTags($companyId: Int!){
        companyTags(companyId: $companyId){
            id
            key
            value
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
    const [loading, setLoading] = React.useState(true);
    const primary = getPrimary();

    const getData = async () => {
        const response = await client.query({
            query,
            variables: {
                companyId: company.id
            }
        });
        setData(response.data.companyTags);
        setLoading(false)
    }

    React.useEffect(() => {
        if(!data){
            getData();
        }
    }, [company.id]);

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
        const response = await client.mutate({
            mutation: deleteCompanyTag,
            variables: {
                tagId: id
            }
        });
        getData();
    }

    return (
        <div>
            <SectionTitle
                color={primary}
                title="Etiquetas de compañía"
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
                <React.Fragment>
                    {data.length > 0?
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        Clave
                                    </TableCell>
                                    <TableCell>
                                        Valor
                                    </TableCell>
                                    <TableCell/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map(tag => (
                                    <HoverableRow
                                        key={`tag_${tag.id}`}
                                        tag={tag}
                                        editTag={openEditTag}
                                        translate={translate}
                                        deleteTag={deleteTag}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    :
                        translate.no_results
                    }
                </React.Fragment>

            }
        </div>
    )
}

const HoverableRow = ({ translate, tag, deleteTag, editTag }) => {
    const [show, handlers] = useHoverRow();
    const primary = getPrimary();

    return (
        <TableRow {...handlers}>
            <TableCell>
                {tag.key}
            </TableCell>
            <TableCell>
                {tag.value}
            </TableCell>
            <TableCell>
                <div style={{width: '4em', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
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