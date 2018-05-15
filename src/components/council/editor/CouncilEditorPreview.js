import React, { Component, Fragment } from 'react';
import {
    BasicButton, LoadingSection, DropDownMenu, Grid, GridItem, AlertConfirm, TextInput
} from "../../../displayComponents";
import { getPrimary, getSecondary } from '../../../styles/colors';
import { withRouter } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import {
    councilStepSix,
    conveneCouncil,
    sendConveneTest,
    conveneWithoutNotice,
    sendPreConvene
} from '../../../queries';
import { Paper, Icon, MenuItem, Typography } from 'material-ui';
import FontAwesome from 'react-fontawesome';
import { bHistory } from '../../../containers/App';
import * as CBX from '../../../utils/CBX';
import { checkValidEmail } from '../../../utils/validation';
import { toast } from 'react-toastify';


class CouncilEditorPreview extends Component {

    constructor(props) {
        super(props);
        this.state = {
            conveneTestModal: false,
            conveneTestSuccess: false,
            preConveneModal: false,
            preConveneSuccess: false,
            sendConveneWithoutNoticeModal: false,
            conveneWithoutNoticeSuccess: false,
            data: {
                conveneTestEmail: ''
            },

            errors: {
                conveneTestEmail: ''
            }
        }
    }

    componentDidMount() {
        this.props.data.refetch();
    }

    conveneCouncil = async () => {
        const { __typename, ...council } = this.props.data.council;
        this.props.data.loading = true;
        const response = await this.props.conveneCouncil({
            variables: {
                councilId: council.id
            }
        });

        if (response.data.conveneCouncil.success) {
            toast.success(this.props.translate.council_sended);
            bHistory.push('/');
        }
    };

    sendConveneTest = async () => {
        if (checkValidEmail(this.state.data.conveneTestEmail)) {
            const response = await this.props.sendConveneTest({
                variables: {
                    councilId: this.props.data.council.id,
                    email: this.state.data.conveneTestEmail
                }
            });

            if (!response.errors) {
                this.setState({
                    conveneTestSuccess: true
                });
            }
        } else {
            this.setState({
                errors: {
                    ...this.state.errors,
                    conveneTestEmail: 'EMAIL NO VÁLIDO'
                }
            })
        }

    };

    conveneTestKeyUp = (event) => {
        if (event.nativeEvent.keyCode === 13) {
            this.sendConveneTest();
        }
    };

    updateState = (object) => {
        this.setState({
            data: {
                ...this.state.data, ...object
            }
        });
    };

    resetConveneTestValues = () => {
        this.setState({
            conveneTestModal: false,
            conveneTestSuccess: false,
            errors: { conveneTestEmail: '' }
        });
        this.updateState({ conveneTestEmail: '' });
    };

    sendPreConvene = async () => {
        const response = await this.props.sendPreConvene({
            variables: {
                councilId: this.props.data.council.id
            }
        });

        if (!response.errors) {
            this.setState({
                preConveneSuccess: true
            });
        }
    };

    sendConveneWithoutNotice = async () => {
        const response = await this.props.conveneWithoutNotice({
            variables: {
                councilId: this.props.data.council.id
            }
        });
        if (!response.errors) {
            this.setState({
                conveneWithoutNoticeSuccess: true
            });
            if (response.data.conveneWithoutNotice.success) {
                toast.success(this.props.translate.changes_saved);
                bHistory.push('/');
            }
        }
    };

    _renderPreConveneModalBody = () => {
        if (this.state.preConveneSuccess) {
            return (<SuccessMessage message={this.props.translate.sent}/>);
        }

        return (<div style={{ width: '500px' }}>
            {this.props.translate.send_preconvene_desc}
        </div>);
    };

    _renderConveneTestModalBody() {
        const { translate } = this.props;
        const { data, errors } = this.state;
        const texts = CBX.removeHTMLTags(translate.send_convene_test_email_modal_text).split('.');


        if (this.state.conveneTestSuccess) {
            return (<SuccessMessage message={translate.sent}/>);
        }

        return (<div style={{ width: '500px' }}>
            <Typography style={{ fontWeight: '700' }}>
                {texts[ 0 ]}
            </Typography>
            <Typography>
                {`${texts[ 1 ]}.`}
            </Typography>
            <div style={{ marginTop: '2em' }}>
                <TextInput
                    required
                    floatingText={translate.email}
                    onKeyUp={this.conveneTestKeyUp}
                    type="text"
                    errorText={errors.conveneTestEmail}
                    value={data.conveneTestEmail}
                    onChange={(event) => this.updateState({
                        conveneTestEmail: event.nativeEvent.target.value
                    })}
                />
            </div>
        </div>);
    }

    _renderSendConveneWithoutNoticeBody = () => {
        return (<div>{this.props.translate.new_save_convene}</div>);
    };

    render() {
        const { translate } = this.props;
        const primary = getPrimary();
        const secondary = getSecondary();

        if (this.props.data.loading) {
            return (<LoadingSection/>);
        }

        return (<div style={{
            width: '100%',
            height: '100%'
        }}>
            <Grid>
                <GridItem xs={12} lg={12} md={12}>
                    <div style={{
                        float: 'right'
                    }}>
                        <DropDownMenu
                            color="transparent"
                            buttonStyle={{
                                boxSizing: 'border-box',
                                padding: '0',
                                border: `1px solid ${primary}`,
                                marginLeft: '0.3em'
                            }}
                            text={<FontAwesome
                                name={'bars'}
                                style={{
                                    cursor: 'pointer',
                                    fontSize: '0.8em',
                                    height: '0.8em',
                                    color: primary
                                }}
                            />}
                            textStyle={{ color: primary }}
                            type="flat"
                            icon={<Icon className="material-icons"
                                        style={{ color: primary }}>keyboard_arrow_down</Icon>}
                            items={<Fragment>
                                <MenuItem
                                    onClick={() => this.setState({ conveneTestModal: true })}>
                                    <Icon className="fa fa-flask" style={{
                                        color: secondary,
                                        marginLeft: '0.4em'
                                    }}> </Icon>
                                    {translate.send_test_convene}
                                </MenuItem>
                                <MenuItem
                                    onClick={() => this.setState({ preConveneModal: true })}>
                                    <Icon className="material-icons" style={{
                                        color: secondary,
                                        marginLeft: '0.4em'
                                    }}>query_builder</Icon>
                                    {translate.send_preconvene}
                                </MenuItem>
                                <MenuItem
                                    onClick={() => this.setState({ sendConveneWithoutNoticeModal: true })}>
                                    <Icon className="material-icons" style={{
                                        color: secondary,
                                        marginLeft: '0.4em'
                                    }}>notifications_off</Icon>
                                    {translate.new_save_convene}
                                </MenuItem>
                            </Fragment>}
                        />
                    </div>
                    <BasicButton
                        text={translate.new_save_and_send}
                        color={primary}
                        textStyle={{
                            color: 'white',
                            fontWeight: '700',
                            marginLeft: '0.3em',
                            fontSize: '0.9em',
                            textTransform: 'none'
                        }}
                        floatRight
                        textPosition="after"
                        onClick={this.conveneCouncil}
                    />
                    <BasicButton
                        text={translate.previous}
                        color={secondary}
                        textStyle={{
                            color: 'white',
                            fontWeight: '700',
                            fontSize: '0.9em',
                            textTransform: 'none'
                        }}
                        floatRight
                        textPosition="after"
                        onClick={this.props.previousStep}
                    />
                </GridItem>
            </Grid>
            <Paper style={{ marginTop: '1.5em' }}>
                <div
                    dangerouslySetInnerHTML={{ __html: this.props.data.councilPreviewHTML }}
                    style={{ padding: '2em' }}
                />
            </Paper>
            <AlertConfirm
                requestClose={this.resetConveneTestValues}
                open={this.state.conveneTestModal}
                acceptAction={this.state.conveneTestSuccess ? this.resetConveneTestValues : this.sendConveneTest}
                buttonAccept={this.state.conveneTestSuccess ? translate.accept : translate.send}
                buttonCancel={translate.close}
                bodyText={this._renderConveneTestModalBody()}
                title={translate.send_test_convene}
            />
            <AlertConfirm
                requestClose={() => this.setState({
                    preConveneModal: false,
                    preConveneSuccess: false
                })}
                open={this.state.preConveneModal}
                acceptAction={this.state.preConveneSuccess ? () => this.setState({
                    preConveneSuccess: false,
                    preConveneModal: false
                }) : this.sendPreConvene}
                buttonAccept={this.state.preConveneSuccess ? translate.accept : translate.send}
                buttonCancel={translate.close}
                bodyText={this._renderPreConveneModalBody()}
                title={translate.send_preconvene}
            />
            <AlertConfirm
                requestClose={() => this.setState({
                    sendConveneWithoutNoticeModal: false,
                    sendWithoutNoticeSuccess: false
                })}
                open={this.state.sendConveneWithoutNoticeModal}
                acceptAction={this.state.sendWithoutNoticeSuccess ? () => {
                    this.setState({
                        sendConveneWithoutNoticeModal: false,
                        sendWithoutNoticeSuccess: false
                    }, () => bHistory.push(`/`));
                } : this.sendConveneWithoutNotice}
                buttonAccept={this.state.sendWithoutNoticeSuccess ? translate.accept : translate.send}
                buttonCancel={translate.close}
                bodyText={this._renderSendConveneWithoutNoticeBody()}
                title={translate.send_preconvene}
            />
        </div>);
    }
}

const SuccessMessage = ({ message }) => (<div style={{
    width: '500px',
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'column'
}}>
    <Icon className="material-icons" style={{
        fontSize: '6em',
        color: 'green'
    }}>
        check_circle
    </Icon>
    <Typography variant="subheading">
        {message}
    </Typography>
</div>);

export default compose(graphql(conveneCouncil, {
        name: 'conveneCouncil'
    }),

    graphql(sendConveneTest, {
        name: 'sendConveneTest'
    }),

    graphql(sendPreConvene, {
        name: 'sendPreConvene'
    }),

    graphql(conveneWithoutNotice, {
        name: 'conveneWithoutNotice',
        options: {
            errorPolicy: 'all'
        }
    }), graphql(councilStepSix, {
        name: "data",
        options: (props) => ({
            variables: {
                id: props.councilID,
                companyId: props.company.id
            },
            notifyOnNetworkStatusChange: true
        })
    })
)(withRouter(CouncilEditorPreview));
