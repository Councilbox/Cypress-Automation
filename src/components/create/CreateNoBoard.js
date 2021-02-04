import React from 'react';
import { withApollo } from 'react-apollo';
import { MenuItem } from 'material-ui';
import withSharedProps from '../../HOCs/withSharedProps';
import { statutes } from '../../queries';
import { SelectInput } from '../../displayComponents';


const CreateNoBoard = ({ setOptions, options, translate, hybrid, errors, company, client, ...props }) => {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: statutes,
            variables: {
                companyId: company.id
            }
        });

        setData(response.data);
        setLoading(false);
        setOptions({
            statuteId: response.data.companyStatutes[0].id
        })
    }, [company.id]);

    React.useEffect(() => {
        props.setTitle('Seleccionar tipo de reunión');//TRADUCCION
        getData();
    }, [getData]);

    if(loading){
        return null;
    }

    return (
        <div>
            <SelectInput
                floatingText={translate.council_type}
                value={options ? options.statuteId : ''}
                onChange={event => setOptions({
                        statuteId: +event.target.value
                    })
                }
            >
                {data.companyStatutes.map((statute) => (
                        <MenuItem
                            value={statute.id}
                            key={`statutes_${statute.id}`}
                        >
                            {translate[statute.title] ||
                                statute.title}
                        </MenuItem>
                    ))}
            </SelectInput>
        </div>
    )
}

export default withSharedProps()(withApollo(CreateNoBoard));
