import React, { Component, Fragment } from "react";
import { councils, deleteCouncil } from "../../queries.js";
import { compose, graphql } from "react-apollo";
import {
	AlertConfirm,
	ErrorWrapper,
	LoadingSection,
	SectionTitle,
} from "../../displayComponents/index";
import Scrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import CouncilsList from './CouncilsList';
import CouncilsHistory from './CouncilsHistory';

class Councils extends Component {
	constructor(props) {
		super(props);
		this.state = {
			councilToDelete: "",
			deleteModal: false
		};
	}

	componentDidMount() {
		this.props.data.refetch();
	}

	openDeleteModal = councilID => {
		this.setState({
			deleteModal: true,
			councilToDelete: councilID
		});
	};
	deleteCouncil = async () => {
		this.props.data.loading = true;
		const response = await this.props.mutate({
			variables: {
				councilId: this.state.councilToDelete
			}
		});
		if (response) {
			this.setState({
				deleteModal: false
			});
			this.props.data.refetch();
		}
	};


	render() {
		const { translate } = this.props;
		const { loading, councils, error } = this.props.data;
		return (
			<div
				style={{
					height: "100%",
					overflow: "hidden",
					position: "relative"
				}}
			>
				<Scrollbar>
					<div style={{ padding: "2em" }}>
						<SectionTitle
							icon={this.props.icon}
							title={this.props.title}
							subtitle={this.props.desc}
						/>
						{loading ? (
							<LoadingSection />
						) : (
							<Fragment>
								{error ? (
									<div>
										{error.graphQLErrors.map(error => {
											return (
												<ErrorWrapper
													error={error}
													translate={translate}
												/>
											);
										})}
									</div>
								) : councils.length > 0 ? (
									this.props.link === "/history"? 
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
									bodyText={translate.send_to_trash_desc}
									open={this.state.deleteModal}
									buttonAccept={translate.send_to_trash}
									buttonCancel={translate.cancel}
									modal={true}
									acceptAction={this.deleteCouncil}
									requestClose={() =>
										this.setState({ deleteModal: false })
									}
								/>
							</Fragment>
						)}
					</div>
				</Scrollbar>
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
			}
		})
	})
)(Councils);
