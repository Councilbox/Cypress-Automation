import React from 'react';
import { GridItem, Grid, AlertConfirm } from '../../../displayComponents';
import { moment } from '../../../containers/App';
import { Avatar } from 'material-ui';
import OneOneOneAttachmentsModal from './OneOneOneAttachmentsModal';


const OneOneOnItem = ({ translate, council, index }) => {
    const [attachmentsModal, setAttachmentsModal] = React.useState(false);

    return (
        <GridItem
            key={council.id}
            style={{ background: index % 2 ? "#edf4fb" : "", padding: "0.7em 1em", cursor: 'pointer' }}
            xs={12}
            md={12}
            lg={12}
            onClick={() => setAttachmentsModal(true)}>
            {attachmentsModal &&
                <OneOneOneAttachmentsModal
                    council={council}
                    translate={translate}
                    requestClose={event => {
                        event.stopPropagation();
                        setAttachmentsModal(false);
                    }}
                    open={attachmentsModal}
                />
            }

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
                    {council.name} - {moment(council.dateStart).subtract(10, 'days').calendar()}
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
                    {council.attachments.filter(attachment => !!attachment.participantId).length > 0 &&
                        <>
                            {'El participante ha añadido documentación adjunta' //TRADUCCION
                            }
                            <span
                                onClick={() => setAttachmentsModal(true)}
                                style={{
                                    cursor: 'pointer',
                                    marginLeft: '.3em',
                                    fontWeight: '700'
                                }}
                            >{translate.see}</span>
                        </>
                    }
                </GridItem>
            </Grid>
        </GridItem>
    )
}

export default OneOneOnItem;