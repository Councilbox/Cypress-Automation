import React from 'react';
import { AlertConfirm, Grid, GridItem, ReactSignature, BasicButton, Scrollbar, HelpPopover } from '../../../displayComponents';
import { getSecondary, getPrimary } from '../../../styles/colors';
import withWindowSize from '../../../HOCs/withWindowSize';
import { moment } from '../../../containers/App';
import { Card } from 'material-ui';
import { isMobile } from "../../../utils/screen";


const DelegationProxyModal = ({ open, council, innerWidth, delegation, translate, participant, requestClose, action }) => {
    const signature = React.useRef();
    const [loading, setLoading] = React.useState(false);
    const signatureContainer = React.useRef();
    const [signed, setSigned] = React.useState(false);
    const primary = getPrimary();
    const signaturePreview = React.useRef();
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
                });
            }
		}, 150)
		return () => clearTimeout(timeout);

    }, [open, innerWidth])

    const getSignaturePreview = () => {
        signaturePreview.current.fromDataURL(signature.current.toDataURL());
    }

    const sendDelegationData = async signature => {
        setLoading(true);
        await action(signature);
        setLoading(false);
        requestClose();
    }

    React.useEffect(() => {
        if (signaturePreview.current) {
            signaturePreview.current.off();
        }
    }, [signaturePreview.current]);
    const clear = () => {
        setSigned(false);
        signaturePreview.current.clear();
		signature.current.clear();
    };

    //TRADUCCION TODO
    return (
        <AlertConfirm
            open={open}
            loadingAction={loading}
            bodyStyle={{
                width: isMobile? '100%' : "60vw",
            }}
            PaperProps={{
                style: {
                    margin: isMobile? 0 : '32px'
                }
            }}
            requestClose={requestClose}
            title={"Generación de documento de delegación"}
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
                                    <ReactSignature
                                        height={80}
                                        width={160}
                                        dotSize={1}
                                        disabled
                                        ref={signaturePreview}
                                    />
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
                            }} onClick={() => sendDelegationData()}>
                                Enviar intención y descargar PDF para entrega presencial
                            </div>
                            <HelpPopover
                                title={'Información'}
                                content={
                                    <div>
                                        Esta acción marcará la intención de asistencia como "Delegación",
                                        pero la delegación tendrá que ser realizada por el administrador de sala con la entrega del documento firmado
                                    </div>
                                }
                            />
                        </div>
                        <div
                            style={{
                                border: 'solid 1px #979797',
                                color: '#a09aa0',
                                padding: "0.6em",
                                marginBottom: "1em",
                                height: 'calc( 100% - 7em )'
                            }}
                            onMouseDown={() => setSigned(true)}
                            ref={signatureContainer}
                        >
                            {!signed &&
                                <div style={{ position: 'absolute'}}>Firme en este recuadro para hacer efectiva la firma electrónica en el documento.</div>
                            }
                            <div>
                                <ReactSignature
                                    height={canvasSize.height}
                                    width={canvasSize.width}
                                    dotSize={1}
                                    onEnd={() => {
                                        setSigned(true);
                                    }}
                                    onMove={() => {
                                        getSignaturePreview();
                                    }}
                                    style={{}}
                                    ref={signature}
                                />
                            </div>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <BasicButton
                                text={translate.clean}
                                color={'white'}
                                type='flat'
                                textStyle={{
                                    color: secondary,
                                    border: `1px solid ${secondary}`,
                                    width: "30%"
                                }}
                                onClick={clear}
                            />
                            <BasicButton
                                text={'Enviar documento firmado'}
                                color={!signed? 'silver' : secondary}
                                disabled={!signed}
                                loading={loading}
                                textStyle={{
                                    color: "white",
                                    width: "65%"
                                }}
                                onClick={() => sendDelegationData(signature.current.toDataURL())}
                            />
                        </div>

                    </GridItem>
                </Grid>
            }
        />
    )
}

export default withWindowSize(DelegationProxyModal);