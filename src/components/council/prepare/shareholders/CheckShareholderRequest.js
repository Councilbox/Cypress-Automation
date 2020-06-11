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

export const getTypeText = text => {
    const texts = {
        'access': 'Asistencia a la junta general',
        'vote': 'Voto anticipado',
        'represent': 'Representación de voto'
    }

    return texts[text];
}


const CheckShareholderRequest = ({ request, translate, refetch, client }) => {
    const [modal, setModal] = React.useState(false);
    const secondary = getSecondary();

    if(request.data.requestType === 'represent'){
        console.log(request);
    }

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

        console.log(response);
        const file = response.data.shareholdersRequestAttachment;
        const base64 = file.base64.split(';base64,').pop();
        downloadFile(base64, file.filetype, file.filename)
    }


    const modalBody = () => {
        return (
            <>
                <div>
                    <h5>Datos:</h5>
                    <div>
                        Tipo de solicitud: {getTypeText(request.data.requestType)}
                    </div>
                    {request.data.requestType === 'vote' &&
                        <>
                          {request.data.earlyVotes.map((vote, index) => (
                              <div key={`early_vote_${index}`}>
                                <div style={{fontWeight: '700'}}>{vote.name}</div>
                                <div>-{vote.value}</div>
                              </div>
                          ))}
                        </>
                    }
                    {request.data.requestType === 'represent' &&
                        <>
                            En:
                            <div style={{marginBotton: '2em'}}>
                                {request.data.representative[0].value === 'el presidente'?
                                    request.data.representative[0].value
                                :
                                request.data.representative[0].info.map((data, index) => (
                                    <div key={index}>
                                        {data.name}  - {data.value}
                                    </div>
                                ))}
                            </div>
                            {request.data.earlyVotes && request.data.earlyVotes.map((vote, index) => (
                              <div key={`early_vote_${index}`}>
                                <div style={{fontWeight: '700'}}>{vote.name}</div>
                                <div>-{vote.value}</div>
                              </div>
                          ))}
                        </>
                    }
                </div>
                <div style={{ marginTop: '1em', marginBottom: '1.6em'}}>
                    Adjuntos:
                    {request.data.attachments ?
                        request.data.attachments.map((attachment, index) => (
                            <div onClick={() => downloadAttachment(request.id, index)} style={{cursor: 'pointer'}}>
                                <i className='fa fa-file-pdf-o'></i>  {attachment.filename}
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
                {request.participantCreated &&
                    <DelegateVoteButton
                        request={request}
                        refetch={refetch}
                        translate={translate}
                    />

                }
            </>
        )
    }

    return (
        <>
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
                title={'Solicitud de accionista'}
                bodyText={modalBody()}
                requestClose={() => setModal(false)}
                open={modal}
            />
        </>
    )
    
}

export default withApollo(CheckShareholderRequest);