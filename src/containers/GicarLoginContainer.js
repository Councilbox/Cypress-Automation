import React from 'react';
import { LoadingSection } from '../displayComponents';


const GicarLoginContainer = ({ match }) => {
    React.useEffect(() => {
        setTimeout(() => {
            window.opener.setToken({
                token: match.params.token,
                refreshToken: match.params.refresh
            });
            window.close();
        }, 2500);
    }, []);

    return (
        <div style={{width: '100%', height: '100%', display: 'flex', alignContent: 'center', justifyContent: 'center', flexDirection: 'column'}}>
            <div>
                <LoadingSection />
            </div>
            <div style={{width: '100%', textAlign: 'center'}}>
                Estableciendo conexión segura...
            </div>
        </div>

    )
}

export default GicarLoginContainer;