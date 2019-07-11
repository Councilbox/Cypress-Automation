import React from "react";
import { Link } from "react-router-dom";
import { companyDrafts, deleteDraft } from "../../../queries/companyDrafts.js";
import { compose, graphql } from "react-apollo";
import CompanyDraftNew from "./CompanyDraftNew";
import {
	AlertConfirm,
	BasicButton,
	ButtonIcon,
	CardPageLayout,
	CloseIcon,
	Grid,
	GridItem,
	EnhancedTable,
	ErrorWrapper
} from "../../../displayComponents";
import { getPrimary, getSecondary } from "../../../styles/colors";
import { Card } from 'material-ui';
import { isMobile } from 'react-device-detect';
import { TableCell, TableRow } from "material-ui/Table";
import withSharedProps from "../../../HOCs/withSharedProps";
import { DRAFTS_LIMITS } from "../../../constants";
import TableStyles from "../../../styles/table";
import { bHistory } from "../../../containers/App";
import { sendGAevent } from "../../../utils/analytics.js";

class CompanyDraftList extends React.Component {
	state = {
		deleteModal: false,
		draftID: null,
		newForm: false
	}

	componentDidMount() {
		this.props.data.refetch();
		sendGAevent({
			category: 'Borradores',
			action: `Entrada a la lista`,
			label: this.props.company.businessName
		});
	}

	_renderDeleteIcon = draftID => {
		const primary = getPrimary();
		return (
			<CloseIcon
				style={{ color: primary }}
				onClick={event => {
					this.openDeleteModal(draftID);
					event.stopPropagation();
				}}
			/>
		);
	};

	openDeleteModal = draftID => {
		this.setState({
			deleteModal: true,
			draftID: draftID
		});
	};
	deleteDraft = async () => {
		this.props.data.loading = true;
		const response = await this.props.deleteDraft({
			variables: {
				id: this.state.draftID
			}
		});
		if (!response.errors) {
			this.props.data.refetch();
			this.setState({
				deleteModal: false
			});
		}
	};


	render() {
		const { translate, company } = this.props;
		const { companyDrafts, draftTypes, loading, error } = this.props.data;

		if (this.state.newForm) {
			return (
				<CompanyDraftNew
					translate={translate}
					closeForm={() => {
						this.setState({ newForm: false });
						this.props.data.refetch();
					}}
					company={company}
				/>
			);
		}

		return (
			<CardPageLayout title={translate.drafts}>
				<div style={{display: 'flex', justifyContent: isMobile? 'space-between' : 'flex-start', marginBottom: '1em'}}>
					<BasicButton
						text={translate.drafts_new}
						color={getPrimary()}
						textStyle={{
							color: "white",
							fontWeight: "700",
							textTransform: 'none'
						}}
						onClick={() =>
							this.setState({
								newForm: true
							})
						}
						icon={<ButtonIcon type="add" color="white" />}
					/>
					<Link
						to={`/company/${company.id}/platform/drafts/`}
						style={{ marginLeft: "1em" }}
					>
						<BasicButton
							text={translate.general_drafts}
							color={getSecondary()}
							textStyle={{
								color: "white",
								fontWeight: "700",
								textTransform: 'none'
							}}
							icon={<ButtonIcon type="add" color="white" />}
						/>
					</Link>
				</div>
				<React.Fragment>
					{error ? (
						<div>
							{error.graphQLErrors.map((error, index) => {
								return (
									<ErrorWrapper
										key={`error_${index}`}
										error={error}
										translate={translate}
									/>
								);
							})}
						</div>
					) : (
						!!companyDrafts && (
							<React.Fragment>
								<EnhancedTable
									translate={translate}
									defaultLimit={DRAFTS_LIMITS[0]}
									defaultFilter={"title"}
									limits={DRAFTS_LIMITS}
									page={1}
									loading={loading}
									length={companyDrafts.list.length}
									total={companyDrafts.total}
									refetch={this.props.data.refetch}
									headers={[
										{
											text: translate.name,
											name: "title",
											canOrder: true
										},
										{
											name: "type",
											text: translate.type,
											canOrder: true
										},
										{
											name: '',
											text: ''
										}
									]}
									action={this._renderDeleteIcon}
									companyID={this.props.company.id}
								>
									{companyDrafts.list.map(draft => {
										return (
											<HoverableRow
												key={`draft${draft.id}`}
												translate={translate}
												renderDeleteIcon={this._renderDeleteIcon}
												draft={draft}
												draftTypes={draftTypes}
												company={this.props.company}
											/>
										);
									})}
								</EnhancedTable>
							</React.Fragment>
						)
					)}

					<AlertConfirm
						title={translate.attention}
						bodyText={translate.question_delete}
						open={this.state.deleteModal}
						buttonAccept={translate.delete}
						buttonCancel={translate.cancel}
						modal={true}
						acceptAction={this.deleteDraft}
						requestClose={() =>
							this.setState({ deleteModal: false })
						}
					/>
				</React.Fragment>
			</CardPageLayout>
		);
	}
}

class HoverableRow extends React.Component {

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

	render() {
		const { draft, draftTypes, translate } = this.props;

		if(isMobile){
            return(
                <Card
                    style={{marginBottom: '0.5em', padding: '0.3em', position: 'relative'}}
					onClick={() => { bHistory.push(`/company/${this.props.company.id}/draft/${draft.id}`);
				}}
                >
                    <Grid>
                        <GridItem xs={4} md={4} style={{fontWeight: '700'}}>
                            {translate.name}
                        </GridItem>
                        <GridItem xs={7} md={7}>
							{draft.title}
                        </GridItem>

						<GridItem xs={4} md={4} style={{fontWeight: '700'}}>
                            {translate.type}
                        </GridItem>
                        <GridItem xs={7} md={7}>
							{translate[draftTypes[draft.type].label]}
                        </GridItem>
                    </Grid>
                    <div style={{position: 'absolute', top: '5px', right: '5px'}}>
						{this.props.renderDeleteIcon(draft.id)}
                    </div>
                </Card>
            )
        }

		return (
			<TableRow
				hover
				onMouseOver={this.mouseEnterHandler}
				onMouseLeave={this.mouseLeaveHandler}
				onClick={() => {
					bHistory.push(
						`/company/${
							this.props.company
								.id
						}/draft/${draft.id}`
					);
				}}
			>
				<TableCell
					style={TableStyles.TD}
				>
					{draft.title}
				</TableCell>
				<TableCell>
					{translate[draftTypes[draft.type].label]}
				</TableCell>
				<TableCell>
					<div style={{width: '3em'}}>
						{this.state.showActions && this.props.renderDeleteIcon(
							draft.id
						)}
					</div>
				</TableCell>
			</TableRow>
		)
	}
}

export default withSharedProps()(
	compose(
		graphql(deleteDraft, {
			name: "deleteDraft",
			options: {
				errorPolicy: "all"
			}
		}),
		graphql(companyDrafts, {
			name: "data",
			options: props => ({
				variables: {
					companyId: props.company.id,
					options: {
						limit: DRAFTS_LIMITS[0],
						offset: 0
					}
				},
				notifyOnNetworkStatusChange: true
			})
		})
	)(CompanyDraftList)
);
