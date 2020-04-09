import React from 'react';
import { BasicButton, ButtonIcon } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';

const reducer = (state, action) => {
    const actions = {
        'SUCCESS': () => {
            return ({
                ...state,
                status: 'SUCCESS'
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
    const primary = getPrimary();

    const getData = async () => {
        const response = await fetch(`${process.env.REACT_APP_CERT_API}participant/${participant.id}`);
        console.log(response);

        const json = await response.json();

        console.log(json);
        if(json.success){
            dispatch({ type: 'SUCCESS' })
        } else {
            dispatch({ type: 'ERROR', payload: json.error })
        }
    }

    React.useEffect(() => {
        getData();
    }, [participant.id])


    return (
        <>
            <div style={{color: 'red'}}>
                {message}
            </div>
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