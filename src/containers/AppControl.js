import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from "react-redux";
import * as mainActions from '../actions/mainActions';
import { bindActionCreators } from 'redux';
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
        console.log(this.props.data.appConfig);
        return(
            <ConfigContext.Provider value={this.props.data.appConfig}>
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
                video
                commandBar
                recording
            }
        }
    }
`;

const appConfig = gql`
    query AppConfig($userId: String!){
        appConfig(userId: $userId){
            video
            commandBar
            recording
        }
    }
`;

const mapStateToProps = state => ({
	main: state.main,
	translate: state.translate,
	companies: state.companies,
	user: state.user
});

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(mainActions, dispatch)
	};
}

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
                        console.log(subscriptionData);
                        console.log(prev);

                        if(subscriptionData.data.appControlChange.command === 'logout'){
                            store.dispatch(mainActions.logout());
                        }

                        if(subscriptionData.data.appControlChange.command === 'refresh'){
                            window.location.reload(true);
                        }

                        if(!subscriptionData.data.appControlChange.config || true) return prev;

                        const { config } = subscriptionData.data.appControlChange;

                        Object.keys(config).forEach(key => {
                            if (config[key] === null) {
                                delete config[key];
                            }
                        });
                        return({
                            ...prev,
                            appConfig: {
                                ...prev.appConfig,
                                ...config
                            }
                        })
			        }
			    });
		    }
		};
	}
})(connect(mapStateToProps)(AppControl));