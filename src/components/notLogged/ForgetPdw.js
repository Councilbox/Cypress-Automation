import React from 'react';
import * as mainActions from '../../actions/mainActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card } from 'material-ui';
import { graphql } from 'react-apollo';
import { restorePwd } from '../../queries/restorePwd';
import { getPrimary, secondary } from '../../styles/colors';
import withWindowSize from '../../HOCs/withWindowSize';
import { BasicButton, ButtonIcon, TextInput } from '../displayComponents/index';
import background from '../../assets/img/signup3.jpg';

class ForgetPdw extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            user: '',
            errors: {
                user: '',
            },
            sent: false
        }
    }

    checkRequiredFields() {
        let errors = {
            user: ''
        };
        let hasError = false;

        if (!this.state.user.length > 0) {
            hasError = true;
            errors.user = 'Por favor introduce un email'
        }

        this.setState({
            ...this.state,
            errors: errors
        });

        return hasError;
    }

    restorePdw = async () => {
        const { translate } = this.props;
        const { user } = this.state;
        if (!this.checkRequiredFields()) {
            const response = await this.props.mutate({
                variables: {
                    email: user,
                }
            });
            if (response.errors) {
                switch (response.errors[ 0 ].message) {
                    case 'Not found':
                        this.setState({
                            errors: {
                                user: translate.email_not_found
                            }
                        });
                        break;

                    default:
                        return;
                }

            }
            if (response.data.restorePwd.success) {
                this.setState({
                    sent: true
                });
            }
        }
    };

    logout = () => {
        this.props.actions.logout();
    };

    handleKeyUp = (event) => {
        if (event.nativeEvent.keyCode === 13) {
            this.restorePdw();
        }
    };

    render() {
        const { translate, windowSize } = this.props;
        const primary = getPrimary();
        return (<div className="row justify-content-md-center" style={{
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
                {!this.state.sent

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
                            {`${translate.restore_header} Councilbox`}
                        </div>
                        <br/>
                        <div
                            style={{
                                marginBottom: 0,
                                paddingBottom: 0,
                                fontWeight: '500',
                                fontSize: '1em',
                                color: secondary
                            }}>
                            {translate.restore_subheader}
                        </div>
                        <br/>
                        <div>
                            <TextInput
                                onKeyUp={this.handleKeyUp}
                                floatingText={translate.login_email}
                                errorText={this.state.errors.user}
                                type="text"
                                value={this.state.user}
                                onChange={(event) => this.setState({
                                    user: event.nativeEvent.target.value
                                })}/>
                        </div>
                        <div style={{ marginTop: '3em' }}>
                            <BasicButton
                                text={translate.restore_check_in}
                                color={primary}
                                textStyle={{
                                    color: 'white',
                                    fontWeight: '700'
                                }}
                                textPosition="before"
                                onClick={this.restorePdw}
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
                        <div
                            style={{
                                marginBottom: 0,
                                paddingBottom: 0,
                                fontWeight: '700',
                                fontSize: '1.5em',
                                color: primary
                            }}>
                            {translate.sent_reset_pwd}
                        </div>
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

export default connect(null, mapDispatchToProps)(graphql(restorePwd, { options: { errorPolicy: 'all' } })(withWindowSize(ForgetPdw)));