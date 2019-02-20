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


class AppControl extends React.Component {

    state = {
        configForCompany: ''
    }

    componentDidUpdate(prevProps, prevState){
        if(!prevProps.user.id && !!this.props.user.id){
            this.props.subscribeToAppControl({userId: this.props.user.id});
        }
        if(this.props.companies){
            if(this.props.companies.list[this.props.companies.selected] && prevProps.companies.list[this.props.companies.selected]){
                if(this.props.companies.list[this.props.companies.selected].id !== this.state.configForCompany){
                    this.updateCompanyConfig();
                }
            }

        }
    }

    updateCompanyConfig = () => {
        const company = this.props.companies.list[this.props.companies.selected];
        this.setState({
            configForCompany: company.id
        });

        this.props.data.refetch({
            companyId: company.id
        })
    }


    render(){
        let config = {};
        if(!this.props.data.loading){
            for(let field of this.props.data.appConfig){
                config[field.name] = field.active;
            }
        }

        console.log(config);

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