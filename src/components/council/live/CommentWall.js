import React from "react";
import { Drawer } from "material-ui";
import { graphql } from "react-apollo";
import {
	darkGrey,
	getPrimary,
	getSecondary,
	lightGrey
} from "../../../styles/colors";
import { wallComments } from "../../../queries";
import gql from 'graphql-tag';
import { Icon, LoadingSection, Scrollbar } from "../../../displayComponents";
//import Scrollbar from "react-perfect-scrollbar";
import { moment } from '../../../containers/App';

class CommentWall extends React.Component {
	state = {
		commentsRead: 0,
		subscribed: false
	};

	static getDerivedStateFromProps(nextProps) {
		if (nextProps.open && !nextProps.data.loading) {
			return {
				commentsRead: nextProps.data.councilRoomMessages.length
			};
		}

		return null;
	}

	componentDidUpdate(prevProps, prevState) {
		if (!this.props.data.loading && this.props.unreadComments !== this.props.data.councilRoomMessages.length - this.state.commentsRead) {
			this.props.updateState({
				unreadComments:
					this.props.data.councilRoomMessages.length -
					this.state.commentsRead
			});
		}

		if(prevProps.data.loading && !this.props.data.loading && !this.state.subscribed){
			this.props.subscribeToWallComments({
				councilId: this.props.council.id
			});
			this.setState({
				subscribed: true
			});
		}
	}

	render() {
		const { data, translate, open, requestClose } = this.props;
		return (
			<Drawer
				style={{
					zIndex: -1,
					width: "300px"
				}}
				anchor="right"
				variant="persistent"
				open={open}
				onClose={() => requestClose(data.councilRoomMessages.length)}
			>
				<div
					style={{
						height: "100%",
						width: "300px",
						paddingTop: "3em",
						overflow: "hidden"
					}}
				>
					<div
						style={{
							display: "flex",
							cursor: "pointer",
							alignItems: "center",
							justifyContent: "space-between",
							paddingLeft: "0.8em",
							fontSize: "0.90rem",
							width: "100%",
							height: "3.5em",
							backgroundColor: darkGrey,
							textTransform: "uppercase",
							color: "grey"
						}}
						onClick={requestClose}
					>
						{translate.wall}
						<Icon
							className="material-icons"
							style={{
								color: "grey",
								marginRight: "1.1em"
							}}
						>
							keyboard_arrow_right
						</Icon>
					</div>
					{data.loading ? (
						<LoadingSection />
					) : (
						<div
							style={{
								width: "100%",
								height: "100%",
								overflow: "hidden",
								paddingBottom: "3em",
								position: "relative"
							}}
						>
							<Scrollbar>
								{data.councilRoomMessages.map(comment => (
									<div
										key={`comment_${comment.id}`}
										style={{
											fontSize: "0.85rem",
											padding: "1em 0.8em",
											backgroundColor:
												comment.participantId === -1
													? lightGrey
													: "transparent"
										}}
									>
										<div
											style={{
												display: "flex",
												flexDirection: "row",
												justifyContent: "space-between"
											}}
										>
											<div>
												{comment.author ? (
													<span
														style={{
															fontWeight: "700",
															color: getPrimary()
														}}
													>{`${comment.author.name} ${
														comment.author.surname
													} - ${
														comment.author.position
													}`}</span>
												) : (
													<span
														style={{
															fontWeight: "700",
															color: getSecondary()
														}}
													>
														Room
													</span>
												)}
											</div>
											<div>
												{moment(comment.date).format(
													"HH:mm"
												)}
											</div>
										</div>
										{comment.text}
									</div>
								))}
							</Scrollbar>
						</div>
					)}
				</div>
			</Drawer>
		);
	}
}

const roomMessagesSubscription = gql`
  subscription roomMessageAdded($councilId: Int!) {
    roomMessageAdded(councilId: $councilId) {
        id
		participantId
		text
		date
		author {
			name
			participantId
			surname
			position
			id
		}
    }
  }
`;

export default graphql(wallComments, {
	options: props => ({
		variables: {
			councilId: props.council.id
		},
		pollInterval: 5000
	}),
	props: props => {
		return {
		  ...props,
		  subscribeToWallComments: params => {
			return props.data.subscribeToMore({
			  document: roomMessagesSubscription,
			  variables: {
				councilId: params.councilId
			  },
			  updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data.roomMessageAdded) {
				  return prev;
				}
				console.log(prev);
				console.log(subscriptionData);
				return ({
					councilRoomMessages: [
						...prev.councilRoomMessages,
						...[subscriptionData.data.roomMessageAdded]
					]
				});
			  }
			});
		  }
		};
	  }
})(CommentWall);
