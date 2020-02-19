import React from 'react';
import { AlertConfirm, Grid, GridItem, ReactSignature, BasicButton } from '../../../displayComponents';
import { getSecondary, getPrimary } from '../../../styles/colors';
import withWindowSize from '../../../HOCs/withWindowSize';


const DelegationProxyModal = ({ open, council, innerWidth, participant, requestClose, action }) => {
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
                width: "50vw",
                // minWidth: "50vw",
            }}
            requestClose={requestClose}
            title={"Generación de documento delegado"}
            bodyText={
                <Grid style={{ marginTop: "15px", height: "100%" }}>
                    <GridItem xs={12} md={6} lg={6} style={{ height: "100%" }} >
                        <div style={{
                            boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
                            padding: "1em",
                            color: "#000000",
                            height: "100%"
                        }}>
                            <div>{council.company.businessName}</div>
                            <div>{council.street}</div>
                            <div>{council.countryState} {council.countryState}</div>
                            <div>{council.country}</div>

                            <div>En Salamanca, a 05 de Febrero de 2020</div>

                            <div>Distinguido/s Señor/es:</div>

                            <div>
                                No pudiendo asistir a la Junta General Extraordinaria de
                            Accionistas  de OLIVO ENTERPRISE, S.A.
                            convocada para el próximo día 14 de Marzo de
                            2020 a las 12:34 horas, en C/ Martin,
                            en primera convocatoria, o bien el 14 de Marzo de 2020 a las 13.00
                            horas en el mismo lugar, en segunda convocatoria,
                            delego mi representación y voto en favor de D./ Aaron Fuentes Garcia para que me
                            represente en dicha reunión sin limitación de facultad de voto.
                            </div>

                            <div>Le saluda muy atentamente,</div>
                            _________________________________
                            <div>D.  {participant.name} {participant.surname} </div>
                        </div>
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