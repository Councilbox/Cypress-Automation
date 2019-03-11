import React from 'react';
import { NotLoggedLayout, TextInput, BasicButton, SectionTitle, LoadingSection, Grid, GridItem, DropDownMenu } from '../../../displayComponents';
import withTranslations from '../../../HOCs/withTranslations';
import { Card, Button, CardHeader, Avatar, CardContent, IconButton, Popover } from 'material-ui';
import { isMobile } from 'react-device-detect';
import { getPrimary } from '../../../styles/colors';
import { EXPLORER_URL } from '../../../config';
import { moment } from '../../../containers/App';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import ToolTip from '../../../displayComponents/Tooltip';

//3f055426-0770-419c-a609-e42efe1a4fe1

class ValidatorPage extends React.Component {

    state = {
        code: this.props.match.params.uuid,
        error: '',
        data: ''
    }

    async componentDidMount() {
        if (this.props.match.params.uuid) {
            await this.searchCode(this.props.match.params.uuid)
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.match.params.uuid) {
            if (this.props.match.params.uuid !== prevProps.match.params.uuid) {
                this.searchCode(this.props.match.params.uuid);
            }
        }

    }

    updateCode = event => {
        this.setState({
            code: event.target.value
        });
    }

    sendCode = () => {
        this.props.history.push(`/validator/${this.state.code}`);
    }

    handleEnter = event => {
        const key = event.nativeEvent;

        if (key.keyCode === 13) {
            if (this.state.code !== this.props.match.params.uuid) {
                this.sendCode();
            }
        }
    }

    searchCode = async code => {
        this.setState({
            loading: true
        });
        const response = await this.props.client.query({
            query: getData,
            variables: {
                code: code
            }
        });

        if(response.errors){
            if(response.errors[0].code === 404){
                return this.setState({
                    error: response.errors[0].message === 'Evidence not found' ? 'Evidencia pendiente de ser procesada' : 'El código no corresponde con ninguna evidencia de Councilbox', //TRADUCCION
                    loading: false,
                    data: null
                });
            }
            if (response.errors[0].code === 401) {
                return this.setState({
                    error: 'No tienes acceso a esta información',
                    loading: false,
                    data: null
                });
            }
        }

        this.setState({
            loading: false,
            error: '',
            data: response.data.evidenceContent
        })
    }

    render() {
        //TRADUCCION

        const primary = getPrimary();

        return (
            <NotLoggedLayout
                translate={this.props.translate}
                languageSelector={true}
            >
                <div style={{ width: '100%', overflow: 'auto' }}>
                    {/* <Card style={{ width: isMobile ? '100%' : '70%', margin: '4em auto', padding: '1em', display: 'block' }}> */}
                     <div style={{ width: isMobile ? '100%' : '70%', margin: '4em auto', padding: '1em', display: 'block' }}>

                        {/* <TextInput
                            floatingText="Código"
                            value={this.state.code}
                            onChange={this.updateCode}
                            onKeyUp={this.handleEnter}
                        />
                        <BasicButton
                            text={'Enviar'}
                            onClick={this.sendCode}
                            color={primary}
                            textStyle={{ color: 'white', fontWeight: '700' }}
                        /> */}
                        {this.state.loading &&
                            <LoadingSection />
                        }
                        {this.state.error &&
                            <div style={{ fontWeight: '700', color: 'red', marginTop: '1em', fonSize: '1.1em' }}>
                                {this.state.error}
                            </div>
                        }

                        {this.state.data &&
                            // <div style={{ fontWeight: '700', marginTop: '1em', fonSize: '1.1em', wordWrap: 'break-word' }}>
                            <Card style={{ padding: "2em", margin: '1.5em' }} elevation={4}>
                                <EvidenceContentDisplay content={this.state.data.content} txHash={this.state.data.cbxEvidence.tx_hash} />
                                <hr></hr>
                                {/* {this.state.data.cbxEvidence.tx_hash &&
                                    <TransactionResult validated={this.state.data.validated} />
                                }Contenido registrasdo en blockchain */}
                                <ExplorerLink txHash={this.state.data.cbxEvidence.tx_hash} /> {/*Explorador*/}
                                <br />

                            </Card>
                            // </div>
                        }
                    {/* </Card> */}
                </div>
                </div>
            </NotLoggedLayout>
        )
    }
}

const TransactionResult = validated => {

    return (
        <div>
            {validated ?
                <div style={{ display: "flex" }}>
                    <i className="material-icons" style={{ width: '30px', color: "green" }}>
                        verified_user
                    </i>
                    <div style={{ lineHeight: "2" }}>Contenido registrado en blockchain</div>
                </div>
                :
                <div style={{ display: "flex" }}>
                    <i className="material-icons" style={{ width: '20px' }}>
                        query_builder
                    </i>
                    <div style={{ lineHeight: "2" }}>Contenido pendiente de registro en blockchain</div>
                </div>
            }
        </div>
    )
}

export const ExplorerLink = ({ txHash, translate }) => {
    return (
        <React.Fragment>
            { /*Boton de Explorador*/}
            {txHash ?
                <Button style={{ marginLeft: "1.2em" }} size="small" color="primary" href={`${EXPLORER_URL}/transaction/${txHash}`} target="_blank" rel="noreferrer noopener">{/*TRADUCCION*/}
                    VER EN BLOCKCHAIN
                </Button>
                :
                ''
            }
        </React.Fragment>
    )
}

export const ValidatorLink = ({ prvHash, translate }) => {
    const primary = getPrimary();
    return (
        <Button size="small" color="primary" href={`${window.location.origin}/evidence/${prvHash}`} target="_blank" rel="noreferrer noopener">
            VER DETALLES {/*TRADUCCION*/}{/* Link al visualizador de evidencias de Councilbox */}
        </Button>
    )
}

const EvidenceContentDisplay = (data, txHash) => {
    const parsedContent = JSON.parse(data.content);
    return (
        <div>
            {getEvidenceComponent(parsedContent, txHash)}
        </div>
    )
}

const UserEvidence = withTranslations()(({ evidence, translate }) => {
    return (
        <div>
            <EvidenceDisplay evidence={evidence} translate={translate} />
            <UserSection evidence={evidence} translate={translate} />
        </div>
    )
});

export const CouncilEvidence = withTranslations()(({ evidence, translate, txHash }) => {
    const primary = getPrimary()
    return (
        <React.Fragment>
            <CardHeader
                avatar={
                    <EvidenceDisplay evidence={evidence} translate={translate} txHash={txHash} />
                }
            />
            <hr></hr>
            <CardContent style={{ paddingBottom: '10px' }}>
                {evidence.data.user &&
                    <UserSection evidence={evidence} translate={translate} />
                }
                {evidence.data.agendaPoint &&
                    <AgendaPointSection evidence={evidence.data} translate={translate} />
                }
                {evidence.data.participant ?
                    <React.Fragment>
                        <CouncilSection evidence={evidence.data.participant} translate={translate} />
                        <ParticipantSection evidence={evidence} translate={translate} />
                    </React.Fragment>
                    :
                    <CouncilSection evidence={evidence.data} translate={translate} />
                }
            </CardContent>
        </React.Fragment>
    )
});

const UserSection = ({ evidence, translate }) => {
    return (
        <div style={{ /*paddingLeft: '1.5em' */ marginBottom: '1em' }}>
            {/* <h5>{translate.user_data}</h5> */}
            <div style={{ fontWeight: '700', fontSize: '1.2em' }}>
                {translate.user_data}
                <hr style={{ margin: '0.5em 0em' }}></hr>
            </div>
            <div>
                <div style={{ display: "flex" }}>
                    <div style={{ width: '100px' }}>
                        <b>{translate.email}:</b>
                    </div>
                    <div>
                        {evidence.data.user.email}
                    </div>
                </div>
                <div style={{ display: "flex" }}>
                    <div style={{ width: '100px' }}>
                        <b>{translate.name}:</b>
                    </div>
                    <div>
                        {evidence.data.user.name}
                    </div>
                </div>
                <div style={{ display: "flex" }}>
                    <div style={{ width: '100px' }}>
                        <b>{translate.surname}:</b>
                    </div>
                    <div>
                        {evidence.data.user.surname}
                    </div>
                </div>
            </div>
        </div>
    )
}

const ParticipantSection = ({ evidence, translate }) => {
    return (
        <div style={{ /*paddingLeft: '1.5em' */ marginBottom: '1em' }}>
            {/* <h5>{translate.user_data}</h5> */}
            <div style={{ fontWeight: '700', fontSize: '1.2em' }}>
                {translate.participant}
                <hr style={{ margin: '0.5em 0em' }}></hr>
            </div>
            <div>
                <div style={{ display: "flex" }}>
                    <div style={{ width: '100px' }}>
                        <b>{translate.email}:</b>
                    </div>
                    <div>
                        {evidence.data.participant.email}
                    </div>
                </div>
                <div style={{ display: "flex" }}>
                    <div style={{ width: '100px' }}>
                        <b>{translate.name}:</b>
                    </div>
                    <div>
                        {evidence.data.participant.name}
                    </div>
                </div>
                <div style={{ display: "flex" }}>
                    <div style={{ width: '100px' }}>
                        <b>{translate.surname}:</b>
                    </div>
                    <div>
                        {evidence.data.participant.surname}
                    </div>
                </div>
                <div style={{ display: "flex" }}>
                    <div style={{ width: '100px' }}>
                        <b>{translate.dni}:</b>
                    </div>
                    <div>
                        {evidence.data.participant.dni}
                    </div>
                </div>
            </div>
        </div>
    )
}

const AgendaPointSection = ({ evidence, translate }) => {
    return (
        <div style={{ /*paddingLeft: '1.5em'*/ marginBottom: '1em' }}>
            <div style={{ fontWeight: '700', fontSize: '1.2em' }}>
                {'Punto del día' /*TRADUCCION*/}
                <hr style={{ margin: '0.5em 0em' }}></hr>
            </div>

            <div style={{ display: "flex" }}>
                <div style={{ width: '100px' }}>
                    <b>{translate.type}:</b>
                </div>
                <div>
                    {translate[getTypeTranslation(evidence.agendaPoint.type)]}
                </div>
            </div>
            <div style={{ display: "flex" }}>
                <div style={{ width: '100px' }}>
                    <b>{translate.name}:</b>
                </div>
                <div>
                    {evidence.agendaPoint.name}
                </div>
            </div>

        </div>
    )
}

const CouncilSection = ({ evidence, translate }) => {
    return (
        <div style={{ /*paddingLeft: '1.5em'*/ marginBottom: '1em' }}>
            <div style={{ fontWeight: '700', fontSize: '1.2em' }}>
                {translate.council_info}
                <hr style={{ margin: '0.5em 0em' }}></hr>
            </div>
            <div>
                {evidence.agendaPoint &&
                    <React.Fragment>
                        {evidence.agendaPoint.company &&
                            <div style={{ display: "flex" }}>
                                <div style={{ width: '100px' }}>
                                    <b>Compañía:</b>{/*TRADUCCION*/}
                                </div>
                                <div>
                                    {evidence.agendaPoint.company.businessName}
                                </div>
                            </div>
                        }
                        <div style={{ display: "flex" }}>
                            <div style={{ width: '100px' }}>
                                <b>{translate.name}:</b>
                            </div>
                            <div>
                                {evidence.agendaPoint.council.name}
                            </div>
                        </div>
                        <div style={{ display: "flex" }}>
                            <div style={{ width: '100px' }}>
                                <b>{translate.date_real_start}:</b>
                            </div>
                            <div>
                                {moment(evidence.agendaPoint.council.dateRealStart).format('LLL')}
                            </div>
                        </div>
                    </React.Fragment>
                }
                {evidence.council &&
                    <React.Fragment>
                        {evidence.council.company &&
                            <div style={{ display: "flex" }}>
                                <div style={{ width: '100px' }}>
                                    <b>Compañía:</b>{/*TRADUCCION*/}
                                </div>
                                <div>
                                    {evidence.council.company.businessName}
                                </div>
                            </div>
                        }
                        <div style={{ display: "flex" }}>
                            <div style={{ width: '100px' }}>
                                <b>{translate.name}:</b>
                            </div>
                            <div>
                                {evidence.council.name}
                            </div>
                        </div>
                        <div style={{ display: "flex" }}>
                            <div style={{ width: '100px' }}>
                                <b>{translate.date_real_start}:</b>
                            </div>
                            <div>
                                {moment(evidence.council.dateRealStart).format('LLL')}
                            </div>
                        </div>
                    </React.Fragment>
                }
            </div>
        </div>
    )
}

const EvidenceDisplay = ({ evidence, translate, txHash }) => {
    const type = getTranslateFieldFromType(evidence.data.type);
    const primerasLetras = translate[type].split(' ').map(palabra => palabra.toUpperCase().substr(0, 1))

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ position: 'relative', width: '40px', marginRight: '1em' }}>
                <Avatar>
                    {primerasLetras}
                </Avatar>
                <ToolTip text={txHash ? 'Contenido registrado en blockchain' : 'Contenido pendiente de registro en blockchain'}>
                    <i className="material-icons" style={{ position: 'absolute', top: '60%', left: '60%', fontSize: '20px', color: txHash ? 'green' : 'red' }}>
                        {txHash ?
                            'verified_user'
                            :
                            'query_builder'
                        }
                    </i>
                </ToolTip>
            </div>
            <div>
                <div>
                    {translate[type] || type || ''}
                </div>
                <div>
                    {moment(evidence.data.date).format('LLL')}
                </div>
            </div>
        </div>
    )
};

export const getTranslateFieldFromType = type => {

    switch (type) {
        case 'START_COUNCIL':
            return 'start_council';
        case 'LOGIN':
            return 'login_to_enter';
        case 'OPEN_POINT_DISCUSSION':
            return 'discuss_agenda';
        case 'CLOSE_POINT_DISCUSSION':
            return 'close_point';
        case 'OPEN_VOTING':
            return 'active_votings';
        case 'CLOSE_VOTING':
            return 'closed_votings';
        case 'REOPEN_VOTING':
            return 'Reabrir votaciones';//TRADUCCION
        case 'END_COUNCIL':
            return 'finish_council';
        case 'VOTE':
            return 'has_voted';
        case 'UPDATE_VOTE':
            return 'Cambio de voto';//TRADUCCION
        case 'PARTICIPANT_LOGIN':
            return 'Login de participante';//TRADUCCION
        case 'PARTICIPANT_CONNECT':
            return 'Conexión del participante a la sala';//TRADUCCION
        case 'PARTICIPANT_DISCONNECT':
            return 'Desconexión del participante';//TRADUCCION
    }
}

const getTypeTranslation = type => {
    const translations = {
        INFORMATIVE: 'informative',
        NOMINAL: 'public_voting',
        ANONYMOUS: 'private_voting',
        NOMINAL_ACT: 'public_act',
        DEFAULT: 'custom_point'
    }

    return translations[type] || translations['default'];
}


const getEvidenceComponent = (evidence, txHash) => {
    if (evidence.data.type === 'LOGIN') {
        return <UserEvidence evidence={evidence} />
    }

    return <CouncilEvidence evidence={evidence} txHash={txHash} />
}

const getData = gql`
    query EvidenceContent($code: String!){
        evidenceContent(code: $code){
            userId
            participantId
            content
            type
            uuid
            validated
            cbxEvidence {
                evhash
                tx_hash
                prvhash
                uuid
                data
            }
        }
    }
`;

export default withApollo(withTranslations()(ValidatorPage));
