import gql from 'graphql-tag';
import React from 'react';
import { withApollo } from 'react-apollo';
import { withRouter } from 'react-router';
import { AlertConfirm, BasicButton } from '../../../displayComponents';
import { moment } from '../../../containers/App';
import { useCountdown } from '../../../hooks';
import { getPrimary } from '../../../styles/colors';


const Resend2FAModal = ({
 translate, open, requestClose, match, client
}) => {
    const [data, setData] = React.useState(null);
    const { secondsLeft, setCountdown } = useCountdown(0);
    const [timeDifference, setTimeDifference] = React.useState(0);

    React.useEffect(() => {
        if (data && data.sendDate) {
            const firstDate = moment();
            const secondDate = moment(data.sendDate);
            const difference = firstDate.diff(secondDate, 'seconds');
            setTimeDifference(difference > 0 ? difference : 0);
            setCountdown(60 - difference);
        }
    }, [data]);

    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: gql`
                query Last2FASent($token: String!){
                    last2FASent(token: $token){
                        id
                        sendDate
                        reqCode
                        phone
                    }
                }
            `,
            variables: {
                token: match.params.token
            }
        });

        setData(response.data.last2FASent);
    }, [match.params.token, open]);

    const resendKey = async () => {
        await client.mutate({
            mutation: gql`
                mutation resend2FA($token: String!){
                    resend2FA(token: $token){
                        success
                    }
                }
            `,
            variables: {
                token: match.params.token
            }
        });

        getData();
    };

    React.useEffect(() => {
        if (open) {
            getData();
        }
    }, [getData]);

    const resendDisabled = timeDifference <= 60 && secondsLeft > 0;

    return (
        <AlertConfirm
            title={translate.resend}
            bodyText={
                <div>
                    {data
                        && <>
                            <div>
                                Último envío realizado: {moment(data.sendDate).format('LLL')}
                            </div>
                            <div>
                                Teléfono terminado en: {data.phone}
                            </div>
                        </>
                    }
                </div>
            }
            open={open}
            extraActions={
                <BasicButton
                    color={getPrimary()}
                    textStyle={{
                        color: 'white',
                        fontWeight: '700'
                    }}
                    text={resendDisabled ? `Debe esperar para volver a enviar ${secondsLeft}` : translate.resend}
                    disabled={resendDisabled}
                    onClick={resendKey}
                />
            }
            buttonCancel={translate.close}
            requestClose={requestClose}
        />
    );
};

export default withApollo(withRouter(Resend2FAModal));
