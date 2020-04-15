import React from 'react';
import { BasicButton, ButtonIcon } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import RequestDataInfo from './RequestDataInfo';

const reducer = (state, action) => {
    const actions = {
        'SUCCESS': () => {
            return ({
                ...state,
                status: 'SUCCESS',
                message: action.payload.message
            })
        },
        'ERROR': () => ({
            ...state,
            status: 'ERROR',
            message: action.payload.message
        })
    }

    return actions[action.type]? actions[action.type]() : state;


}


const LoginWithCert = ({ participant, handleSuccess, translate }) => {
    const [{ status, message }, dispatch] = React.useReducer(reducer, { status: 'WAITING' });
    const primary = getPrimary();

    const getData = async () => {
        try {
            dispatch({ type: 'LOADING' });
            const response = await fetch(`${process.env.REACT_APP_CERT_API}participant/${participant.id}`);
            const json = await response.json();    
            if(json.success){
                dispatch({ type: 'SUCCESS', payload: {
                    message: translate.cert_success,
                }})
            } else {
                let message = json.error;
                if(response.status == 403) {
                    message = translate.cert_doesnt_match;
                }
                if(response.status === 401){
                    message = translate.cert_missing;
                }
                dispatch({ type: 'ERROR', payload: {
                    message
                }})
            }
        } catch (error){
            dispatch({ type: 'ERROR', payload: translate.cert_error });
        }

    }

    return (
        <>
            <div style={{color: status === 'ERROR'? 'red' : 'green', fontSize: '1.2em', marginBottom: '0.4em', fontWeight: '700'}}>
                {message}
            </div>
            {status === 'ERROR' &&
                <BasicButton
                    text={translate.retry}
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
            }
            {status === 'WAITING' &&
                <BasicButton
                    text={translate.check_certificate}
                    color={primary}
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
                    onClick={getData}
                />
            }
            {status === 'SUCCESS' &&
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