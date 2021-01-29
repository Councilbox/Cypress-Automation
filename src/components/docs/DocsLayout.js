import React from 'react';
import logo from '../../assets/img/logo-white.png';
import ApikeyLogin from './ApikeyLogin';

export const DocsContext = React.createContext();


const DocsLayout = props => {
    const [state, setState] = React.useState({
        login: false
    });

    const loginSuccess = account => {
        setState({
            ...state,
            login: account,
        });
    }

    const logout = () => {
        sessionStorage.removeItem("apiToken");
        sessionStorage.removeItem("refreshToken");
        setState({
            ...state,
            login: false
        });
    }

    const value = {
        ...state,
        logout,
        loginSuccess
    }


    return (
        <DocsContext.Provider value={value}>
            <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#424242',
                display: 'flex',
                color: 'white',
                flexDirection: 'column'
            }}>
                <header style={{
                    width: '100%',
                    height: '3.5em',
                    backgroundColor: '#212121',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <img src={logo} style={{ height: '1.75em', width: 'auto', margin: '0 1em' }} alt="councilbox-logo"/>
                        <span style={{ fontSize: '1.75em' }}>Developer</span>
                    </div>
                    {props.login &&
                        <ApikeyLogin />
                    }
                </header>
                <div style={{ height: 'calc(100% - 3.5em)', width: '100%', overflow: 'auto' }}>
                    {props.children}
                </div>
            </div>
        </DocsContext.Provider>
    )
}

export default DocsLayout;


