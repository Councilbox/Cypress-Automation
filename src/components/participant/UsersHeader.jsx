import React from 'react';
import { Drawer, withStyles, Divider } from 'material-ui';
import { withApollo, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { LoadingSection, Scrollbar, } from '../../displayComponents';
import * as CBX from '../../utils/CBX';
import { usePolling } from '../../hooks';
import { isMobile } from '../../utils/screen';

const roomLiveParticipantsOnline = gql`
	query roomLiveParticipantsOnline ( $councilId: Int!, $filters: [FilterInput], $options: OptionsInput ) {
		roomLiveParticipantsOnline( councilId: $councilId, filters: $filters, options: $options) {
			list {
				id
				state
				councilId
				name
				personOrEntity
				position
				type
				assistanceLastDateConfirmed
				online
				requestWord
				numParticipations
				surname
			}
			total
		}
		roomLiveParticipantsPresents( councilId: $councilId, filters: $filters, options: $options ) {
			list {
				id
				state
				councilId
				name
				personOrEntity
				position
				email
				phone
				dni
				type
				signed
				assistanceIntention
				assistanceLastDateConfirmed
				online
				requestWord
				numParticipations
				surname
			}
			total
		}
	}
`;

const UsersHeader = graphql(gql`
		subscription participantsOnlineCount($councilId: Int!){
			participantsOnlineCount(councilId: $councilId){
				online
				presents
		}
    }`, {
	name: 'onlineCount',
	options: props => ({
		variables: {
			councilId: props.council.id
		}
	})
})(({ council, classes, client, drawerTop, setDrawerTop, onlineCount }) => {
	const [recount, setRecount] = React.useState({
		online: null,
		presents: null
	});
	const [participantsOnline, setParticipantsOnline] = React.useState(false);
	const [participantsPresents, setParticipantsPresents] = React.useState(false);
	const [state, setState] = React.useState({
		loading: true,
		loadingPresents: true,
		loadingPresentsAll: true,
		showModal: false,
		filters: '',
		offsetOnline: 0,
		offsetPresencial: 0
	});

	React.useEffect(() => {
		if (onlineCount.participantsOnlineCount) {
			setRecount(onlineCount.participantsOnlineCount);
		}
	}, [JSON.stringify(onlineCount)]);

	const getParticipantsOnline = async () => {
		const response = await client.query({
			query: roomLiveParticipantsOnline,
			variables: {
				councilId: council.id
			}
		});

		setParticipantsOnline(response.data.roomLiveParticipantsOnline);
		setParticipantsPresents(response.data.roomLiveParticipantsPresents);
		setRecount({
			...recount,
			online: response.data.roomLiveParticipantsOnline.total,
			presents: response.data.roomLiveParticipantsPresents.total
		});
		setState(oldState => ({ ...oldState, loading: false }));
	};

	const getData = () => {
		getParticipantsOnline();
	};

	React.useEffect(() => {
		getData();
	}, [council.id]);

	React.useEffect(() => {
		if (drawerTop) {
			getData();
		}
	}, [drawerTop]);

	usePolling(getData, drawerTop ? 8000 : 100000);

	return (
		<div
			style={{
				height: '3em',
				display: 'flex',
				flexDirection: 'row',
				width: '100%',
				justifyContent: 'space-between',
				alignItems: 'center',
				background: '#483962',
			}}
		>
			<div style={{ marginLeft: '1em ', marginRight: '1em', color: 'white', display: 'flex', justifyContent: 'center', fontSize: '16px' }}>
				<div
					style={{
						marginRight: '0.7em',
						padding: '0px 12px',
						background: '#75569b',
						borderRadius: '6px',
						cursor: 'pointer',
						display: 'flex',
						alignItems: 'center'
					}}
					onClick={event => setDrawerTop(event)}
				>
					<i className="fa fa-users" aria-hidden="true" style={{ marginRight: '5px', }}></i>
					{state.loading ?
						<div style={{ width: '1em', height: '1.4em' }}><LoadingSection size={'1em'} /></div>
						: <span style={{ fontSize: '15px' }} >{recount.online + recount.presents}</span>
					}

				</div>
				<div style={{ marginRight: '0.7em', padding: '2px 0px', display: 'flex', alignItems: 'center' }}>
					<i className="fa fa-globe" aria-hidden="true" style={{ marginRight: '5px' }}></i>
					{state.loading ?
						<div style={{ width: '1em', height: '1.4em' }}><LoadingSection size={'1em'} /></div>
						:
						recount.online
					}
				</div>
				<div style={{ marginRight: '0.7em', padding: '2px 0px', display: 'flex', alignItems: ' center' }}>
					<i className="material-icons" aria-hidden="true" style={{ marginRight: '5px', fontSize: '20px' }}>face</i>
					{state.loading ?
						<div style={{ width: '1em', height: '1.4em' }}><LoadingSection size={'1em'} /></div>
						: recount.presents
					}
				</div>
			</div>
			{drawerTop &&
				<Drawer
					className={isMobile ? 'drawerUsersRoot' : 'drawerUsersRootPc'}
					BackdropProps={{
						className: 'drawerUsers'
					}}
					classes={{
						paperAnchorTop: classes.paperAnchorTop,
					}}
					anchor="top"
					open={drawerTop}
					onClose={event => setDrawerTop(event)}
				>


					<div style={{ marginTop: '0.5em', marginBottom: '0.5em', height: '100%', }}>
						<Scrollbar>
							<div style={{ marginLeft: '1.3em' }}>
								<div style={{ display: 'flex', alignItems: 'center', marginBottom: '1em' }} ><i className={'fa fa-globe'} style={{ marginRight: '0.5em' }}></i>Online</div>
								{state.loading ?
									<LoadingSection />
									:
									participantsOnline.list.map(item => {
										return (
											<div key={item.id} style={{ display: 'flex', alignItems: 'center', fontSize: '14px', marginBottom: '0.2em', width: '90%' }} >
												{CBX.haveGrantedWord(item) &&
													<i className={'fa fa-video-camera'} style={{ marginRight: '0.5em', color: item.online === 1 ? 'white' : 'darkgrey' }}></i>
												}
												{CBX.isAskingForWord(item) &&
													<i className={'material-icons'} style={{ marginRight: '0.5em', fontSize: '12px', color: item.online === 1 ? 'white' : 'darkgrey' }}>pan_tool</i>
												}
												{item.requestWord === 3 &&
													<i className={'material-icons'} style={{ marginRight: '0.5em', fontSize: '12px', color: item.online === 1 ? 'white' : 'darkgrey' }}>input</i>
												}
												<div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: item.online === 1 ? 'white' : 'darkgrey' }} >
													{`${item.name} ${item.surname || ''}`}
												</div>
											</div>
										);
									})
								}

							</div>

							<Divider
								style={{ background: '#ffffff4a', margin: '1.2em 0px' }}
							/>
							<div style={{ marginLeft: '1.3em' }}>
								<div style={{ display: 'flex', alignItems: 'center', marginBottom: '1em' }} ><i className="material-icons" aria-hidden="true" style={{ marginRight: '5px', fontSize: '18px' }}>face</i>Presencial</div>
								{state.loading ?
									<LoadingSection />
									:
									participantsPresents.list.map(item => {
										return (
											<div key={`${item.id}_presents`} style={{ display: 'flex', alignItems: 'center', fontSize: '14px', marginBottom: '0.2em', width: '90%' }} >
												<div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', }} >
													{`${item.name} ${item.surname || ''}`}
												</div>
											</div>
										);
									}
									)
								}
							</div>
						</Scrollbar>
					</div>
				</Drawer>
			}
		</div>
	);
});

const styles = {
	paperAnchorTop: {
		top: isMobile ? '88px' : '104px',
		left: !isMobile && '10px',
		width: '200px!important',
		maxHeight: 'calc( 100% - 10rem )!important',
		background: '#74559bed',
		color: 'white',
		boxShadow: 'none',
		borderRadius: isMobile && '5px',
		height: '100%',
		overflow: 'hidden'
	},
	paper: {
		top: '88px',
		width: '200px!important',
		height: '100%'
	}
};


export default withStyles(styles)(withApollo(UsersHeader));
