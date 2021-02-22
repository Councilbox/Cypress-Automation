import React from 'react';
import { Drawer } from 'material-ui';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {
	darkGrey,
	getPrimary,
	getSecondary,
	lightGrey
} from '../../../styles/colors';
import { wallComments } from '../../../queries';
import { Icon, LoadingSection, Scrollbar } from '../../../displayComponents';
import { moment } from '../../../containers/App';

const CommentWall = ({
	open, data, council, translate, subscribeToWallComments, requestClose, updateState, unreadComments
}) => {
	const [commentsRead, setCommentsRead] = React.useState(sessionStorage.getItem(`readMessages_${council.id}`) || 0);
	const scrollbar = React.useRef();

	React.useEffect(() => {
		if (open && !data.loading) {
			sessionStorage.setItem(`readMessages_${council.id}`, data.councilRoomMessages.length);
			scrollbar.current.scrollToBottom();
		}
		if (!open && !data.loading) {
			setCommentsRead(data.councilRoomMessages.length);
		}
	}, [open]);

	React.useEffect(() => {
		if (!data.loading) {
			const newUnread = data.councilRoomMessages.length - sessionStorage.getItem(`readMessages_${council.id}`);

			if (newUnread !== unreadComments) {
				updateState({
					unreadComments: newUnread
				});
			}
		}
	}, [data]);

	React.useEffect(() => {
		subscribeToWallComments({
			councilId: council.id
		});
	}, [council.id]);

	return (
		<>
			{open
				&& <Drawer
					style={{
						zIndex: -1,
						width: '300px'
					}}
					anchor="right"
					variant="persistent"
					open={open}
					onClose={() => requestClose(data.councilRoomMessages.length)}
				>
					<div
						style={{
							height: '100%',
							width: '300px',
							paddingTop: '3em',
							overflow: 'hidden'
						}}
					>
						<div
							style={{
								display: 'flex',
								cursor: 'pointer',
								alignItems: 'center',
								justifyContent: 'space-between',
								paddingLeft: '0.8em',
								fontSize: '0.90rem',
								width: '100%',
								height: '3.5em',
								fontWeight: '700',
								backgroundColor: darkGrey,
								textTransform: 'uppercase',
								color: 'grey'
							}}
							onClick={requestClose}
						>
							{translate.wall}
							<Icon
								className="material-icons"
								style={{
									color: 'grey',
									marginRight: '1.1em'
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
									width: '100%',
									height: '100%',
									overflow: 'hidden',
									paddingBottom: '3em',
									position: 'relative'
								}}
							>
								<Scrollbar ref={scrollbar}>
									{data.councilRoomMessages.map((comment, index) => (
										<div
											key={`comment_${comment.id}`}
											style={{
												fontSize: '0.85rem',
												padding: '1em 0.8em',
												fontWeight: (index + 1) > commentsRead ? '700' : '400',
												backgroundColor:
													comment.participantId === -1 ?
														lightGrey
														: 'transparent'
											}}
										>
											<div
												style={{
													display: 'flex',
													flexDirection: 'row',
													justifyContent: 'space-between'
												}}
											>
												<div>
													{comment.author ? (
														<span
															style={{
																fontWeight: '700',
																color: getPrimary()
															}}
														>{`${comment.author.name} ${comment.author.surname || ''} ${
																comment.author.position ? `- ${comment.author.position}` : ''}
														`}</span>
													) : (
														<span
															style={{
																fontWeight: '700',
																color: getSecondary()
															}}
														>
															Room
														</span>
													)}
												</div>
												<div>
													{moment(comment.date).format(
														'HH:mm'
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
			}
		</>
	);
};


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
			councilId: +props.council.id
		},
		pollInterval: 30000
	}),
	props: props => ({
		...props,
		subscribeToWallComments: params => props.data.subscribeToMore({
			document: roomMessagesSubscription,
			variables: {
				councilId: +params.councilId
			},
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data.roomMessageAdded) {
					return prev;
				}

				const messagesMap = new Map();

				const newMessageList = [
					...prev.councilRoomMessages,
					...[subscriptionData.data.roomMessageAdded]
				];

				newMessageList.forEach(message => {
					messagesMap.set(message.id, message);
				});

				return ({
					councilRoomMessages: Array.from(messagesMap.values())
				});
			}
		})
	})
})(CommentWall);
