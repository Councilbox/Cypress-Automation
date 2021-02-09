import React from 'react';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { Paper } from 'material-ui';
import gql from 'graphql-tag';
import { bHistory } from '../../containers/App';
import withTranslations from '../../HOCs/withTranslations';
import { getPrimary } from '../../styles/colors';
import { LoadingSection, BasicButton, NotLoggedLayout } from '../../displayComponents';
import logo from '../../assets/img/logo-icono.png';


const ActiveUserPage = ({ match, translate, activeUser }) => {
    const [state, setState] = React.useState({
        loading: true,
        success: false,
        error: ''
    });

    const activateUser = async () => {
        const response = await activeUser({
            variables: {
                token: match.params.token
            }
        });

        if(!response.errors){
            setState({
                ...state,
                loading: false,
                success: true
            });
        }else{
            setState({
                ...state,
                loading: false,
                success: false,
                error: response.errors[0].code
            });
        }
    };

    React.useEffect(() => {
        activateUser();
    }, [match.params.token]);

    const errorWrapper = () => (
            <div
                style={{
                    color: getPrimary(),
                    fontSize: '1.3em',
                    fontWeight: '700',
                    marginBottom: '1.3em'
                }}
            >
                {state.error === 407 ?
                    translate.account_actived_yet
                :
                    translate.error_active_account
                }
            </div>
        );

    const successMessage = () => (
            <div
                style={{
                    color: getPrimary(),
                    fontSize: '1.3em',
                    fontWeight: '700',
                    marginBottom: '1.3em'
                }}
            >
                {translate.account_actived}
            </div>
        );

    return(
        <NotLoggedLayout
            translate={translate}
            helpIcon={true}
            languageSelector={true}
        >
            <div
                className="row"
                style={{
                    width: '100%',
                    margin: 0,
                    fontSize: '0.85em',
                    height: '100%',
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
                    {state.loading ?
                        <LoadingSection />
                    :
                        <React.Fragment>
                            <img src={logo} style={{ height: '6em', marginBottom: '0.6em' }} alt="councibox-icon" />
                            {state.error &&
                                errorWrapper()
                            }
                            {state.success &&
                                successMessage()
                            }
                            <BasicButton
                                text={translate.go_login}
                                textStyle={{ color: 'white', textTransform: 'none', fontWeight: '700' }}
                                color={getPrimary()}
                                onClick={() => bHistory.push('/')}
                            />
                        </React.Fragment>
                    }

                </Paper>
            </div>
        </NotLoggedLayout>
    );
};

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
