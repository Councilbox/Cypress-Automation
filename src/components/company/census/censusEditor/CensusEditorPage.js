import React from "react";
import { graphql } from "react-apollo";
import { census } from "../../../../queries/census";
import {
	CardPageLayout,
	LoadingSection,
} from "../../../../displayComponents";
import withSharedProps from "../../../../HOCs/withSharedProps";
import { withRouter } from "react-router-dom";
import CensusParticipants from "./CensusParticipants";
import { isMobile } from 'react-device-detect';

class CensusEditorPage extends React.Component {
	state = {
		data: {
			id: '',
			censusName: "",
			censusDescription: ""
		},
		errors: {},
		filterBy: ""
	};

	componentDidMount() {
		this.props.data.refetch();
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (!nextProps.data.loading) {
			if (prevState.data.id !== nextProps.data.census.id) {
				return {
					data: {
						...nextProps.data.census,
						censusDescription:
							nextProps.data.census.censusDescription || ""
					}
				};
			}
		}
		return null;
	}

	updateState = object => {
		this.setState({
			data: {
				...this.state.data,
				...object
			}
		});
	};

	render() {
		const { translate } = this.props;
		const { loading } = this.props.data;
		const census = this.state.data;

		return (
			<CardPageLayout title={census.censusName || translate.census}>
				<div style={{padding: isMobile? '0.6em' : '2em', paddingTop: '0'}}>
					{loading ? (
						<LoadingSection />
					) : (
						<CensusParticipants
							recount={this.props.data.censusRecount}
							translate={translate}
							refetch={this.props.data.refetch}
							census={census}
							company={this.props.company}
						/>
					)}
				</div>
			</CardPageLayout>
		);
	}
}

export default withSharedProps()(
	graphql(census, {
		options: props => ({
			variables: {
				id: props.match.params.id
			},
		})
	})(withRouter(CensusEditorPage))
);
