import React from 'react';
import { LoadingMainApp } from '../../../../displayComponents';
import { graphql } from 'react-apollo';
import { councilLiveQuery } from "../../../../queries";
import ParticipantsManager from '../ParticipantsManager';
import LiveMobileHeader from './LiveMobileHeader';

class CouncilLiveMobilePage extends React.Component {

    render() {

        const company = this.props.companies.list[
            this.props.companies.selected
        ];

        if (this.props.data.loading) {
            return <LoadingMainApp />
        }

        return (
            <div
                style={{
                    width: '100vw',
                    height: '100vh',
                }}
            >
                <LiveMobileHeader
                    logo={!!company && company.logo}
                    companyName={!!company && company.businessName}
                    councilName={this.props.data.council.name}
                    translate={this.props.translate}
                />
                <div
                    style={{
                        width: '100vw',
                        height: 'calc( 100vh - 3.5em )',
                        marginTop: '3.5em'
                    }}
                >
                    <ParticipantsManager
                        translate={this.props.translate}
                        participants={
                            this.props.data.council.participants
                        }
                        council={this.props.data.council}
                    />
                </div>

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