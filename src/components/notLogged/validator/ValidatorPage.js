import React from 'react';
import { NotLoggedLayout, TextInput, BasicButton, SectionTitle, LoadingSection, Grid, GridItem } from '../../../displayComponents';
import withTranslations from '../../../HOCs/withTranslations';
import { Card } from 'material-ui';
import { isMobile } from 'react-device-detect';
import { getPrimary } from '../../../styles/colors';
import { EXPLORER_URL } from '../../../config';
import { moment } from '../../../containers/App';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';

//3f055426-0770-419c-a609-e42efe1a4fe1

class ValidatorPage extends React.Component {

    state = {
        code: this.props.match.params.uuid,
        error: '',
        data: ''
    }

    async componentDidMount(){
        if(this.props.match.params.uuid){
            await this.searchCode(this.props.match.params.uuid)
        }
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.match.params.uuid){
            if(this.props.match.params.uuid !== prevProps.match.params.uuid){
                this.searchCode(this.props.match.params.uuid);
            }
        }

    }

    componentWillUnmount(){
        console.log('se desmonta');
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

        if(key.keyCode === 13){
            if(this.state.code !== this.props.match.params.uuid){
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

        console.log(response)

        if(response.errors){
            if(response.errors[0].code === 404){
                return this.setState({
                    error: response.errors[0].message === 'Evidence not found'? 'Evidencia pendiente de ser procesada' : 'El código no corresponde con ninguna evidencia de Councilbox', //TRADUCCION
                    loading: false,
                    data: null
                });
            }
            if(response.errors[0].code === 401){
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

    render(){
        //TRADUCCION

        console.log(this.state.data);
        const primary = getPrimary();
        return(
            <NotLoggedLayout
				translate={this.props.translate}
				languageSelector={true}
			>
                <div style={{width: '100%', overflow: 'auto'}}>
                    <Card style={{width: isMobile? '100%' : '70%', margin: '4em auto', padding: '1em', display: 'block'}}>
                        <SectionTitle
                            text="Introduce el código a comprobar"
                            color={primary}
                        />
                        <TextInput
                            floatingText="Código"
                            value={this.state.code}
                            onChange={this.updateCode}
                            onKeyUp={this.handleEnter}
                        />
                        <BasicButton
                            text={'Enviar'}
                            onClick={this.sendCode}
                            color={primary}
                            textStyle={{ color: 'white', fontWeight: '700'}}
                        />
                        {this.state.loading &&
                            <LoadingSection />
                        }
                        {this.state.error &&
                            <div style={{fontWeight: '700', color: 'red', marginTop: '1em', fonSize: '1.1em'}}>
                                {this.state.error}
                            </div>
                        }
                        {this.state.data &&
                            <div style={{fontWeight: '700', marginTop: '1em', fonSize: '1.1em', wordWrap: 'break-word'}}>
                                {this.state.data.cbxEvidence.tx_hash &&
                                    <TransactionResult validated={this.state.data.validated} />
                                }
                                <ExplorerLink txHash={this.state.data.cbxEvidence.tx_hash}/>
                                <br/>
                                <EvidenceContentDisplay content={this.state.data.content} />
                            </div>
                        }
                    </Card>
                </div>
			</NotLoggedLayout>
        )
    }
}

const TransactionResult = validated => {

    return(
        <Card style={{padding: '0.9em', color: 'green'}}>
            {validated?
                'Contenido registrado en blockchain'
                :
                'Contenido pendiente de registro en blockchain'
            }
        </Card>
    )
}

export const ExplorerLink = ({ txHash, translate }) => {
    return(
        <Card style={{padding: '0.9em', marginTop: '0.6em'}}>
            {txHash?
                <a href={`${EXPLORER_URL}/transaction/${txHash}`} target="_blank" rel="noreferrer noopener" >
                    <Grid>
                        <GridItem xs={12} md={3} lg={2} style={{fontWeight: '700'}}>Link al explorador de bloques</GridItem>
                        <GridItem xs={12} md={9} lg={10}>
                            <i className="fa fa-external-link" aria-hidden="true"></i>
                        </GridItem>
                    </Grid>
                </a>
            :
                'Transacción pendiente de registro'
            }

        </Card>
    )
}

export const ValidatorLink = ({ prvHash, translate }) => {
    return(
        <Card style={{padding: '0.9em', marginTop: '0.6em'}}>
            <a href={`${window.location.origin}/validator/${prvHash}`} target="_blank" rel="noreferrer noopener" >
                <Grid>
                    <GridItem xs={12} md={12} lg={12} style={{fontWeight: '700'}}>Link al visualizador de evidencias de Councilbox {/*TRADUCCION*/}<i className="fa fa-external-link" aria-hidden="true" style={{marginLeft: '1em'}}></i></GridItem>
                </Grid>
            </a>
        </Card>
    )
}

const EvidenceContentDisplay = data => {
    const parsedContent = JSON.parse(data.content);
    return (
        <div>
            {getEvidenceComponent(parsedContent)}
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

export const CouncilEvidence = withTranslations()(({ evidence, translate }) => {
    return (
        <div>
            <EvidenceDisplay evidence={evidence} translate={translate} />
            {evidence.data.user &&
                <UserSection evidence={evidence} translate={translate} />
            }
            {evidence.data.agendaPoint &&
                <AgendaPointSection evidence={evidence.data} translate={translate} />
            }
            {evidence.data.participant?
                <React.Fragment>
                    <CouncilSection evidence={evidence.data.participant} translate={translate} />
                    <ParticipantSection evidence={evidence} translate={translate} />
                </React.Fragment>
            :
                <CouncilSection evidence={evidence.data} translate={translate} />
            }
        </div>
    )
});

const UserSection = ({ evidence, translate }) => {
    return (
        <React.Fragment>
            <h5 style={{marginTop: '1em'}}>{translate.user_data}</h5>
            <Grid>
                <GridItem xs={12} md={3} lg={2} style={{fontWeight: '700'}}>{translate.email}</GridItem>
                <GridItem xs={12} md={9} lg={10}>{evidence.data.user.email}</GridItem>
                <GridItem xs={12} md={3} lg={2} style={{fontWeight: '700'}}>{translate.name}</GridItem>
                <GridItem xs={12} md={9} lg={10}>{evidence.data.user.name}</GridItem>
                <GridItem xs={12} md={3} lg={2} style={{fontWeight: '700'}}>{translate.surname}</GridItem>
                <GridItem xs={12} md={9} lg={10}>{evidence.data.user.surname}</GridItem>

            </Grid>
        </React.Fragment>
    )
}

const ParticipantSection = ({ evidence, translate }) => {
    return (
        <React.Fragment>
            <h5 style={{marginTop: '1em'}}>{translate.participant}</h5>
            <Grid>
                <GridItem xs={12} md={3} lg={2} style={{fontWeight: '700'}}>{translate.email}</GridItem>
                <GridItem xs={12} md={9} lg={10}>{evidence.data.participant.email}</GridItem>
                <GridItem xs={12} md={3} lg={2} style={{fontWeight: '700'}}>{translate.name}</GridItem>
                <GridItem xs={12} md={9} lg={10}>{evidence.data.participant.name}</GridItem>
                <GridItem xs={12} md={3} lg={2} style={{fontWeight: '700'}}>{translate.surname}</GridItem>
                <GridItem xs={12} md={9} lg={10}>{evidence.data.participant.surname}</GridItem>
                <GridItem xs={12} md={3} lg={2} style={{fontWeight: '700'}}>{translate.dni}</GridItem>
                <GridItem xs={12} md={9} lg={10}>{evidence.data.participant.dni}</GridItem>
            </Grid>
        </React.Fragment>
    )
}

const AgendaPointSection = ({ evidence, translate }) => {
    console.log(evidence);
    return (
        <React.Fragment>
            <h5 style={{marginTop: '1em'}}>{'Punto del día' /*TRADUCCION*/}</h5>
            <Grid>
                <GridItem xs={12} md={3} lg={2} style={{fontWeight: '700'}}>{translate.type}</GridItem>
                <GridItem xs={12} md={9} lg={10}>{translate[getTypeTranslation(evidence.agendaPoint.type)]}</GridItem>
                <GridItem xs={12} md={3} lg={2} style={{fontWeight: '700'}}>{translate.name}</GridItem>
                <GridItem xs={12} md={9} lg={10}>{evidence.agendaPoint.name}</GridItem>
            </Grid>
        </React.Fragment>
    )
}

const CouncilSection = ({ evidence, translate }) => {
    return (
        <React.Fragment>
            <h5 style={{marginTop: '1em'}}>{translate.council_info}</h5>
            {evidence.agendaPoint &&
                <Grid>
                    {evidence.agendaPoint.company &&
                        <React.Fragment>
                            <GridItem xs={12} md={3} lg={2} style={{fontWeight: '700'}}>Compañía {/*TRADUCCION*/}</GridItem>
                            <GridItem xs={12} md={9} lg={10}>{evidence.agendaPoint.company.businessName}</GridItem>
                        </React.Fragment>
                    }
                    <GridItem xs={12} md={3} lg={2} style={{fontWeight: '700'}}>{translate.name}</GridItem>
                    <GridItem xs={12} md={9} lg={10}>{evidence.agendaPoint.council.name}</GridItem>
                    <GridItem xs={12} md={3} lg={2} style={{fontWeight: '700'}}>{translate.date_real_start}</GridItem>
                    <GridItem xs={12} md={9} lg={10}>{moment(evidence.agendaPoint.council.dateRealStart).format('LLL')}</GridItem>
                </Grid>
            }
            {evidence.council &&
                <Grid>
                    {evidence.council.company &&
                        <React.Fragment>
                            <GridItem xs={12} md={3} lg={2} style={{fontWeight: '700'}}>Compañía {/*TRADUCCION*/}</GridItem>
                            <GridItem xs={12} md={9} lg={10}>{evidence.council.company.businessName}</GridItem>
                        </React.Fragment>
                    }
                    <GridItem xs={12} md={3} lg={2} style={{fontWeight: '700'}}>{translate.name}</GridItem>
                    <GridItem xs={12} md={9} lg={10}>{evidence.council.name}</GridItem>
                    <GridItem xs={12} md={3} lg={2} style={{fontWeight: '700'}}>{translate.date_real_start}</GridItem>
                    <GridItem xs={12} md={9} lg={10}>{moment(evidence.council.dateRealStart).format('LLL')}</GridItem>
                </Grid>
            }
        </React.Fragment>
    )
}

const EvidenceDisplay = ({ evidence, translate }) => {
    const type = getTranslateFieldFromType(evidence.data.type);
    return (
        <div>
            <h5>Contenido</h5>
            <Grid>
                <GridItem xs={12} md={3} lg={2} style={{fontWeight: '700'}}>{translate.type}</GridItem>
                <GridItem xs={12} md={9} lg={10}>{translate[type] || type || ''}</GridItem>
                <GridItem xs={12} md={3} lg={2} style={{fontWeight: '700'}}>Fecha de registro</GridItem>
                <GridItem xs={12} md={9} lg={10}>{moment(evidence.data.date).format('LLL')}</GridItem>
            </Grid>
        </div>
    )
};

export const getTranslateFieldFromType = type => {

    switch(type){
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


const getEvidenceComponent = evidence => {
    if(evidence.data.type === 'LOGIN'){
        return <UserEvidence evidence={evidence} />
    }

    return <CouncilEvidence evidence={evidence} />
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
