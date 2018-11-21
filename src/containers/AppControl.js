import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from "react-redux";
import * as mainActions from '../actions/mainActions';
import { store } from '../containers/App';

const ConfigContext = React.createContext({
    video: true,
    commandBar: false,
    recording: true
});

export { ConfigContext };


class AppControl extends React.Component {


    componentDidUpdate(prevProps){
        if(!prevProps.user.id && !!this.props.user.id){
            this.props.subscribeToAppControl({userId: this.props.user.id});
        }
    }

    render(){
        let config = {};

        console.log(this.props.data.appConfig);

        if(!this.props.data.loading){
            for(let field of this.props.data.appConfig){
                config[field.name] = field.active;
            }
        }
        return(
            <ConfigContext.Provider value={config}>
                {this.props.children}
            </ConfigContext.Provider>
        )
    }

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
    query AppConfig($userId: String!){
        appConfig(userId: $userId){
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
    options: props => ({
        variables: {
            userId: 'u152'
        }
    }),
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

                        console.log(oldConfig);


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