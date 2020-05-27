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
        const proxyTranslate = proxyTranslations[translate.selectedLanguage]? proxyTranslations[translate.selectedLanguage] : proxyTranslations.es;      
        
        const signature = (
            <ReactSignature
                height={80}
                width={160}
                dotSize={1}
                disabled
                ref={signaturePreview}
            />
        )

        const buildCustomProxy = proxy => {
            const segments = proxy.split('{{signature}}');

            if(segments.length === 1){
                return (
                    <>
                        <div dangerouslySetInnerHTML={{ __html: replaceDocsTags(proxy, { council, participant, delegate: delegation }) }}></div>
                        {signature}
                    </>
                )
            }

            return (
                segments.map((text, index) => {
                    return (
                        <>
                            {index > 0 &&
                                signature
                            }
                            <div dangerouslySetInnerHTML={{ __html: replaceDocsTags(text, { council, participant, delegate: delegation }) }}></div>
                            
                        </>
                    )
                })
            )
        }

        const getProxyBody = () => {
            const proxyBody = <>
                <br/>
                <div>{proxyTranslate.intro}</div>
                <br/>
                <div>{proxyTranslate.body({
                    council,
                    delegation
                })}
                </div>
                <br/>
                <br/>
                <div>{proxyTranslate.salute}</div>
                {signature}
                {!council.statute.proxy &&
                    <>
                        _________________________________
                        <div>{proxyTranslate.sir}  {participant.name} {participant.surname || ''} </div>
                    </>
                }
            </>

            if(council.statute.doubleColumnDocs){
                return (
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                        {council.statute.proxy?
                            <div style={{width: '48%'}}>
                                {buildCustomProxy(council.statute.proxy)}
                            </div>
                        :
                            proxyBody
                        }
                        {council.statute.proxySecondary?
                            <div style={{width: '48%'}}>
                                <div dangerouslySetInnerHTML={{ __html: replaceDocsTags(council.statute.proxySecondary, { council, participant, delegate: delegation }) }}></div>
                            </div>
                        :
                            proxyBody
                        }
                    </div>
                )
            }
            

            if(council.statute.proxy){
                return <div dangerouslySetInnerHTML={{ __html: council.statute.proxy }}></div>
            }

            return proxyBody;
        }
        
        return (
            delegation &&
                <Card style={{padding: '0.6em', paddingBottom: '1em', width: '96%', marginLeft: '2%'}}>
                    <div>{council.company.businessName}</div>
                    <div>{council.street}</div>
                    <div>{council.countryState} {council.countryState}</div>
                    <div>{council.country}</div>
                    <br/>
                    <div>{proxyTranslate.in} {council.city}, {proxyTranslate.at} {moment(new Date()).format('LL')}</div>
                    <br/>
                    {getProxyBody()}
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
                    <GridItem xs={12} md={6} lg={5} >
                        <DownloadUnsignedProxy
                            translate={translate}
                            action={sendDelegationData}
                            participant={participant}
                            delegation={delegation}
                        />
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




const proxyTranslations = {
    es: {
        at: 'a',
        body: ({ council, delegation }) => (`No pudiendo asistir a la ${council.name} de ${council.company.businessName} convocada${
        ' '}para el próximo día ${moment(council.dateStart).format('LL')} a${
        ' '}las ${moment(council.dateStart).format('h:mm:ss')} horas, en ${council.street}, en${
        ' '}primera convocatoria, o bien el ${moment(council.dateStart2ndCall).format('LL')} a${
        ' '}las ${moment(council.dateStart2ndCall).format('h:mm:ss')} horas${
        ' '}en el mismo lugar, en segunda convocatoria, delego mi representación y voto en favor de ${
        ' '}D./ ${delegation.name} ${delegation.surname || ''} para que me represente en dicha reunión sin limitación de facultad de voto.`),
        in: 'En',
        intro: 'Distinguido/s Señor/es:',
        salute: 'Le saluda muy atentatamente',
        sir: 'D.'
    },
    cat: {
        at: 'a',
        body: ({ council, delegation }) => (`Malauradament no poden assistir a la ${council.name} d'${council.company.businessName} convocada${
        ' '}per el pròxim dia ${moment(council.dateStart).format('LL')} a${
        ' '}les ${moment(council.dateStart).format('h:mm:ss')} horas, ${council.statute.hasSecondCall === 1? `en ${council.street}, en${
            ' '}primera convocatòria, o bé el ${moment(council.dateStart2ndCall).format('LL')} a${
            ' '}les ${moment(council.dateStart2ndCall).format('h:mm:ss')} horas${
            ' '}en la mateixa direcció, en segona convocatòria` : ''}. Delego la meva representació y el meu vot en favor de ${
        ' '}D./ ${delegation.name} ${delegation.surname || ''} per que pugui representar-me en la citada reunió sense cap limitació de facultat de vot.`),
        in: 'En',
        intro: 'Distingits Senyors/res:',
        salute: 'Salutacions',
        sir: 'D,'
    }
}




export const replaceDocsTags = (text, data = {}) => {
    if(!text){
        return '';
    }

    text = text.replace(/{{participantName}}/g, `${data.participant.name} ${data.participant.surname || ''}`);
    if(data.delegate){
        text = text.replace(/{{delegateName}}/g, `${data.delegate.name} ${data.delegate.surname || ''}`);
    }
    text = text.replace(/{{business_name}}/g, data.council.company.businessName);
    text = text.replace(/{{city}}/g, data.council.city);
    text = text.replace(/{{address}}/g, data.council.street);
    text = text.replace(/{{dateFirstCall}}/g, moment(data.council.dateStart).format('DD/MM/YYYY hh:mm'));
    text = text.replace(/{{dateSecondCall}}/g, moment(data.council.dateStart2ndCall).format('DD/MM/YYYY hh:mm'));

    return text;
}