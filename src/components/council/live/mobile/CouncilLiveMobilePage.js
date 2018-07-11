import React from 'react';
import LiveHeader from '../LiveHeader';
import { LoadingMainApp } from '../../../../displayComponents';
import { graphql } from 'react-apollo';
import { councilLiveQuery } from "../../../../queries";
import ParticipantsManager from '../ParticipantsManager';

class CouncilLiveMobilePage extends React.Component {

    render(){

        const company = this.props.companies.list[
			this.props.companies.selected
        ];

        if(this.props.data.loading){
            return <LoadingMainApp />
        }

        return(
            <div
                style={{
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'red'
                }}
            >
                <LiveHeader
                    logo={!!company && company.logo}
					companyName={!!company && company.businessName}
					councilName={this.props.data.council.name}
					translate={this.props.translate}
                />
                <ParticipantsManager
                    translate={this.props.translate}
                    participants={
                        this.props.data.council.participants
                    }
                    council={this.props.data.council}
                />
            </div>
        )
    }
}

export default graphql(councilLiveQuery, {
	name: "data",
	options: props => ({
		variables: {
			councilID: props.councilID
		},
		pollInterval: 10000
	})
})(CouncilLiveMobilePage);