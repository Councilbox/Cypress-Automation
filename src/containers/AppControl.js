import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from "react-redux";
import * as mainActions from '../actions/mainActions';
import { store } from '../containers/App';
import { company } from '../queries';

const ConfigContext = React.createContext({
    video: true,
    commandBar: false,
    recording: true
});

export { ConfigContext };

const AppControl = ({ subscribeToAppControl, companies, user = {}, children, client }) => {
    const [config, setConfig] = React.useState(null);

    const getData = React.useCallback(async companyId => {
        const response = await client.query({
            query: appConfig,
            variables: {
                userId: 'u152',
                ...(companyId? {
                    companyId
                } : {})
            }
        });
        if(response.data){
            let newConfig = {};
            for(let field of response.data.appConfig){
                newConfig[field.name] = field.active;
            }
            if(companies.selected || companies.selected === 0){
                if(companies.list[companies.selected].id === 488){
                    //newConfig.blockchain = true;
                }
            }
            setConfig(newConfig);
        }
    }, [client]);

    React.useEffect(() => {
        getData();
    }, [getData]);


    React.useEffect(() => {
        if(!!user && !!user.id){
            const subscribir = async () => {
                const response = await client.subscribe({
                    query: appControlChange,
                    variables: {
                        userId: user.id
                    }
                });
                response.subscribe(subscriptionData => {
                    if(subscriptionData.data.appControlChange.command === 'logout'){
                        store.dispatch(mainActions.logout());
                    }

                    if(subscriptionData.data.appControlChange.command === 'refresh'){
                        window.location.reload(true);
                    }

                    if(!subscriptionData.data.appControlChange.config) return;
                    const newConfig = {};
                    for(let field of subscriptionData.data.appControlChange.config){
                        newConfig[field.name] = field.active;
                    }
                    setConfig({
                        ...config,
                        ...newConfig
                    });
                });
            }
            subscribir();

        }
    }, [user.id]);


    React.useEffect(() => {
        if(companies.selected || companies.selected === 0){
            getData(companies.list[companies.selected].id);
        }
    }, [companies.selected]);

    return(
        <ConfigContext.Provider value={config}>
            {children}
        </ConfigContext.Provider>
    )
}


const appControlChange = gql`
    subscription AppControlChange($userId: String!) {
        appControlChange(userId: $userId) {
            command
            userId
            config {
                name
                active
            }
        }
    }
`;

const appConfig = gql`
    query AppConfig($userId: String!, $companyId: Int){
        appConfig(userId: $userId, companyId: $companyId){
            name
            active
        }
    }
`;

const mapStateToProps = state => ({
	main: state.main,
	translate: state.translate,
	companies: state.companies,
	user: state.user
});


export default (connect(mapStateToProps)(withApollo(AppControl)));

/*
graphql(appConfig, {
    options: props => {
        return {
            variables: {
            userId: 'u152',
            },
            fetchPolicy: 'network-only',
            forceFetch: true,
            notifyOnNetworkStatusChange: true
    }},
    props: props => {
		return {
		    ...props,
		    subscribeToAppControl: params => {
			    return props.data.subscribeToMore({
                    document: appControlChange,
                    variables: {
                        userId: params.userId
                    },
			        updateQuery: (prev, { subscriptionData }) => {

                        if(subscriptionData.data.appControlChange.command === 'logout'){
                            store.dispatch(mainActions.logout());
                        }

                        if(subscriptionData.data.appControlChange.command === 'refresh'){
                            window.location.reload(true);
                        }

                        if(!subscriptionData.data.appControlChange.config) return prev;
                        const config = subscriptionData.data.appControlChange.config;
                        let oldConfig = prev.appConfig;

                        oldConfig = {
                            ...oldConfig,
                            ...config
                        };

                        return({
                            ...prev,
                            appConfig: [
                                ...prev.appConfig,
                                ...config
                            ]
                        });
			        }
			    });
		    }
		};
	}
})

*/