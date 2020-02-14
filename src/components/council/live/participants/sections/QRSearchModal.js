import React from 'react';
import QrReader from 'react-qr-reader';
import { AlertConfirm, BasicButton, ReactSignature, ParticipantDisplay } from '../../../../../displayComponents';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { PARTICIPANT_STATES } from '../../../../../constants';
import { canBePresentWithRemoteVote } from '../../../../../utils/CBX';


const QRSearchModal = ({ updateSearch, open, requestClose, client, council, translate }) => {
    const [search, setSearch] = React.useState('');
    const [result, setResult] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const signature = React.useRef();

    const _canBePresentWithRemoteVote = canBePresentWithRemoteVote(
		council.statute
	);

    const searchParticipant = React.useCallback(async() => {
        if(search){
            setLoading(true);
            const response = await client.query({
                query: gql`
                    query liveParticipantQRSearch($accessId: String!, $councilId: Int!){
                        liveParticipantQRSearch(accessId: $accessId, councilId: $councilId){
                            name
                            surname
                            id
                            dni
                            email
                            numParticipations
                            position
                            state
                            signed
                        }
                    }
                `,
                variables: {
                    accessId: search,
                    councilId: council.id
                }
            });

            if(!response.data.liveParticipantQRSearch){
                setError('404')
            } else {
                setResult(response.data.liveParticipantQRSearch);
            }
            console.log(response);
            setLoading(false);

        }
    }, [search]);

    React.useEffect(() => {
        searchParticipant();
    }, [searchParticipant])

    const handleError = error => {
        setSearch('aaronCracker');
    }

    const handleScan = data => {
        if (data) {
            console.log(data);
        }
    }

    const setParticipantAsPresent = async () => {
        // const save = async () => {
        //     let signatureData = signature.current.toDataURL();
        //     let response;
        //     if (state.clean) {
        //         response = await props.removeLiveParticipantSignature({
        //             variables: {
        //                 participantId: participant.id
        //             }
        //         });
        //     } else {
        //         response = await props.setLiveParticipantSignature({
        //             variables: {
        //                 signature: {
        //                     ...(data.liveParticipantSignature ? { id: data.liveParticipantSignature.id } : {}),
        //                     data: signatureData,
        //                     participantId: participant.id
        //                 },
        //                 state: state.participantState
        //             }
        //         });
        //     }
    
        //     if (!response.errors) {
        //         await data.refetch();
        //         await props.refetch();
        //         close();
        //     }
        // };
        setResult(null);
    }

    const signatureSection = () => {
        const maxWidth = 600;
        const minWidth = window.innerWidth * 0.7;
        let width = minWidth;
    
        if (minWidth > maxWidth) {
            width = maxWidth;
        }
        const height = width * 0.41;

        return (
            <div>
                <div
                    style={{
                        height: "400px",
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        position: "relative"
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            textAlign: "left"
                        }}
                    >
                        <ParticipantDisplay
                            participant={result}
                            translate={translate}
                            delegate={true}
                            council={council}
                        />
                    </div>
                    {/* {_canBePresentWithRemoteVote ? (
                        <div>
                            <Checkbox
                                label={translate.has_remote_vote}
                                value={
                                    participantState ===
                                    PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE
                                }
                                onChange={(event, isInputChecked) =>
                                    setState({
                                        participantState: isInputChecked
                                            ? PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE
                                            : PARTICIPANT_STATES.PHYSICALLY_PRESENT
                                    })
                                }
                            />
                        </div>
                    ) : (
                            <br />
                        )} */}
                    <div tyle={{ width: 'calc(100% - 2em)', display: 'flex', justifyContent: 'center' }}>
                        <ReactSignature
                            height={height}
                            width={width}
                            dotSize={1}
                            //onEnd={() => setState({ clean: false })}
                            style={{ border: "solid 1px" }}
                            ref={signature}
                        />
                    </div>
                </div>
            </div>
        )
    }

    const renderBody = () => {
        if(result){
            return (
                <div>
                    {result.name}
                    {result.state === PARTICIPANT_STATES.PHYSICALLY_PRESENT?
                        'Este participante ya está presente'
                    :
                        <React.Fragment>
                            <div>
                                {signatureSection()}
                            </div>
                            <BasicButton
                                text="Marcar como presente"
                                onClick={setParticipantAsPresent}
                            />
                        </React.Fragment>
                    }
                </div>
            )
        }

        return (
            <div
                style={{
                    borderRadius: '27px',
                    background: "white",
                    display: 'flex',
                    flexGrow: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: "hidden",
                    flexDirection: 'column',
                    minHeight: '300px',
                    minWidth: '300px',
                    zIndex: "1", 
                }}
            >
                {error &&
                    //TRADUCCION
                    <div style={{color: 'red'}}>
                        No se encuentra ningún participante con ese código
                    </div>
                }
                <QrReader
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    className={'qrEscaner'}
                    style={{
                        borderRadius: '27px',
                        width: '100%',
                        height: '100%',
                        border: '1px solid gainsboro !important',
                        boxShadow: 'none !important'
                    }}
                />
            </div>
        )
    }

    return (
        <AlertConfirm
            open={open}
            bodyStyle={{padding: '1em 2em', margin: '0'}}
            requestClose={requestClose}
            title={translate.search}
            bodyText={renderBody()}
        />
    )
}

export default withApollo(QRSearchModal);