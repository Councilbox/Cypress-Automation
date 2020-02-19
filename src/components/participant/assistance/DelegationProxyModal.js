import React from 'react';
import { AlertConfirm, Grid, GridItem, ReactSignature, BasicButton, Scrollbar } from '../../../displayComponents';
import { getSecondary, getPrimary } from '../../../styles/colors';
import withWindowSize from '../../../HOCs/withWindowSize';
import { moment } from '../../../containers/App';
import { Card } from 'material-ui';
import { isMobile } from "../../../utils/screen";


const DelegationProxyModal = ({ open, council, innerWidth, delegation, participant, requestClose, action }) => {
    const signature = React.useRef();
    const signatureContainer = React.useRef();
    const primary = getPrimary();
    const secondary = getSecondary();
    const [canvasSize, setCanvasSize] = React.useState({
		width: 0,
		height: 0
    })

	React.useEffect(() => {
		let timeout = setTimeout(() => {
			if (signatureContainer.current) {
				setCanvasSize({
					width: (signatureContainer.current.getBoundingClientRect().width - 20),
					height: (signatureContainer.current.getBoundingClientRect().height - 110),
				})
			}
		}, 150)
		return () => clearTimeout(timeout);

	}, [open, innerWidth])

    return (
        <AlertConfirm
            open={open}
            bodyStyle={{
                width: isMobile? '100%' : "60vw",
            }}
            requestClose={requestClose}
            title={"Generación de documento delegado"}
            bodyText={
                <Grid style={{ marginTop: "15px", height: "100%" }}>
                    <GridItem xs={12} md={6} lg={6} style={{ height: "70vh" }} >
                        <Scrollbar>
                            {delegation &&
                                <Card style={{padding: '0.6em', paddingBottom: '1em', width: '96%', marginLeft: '2%'}}>
                                    <div>{council.company.businessName}</div>
                                    <div>{council.street}</div>
                                    <div>{council.countryState} {council.countryState}</div>
                                    <div>{council.country}</div>
                                    <br/>
                                    <div>En {council.city}, a {moment(new Date()).format('LL')}</div>
                                    <br/>
                                    <div>Distinguido/s Señor/es:</div>
                                    <br/>
                                    <div>
                                        No pudiendo asistir a la {council.name} de {council.company.businessName} convocada
                                        para el próximo día {moment(council.dateStart).format('LL')} a
                                        las {moment(council.dateStart).format('h:mm:ss')} horas, en {council.street}, en
                                        primera convocatoria, o bien el {moment(council.dateStart2ndCall).format('LL')} a
                                        las {moment(council.dateStart2ndCall).format('h:mm:ss')} horas
                                        en el mismo lugar, en segunda convocatoria,
                                        delego mi representación y voto en favor de D./ {delegation.name} {delegation.surname || ''} para que me
                                        represente en dicha reunión sin limitación de facultad de voto.
                                    </div>
                                    <br/>
                                    <br/>
                                    <div>Le saluda muy atentamente,</div>
                                    <br/><br/><br/>
                                    _________________________________
                                    <div>D.  {participant.name} {participant.surname} </div>
                                </Card>
                            }
                        </Scrollbar>
                    </GridItem>
                    <GridItem xs={12} md={6} lg={6} >
                        <div style={{
                            borderRadius: '4px',
                            boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.5)',
                            color: primary,
                            marginBottom: "1em",
                            padding: "0.6em 1em",
                            display: "flex",
                            alignItems: "center",
                            width: "100%"
                        }}>
                            <div style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                cursor: "pointer"
                            }}>Imprimir PDF para firmar en papel</div>
                            <i className="material-icons" style={{
                                color: primary,
                                fontSize: '14px',
                                paddingRight: "0.3em",
                                cursor: "pointer",
                                marginLeft: "5px"
                            }} >
                                help
                            </i>
                        </div>
                        <div
                            style={{
                                border: 'solid 1px #979797',
                                color: '#a09aa0',
                                padding: "0.6em",
                                marginBottom: "1em",
                                height: 'calc( 100% - 7em )'
                            }}
                            ref={signatureContainer}
                        >
                            Firme en este recuadro para hacer efectiva la firma electrónica en el documento.
                            <ReactSignature
                                height={canvasSize.height}
                                width={canvasSize.width}
                                dotSize={1}
                                onEnd={() => {}}
                                style={{}}
                                ref={signature}
                            />
                        </div>
                        <BasicButton
                            text={'Enviar documento firmado'}
                            color={secondary}
                            textStyle={{
                                color: "white",
                                width: "100%"
                            }}
                        // onClick={sendAttendanceIntention}
                        />
                    </GridItem>
                </Grid>
            }
        />
    )
}

export default withWindowSize(DelegationProxyModal);