import React from 'react';
import { graphql } from 'react-apollo';
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

const AppControl = ({ subscribeToAppControl, companies, user = {}, data, children }) => {

    const [config, setConfig] = React.useState(null);

    React.useEffect(() => {
        if(!!user && !!user.id){
            subscribeToAppControl({userId: user.id});
        }
    }, [user.id]);

    React.useEffect(() => {
        let newConfig = {};
        if(!data.loading){
            for(let field of data.appConfig){
                newConfig[field.name] = field.active;
            }
            //console.log(config, newConfig);
            setConfig(newConfig);
        }
    }, [data]);

    React.useEffect(() => {
        if(companies.selected || companies.selected === 0){
            updateCompanyConfig();
        }
    }, [companies.selected]);

    const updateCompanyConfig = async () => {
        await data.refetch({
            companyId: companies.list[companies.selected].id
        });
    }

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


export default graphql(appConfig, {
    options: props => {
        let company = null;
        if(props.companies && (props.companies.selected || props.companies.selected === 0)){
            props.companies.list[props.companies.selected].id
        }

        return {
            variables: {
            userId: 'u152',
            ...(company? {
                companyId: company.id
            } : {}),
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
})(connect(mapStateToProps)(AppControl));