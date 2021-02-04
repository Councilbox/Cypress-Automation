import React from 'react';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { Paper } from 'material-ui';
import gql from 'graphql-tag';
import { bHistory } from '../../containers/App';
import withTranslations from '../../HOCs/withTranslations';
import { getPrimary } from '../../styles/colors';
import { LoadingSection, BasicButton, NotLoggedLayout } from '../../displayComponents';
import logo from "../../assets/img/logo-icono.png";



const ChangeEmail = ({ match, translate, ...props }) => {
    const [state, setState] = React.useState({
        loading: true,
        success: false,
        error: ''
    })

    React.useEffect(() => {
        const confirEmailUser = async () => {
            const response = await props.updateEmail({
                variables: {
                    token: match.params.token,
                }
            });

            if (!response.errors) {
                setState({
                    loading: false,
                    success: true
                });
            } else {
                setState({
                    loading: false,
                    success: false,
                    error: response.errors[0].code
                });
            }
        }
        confirEmailUser()
    }, []);



    const errorWrapper = () => (
            <div
                style={{
                    color: getPrimary(),
                    fontSize: '1.3em',
                    fontWeight: '700',
                    marginBottom: '1.3em'
                }}
            >
                FAIL
            </div>
        )




    return (
        <NotLoggedLayout
            translate={translate}
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
                    {state.loading ?
                        <LoadingSection />
                        :
                        <React.Fragment>
                            <img src={logo} style={{ height: '6em', marginBottom: '0.6em' }} alt="councibox-icon" />
                            {!state.success &&
                                errorWrapper()
                            }
                            {state.success &&
                                <div style={{ margin: "1em" }}>
                                Gracias por confirmar el nuevo email
                                </div>
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
    )
}

const updateEmail = gql`
    mutation updateEmail($token: String!){
        updateEmail(token: $token){
            success
            message
        }
    }
`;

export default graphql(updateEmail, {
    name: 'updateEmail'
})(withTranslations()(withRouter(ChangeEmail)));
