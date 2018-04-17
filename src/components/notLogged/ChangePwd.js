import React from 'react';
import * as mainActions from '../../actions/mainActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Card } from 'material-ui';
import { compose, graphql } from 'react-apollo';
import { changePwd, checkExpiration } from '../../queries/restorePwd';
import { getPrimary } from '../../styles/colors';
import withWindowSize from '../../HOCs/withWindowSize';
import { BasicButton, ButtonIcon, TextInput } from '../displayComponents/index';
import background from '../../assets/img/signup3.jpg';

const DEFAULT_ERRORS = {
    pwd: '',
    repeatPdw: '',
};

class ChangePwd extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            pdw: '',
            repeatPdw: '',
            linkExpired: false,
            changed: false,
            errors: DEFAULT_ERRORS,
        }
    }

    componentDidMount() {
        this.checkExpiration();
    }

    checkRequiredFields() {
        const { translate } = this.props;

        let errors = DEFAULT_ERRORS;

        let hasError = false;

        if (!this.state.pdw.length > 0) {
            hasError = true;
            errors.pwd = translate.no_empty_pwd;
        }
        if (this.state.pdw !== this.state.repeatPdw) {
            hasError = true;
            errors.repeatPdw = translate.no_match_pwd;
        }

        this.setState({
            ...this.state,
            errors: errors
        });

        return hasError;
    }

    changePdw = async () => {
        const { user } = this.state;
        if (!this.checkRequiredFields()) {
            const response = await this.props.changePwd({
                variables: {
                    token: user,
                    pwd: this.state.pwd,
                }
            });
            if (response.errors) {
                switch (response.errors[ 0 ].code) {
                    case 402:
                        this.setState({
                            linkExpired: true
                        });
                        break;

                    default:
                        return;
                }
            }
            if (response.data.changePdw.success) {
                this.setState({
                    changed: true
                });
            }
        }
    };

    checkExpiration = async () => {
        const { user } = this.state;
        const response = await this.props.checkExpiration({
            variables: {
                token: this.props.match.params.token
            }
        });
        if (response.errors) {
            switch (response.errors[ 0 ].code) {
                case 402:
                    this.setState({
                        linkExpired: true
                    });
                    break;

                default:
                    return;
            }
        }
    };

    handleKeyUp = (event) => {
        if (event.nativeEvent.keyCode === 13) {
            this.changePdw();
        }
    };

    render() {
        const { translate, windowSize } = this.props;
        const primary = getPrimary();
        return (<div className="row justify-content-md-center"
                     style={{
                         width: '100%',
                         margin: 0,
                         backgroundImage: `url(${background})`,
                         fontSize: '0.85em',
                         height: '100%'
                     }}>
            <div className="col-lg-8 col-md-8 col-xs-12 "
                 style={{
                     display: 'flex',
                     justifyContent: 'center',
                     alignItems: 'center',
                     padding: 0
                 }}>
                {!this.state.linkExpired

                    ?

                    (!this.state.changed

                        ?

                        <Card
                            style={{
                                width: windowSize === 'xs' ? '100%' : '70%',
                                padding: '4vw'
                            }}>
                            <div
                                style={{
                                    marginBottom: 0,
                                    paddingBottom: 0,
                                    fontWeight: '700',
                                    fontSize: '1.5em',
                                    color: primary
                                }}>
                                {`${translate.change_pwd_header} Councilbox`}
                            </div>
                            <br/>
                            <div>
                                <TextInput
                                    onKeyUp={this.handleKeyUp}
                                    floatingText={translate.new_password}
                                    errorText={this.state.errors.user}
                                    type="password"
                                    value={this.state.user}
                                    onChange={(event) => this.setState({
                                        pwd: event.nativeEvent.target.value
                                    })}/>
                            </div>
                            <div>
                                <TextInput
                                    onKeyUp={this.handleKeyUp}
                                    floatingText={translate.login_confirm_password}
                                    errorText={this.state.errors.user}
                                    type="password"
                                    value={this.state.user}
                                    onChange={(event) => this.setState({
                                        repeatPwd: event.nativeEvent.target.value
                                    })}/>
                            </div>
                            <div style={{ marginTop: '3em' }}>
                                <BasicButton
                                    text={translate.change_pwd}
                                    color={primary}
                                    textStyle={{
                                        color: 'white',
                                        fontWeight: '700'
                                    }}
                                    textPosition="before"
                                    onClick={this.changePdw}
                                    fullWidth={true}
                                    icon={<ButtonIcon color='white' type="arrow_forward"/>}/>
                            </div>
                        </Card>

                        :

                        <Card
                            style={{
                                width: windowSize === 'xs' ? '100%' : '70%',
                                padding: '3vw'
                            }}>
                            {translate.password_changed}
                            <BasicButton
                                text={translate.to_entry}
                                color={primary}
                                textStyle={{
                                    color: 'white',
                                    fontWeight: '700'
                                }}
                                textPosition="before"
                                onClick={this.goLogin}
                                fullWidth={true}
                                icon={<ButtonIcon color='white' type="arrow_forward"/>}/>
                        </Card>)

                    :

                    <Card
                        style={{
                            width: windowSize === 'xs' ? '100%' : '70%',
                            padding: '3vw'
                        }}>
                        {translate.link_expired}
                        <BasicButton
                            text={translate.restore_header}
                            color={primary}
                            textStyle={{
                                color: 'white',
                                fontWeight: '700'
                            }}
                            textPosition="before"
                            onClick={this.goRestorePwd}
                            fullWidth={true}
                            icon={<ButtonIcon color='white' type="arrow_forward"/>}/>
                    </Card>}
            </div>
        </div>);
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(mainActions, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(compose(graphql(changePwd, {
    name: 'changePwd',
    options: { errorPolicy: 'all' }
}), graphql(checkExpiration, {
    name: 'checkExpiration',
    options: { errorPolicy: 'all' }
}),)(withWindowSize(withRouter(ChangePwd))))