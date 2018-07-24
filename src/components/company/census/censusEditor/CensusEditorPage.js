import React from "react";
import { graphql } from "react-apollo";
import { census } from "../../../../queries/census";
import {
	CardPageLayout,
	Grid,
	GridItem,
	LoadingSection,
	SelectInput,
	TextInput
} from "../../../../displayComponents";
import { MenuItem } from "material-ui";
import withSharedProps from "../../../../HOCs/withSharedProps";
import { withRouter } from "react-router-dom";
import CensusParticipants from "./CensusParticipants";

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
		const errors = this.state.errors;

		return (
			<CardPageLayout title={census.censusName || translate.census}>
				<div style={{padding: '2.2em', paddingTop: '0'}}>
					<Grid style={{marginBottom: '1.6em'}}>
						<GridItem lg={6} md={6} xs={12} style={{padding: '0.8em'}}>
							<TextInput
								floatingText={translate.name}
								required
								type="text"
								errorText={errors.censusName}
								value={census.censusName}
								onChange={event => {
									this.updateState({
										censusName: event.target.value
									});
								}}
							/>
						</GridItem>
						<GridItem lg={6} md={6} xs={12} style={{padding: '0.8em'}}>
							<SelectInput
								floatingText={translate.census_type}
								value={census.quorumPrototype}
								onChange={event => {
									this.updateState({
										quorumPrototype: event.target.value
									});
								}}
							>
								<MenuItem value={0}>
									{translate.census_type_assistants}
								</MenuItem>
								<MenuItem value={1}>
									{translate.social_capital}
								</MenuItem>
							</SelectInput>
						</GridItem>
						<GridItem xs={12} md={12} lg={12} style={{padding: '0.8em', paddingTop: 0}}>
							<TextInput
								floatingText={translate.description}
								required
								type="text"
								errorText={errors.censusDescription}
								value={census.censusDescription}
								onChange={event => {
									this.updateState({
										censusDescription: event.target.value
									});
								}}
							/>
						</GridItem>
					</Grid>
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
