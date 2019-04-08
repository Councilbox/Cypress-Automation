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
                    error: response.errors[0].message === 'Evidence not found' ? this.props.translate.evidence_pending : this.props.translate.invalid_evidence_code,
                    loading: false,
                    data: null
                });
            }
            if (response.errors[0].code === 401) {
                return this.setState({
                    error: this.props.translate.you_cant_access_info,
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
        const primary = getPrimary();

        return (
            <NotLoggedLayout
                translate={this.props.translate}
                languageSelector={true}
            >
                <div style={{ width: '100%', overflow: 'auto' }}>
                     <div style={{ width: isMobile ? '100%' : '70%', margin: '4em auto', padding: '1em', display: 'block' }}>
                        {this.state.loading &&
                            <Card style={{ padding: "2em", margin: '1.5em' }} elevation={4}>
                                <LoadingSection />
                            </Card>
                        }
                        {this.state.error &&
                            <Card style={{ padding: "2em", margin: '1.5em' }} elevation={4}>
                                <div style={{ fontWeight: '700', color: 'red', marginTop: '1em', fonSize: '1.1em' }}>
                                    {this.state.error}
                                </div>
                            </Card>
                        }

                        {this.state.data &&
                            <Card style={{ padding: "2em", margin: '1.5em' }} elevation={4}>
                                <EvidenceContentDisplay content={this.state.data.content} txHash={this.state.data.cbxEvidence.tx_hash} />
                                <hr></hr>
                                <ExplorerLink txHash={this.state.data.cbxEvidence.tx_hash} translate={this.props.translate} />
                                <br />

                            </Card>
                        }
                    </div>
                </div>
            </NotLoggedLayout>
        )
    }
}


export const ExplorerLink = ({ txHash, translate }) => {
    return (
        <React.Fragment>
            {txHash ?
                <Button style={{ marginLeft: "1.2em" }} size="small" color="primary" href={`${EXPLORER_URL}/transaction/${txHash}`} target="_blank" rel="noreferrer noopener">
                    {translate.see_blockchain_explorer.toUpperCase()}
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
            {translate.read_details.toUpperCase()}
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
        <div style={{ marginBottom: '1em' }}>
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
        <div style={{ marginBottom: '1em' }}>
            <div style={{ fontWeight: '700', fontSize: '1.2em' }}>
                {translate.agenda_point}
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
                                    <b>{`${translate.company}:`}</b>
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
                                    <b>{`${translate.company}:`}</b>
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
                <ToolTip text={txHash ? translate.blockchain_registered_content : translate.blockchain_pending_content}>
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
    const types = {
        'CLOSE_POINT_DISCUSSION': 'close_point',
        'CLOSE_VOTING': 'closed_votings',
        'CONVENE_COUNCIL_WITH_NOTICE': 'convene_council_with_notice',
        'CONVENE_COUNCIL_WITHOUT_NOTICE': 'convene_council_without_notice',
        'END_COUNCIL': 'finish_council',
        'LOGIN': 'login_to_enter',
        'OPEN_COUNCIL_ROOM': 'room_opened',
        'OPEN_POINT_DISCUSSION': 'discuss_agenda',
        'OPEN_VOTING': 'active_votings',
        'PARTICIPANT_CONNECT': 'participant_enter_room',
        'PARTICIPANT_DISCONNECT': 'participant_disconnect',
        'PARTICIPANT_LOGIN': 'participant_login',
        'PARTICIPANT_SIGNED': 'participant_signed',
        'REFUSED_DELEGATION': 'refused_delegation',
        'REOPEN_VOTING': 'reopen_voting',
        'SEND_ACCESS_KEY_EMAIL': 'send_access_key_email',
        'SEND_ACCESS_KEY_SMS': 'send_access_key_phone',
        'SEND_NOTICE': 'send_convene',
        'SEND_ROOM_ACCESS_EMAIL': 'send_room_access_email',
        'START_COUNCIL': 'start_council',
        'UPDATE_VOTE': 'update_vote',
        'VOTE': 'has_voted',
        'VOTE_DELEGATION': 'vote_delegation',
        default: () => type
    }

    return types[type]? types[type] : types.default();
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
