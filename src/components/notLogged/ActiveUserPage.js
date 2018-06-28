import React from 'react';
import withTranslations from '../../HOCs/withTranslations';
import Header from '../Header';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { Paper } from 'material-ui';
import { bHistory } from '../../containers/App';
import gql from 'graphql-tag';
import { getPrimary } from '../../styles/colors';
import { LoadingSection, BasicButton, NotLoggedLayout } from '../../displayComponents';


class ActiveUserPage extends React.Component {

    state = {
        loading: true,
        success: false,
        error: ''
    }

    async componentDidMount(){
        const response = await this.props.activeUser({
            variables: {
                token: this.props.match.params.token
            }
        });

        if(!response.errors){
            this.setState({
                loading: false,
                success: true
            });
        }else{
            this.setState({
                loading: false,
                success: false,
                error: response.errors[0].code
            });
        }
    }

    errorWrapper = () => {
        return(
            <div
                style={{
                    color: getPrimary(),
                    fontSize: '1.3em',
                    fontWeight: '700',
                    marginBottom: '1.3em'
                }}
            >
                {this.state.error === 407?
                    this.props.translate.account_actived_yet
                :
                    this.props.translate.error_active_account
                }
            </div>
        )
    }

    successMessage = () => {
        return (
            <div
                style={{
                    color: getPrimary(),
                    fontSize: '1.3em',
                    fontWeight: '700',
                    marginBottom: '1.3em'
                }}
            >
                {this.props.translate.account_actived}
            </div>
        )
    }

    render(){
        return(
            <NotLoggedLayout
				translate={this.props.translate}
				helpIcon={true}
				languageSelector={true}
			>
                <div
					className="row"
					style={{
						width: "100%",
						margin: 0,
						fontSize: "0.85em",
						height: "100%",
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
					}}
				>
                    <Paper
                        style={{
                            width: '600px',
                            height: '60vh',
                            display: 'flex',
                            fontSize: '1.2em',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column'
                        }}
                    >
                        {this.state.loading?
                            <LoadingSection />
                        :
                            <React.Fragment>
                                {this.state.error &&
                                    this.errorWrapper()
                                }
                                {this.state.success &&
                                    this.successMessage()
                                }
                                <BasicButton
                                    text={this.props.translate.go_login}
                                    textStyle={{color: 'white', textTransform: 'none', fontWeight: '700'}}
                                    color={getPrimary()}
                                    onClick={() => bHistory.push('/')}
                                />
                            </React.Fragment>
                        }

                    </Paper>
                </div>
            </NotLoggedLayout>
        )
    }
}

const activeUser = gql`
    mutation confirmEmail($token: String!){
        confirmEmail(token: $token){
            success
            message
        }
    }
`;

export default graphql(activeUser, {
    name: 'activeUser'
})(withTranslations()(withRouter(ActiveUserPage)));