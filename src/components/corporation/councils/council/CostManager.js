import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { TextInput, BasicButton } from '../../../../displayComponents';

const CostManager = ({ council, updateCouncil }) => {
    const [formData, setFormData] = React.useState({
        price: council.price,
        priceObservations: council.priceObservations
    });
    const [loading, setLoading] = React.useState(false);

    const updatePrice = event => {
        setFormData({
            ...formData,
            price: event.target.value
        });
    }

    const updateObservations = event => {
        setFormData({
            ...formData,
            priceObservations: event.target.value
        });
    }

    const sendUpdate = async () => {
        setLoading(true);
        const response = await updateCouncil({
            variables: {
                council: {
                    id: council.id,
                    price: formData.price,
                    priceObservations: formData.priceObservations
                }
            }
        });

        setLoading(false);
    }

    return (
        <div>
            <TextInput
                floatingText="Coste"
                value={formData.price || ''}
                onChange={updatePrice}
                styles={{marginBottom: "0.8em"}}
            />
            <TextInput
                floatingText="Observaciones sobre el coste"
                value={formData.priceObservations || ''}
                onChange={updateObservations}
            />
            <BasicButton
                buttonStyle={{ marginTop: "1em" }}
                text="Guardar"
                loading={loading}
                onClick={sendUpdate}
            />
        </div>
    )
}

const updateCouncil = gql`
    mutation UpdateCouncil($council: CouncilInput){
        updateCouncil(council: $council){
            id
            price
            priceObservations
        }
    }
`;

export default graphql(updateCouncil, { name: 'updateCouncil' })(CostManager)