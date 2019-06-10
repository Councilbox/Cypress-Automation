import React from 'react';
import { ConfigContext } from './AppControl';
//import { AdomClient, AdomProvider, Assisted } from 'adom-client';
//import { theme } from '../displayComponents/ThemeProvider';

//const adomClient = new AdomClient(process.env.REACT_APP_ADOM_URL, 443);

const AdomWrapper = ({ children }) => {
    //const config = React.useContext(ConfigContext);
    // if(config && config.adom){
    //     return (
    //         <AdomProvider client={adomClient}>
    //             <Assisted theme={theme}>
    //                 {children}
    //             </Assisted>
    //         </AdomProvider>
    //     )
    // }

    return children;


}

export default AdomWrapper;