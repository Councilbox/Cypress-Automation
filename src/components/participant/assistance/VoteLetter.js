import React from 'react';
import { AlertConfirm, Grid, GridItem, ReactSignature, BasicButton, Scrollbar, HelpPopover } from '../../../displayComponents';
import { getSecondary, getPrimary } from '../../../styles/colors';
import withWindowSize from '../../../HOCs/withWindowSize';
import { moment } from '../../../containers/App';
import { Card } from 'material-ui';
import { isMobile } from "../../../utils/screen";
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { replaceDocsTags } from './DelegationProxyModal';


const VoteLetter = ({ open, council, client, innerWidth, delegation, translate, participant, requestClose, action }) => {
    const signature = React.useRef();
    const [loading, setLoading] = React.useState(false);
    const [existingProxy, setExistingProxy] = React.useState(null);
    const signatureContainer = React.useRef();
    const [signed, setSigned] = React.useState(false);
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
            setSigned(true);
            signature.current.fromDataURL(response.data.proxy.signature);
            signaturePreview.current.fromDataURL(response.data.proxy.signature);
        }
    }, [participant.id]);

    React.useEffect(() => {
        if(open){
            getProxy();
        }
    }, [getProxy, open]);

	React.useEffect(() => {
		let timeout = setTimeout(() => {
			if (signatureContainer.current) {
				setCanvasSize({
					width: (signatureContainer.current.getBoundingClientRect().width),
					height: (signatureContainer.current.getBoundingClientRect().height),
                });
            }
		}, 150)
		return () => clearTimeout(timeout);

    }, [open, innerWidth])

    const getSignaturePreview = () => {
        signaturePreview.current.fromDataURL(signature.current.toDataURL());
    }

    const sendVote = async signature => {
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
        const proxyTranslate = proxyTranslations[translate.selectedLanguage]? proxyTranslations[translate.selectedLanguage] : proxyTranslations.es;
        
        const getBody = () => {
            const docBody = <>
                <div>{proxyTranslate.intro}</div>
                <br/>
                <div>{proxyTranslate.body({
                    company: council.company
                })}
                </div>
                <br/>
                <br/>
                <div>{proxyTranslate.salute}</div>
            </>


            if(council.statute.doubleColumnDocs){
                return (
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                        {council.statute.voteLetter?
                            <div dangerouslySetInnerHTML={{ __html: replaceDocsTags(council.statute.voteLetter, { council, participant }) }} style={{width: '48%'}}></div>
                        :
                            docBody
                        }
                        {council.statute.voteLetterSecondary?
                            <div dangerouslySetInnerHTML={{ __html: replaceDocsTags(council.statute.voteLetterSecondary, { council, participant }) }} style={{width: '48%'}}></div>
                        :
                            docBody
                        }
                    </div>
                )
            }
            

            if(council.statute.voteLetter){
                return <div dangerouslySetInnerHTML={{ __html: council.statute.voteLetter }}></div>
            }

            return docBody;
        }
        
        
        return (
            <Card style={{padding: '0.6em', paddingBottom: '1em', width: '96%', marginLeft: '2%'}}>
                <div>{council.company.businessName}</div>
                <div>{council.street}</div>
                <div>{council.countryState} {council.countryState}</div>
                <div>{council.country}</div>
                <br/>
                <div>{proxyTranslate.in} {council.city}, {proxyTranslate.at} {moment(new Date()).format('LL')}</div>
                <br/><br/>
                {getBody()}
                <ReactSignature
                    height={80}
                    width={160}
                    dotSize={1}
                    disabled
                    ref={signaturePreview}
                />
                _________________________________
                <div>{proxyTranslate.sir}  {participant.name} {participant.surname} </div>
            </Card>
        )
    }

    const disableSendButton = () => {
        return existingProxy && (delegation && existingProxy.delegateId === delegation.id);
    }

    return (
        <AlertConfirm
            open={open}
            loadingAction={loading}
            bodyStyle={{
                width: isMobile? '100%' : council.statute.doubleColumnDocs? "80vw" : "60vw",
            }}
            PaperProps={{
                style: {
                    margin: isMobile? 0 : '32px'
                }
            }}
            requestClose={requestClose}
            title={translate.create_proxy_document}
            bodyText={
                <Grid style={{ marginTop: "15px", height: "100%" }}>
                    <GridItem xs={12} md={6} lg={7} style={{ ...(isMobile? {} : { height: "70vh" }) }} >
                        {isMobile? 
                            proxyPreview()
                        :
                            <Scrollbar>
                                {proxyPreview()}
                            </Scrollbar>
                        }

                    </GridItem>
                    <GridItem xs={12} md={6} lg={5}>
                        <div
                            style={{
                                border: 'solid 2px silver',
                                color: '#a09aa0',
                                padding: "0",
                                borderRadius: '3px',
                                marginBottom: "1em",
                                height: isMobile? '250px' : '300px'
                            }}
                            onMouseDown={() => setSigned(true)}
                            ref={signatureContainer}
                        >
                            {!signed &&
                                <div style={{ position: 'absolute', margin: '0.6em'}}>{translate.sign_to_create_proxy}.</div>
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
                                text={disableSendButton()? `${translate.tooltip_sent} ${moment(existingProxy.date).format('LLL')}` : translate.send_signed_document}
                                color={!signed || disableSendButton()? 'silver' : secondary}
                                disabled={!signed || disableSendButton()}
                                loading={loading}
                                textStyle={{
                                    color: "white",
                                    width: "65%"
                                }}
                                onClick={() => sendVote(signature.current.toDataURL())}
                            />
                        </div>

                    </GridItem>
                </Grid>
            }
        />
    )
}

export default withApollo(withWindowSize(VoteLetter));




const proxyTranslations = {
    es: {
        at: 'a',
        body: ({ company }) => (`El abajo firmante, en su condición de miembro del Consejo de Administración de${
            company.businessName}, tras ser informado por el Secretario/no-miembro del Consejo de la urgencia de adoptar unos acuerdos${
                ''} y a la vista de las dificultades de celebrar inmediatamente una reunión del Consejo de Administración de la Sociedad, (1)${
                ''} acepta seguir el procedimiento de votación por escrito y sin sesión, previsto en el articulo 100.3 del Reglamento del Registro${
                ''} Mercantil, (2) vota a favor de los acuerdos contenidos en el borrador de acta adjunto y (3) aprueba el texto del acta${
                ''} para el caso de que los acuerdos sean finalmente adoptados por el Consejo.`),
        in: 'En',
        intro: 'Estimados Señores:',
        salute: 'Atentamente',
        sir: 'D.'
    },
    en: {
        at: 'at',
        body: ({ company }) => (`I, the undersigned, member of the board of directors of ${
            company.businessName}, am aware of the urgency of approving certain resolutions, and in view of the difficulties of immediately${
                ''} holding a Company board of directors meeting, hereby agree (1) to use the written voting process and not hold a meeting,${
                ''} as set forth in article 100.3 of the Commercial Registry Regulations, and (2) vote in favour of the resolution in the draft${
                ''} minutes attached hereto. In addition, (3) I approve the contents of the minutes in the event that the resolution of the${
                ''} minutes is finally adopted by the board.`),
        in: 'In',
        intro: 'Dear Sirs,',
        salute: 'Yours faithfully,',
        sir: 'Mr.'
    }
}