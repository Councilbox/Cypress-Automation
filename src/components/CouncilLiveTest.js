import React from 'react';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import withSharedProps from '../HOCs/withSharedProps';
import { bHistory } from '../containers/App';
import { checkCouncilState } from '../utils/CBX';
import gql from 'graphql-tag';
import LiveHeader from "./council/live/LiveHeader";
import { lightGrey } from "../styles/colors";
let logo;
import("../assets/img/logo-white.png").then(data => logo = data);


class CouncilLiveTest extends React.Component {
    state = {
        url: ''
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(!!nextProps.data.roomVideoURL){
            if(nextProps.data.roomVideoURL !== prevState.url){
                return { url: nextProps.data.roomVideoURL };
            }
        }

        return null;
    }

    componentDidUpdate(){
        if(!this.props.data.loading){
            if(this.props.data.council){
                checkCouncilState(
                    {
                        state: this.props.data.council.state,
                        id: this.props.data.council.id
                    },
                    this.props.company,
                    bHistory,
                    "live"
                );
            }
        }
    }

	render() {
		const { translate, company } = this.props;

		return (
			<div
				style={{
					height: "100vh",
					overflow: "hidden",
					backgroundColor: lightGrey,
					fontSize: "1em"
				}}
			>
				<LiveHeader
					logo={!!company? company.logo : logo}
					companyName={!!company && company.businessName}
					councilName={'COUNCIL TEST ENV'}
					translate={translate}
				/>
				<div
					style={{
						display: "flex",
						width: "100%",
						height: "calc(100vh - 3em)",
						flexDirection: "row"
					}}
				>
				{!!this.state.url &&
					<iframe
						title="meetingScreen"
						allow="geolocation; microphone; camera"
						scrolling="no"
						className="temp_video"
						src={`https://${this.state.url}?rand=${Date.now()}`}
						allowFullScreen={true}
						style={{
							border: "none !important"
						}}
					>
						Something wrong...
					</iframe>
				}
				</div>
			</div>
		);
	}
}


const council = gql`
    query CouncilCMPTestPage($id: Int!, $participantId: String!){
        council(id: $id){
            state
            id
        }

        roomVideoURL(councilId: $id, participantId: $participantId)
    }
`;

export default graphql(council, {
    options: props => ({
        variables: {
            id: props.councilId,
            participantId: 'Mod'
        }
    })
})(withSharedProps()(withRouter(CouncilLiveTest)));