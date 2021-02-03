import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from "react-redux";
import * as mainActions from '../actions/mainActions';
import { store } from "./App";

const ConfigContext = React.createContext({
    video: true,
    commandBar: false,
    recording: true
});

const appControlChange = gql`
    subscription AppControlChange($userId: Int!) {
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

export { ConfigContext };

const AppControl = ({ companies, user = {}, children, client }) => {
    const [config, setConfig] = React.useState({});
    const [loading, setLoading] = React.useState(true);

    const getData = React.useCallback(async companyId => {
        const response = await client.query({
            query: appConfig,
            variables: {
                userId: 'u152',
                ...(companyId ? {
                    companyId
                } : {})
            }
        });
        if(response.data){
            const newConfig = {};
            for(const field of response.data.appConfig){
                newConfig[field.name] = field.active;
            }
            if(companies.selected || companies.selected === 0){
                if(companies.list[companies.selected].id === 488){
                    //newConfig.blockchain = true;
                }
            }
            setConfig(newConfig);
            setLoading(false);
        }
    }, [client]);

    React.useEffect(() => {
        getData();
    }, [getData]);


    React.useEffect(() => {
        if(!!user && !!user.id){
            const subscribe = async () => {
                const response = await client.subscribe({
                    query: appControlChange,
                    variables: {
                        userId: +user.id
                    }
                });
                response.subscribe(subscriptionData => {
                    if(!subscriptionData.data.appControlChange){
                        return;
                    }
                    if(subscriptionData.data.appControlChange.command === 'logout'){
                        store.dispatch(mainActions.logout());
                    }

                    if(subscriptionData.data.appControlChange.command === 'refresh'){
                        window.location.reload(true);
                    }

                    if(!subscriptionData.data.appControlChange.config) return;
                    const newConfig = {};
                    for(const field of subscriptionData.data.appControlChange.config){
                        newConfig[field.name] = field.active;
                    }
                    setConfig({
                        ...config,
                        ...newConfig
                    });
                });
            }
            subscribe();
        }
    }, [user.id]);


    React.useEffect(() => {
        if(companies.selected || companies.selected === 0){
            getData(companies.list[companies.selected].id);
        }
    }, [companies.selected]);

    return(
        <ConfigContext.Provider value={{
            ...config,
            updateConfig: getData
        }}>
            {loading ?
                <></>
            :
                children
            }
        </ConfigContext.Provider>
    )
}

const mapStateToProps = state => ({
	main: state.main,
	translate: state.translate,
	companies: state.companies,
	user: state.user
});


export default (connect(mapStateToProps)(withApollo(AppControl)));
