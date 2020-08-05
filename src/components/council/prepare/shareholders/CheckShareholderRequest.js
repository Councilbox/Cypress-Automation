import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton, AlertConfirm } from '../../../../displayComponents';
import { getSecondary } from '../../../../styles/colors';
import ApproveRequestButton from './ApproveRequestButton';
import AddShareholder from './AddShareholder';
import { downloadFile } from '../../../../utils/CBX';
import RefuseRequestButton from './RefuseRequestButton';
import DelegateVoteButton from './DelegateVoteButton';
import { getVote } from '../../../participant/ResultsTimeline';

export const getTypeText = text => {
    const texts = {
        'access': 'Solicitud',
        // 'access': 'Asistencia a la junta general',
        'vote': 'Voto anticipado',
        'represent': 'Representación de voto'
    }

    return texts[text];
}


const CheckShareholderRequest = ({ request, translate, refetch, client }) => {
    const [modal, setModal] = React.useState(false);
    const [modalAlert, setModalAlert] = React.useState(false);
    const [inModal, setInModal] = React.useState(null);
    const [representative, setRepresentative] = React.useState(false);
    const secondary = getSecondary();

    // console.log(request);


    const downloadAttachment = async (requestId, index) => {
        const response = await client.query({
            query: gql`
                query ShareholdersRequestAttachment($requestId: Int!, $index: Int!){
                    shareholdersRequestAttachment(requestId: $requestId, index: $index){
                        base64
                        filename
                        filetype
                    }
                }
            `,
            variables: {
                requestId,
                index
            }
        });
        const file = response.data.shareholdersRequestAttachment;
        const base64 = file.base64.split(';base64,').pop();
        downloadFile(base64, file.filetype, file.filename)
    }

    const modalBody = (representative) => {
        return (
            <>
                <div>
                    <h5>Datos:</h5>
                    <div>
                        Tipo de solicitud: {getTypeText(request.data.requestType)}
                    </div>
                    {request.data.requestType === 'vote' &&
                        <>
                            {request.data.earlyVotes && request.data.earlyVotes.map((vote, index) => (
                                <div key={`early_vote_${index}`}>
                                    <div style={{ fontWeight: '700' }}>{vote.name}</div>
                                    <div>-{getVote(+vote.value, translate)}</div>
                                </div>
                            ))}
                        </>
                    }
                    {request.data.requestType === 'represent' &&
                        <>
                            En:
                            <div style={{ marginBotton: '2em' }}>
                                {request.data.representative[0].value === 'el presidente' || request.data.representative[0].value.includes('Presidente') ?
                                    request.data.representative[0].value
                                    :
                                    request.data.representative[0].info.map((data, index) => (
                                        data.value &&
                                        <div key={index}>
                                            {data.name}  - {data.value}
                                        </div>
                                    ))}
                            </div>
                            {request.data.earlyVotes && request.data.earlyVotes.map((vote, index) => (
                                <div key={`early_votes_${index}`}>
                                    <div style={{ fontWeight: '700' }}>{vote.name}</div>
                                    <div>-{getVote(+vote.value, translate)}</div>
                                </div>
                            ))}
                        </>
                    }
                </div>
                <div style={{ marginTop: '1em', marginBottom: '1.6em' }}>
                    Adjuntos:
                    {request.data.attachments ?
                        request.data.attachments.map((attachment, index) => (
                            <div key={`adjuntos_${index}`} onClick={() => downloadAttachment(request.id, index)} style={{ cursor: 'pointer' }}>
                                <i className='fa fa-file-pdf-o'></i>  {attachment.name}
                            </div>
                        ))
                        :
                        ""
                    }
                </div>
                <AddShareholder
                    request={request}
                    refetch={refetch}
                    translate={translate}
                />
                <RefuseRequestButton
                    request={request}
                    refetch={refetch}
                    translate={translate}
                />
                <ApproveRequestButton
                    request={request}
                    refetch={refetch}
                    translate={translate}
                />
                {request.participantCreated && request.data.requestType === 'represent' &&
                    <DelegateVoteButton
                        request={request}
                        refetch={refetch}
                        translate={translate}
                        setRepresentative={setRepresentative}
                    />
                }
            </>
        )
    }


    const closeModal = () => {
        if (!representative && request.data.requestType === 'represent' && request.participantCreated) {
            setModalAlert(true)

        } else {
            setModal(false)
        }
    }

    const closeModals = () => {
        setModal(false)
        setModalAlert(false)
        refetch()
    }

    const closeModalAlert = () => {
        setModalAlert(false)
        if(inModal){
            setInModal(false)  
        }
        refetch()
    }


    return (
        <>
            <AlertConfirm
                title={inModal ? translate.to_delegate_vote : 'Alerta'}
                bodyText={
                    <div>
                        {inModal ?
                            <div style={{ display: "flex", marginTop: "1em", justifyContent: "flex-end" }}>
                                <DelegateVoteButton
                                    text="Continuar"
                                    request={request}
                                    refetch={refetch}
                                    translate={translate}
                                    setRepresentative={setRepresentative}
                                    closeModal={() => setModalAlert(false)}
                                    setInModal={setInModal}
                                    inModal={inModal}
                                    closeModalAlert={()=>{setModalAlert(false);refetch()}}
                                />
                            </div>
                            :
                            <div>
                                <div>El usuario ha marcado delegación de voto y no se ha realizado</div>
                                <div style={{ display: "flex", marginTop: "1em", justifyContent: "flex-end" }}>
                                    <DelegateVoteButton
                                        text="Continuar"
                                        request={request}
                                        refetch={refetch}
                                        translate={translate}
                                        setRepresentative={setRepresentative}
                                        closeModal={() => setModalAlert(false)}
                                        setInModal={setInModal}
                                        inModal={inModal}
                                    />
                                    <BasicButton
                                        text="Cancelar"
                                        onClick={closeModals}
                                        buttonStyle={{
                                            border: `1px solid ${secondary}`,
                                            marginLeft: "1em"
                                        }}
                                        color="white"
                                        textStyle={{ color: secondary }}
                                    //onClick={approveRequest}
                                    />
                                </div>
                            </div>
                        }
                    </div>
                }
                requestClose={closeModalAlert}
                open={modalAlert}
            />
            <BasicButton
                text="Revisar"
                onClick={() => setModal(request)}
                buttonStyle={{
                    border: `1px solid ${secondary}`
                }}
                color="white"
                textStyle={{ color: secondary }}
            //onClick={approveRequest}
            />
            <AlertConfirm
                title={'Solicitud'}
                bodyText={modalBody()}
                requestClose={closeModal}
                open={modal}
            />
        </>
    )

}

export default withApollo(CheckShareholderRequest);