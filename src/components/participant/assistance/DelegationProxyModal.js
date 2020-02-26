import React from 'react';
import { AlertConfirm, Grid, GridItem, ReactSignature, BasicButton, Scrollbar, HelpPopover } from '../../../displayComponents';
import { getSecondary, getPrimary } from '../../../styles/colors';
import withWindowSize from '../../../HOCs/withWindowSize';
import { moment } from '../../../containers/App';
import { Card } from 'material-ui';
import { isMobile } from "../../../utils/screen";
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import DownloadUnsignedProxy from './DownloadUnsignedProxy';


const DelegationProxyModal = ({ open, council, client, innerWidth, delegation, translate, participant, requestClose, action }) => {
    const signature = React.useRef();
    const [loading, setLoading] = React.useState(false);
    const [existingProxy, setExistingProxy] = React.useState(null);
    const signatureContainer = React.useRef();
    const [signed, setSigned] = React.useState(false);
    const primary = getPrimary();
    const signaturePreview = React.useRef();
    const secondary = getSecondary();
    const [canvasSize, setCanvasSize] = React.useState({
		width: 0,
		height: 0
    });

    const getProxy = React.useCallback(async () => {
        const response = await client.query({
            query: gql`
                query proxy($participantId: Int!){
                    proxy(participantId: $participantId){
                        signature
                        date
                        delegateId
                    }
                }
            `,
            variables: {
                participantId: participant.id
            }
        });
        if(response.data.proxy && (delegation && response.data.proxy.delegateId === delegation.id)){
            setExistingProxy(response.data.proxy);
            signature.current.fromDataURL(response.data.proxy.signature);
        }
    }, [participant.id]);

    React.useEffect(() => {
        if(open && !existingProxy){
            getProxy();
        }
    }, [getProxy, open, existingProxy]);

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

    const proxyPreview = () => {
        return (
            delegation &&
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
        )
    }

    const disableSendButton = () => {
        return existingProxy && (delegation && existingProxy.delegateId === delegation.name);
    }

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
                    <GridItem xs={12} md={6} lg={6} style={{ ...(isMobile? {} : { height: "70vh" }) }} >
                        {isMobile? 
                            proxyPreview()
                        :
                            <Scrollbar>
                                {proxyPreview()}
                            </Scrollbar>
                        }

                    </GridItem>
                    <GridItem xs={12} md={6} lg={6} >
                        <DownloadUnsignedProxy
                            translate={translate}
                            action={sendDelegationData}
                            participant={participant}
                            delegation={delegation}
                        />
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
                                text={disableSendButton()? `Delegación enviada ${moment(existingProxy.date).format('LLL')}` : 'Enviar documento firmado'}
                                color={!signed || disableSendButton()? 'silver' : secondary}
                                disabled={!signed || disableSendButton()}
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

export default withApollo(withWindowSize(DelegationProxyModal));