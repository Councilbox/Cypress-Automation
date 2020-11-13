import React from 'react';
import { GridItem, Grid, AlertConfirm, BasicButton, ButtonIcon } from '../../../displayComponents';
import { bHistory, moment } from '../../../containers/App';
import { Avatar } from 'material-ui';
import OneOnOneAttachmentsModal from './OneOnOneAttachmentsModal';
import { getPrimary, getSecondary } from '../../../styles/colors';
import SendMessageToParticipant from './SendMessageToParticipant';
import withSharedProps from '../../../HOCs/withSharedProps';
import oval from '../../../../src/assets/img/oval.png'
import ovalBlack from '../../../../src/assets/img/oval-copy.png'
import group from '../../../../src/assets/img/group.png'


const OneOnOneItem = ({ translate, council, index, company }) => {
    const [attachmentsModal, setAttachmentsModal] = React.useState(false);
    const [messageModal, setMessageModal] = React.useState(false);
    const secondary = getSecondary();

    return (
        <div>
            <GridItem
                key={council.id}
                style={{ background: index % 2 ? "#edf4fb" : "", padding: "0.7em 1em", cursor: 'pointer' }}
                xs={12}
                md={12}
                lg={12}
            // onClick={() => {
            //     bHistory.push(`/company/${company.id}/council/${council.id}/live`)
            // }}
            >
                <Grid style={{ alignItems: "center" }}>
                    <GridItem xs={1} md={1} lg={1}>
                        <Avatar alt="Foto" src={oval} style={{ width: "25px", height: "25px" }} />
                    </GridItem>
                    <GridItem xs={6} md={3} lg={3}>
                        <b style={{ color: "#154481" }}>Manuel Fernandez</b>
                    </GridItem>
                    <GridItem xs={5} md={2} lg={2} style={{ color: "black" }}>
                        29/11/2020
                    </GridItem>
                    <GridItem xs={12} md={6} lg={6} style={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ marginRight: ".5em", fontSize: "12px" }}>
                                <BasicButton
                                    text="Acceder"
                                    // onClick={getDrafts}
                                    backgroundColor={{ fontSize: "12px", fontStyle: "Lato", fontWeight: 'bold', color: '#ffffff', backgroundColor: '#154481', borderRadius: '4px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)' }}
                                />
                                {/* <BasicButton
                                    text="En espera"
                                    // onClick={getDrafts}
                                    backgroundColor={{ fontSize: "12px", fontStyle: "Lato", fontWeight: 'bold', color: '#5e5d5e', backgroundColor: '#d7d8da', borderRadius: '4px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)' }}
                                /> */}
                                {/* <b style={{ color: getPrimary(), padding: "8px 16px" }}>Asignado</b> */}
                            </div>
                            <div style={{ marginRight: ".5em" }}>
                                <BasicButton
                                    text="Ver documentación del participante"
                                    // onClick={getDrafts}
                                    // disabled
                                    //disabled backgroundColor={{ fontSize: "12px", fontStyle: "Lato", fontWeight: 'bold', color: '#5e5d5e', backgroundColor: '#d7d8da', borderRadius: '4px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)' }}
                                    backgroundColor={{ fontSize: "12px", fontStyle: "Lato", fontWeight: 'bold', color: '#154481', backgroundColor: '#ffffff', borderRadius: '4px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)' }}
                                />
                            </div>
                            <div>
                                <BasicButton
                                    text="Enviar correo al participante"
                                    // onClick={getDrafts}
                                    // disabled
                                    //disabled backgroundColor={{ fontSize: "12px", fontStyle: "Lato", fontWeight: 'bold', color: '#5e5d5e', backgroundColor: '#d7d8da', borderRadius: '4px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)' }}
                                    backgroundColor={{ fontSize: "12px", fontStyle: "Lato", fontWeight: 'bold', color: '#154481', backgroundColor: '#ffffff', borderRadius: '4px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)' }}
                                />
                            </div>
                        </div>
                    </GridItem>
                </Grid>
            </GridItem>
        </div>
    )

    return (
        <>
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
                participantId={council.participants[0].id}
                open={messageModal}
                requestClose={() => setMessageModal(false)}
            />

            <GridItem
                key={council.id}
                style={{ background: index % 2 ? "#edf4fb" : "", padding: "0.7em 1em", cursor: 'pointer' }}
                xs={12}
                md={12}
                lg={12}
                onClick={() => {
                    bHistory.push(`/company/${company.id}/council/${council.id}/live`)
                }}>
                <Grid style={{ alignItems: "center" }}>
                    <GridItem xs={1} md={1} lg={1}>
                        {council.logo ?
                            <Avatar alt="Foto" src={council.logo} />
                            :
                            <i
                                className={'fa fa-building-o'}
                                style={{ fontSize: '1.7em', color: 'lightgrey' }}
                            />
                        }
                    </GridItem>
                    <GridItem xs={4} md={4} lg={4}>
                        <b>{council.company ? council.company.businessName : ""}</b>
                    </GridItem>
                    <GridItem xs={4} md={4} lg={4}>
                        {council.name} - {moment(council.dateStart).format('DD/MM/YYYY HH:mm')}
                    </GridItem>
                    <GridItem xs={3} md={3} lg={3} style={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
                        {(council.state === 5 || council.state === 10) &&
                            translate.convened
                        }

                        {(council.state === 20 || council.state === 30) &&
                            translate.companies_live
                        }

                        {(council.state === 40) &&
                            translate.companies_writing
                        }

                    </GridItem>
                    <GridItem xs={1} md={1} lg={1}>
                    </GridItem>
                    <GridItem xs={11} md={11} lg={11}>
                        {council.attachments && council.attachments.filter(attachment => !!attachment.participantId).length > 0 &&
                            <>
                                <BasicButton
                                    color="white"
                                    textStyle={{
                                        color: secondary
                                    }}
                                    icon={
                                        <ButtonIcon type="attach_file" color={secondary} />
                                    }
                                    type="flat"
                                    text="Ver documentación añadida por el participante"
                                    onClick={event => {
                                        event.stopPropagation();
                                        setAttachmentsModal(true)
                                    }}
                                    buttonStyle={{
                                        border: `1px solid ${secondary}`
                                    }}
                                />
                            </>
                        }
                        <BasicButton
                            color="white"
                            textStyle={{
                                color: secondary
                            }}
                            type="flat"
                            icon={
                                <ButtonIcon type="mail" color={secondary} />
                            }
                            text="Enviar correo al participante"
                            onClick={event => {
                                event.stopPropagation();
                                setMessageModal(true)
                            }}
                            buttonStyle={{
                                border: `1px solid ${secondary}`,
                                marginLeft: '1em'
                            }}
                        />
                    </GridItem>
                </Grid>
            </GridItem>
        </>
    )
}

export default withSharedProps()(OneOnOneItem);