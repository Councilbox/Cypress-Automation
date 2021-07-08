import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import {
	Card, MenuItem, Typography, withStyles, CardHeader
} from 'material-ui';
import {
	AlertConfirm,
	Icon,
	LoadingSection,
	Scrollbar,
	TextInput,
	GridItem,
	Grid
} from '../../../../../displayComponents';
import { DELEGATION_USERS_LOAD } from '../../../../../constants';
import { councilParticipantsFilterIds } from '../../../../../queries/councilParticipant';
import { isMobile } from '../../../../../utils/screen';


const styles = {
	input: {
		'&::placeholder': {
			textOverflow: 'ellipsis !important',
			color: '#0000005c'
		}
	}
};

const DelegationsRestrictionModal = ({
	open, data, translate, participantsTable, participantId = null, ...props
}) => {
	const loadMore = () => {
		data.fetchMore({
			variables: {
				options: {
					offset: data.councilParticipantsFilterIds.list.length,
					limit: DELEGATION_USERS_LOAD
				}
			},
			updateQuery: (prev, { fetchMoreResult }) => {
				if (!fetchMoreResult) {
					return prev;
				}
				return {
					...prev,
					councilParticipantsFilterIds: {
						...prev.councilParticipantsFilterIds,
						list: [
							...prev.councilParticipantsFilterIds.list,
							...fetchMoreResult.councilParticipantsFilterIds.list
						]
					}
				};
			}
		});
	};


	const close = () => {
		props.requestClose();
	};

	const updateFilterText = async text => {
		await data.refetch({
			filters: [
				{
					field: 'fullName',
					text
				}
			]
		});
	};

	React.useEffect(() => {
		data.refetch();
	}, [participantsTable]);


	function renderBody() {
		const { loading } = data;
		let participants = {};
		if (data.councilParticipantsFilterIds) {
			participants = loading ?
				[]
				: data.councilParticipantsFilterIds.list;
		}
		const { total } = loading ?
			0
			: data.councilParticipantsFilterIds;
		const rest = total - participants.length - 1;

		return (
			<div style={{ height: '100%', overflow: 'hidden' }}>
				<Grid>
					<GridItem xs={12} lg={12} md={12} >
						<TextInput
							placeholder={translate.search}
							adornment={<Icon>search</Icon>}
							type="text"
							// value={searchModalPlantillas}
							styleInInput={{
								fontSize: '12px', color: 'rgba(0, 0, 0, 0.54)', background: '#f0f3f6', paddingLeft: '5px'
							}}
							classes={{ input: props.classes.input, formControl: props.classes.formControl }}
							disableUnderline={true}
							stylesAdornment={{ background: '#f0f3f6', marginLeft: '0', paddingLeft: '8px' }}
							onChange={event => {
								updateFilterText(event.target.value);
							}}
						/>
					</GridItem>
				</Grid>
				<div style={{
					marginTop: '1em', borderTop: '2px solid #dcdcdc', overflow: 'hidden', height: isMobile ? 'calc( 100% - 5em )' : '100%',
				}}>
					{loading ? (
						<LoadingSection />
					) : (
						<Scrollbar>
							<Grid style={{ width: '95%', margin: '0 auto', marginTop: '1em' }}>
								<GridItem xs={12} lg={12} md={12} >
									<Grid style={{ display: 'flex' }}>
										{participants.length > 0 ? (
											<React.Fragment>
												{participants
													.filter(participant => participant.id !== participantId)
													.map((participant, index) => (
														<CardPlantillas
															translate={translate}
															key={`delegateVote_${participant.id}`}
															item={participant}
															onClick={() => {
																const { __typename, representative, ...restData } = participant;
																props.updateRepresentative(restData);
																close();
															}}
															index={index}
														/>
													))}
												{participants.length < total - 1 && (
													<Card
														style={{
															width: '90%',
															border: '2px solid grey',
															margin: 'auto',
															marginBottom: '1.2em',
															marginTop: '0.6em',
															cursor: 'pointer',
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center'
														}}
														elevation={1}
														onClick={loadMore}
													>
														<MenuItem style={{
															padding: 0, width: '100%', height: '2em', display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'center'
														}}>
															{`DESCARGAR ${rest > DELEGATION_USERS_LOAD ?
																	`${DELEGATION_USERS_LOAD} de ${rest} RESTANTES`
																: translate.all_plural.toLowerCase()
																}`
															}
															{loading
																&& <div>
																	<LoadingSection size={25} />
																</div>
															}
														</MenuItem>
													</Card>
												)}
											</React.Fragment>
										) : (
											<Typography>{translate.no_results}</Typography>
										)}
									</Grid>
								</GridItem>
							</Grid>
						</Scrollbar>
					)}
				</div>
			</div>
		);
	}


	return (
		<AlertConfirm
			requestClose={close}
			open={open}
			widthModal={{ height: '100%' }}
			buttonCancel={translate.close}
			bodyText={renderBody()}
			title={translate.select}
			bodyStyle={{
				minWidth: '50vw',
				overflow: isMobile && 'hidden',
				width: isMobile && '100%',
				height: isMobile && '100%'
			}}
		/>
	);
};

const regularCardStyle = {
	cardTitle: {
		fontSize: '1em',
	},
	content: {
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		maxWidth: '100%'
	}
};


const CardPlantillas = withStyles(regularCardStyle)(({
	item, classes, onClick, index
}) => {
	const [hover, setHover] = React.useState(false);

	const mouseEnterHandler = () => {
		setHover(true);
	};

	const mouseLeaveHandler = () => {
		setHover(false);
	};

	return (
		<React.Fragment>
			<GridItem xs={12} lg={5} md={5}>
				<Card
					style={{
						boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
						marginBottom: '1em'
					}}>
					<CardHeader
						onMouseOver={mouseEnterHandler}
						onMouseLeave={mouseLeaveHandler}
						style={{
							color: '#000000',
							padding: '1em',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							cursor: 'pointer',
							background: hover && 'gainsboro'
						}}
						title={
							<div
								style={{
									textAlign: 'center',
									whiteSpace: 'nowrap',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									width: '100%'
								}}
							>
								{`${item.name} ${item.surname}` || ''}
							</div>
						}
						classes={{
							title: classes.cardTitle,
							content: classes.content,
						}}

						onClick={onClick}
					/>
				</Card>
			</GridItem>
			{index % 2 === 0
				&& <GridItem xs={2} lg={2} md={2}></GridItem>
			}
		</React.Fragment>
	);
});


export default graphql(councilParticipantsFilterIds, {
	options: props => ({
		variables: {
			councilId: props.council.id,
			options: {
				limit: DELEGATION_USERS_LOAD,
				offset: 0,
				orderBy: 'fullName',
				orderDirection: 'asc'
			}
		},
		forceFetch: true,
		notifyOnNetworkStatusChange: true
	})
})(withApollo(withStyles(styles)(DelegationsRestrictionModal)));
