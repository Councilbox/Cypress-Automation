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
import EditCensusModal from './censusEditor/modals/EditCensusModal';
import { bHistory } from "../../../containers/App";
import { CENSUS_LIMITS } from "../../../constants";

class CompanyCensusPage extends React.Component {
	state = {
		deleteModal: false,
		cloneModal: false,
		editId: false,
		index: 0,
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

	updateState = object => {
		this.setState({
			...object
		})
	}

	openCensusEdit = censusId => {
		bHistory.push(`/company/${this.props.company.id}/census/${censusId}`);
	};

	render() {
		const { translate, company } = this.props;
		const { loading, censuses } = this.props.data;

		return (
			<CardPageLayout title={translate.censuses_list}>
				{!!censuses && (
					<EnhancedTable
						translate={translate}
						defaultLimit={CENSUS_LIMITS[0]}
						defaultFilter={"censusName"}
						limits={CENSUS_LIMITS}
						page={1}
						menuButtons={
							<div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
								<div>
									<AddCensusButton
										translate={translate}
										company={company}
										refetch={this.props.data.refetch}
									/>
								</div>
							</div>
						}
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
								<HoverableRow
									census={census}
									key={`census_${census.id}`}
									changingDefault={this.state.changingDefault}
									openCensusEdit={this.openCensusEdit}
									updateState={this.updateState}
									setDefaultCensus={this.setDefaultCensus}
									index={index}
									translate={translate}
								/>
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
					user={this.props.user}
					refetch={this.props.data.refetch}
					requestClose={() => this.setState({ cloneModal: false, index: null})}
					open={this.state.cloneModal}
					census={!!censuses?
						censuses.list[this.state.index]
					:
						[]
					}
				/>
				{!!this.state.editId &&
					<EditCensusModal
						translate={translate}
						censusId={this.state.editId}
						open={!!this.state.editId}
						requestClose={() => this.setState({
							editId: null
						})}
					/>
				}

			</CardPageLayout>
		);
	}
}

class HoverableRow extends React.PureComponent {

    state = {
        showActions: false
    }

    mouseEnterHandler = () => {
        this.setState({
            showActions: true
        })
    }

    mouseLeaveHandler = () => {
        this.setState({
            showActions: false
        })
    }

    deleteIcon = (councilID) => {
        const primary = getPrimary();

        return (
            <CloseIcon
                style={{ color: primary }}
                onClick={event => {
                    this.props.openDeleteModal(councilID);
                    event.stopPropagation();
                }}
            />
        );
    }


    render() {
        const { census, company, link, translate } = this.props;
		const primary = getPrimary();


        return (
			<TableRow
				hover
				onMouseEnter={this.mouseEnterHandler}
				onMouseLeave={this.mouseLeaveHandler}
				style={{ cursor: "pointer" }}
			>
				<TableCell>
					{census.censusName}
					{census.defaultCensus === 1 &&
						<FontAwesome
							name={"star"}
							style={{
								cursor: "pointer",
								fontSize: "1.5em",
								marginLeft: '0.6em',
								color: primary
							}}
						/>
					}
				</TableCell>
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
					{this.state.showActions?
						<div style={{ float: "right" }}>
							{census.id ===
							this.props.changingDefault ? (
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
											this.props.setDefaultCensus(
												census.id
											);
										}}
									/>
								</Tooltip>

							)}
							<Tooltip title={'Administrar participantes'}>
								<FontAwesome
									name={"users"}
									style={{
										cursor: "pointer",
										fontSize: "1.8em",
										marginLeft: "0.2em",
										color: primary
									}}
									onClick={event => {
										event.stopPropagation();
										this.props.openCensusEdit(census.id)
									}}
								/>
							</Tooltip>
							<Tooltip title={translate.edit}>
								<FontAwesome
									name={"edit"}
									style={{
										cursor: "pointer",
										fontSize: "1.8em",
										marginLeft: "0.2em",
										color: primary
									}}
									onClick={event => {
										event.stopPropagation();
										this.props.updateState({
											editId: census.id
										});
									}}
								/>
							</Tooltip>
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
										this.props.updateState({
											cloneModal: true,
											index: this.props.index
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
											this.props.updateState({
												deleteModal: true,
												deleteCensus: census.id
											});
										}}
									/>
								</span>
							</Tooltip>
						</div>
					:
						<div style={{width: '12.5em'}} />
					}
				</TableCell>
			</TableRow>
        )
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
