import React from "react";
import { councils, deleteCouncil } from "../../queries.js";
import { compose, graphql } from "react-apollo";
import {
	AlertConfirm,
	ErrorWrapper,
	Scrollbar,
	LoadingSection,
	SectionTitle,
} from "../../displayComponents/index";
import "react-perfect-scrollbar/dist/css/styles.css";
import CouncilsList from './CouncilsList';
import CouncilsHistory from './CouncilsHistory';


class Councils extends React.Component {
	state = {
		councilToDelete: "",
		deleteModal: false
	};

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
					height: '100%',
					width: '100%',
					overflow: "hidden",
					position: "relative"
				}}
			>
				<div style={{ width: '100%', height: '100%', padding: '1em' }}>
					<SectionTitle
						icon={this.props.icon}
						title={this.props.title}
						subtitle={this.props.desc}
					/>
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
						<div style={{height: 'calc(100% - 10.5em)', overflow: 'hidden'}}>
							<Scrollbar>
								<div style={{padding: "1em", paddingTop: '2em'}}> 
									{false ? (
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
)(Councils);
