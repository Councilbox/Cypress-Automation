import React from 'react';
import { withApollo } from 'react-apollo';
import { BasicButton, AlertConfirm } from '../../../../displayComponents';
import gql from 'graphql-tag';
import { getSecondary } from '../../../../styles/colors';

const RemoveDelegationButton = ({ participant, delegatedVote, translate, client, refetch }) => {
    const [modal, setModal] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const secondary = getSecondary();

	const removeDelegatedVote = async id => {
        setLoading(true);
		const response = await client.mutate({
            mutation: gql`
                mutation RemoveDelegation($participantId: Int!){
                    removeDelegation(participantId: $participantId){
                        success
                        message
                    }
                }
            `,
			variables: {
				participantId: id
			}
		});

		if (response) {
            setLoading(false);
			refetch();
		}
    }
    
    const renderModalBody = () => {
        //TRADUCCION
        return `Desea eliminar la delegación de ${delegatedVote.name} ${delegatedVote.surname || ''} en ${participant.name} ${participant.surname || ''}`
    }

    return (
        <React.Fragment>
            <AlertConfirm
                open={modal}
                acceptAction={() => removeDelegatedVote(delegatedVote.id)}
                buttonAccept={translate.accept}
                buttonCancel={translate.cancel}
                loadingAction={loading}
                requestClose={() => setModal(false)}
                title={translate.warning}
                bodyText={renderModalBody()}
            />
            <BasicButton
                text={'Quitar delegación'} //TRADUCCION
                onClick={() => setModal(true)}
                type="flat"
                color="white"
                textStyle={{ color: secondary }}
                buttonStyle={{ border: `1px solid ${secondary}` }}
            />

        </React.Fragment>
    )
}

export default withApollo(RemoveDelegationButton);