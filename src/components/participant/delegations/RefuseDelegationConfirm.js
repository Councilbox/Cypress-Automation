import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { AlertConfirm } from '../../../displayComponents';


const RefuseDelegationConfirm = withApollo(({ delegation, client, translate, refetch, requestClose }) => {
    const [loading, setLoading] = React.useState(false);

    const refuseDelegation = async () => {
		setLoading(true);

		const response = await client.mutate({
			mutation: refuseDelegationMutation,
			variables: {
				participantId: delegation.id
			}
		});

		if(response.data.refuseDelegation.success){
            setLoading(false);
            refetch();
            requestClose();
		}
	}

    return(
        <AlertConfirm
            open={true}
            title={translate.warning}
            acceptAction={refuseDelegation}
            buttonAccept={translate.accept}
            requestClose={requestClose}
            cancelAction={requestClose}
            buttonCancel={translate.cancel}
            loadingAction={loading}
            bodyText={
                <div>
                    {`Va a rechazar los votos delegados del participante ${delegation.name} ${delegation.surname}, está acción no se puede deshacer, está seguro?`}
                </div>
            }
        />
    )
})

const refuseDelegationMutation = gql`
	mutation RefuseDelegation($participantId: Int!){
		refuseDelegation(participantId: $participantId){
			success
		}
	}
`;


export default RefuseDelegationConfirm;