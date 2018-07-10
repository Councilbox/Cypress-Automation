import React from "react";
import {
	AlertConfirm,
	CardPageLayout,
	CloseIcon,
	DateWrapper,
	EnhancedTable,
	Grid,
	GridItem,
	LoadingSection
} from "../../../displayComponents";
import { compose, graphql } from "react-apollo";
import { censuses, deleteCensus, setDefaultCensus } from "../../../queries/census";
import { Tooltip } from 'material-ui';
import { TableCell, TableRow } from "material-ui/Table";
import { withRouter } from 'react-router-dom';
import FontAwesome from "react-fontawesome";
import { getPrimary } from "../../../styles/colors";
import withSharedProps from '../../../HOCs/withSharedProps';
import CloneCensusModal from "./CloneCensusModal";
import AddCensusButton from "./AddCensusButton";
import { bHistory } from "../../../containers/App";
import { CENSUS_LIMITS } from "../../../constants";

class CompanyCensusPage extends React.Component {
	state = {
		deleteModal: false,
		cloneModal: false,
		cloneIndex: 0
	};


	deleteCensus = async () => {
		this.props.data.loading = true;
		const response = await this.props.deleteCensus({
			variables: {
				censusId: this.state.deleteCensus
			}
		});
		if (response) {
			this.setState({
				deleteModal: false,
				deleteCensus: -1
			});
			this.props.data.refetch();
		}
	};

	setDefaultCensus = async censusId => {
		this.setState({
			changingDefault: censusId
		});
		const response = await this.props.setDefaultCensus({
			variables: {
				censusId: censusId
			}
		});
		if (response) {
			this.setState({
				changingDefault: -1
			});
			this.props.data.refetch();
		}
	};

	openCensusEdit = censusId => {
		bHistory.push(`/company/${this.props.company.id}/census/${censusId}`);
	};

	render() {
		const { translate, company } = this.props;
		const { loading, censuses } = this.props.data;
		const primary = getPrimary();

		return (
			<CardPageLayout title={translate.censuses_list}>
				<Grid>
					<GridItem xs={6} lg={3} md={3}>
						<AddCensusButton
							translate={translate}
							company={company}
							refetch={this.props.data.refetch}
						/>
					</GridItem>
				</Grid>
				{!!censuses && (
					<EnhancedTable
						translate={translate}
						defaultLimit={CENSUS_LIMITS[0]}
						defaultFilter={"censusName"}
						limits={CENSUS_LIMITS}
						page={1}
						loading={loading}
						length={censuses.list.length}
						total={censuses.total}
						refetch={this.props.data.refetch}
						action={this._renderDeleteIcon}
						headers={[
							{
								text: translate.name,
								name: "censusName",
								canOrder: true
							},
							{
								text: translate.creation_date,
								name: "creationDate",
								canOrder: true
							},
							{
								name: "lastEdit",
								text: translate.last_edit,
								canOrder: true
							},
							{
								name: "creator",
								text: translate.creator,
							},
							{ name: "" }
						]}
					>
						{censuses.list.map((census, index) => {
							return (
								<TableRow
									hover
									key={`census_${census.id}`}
									onClick={() =>
										this.openCensusEdit(census.id)
									}
									style={{ cursor: "pointer" }}
								>
									<TableCell>{census.censusName}</TableCell>
									<TableCell>
										<DateWrapper
											format="DD/MM/YYYY HH:mm"
											date={census.creationDate}
										/>
									</TableCell>
									<TableCell>
										<DateWrapper
											format="DD/MM/YYYY HH:mm"
											date={census.lastEdit}
										/>
									</TableCell>
									<TableCell>
										{`${!!census.creator? census.creator.name : ''} ${!!census.creator? census.creator.surname : ''}`}
									</TableCell>
									<TableCell>
										<div style={{ float: "right" }}>
											{census.id ===
											this.state.changingDefault ? (
												<div
													style={{
														display: "inline-block"
													}}
												>
													<LoadingSection size={20} />
												</div>
											) : (
												<Tooltip title={translate.change_default_census_tooltip}>
													<FontAwesome
														name={
															census.defaultCensus ===
															1
																? "star"
																: "star-o"
														}
														style={{
															cursor: "pointer",
															fontSize: "2em",
															color: primary
														}}
														onClick={event => {
															event.stopPropagation();
															this.setDefaultCensus(
																census.id
															);
														}}
													/>
												</Tooltip>

											)}
											<Tooltip title={translate.clone_census}>
												<FontAwesome
													name={"clone"}
													style={{
														cursor: "pointer",
														fontSize: "1.8em",
														marginLeft: "0.2em",
														color: primary
													}}
													onClick={event => {
														event.stopPropagation();
														this.setState({
															cloneModal: true,
															cloneIndex: index
														});
													}}
												/>
											</Tooltip>
											<Tooltip title={translate.delete}>
												<span>
													<CloseIcon
														style={{
															color: primary,
															marginTop: "-10px"
														}}
														onClick={event => {
															event.stopPropagation();
															this.setState({
																deleteModal: true,
																deleteCensus: census.id
															});
														}}
													/>
												</span>
											</Tooltip>
										</div>
									</TableCell>
								</TableRow>
							);
						})}
					</EnhancedTable>
				)}
				<AlertConfirm
					title={translate.send_to_trash}
					bodyText={translate.send_to_trash_desc}
					open={this.state.deleteModal}
					buttonAccept={translate.send_to_trash}
					buttonCancel={translate.cancel}
					modal={true}
					acceptAction={this.deleteCensus}
					requestClose={() => this.setState({ deleteModal: false })}
				/>
				<CloneCensusModal
					translate={translate}
					refetch={this.props.data.refetch}
					requestClose={() => this.setState({ cloneModal: false, cloneIndex: null})}
					open={this.state.cloneModal}
					census={!!censuses? 
						censuses.list[
							this.state.cloneIndex
						]
					:
						[]
					}
				/>
			</CardPageLayout>
		);
	}
}

export default compose(
	graphql(censuses, {
		name: "data",
		options: props => ({
			variables: {
				companyId: props.match.params.company,
				options: {
					limit: CENSUS_LIMITS[0],
					offset: 0
				}
			}
		})
	}),
	graphql(deleteCensus, {
		name: "deleteCensus"
	}),
	graphql(setDefaultCensus, {
		name: "setDefaultCensus"
	})
)(withSharedProps()(withRouter(CompanyCensusPage)));
