import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';

const logRocketState = {
    initialized: false
}

export const initLogRocket = user => {
    if(logRocketState.initialized) {
        return;
    }

    if(process.env.REACT_APP_LOGROCKET_ENABLED){
        LogRocket.init(process.env.REACT_APP_LOGROCKET_ENABLED);
        try {
            logRocketState.initialized = true;
            setupLogRocketReact(LogRocket);

            if(user.roles !== 'devAdmin'){
                LogRocket.identify(user.id, {
                    name: `${user.name} ${user.surname}`,
                    email: user.email,
                    id: user.id,
                    subscriptionType: user.roles || 'participant'
                });
            }
        } catch (error){
            console.error(error);
        }
    }
}