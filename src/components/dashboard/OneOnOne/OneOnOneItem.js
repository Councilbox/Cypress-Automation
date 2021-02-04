import React from 'react';
import { Avatar, Tooltip } from 'material-ui';
import { GridItem, Grid, BasicButton } from '../../../displayComponents';
import { bHistory, moment } from '../../../containers/App';
import OneOnOneAttachmentsModal from './OneOnOneAttachmentsModal';
import { getPrimary } from '../../../styles/colors';
import SendMessageToParticipant from './SendMessageToParticipant';
import withSharedProps from '../../../HOCs/withSharedProps';
import oval from "../../../assets/img/oval.png"
import { councilStarted } from '../../../utils/CBX';


const OneOnOneItem = ({ translate, council, index, company }) => {
    const [attachmentsModal, setAttachmentsModal] = React.useState(false);
    const [messageModal, setMessageModal] = React.useState(false);
    const primary = getPrimary();
    const participant = council.participants[0];

    return (
        <div>
            <GridItem
                key={council.id}
                style={{ background: index % 2 ? "#edf4fb" : "", padding: "0.7em 1em" }}
                xs={12}
                md={12}
                lg={12}
            >
                {attachmentsModal &&
                    <OneOnOneAttachmentsModal
                        council={council}
                        translate={translate}
                        requestClose={event => {
                            event.stopPropagation();
                            setAttachmentsModal(false);
                        }}
                        open={attachmentsModal}
                    />
                }
                <SendMessageToParticipant
                    translate={translate}
                    council={council}
                    participantId={council.participants[0].id}
                    open={messageModal}
                    requestClose={() => setMessageModal(false)}
                />
                <Grid style={{ alignItems: "center" }}>
                    <GridItem xs={1} md={1} lg={1}>
                        <Avatar alt="Foto" src={oval} style={{ width: "25px", height: "25px" }} />
                    </GridItem>
                    <GridItem xs={6} md={2} lg={2} className="truncate">
                        <b style={{ color: primary }}>{`${participant.name} ${participant.surname || ''}`}</b>
                    </GridItem>
                    <GridItem xs={5} md={2} lg={2} style={{ color: "black" }}>
                        <Tooltip title={`${council.name}${council.externalId ? ` - ${council.externalId}` : ''}`}>
                            <div>
                                {moment(council.dateStart).format('DD/MM/YYYY HH:mm')}
                            </div>
                        </Tooltip>
                    </GridItem>
                    <GridItem xs={12} md={7} lg={7} style={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ marginRight: ".5em", fontSize: "12px", width: '10em' }}>
                                {councilStarted(council) ?
                                    <b style={{ color: getPrimary(), padding: "8px 16px" }}>Iniciada</b>
                                :
                                    <BasicButton
                                        text="Acceder"
                                        onClick={() => bHistory.push(`/company/${company.id}/council/${council.id}/live`)}
                                        backgroundColor={{ fontSize: "12px", fontStyle: "Lato", fontWeight: 'bold', color: '#ffffff', backgroundColor: primary, borderRadius: '4px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)' }}
                                    />
                                }
                            </div>
                            <div style={{ marginRight: ".5em", width: '12em' }}>
                                {(council.attachments && council.attachments.filter(attachment => !!attachment.participantId).length > 0) ?
                                    <BasicButton
                                        text="Ver documentación del participante"
                                        onClick={event => {
                                            event.stopPropagation();
                                            setAttachmentsModal(true);
                                        }}
                                        backgroundColor={{ fontSize: "12px", fontStyle: "Lato", fontWeight: 'bold', color: primary, backgroundColor: '#ffffff', borderRadius: '4px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)' }}
                                    />
                                :
                                    'Sin documentación'
                                }
                            </div>
                            <div>
                                <BasicButton
                                    text="Enviar correo al participante"
                                    disabled={councilStarted(council)}
                                    onClick={event => {
                                        event.stopPropagation();
                                        setMessageModal(true)
                                    }}
                                    backgroundColor={{
                                        fontSize: "12px",
                                        fontStyle: "Lato",
                                        fontWeight: 'bold',
                                        color: primary,
                                        backgroundColor: councilStarted(council) ? 'lightgray' : '#ffffff',
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>
                        </div>
                    </GridItem>
                </Grid>
            </GridItem>
        </div>
    )
}

export default withSharedProps()(OneOnOneItem);
