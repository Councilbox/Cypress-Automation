import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';

export const initLogRocket = user => {
    if(process.env.REACT_APP_LOGROCKET_ENABLED){
        LogRocket.init(process.env.REACT_APP_LOGROCKET_ENABLED);
        setupLogRocketReact(LogRocket);

        if(user.roles !== 'devAdmin'){
            LogRocket.identify(user.id, {
                name: `${user.name} ${user.surname}`,
                email: user.email,
                subscriptionType: user.roles || 'participant'
            });
        }
    }
}