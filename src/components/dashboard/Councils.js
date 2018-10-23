import React from "react";
import { councils, deleteCouncil } from "../../queries.js";
import { compose, graphql } from "react-apollo";
import {
	AlertConfirm,
	ErrorWrapper,
	Scrollbar,
	BasicButton,
	Grid,
	GridItem,
	LoadingSection,
	MainTitle,
} from "../../displayComponents/index";
import { isLandscape } from '../../utils/screen';
import { getSecondary } from '../../styles/colors';
import "react-perfect-scrollbar/dist/css/styles.css";
import withWindowSize from '../../HOCs/withWindowSize';
import CouncilsList from './CouncilsList';
import CouncilsHistory from './CouncilsHistory';
import CouncilsFilters from './CouncilsFilters';


class Councils extends React.Component {
	state = {
		councilToDelete: "",
		deleteModal: false,
		selectedIds: new Map()
	};

	componentDidMount() {
		this.props.data.refetch();
	}

	select = id => {
        if(this.state.selectedIds.has(id)){
            this.state.selectedIds.delete(id);
        } else {
            this.state.selectedIds.set(id, 'selected');
        }

        this.setState({
            selectedIds: new Map(this.state.selectedIds)
        });
	}

	selectAll = () => {
		const newSelected = new Map();
		if(this.state.selectedIds.size !== this.props.data.councils.length){
			this.props.data.councils.forEach(council => {
				newSelected.set(council.id, 'selected');
			})
		}

		this.setState({
			selectedIds: newSelected
		});
	}

	openDeleteModal = councilID => {
		if(Number.isInteger(councilID)){
			if(!this.state.selectedIds.has(councilID)){
				this.state.selectedIds.set(councilID, 'selected');
			}
		}
		this.setState({
			deleteModal: true,
			selectedIds: new Map(this.state.selectedIds)
		});
	};

	deleteCouncil = async () => {
		this.props.data.loading = true;
		const response = await this.props.mutate({
			variables: {
				councilId: Array.from(this.state.selectedIds.keys())
			}
		});
		if (response) {
			this.setState({
				deleteModal: false,
				selectedIds: new Map()
			});
			this.props.data.refetch();
		}
	};

	mobileLandscape = () => {
		return this.props.windowSize === 'xs' && isLandscape();
	}


	render() {
		const { translate } = this.props;
		const { loading, councils, error } = this.props.data;
		return (
			<div
				style={{
					height: '100%',
					width: '100%',
					overflow: "hidden",
					position: "relative"
				}}
			>
				<div style={{ width: '100%', height: '100%', padding: '1em' }}>
					<MainTitle
						icon={this.props.icon}
						title={this.props.title}
						size={this.props.windowSize}
						subtitle={this.props.desc}
					/>
					<Grid style={{marginTop: '0.6em'}}>
						<GridItem xs={4} md={8} lg={9}>
							{this.state.selectedIds.size > 0 &&
								<BasicButton
									text={this.state.selectedIds.size === 1? translate.delete_one_item : `${translate.new_delete} ${this.state.selectedIds.size} ${translate.items}`}
									color={getSecondary()}
									textStyle={{color: 'white', fontWeight: '700'}}
									onClick={this.openDeleteModal}
								/>
							}
						</GridItem>
						<GridItem xs={8} md={4} lg={3}>
							<CouncilsFilters refetch={this.props.data.refetch} />
						</GridItem>
					</Grid>
					{loading ? (
						<div style={{
							width: '100%',
							marginTop: '8em',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}>
							<LoadingSection />
						</div>
					) : (
							<div style={{ height: `calc(100% - ${this.mobileLandscape()? '7em' : '13.5em'})`, overflow: 'hidden' }}>
								<Scrollbar>
									<div style={{ padding: "1em", paddingTop: '2em'}}>
										{false ? (
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
										) : councils.length > 0 ? (
											this.props.link === "/history" || this.props.link === "/finished" ?
												<CouncilsHistory
													councils={councils}
													openDeleteModal={this.openDeleteModal}
													translate={translate}
													company={this.props.company}
												/>
												: (

													<CouncilsList
														openDeleteModal={this.openDeleteModal}
														translate={translate}
														select={this.select}
														selectAll={this.selectAll}
														selectedIds={this.state.selectedIds}
														councils={councils}
														company={this.props.company}
														link={this.props.link}
													/>
												)
										) : (
													<span>{translate.no_results}</span>
												)}
										<AlertConfirm
											title={translate.send_to_trash}
											bodyText={'¿Desea enviar el elemento/s a la papelera? Una vez allí podrá recuperarlo/s contactando con el soporte técnico'}
											open={this.state.deleteModal}
											buttonAccept={translate.send_to_trash}
											buttonCancel={translate.cancel}
											modal={true}
											acceptAction={this.deleteCouncil}
											requestClose={() =>
												this.setState({ deleteModal: false })
											}
										/>
									</div>
								</Scrollbar>
							</div>
						)}
				</div>
			</div>
		);
	}
}

export default compose(
	graphql(deleteCouncil),
	graphql(councils, {
		name: "data",
		options: props => ({
			variables: {
				state: props.state,
				companyId: props.company.id,
				isMeeting: false,
				active: 1
			},
			errorPolicy: 'all'
		})
	})
)(withWindowSize(Councils));
