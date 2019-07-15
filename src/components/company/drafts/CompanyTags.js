import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton, CloseIcon } from '../../../displayComponents';
import { useHoverRow } from '../../../hooks';
import { getPrimary } from '../../../styles/colors';
import { Table, TableHead, TableRow, TableCell, TableBody } from 'material-ui';

const addTag = gql`
    mutation CreateCompanyTag($tag: CompanyTagInput!){
        createCompanyTag(tag: $tag){
            id
            key
            value
        }
    }
`;

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
    const [loading, setLoading] = React.useState(true);

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

    const createCompanyTag = async () => {
        const response = await client.mutate({
            mutation: addTag,
            variables: {
                tag: {
                    value: 'Prueba',
                    key: 'Prueba',
                    companyId: company.id
                }
            }
        });

        if(response.data.createCompanyTag){
            setData([
                ...data,
                response.data.createCompanyTag
            ]);
        }

    }

    const deleteTag = async id => {
        const response = await client.mutate({
            mutation: deleteCompanyTag,
            variables: {
                tagId: id
            }
        });

        console.log(response);

        getData();
    }

    return (
        <div>
            <BasicButton
                onClick={createCompanyTag}
                text="Probar"
            />
            COMPANY TAGS

            {data &&
                <React.Fragment>
                    {data.length > 0?
                        <Table>
                            <TableHead>
                                <TableCell>
                                    Clave
                                </TableCell>
                                <TableCell>
                                    Valor
                                </TableCell>
                                <TableCell/>
                            </TableHead>
                            <TableBody>
                                {data.map(tag => (
                                    <HoverableRow
                                        key={`tag_${tag.id}`}
                                        tag={tag}
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

const HoverableRow = ({ translate, tag, deleteTag }) => {
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
                <div style={{width: '3em'}}>
                    {show &&
                        <CloseIcon
                            style={{ color: primary }}
                            onClick={event => {
                                deleteTag(tag.id);
                                event.stopPropagation();
                            }}
                        />
                    }
                </div>
            </TableCell>
        </TableRow>
    )
}

export default withApollo(CompanyTags);