import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import FontAwesome from 'react-fontawesome';
import { BasicButton, AlertConfirm, TextInput } from '../../../../displayComponents';
import { number } from 'prop-types';


const MergeCouncilsButton = ({ translate, color, council, client }) => {
    const [modal, setModal] = React.useState(false);
    const [from, setFrom] = React.useState(null);

    const mergeCouncils = async () => {
        const response = await client.mutate({
            mutation: gql`
                mutation MergeCouncils($from: Int!, $to: Int!){
                    mergeCouncils(from: $from, to: $to){
                        success
                    }
                }
            `,
            variables: {
                from,
                to: council.id
            }
        });

        console.log(response);
    }

    return (
        <>
            <AlertConfirm
                open={modal}
                requestClose={() => setModal(false)}
                acceptAction={mergeCouncils}
                buttonAccept={translate.send}
                title={'Mezclar reuniones'}
                buttonCancel={translate.cancel}
                bodyText={
                    <>
                        <TextInput
                            value={from}
                            type="number"
                            floatingText={'Mover participantes desde la ID'}
                            onChange={event => {
                                setFrom(+event.target.value)
                            }}
                        />
                    </>
                }
            />
            <BasicButton
                text={'Añadir participantes desde otra reunión'}
                color={color}
                //loading={loading}
                buttonStyle={{ marginTop: "0.5em", marginBottom: '1.4em' }}
                textStyle={{
                    color: "white",
                    fontWeight: "700",
                    fontSize: "0.9em",
                    textTransform: "none"
                }}
                icon={
                    <FontAwesome
                        name={"file-pdf-o"}
                        style={{
                            fontSize: "1em",
                            color: "white",
                            marginLeft: "0.3em"
                        }}
                    />
                }
                textPosition="after"
                onClick={() => setModal(true)}
            />
        </>
    )
}


export default withApollo(MergeCouncilsButton);