import React from 'react';
import logo from '../../assets/img/logo-white.png';
import ApikeyLogin from './ApikeyLogin';


const DocsLayout = props => {

    return (
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
                    <img src={logo} style={{height: '1.75em', width: 'auto', margin: '0 1em'}} alt="councilbox-logo"/>
                    <span style={{fontSize: '1.75em'}}>Developer</span>
                </div>
                {props.login &&
                    <ApikeyLogin />
                }
            </header>
            <div style={{height: 'calc(100% - 3.5em)', width: '100%', padding: '2em', overflow: 'auto'}}>
                {props.children}
            </div>
        </div>
    )
}

export default DocsLayout;


