import React from 'react';
import { BasicButton, ButtonIcon } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';

const reducer = (state, action) => {
    const actions = {
        'SUCCESS': () => {
            return ({
                ...state,
                status: 'SUCCESS',
                message: action.payload
            })
        },
        'ERROR': () => ({
            ...state,
            status: 'ERROR',
            message: action.payload
        })
    }

    return actions[action.type]? actions[action.type]() : state;


}


const LoginWithCert = ({ participant, handleSuccess, translate }) => {
    const [{ status, message }, dispatch] = React.useReducer(reducer, { status: 'LOADING' });
    const [userData, setUserData] = React.useState(null);
    const primary = getPrimary();

    const getData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_CERT_API}participant/${participant.id}`);
            const json = await response.json();    
            if(json.success){
                dispatch({ type: 'SUCCESS', payload: translate.cert_success })
            } else {
                let message = json.error;
                if(response.status == 403) {
                    message = translate.cert_doesnt_match;
                }
                if(response.status === 401){
                    message = translate.cert_missing;
                }
                dispatch({ type: 'ERROR', payload: message })
            }
        } catch (error){
            dispatch({ type: 'ERROR', payload: translate.cert_error });
        }

    }

    const getUserData = async () => {
        const response = await fetch('https://ipinfo.io/json');
        const json = await response.json();

        console.log(json);
    }

    React.useEffect(() => {
        getData();
        getUserData();
    }, [participant.id])


    return (
        <>
            <div style={{color: status === 'ERROR'? 'red' : 'green', fontSize: '1.2em', marginBottom: '0.4em', fontWeight: '700'}}>
                {message}
            </div>
            {status === 'ERROR'?
                <BasicButton
                    text={'Reintentar'}
                    color={'red'}
                    textStyle={{
                        color: "white",
                        fontWeight: "700"
                    }}
                    loading={status === 'LOADING'}
                    textPosition="before"
                    fullWidth={true}
                    onClick={getData}
                />
            :
                <BasicButton
                    text={translate.enter_room}
                    color={status === 'ERROR'? 'grey' : primary}
                    textStyle={{
                        color: "white",
                        fontWeight: "700"
                    }}
                    loading={status === 'LOADING'}
                    disabled={status === 'ERROR'}
                    textPosition="before"
                    fullWidth={true}
                    icon={
                        <ButtonIcon
                            color="white"
                            type="directions_walk"
                        />
                    }
                    onClick={status === 'SUCCESS'? handleSuccess : () => {}}
                />
            }
        </>
    )
}

export default LoginWithCert;

/*
           open={open}
            title="Prueba"
            bodyText={
                status === 'LOADING'?
                    'CARGANDO'
                :
                    status === 'SUCCESS'? 
                        <>
                            Esto furrula entrar?
                            <div style={{backgroundColor: 'red'}} onClick={handleSuccess}>
                                VAMOS PA DENTRO
                            </div>
                        </>
                    :
                        <>
                            Error!
                            <div>
                                {message}
                            </div>
                        </>
*/