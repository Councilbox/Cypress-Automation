import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import FontAwesome from 'react-fontawesome';
import {
 BasicButton, AlertConfirm, TextInput, Checkbox, LoadingSection
} from '../../../../displayComponents';

const reducer = (state, action) => {
    const actions = {
        LOADING: () => ({
            ...state,
            status: 'LOADING'
        }),
        ERROR: () => ({
            ...state,
            status: 'ERROR',
            error: action.payload
        }),
        SUCCESS: () => ({
            ...state,
            status: 'SUCCESS',
            error: null
        }),
        IDDLE: () => ({
            ...state,
            error: null,
            status: 'IDDLE'
        })
    };

    return actions[action.type] ? actions[action.type]() : state;
};


const MergeCouncilsButton = ({
 translate, color, council, client
}) => {
    const [modal, setModal] = React.useState(false);
    const [from, setFrom] = React.useState(null);
    const [force, setForce] = React.useState(false);
    const [{ status, error }, dispatch] = React.useReducer(reducer, {
        status: 'IDDLE'
    });

    const loading = status === 'LOADING';
    const hasError = status === 'ERROR';

    const mergeCouncils = async () => {
        dispatch({ type: 'LOADING' });
        const response = await client.mutate({
            mutation: gql`
                mutation MergeCouncils($from: Int!, $to: Int!, $force: Boolean){
                    mergeCouncils(from: $from, to: $to, force: $force){
                        success
                    }
                }
            `,
            variables: {
                from,
                to: council.id,
                force
            }
        });

        if (response.errors) {
            if (response.errors[0].message === 'Repeated emails between councils') {
                dispatch({
                    type: 'ERROR',
                    payload: {
                        type: 'Duplicated emails',
                        repeatedEmails: response.errors[0].originalError.errors.repeatedEmails
                    }
                });
            }
        } else {
            dispatch({ type: 'SUCCESS' });
        }
    };


    const renderBody = () => {
        if (status === 'SUCCESS') {
            return (
                'Reuniones mezcladas con éxito'
            );
        }

        if (hasError) {
            return (
                <>
                    {error.type === 'Duplicated emails'
                        && <>
                            Hay emails repetidos entre las reuniones
                            {error.repeatedEmails.map(email => (
                                <div key={email}>
                                    {email}
                                </div>
                            ))}
                            Forzar la mezcla igualmente omitiendo el participante con email repetido?
                            <Checkbox
                                value={force}
                                onChange={() => setForce(!force)}
                            />
                        </>
                    }

                </>

            );
        }

        if (loading) {
            return <LoadingSection />;
        }

        return (
            <TextInput
                value={from}
                type="number"
                floatingText={'Mover participantes desde la ID'}
                onChange={event => {
                    setFrom(+event.target.value);
                }}
            />
        );
    };

    return (
        <>
            <AlertConfirm
                open={modal}
                requestClose={() => {
                    setModal(false);
                    dispatch({ type: 'IDDLE' });
                }}
                acceptAction={mergeCouncils}
                hideAccept={status === 'SUCCESS'}
                loadingAction={loading}
                buttonAccept={translate.send}
                title={'Mezclar reuniones'}
                buttonCancel={translate.cancel}
                bodyText={renderBody()}
            />
            <BasicButton
                text={'Añadir participantes desde otra reunión'}
                color={color}
                // loading={loading}
                buttonStyle={{ marginTop: '0.5em', marginBottom: '1.4em', marginRight: '0.6em' }}
                textStyle={{
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '0.9em',
                    textTransform: 'none'
                }}
                icon={
                    <FontAwesome
                        name={'file-pdf-o'}
                        style={{
                            fontSize: '1em',
                            color: 'white',
                            marginLeft: '0.3em'
                        }}
                    />
                }
                textPosition="after"
                onClick={() => setModal(true)}
            />
        </>
    );
};


export default withApollo(MergeCouncilsButton);
