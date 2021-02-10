import React from 'react';
import { Typography, Tooltip } from 'material-ui';
import { withApollo } from 'react-apollo';
import { getSecondary } from '../styles/colors';
import * as CBX from '../utils/CBX';
import DenyVote from '../components/council/live/participants/DenyVote';
import { moment } from '../containers/App';
import withSharedProps from '../HOCs/withSharedProps';
import BasicButton from './BasicButton';
import TextInput from './TextInput';
import { useParticipantContactEdit } from '../hooks';
import { COUNCIL_TYPES, PARTICIPANT_STATES } from '../constants';

const ParticipantDisplay = ({
 participant, translate, refetch, council, delegate, company, client, canEdit
}) => {
	const {
		edit,
		setEdit,
		saving,
		success,
		email,
		setEmail,
		phone,
		setPhone,
		errors,
		updateParticipantContactInfo
	} = useParticipantContactEdit({
 participant, client, translate, council
});

	const secondary = getSecondary();


	return (
		<div style={{ padding: '0.5em' }}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center'
				}}
			>
				<div
					style={{
						width: '2em',
						display: 'flex',
						justifyContent: 'center'
					}}
				>
					<i
						className="fa fa-info"
						aria-hidden="true"
						style={{
							color: secondary,
							fontSize: '0.8em',
							marginRight: '0.3em'
						}}
					></i>
				</div>
				<Typography variant="subheading" className="truncate">
					<b>{`${participant.name} ${participant.surname || ''}`}</b> {
						canEdit
							&& <>
								<Tooltip title={translate.edit_participant_contact}>
									<i
										onClick={() => setEdit(!edit)}
										className="fa fa-pencil-square-o"
										aria-hidden="true"
										style={{
											color: secondary,
											fontSize: '0.8em',
											cursor: 'pointer',
											marginLeft: '0.3em'
										}}>
									</i>
								</Tooltip>

							</>
					}
				</Typography>
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center'
				}}
			>
				<div
					style={{
						width: '2em',
						display: 'flex',
						justifyContent: 'center'
					}}
				>
					<i
						className="fa fa-id-card"
						aria-hidden="true"
						style={{
							color: secondary,
							fontSize: '0.8em',
							marginRight: '0.3em'
						}}>
					</i>
				</div>
				<Typography variant="body1" className="truncate">{`${participant.dni || '-'}`}</Typography>
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center'
				}}
			>
				<div
					style={{
						width: '2em',
						display: 'flex',
						justifyContent: 'center'
					}}
				>
					<i
						className="fa fa-tag"
						aria-hidden="true"
						style={{
							color: secondary,
							fontSize: '0.8em',
							marginRight: '0.3em'
						}}>
					</i>
				</div>
				<Typography variant="body1" className="truncate">
					{`${participant.position || '-'}`}
				</Typography>
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center'
				}}
			>
				<div
					style={{
						width: '2em',
						display: 'flex',
						justifyContent: 'center'
					}}
				>
					<i
						className="fa fa-at"
						aria-hidden="true"
						style={{
							color: secondary,
							fontSize: '0.8em',
							marginRight: '0.3em'
						}}>
					</i>
				</div>
				{edit ?
					<TextInput
						floatingText={translate.email}
						type="text"
						required
						value={email}
						errorText={errors.email}
						onChange={event => setEmail(event.target.value)
						}
					/>
				:					<Typography variant="body1" className="truncate">
					{`${participant.email || '-'}`}
					</Typography>
				}

			</div>

			{council.securityType === 2
				&& <div
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center'
					}}
				>
					<div
						style={{
							width: '2em',
							display: 'flex',
							justifyContent: 'center'
						}}
					>
						<i
							className="fa fa-phone"
							aria-hidden="true"
							style={{
								color: secondary,
								fontSize: '0.8em',
								marginRight: '0.3em'
							}}>
						</i>
					</div>
					{edit ?
						<TextInput
							type="text"
							floatingText={translate.phone}
							required
							value={phone}
							errorText={errors.phone}
							onChange={event => setPhone(event.target.value)
							}
						/>
					:						<Typography variant="body1" className="truncate">
						{`${participant.phone || '-'}`}
						</Typography>
					}

				</div>
			}

			{(!CBX.participantIsGuest(participant) && !CBX.participantIsRepresentative(participant)
				&& !delegate && council.councilType !== COUNCIL_TYPES.ONE_ON_ONE) && (
					<React.Fragment>
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center'
							}}
						>
							<Tooltip title={translate.votes}>
								<div
									style={{
										width: '2em',
										display: 'flex',
										justifyContent: 'center'
									}}
								>
									<i
										className="fa fa-ticket"
										aria-hidden="true"
										style={{
											color: secondary,
											fontSize: '0.8em',
											marginRight: '0.3em'
										}}>
									</i>
								</div>
							</Tooltip>
							<Typography variant="body1">
								{`${CBX.showNumParticipations(participant.numParticipations, company, council.statute)}`}
							</Typography>
						</div>
						{CBX.hasParticipations(council.statute) && (
							<div
								style={{
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'center'
								}}
							>
								<Tooltip
									title={translate.census_type_social_capital}
								>
									<div
										style={{
											width: '2em',
											display: 'flex',
											justifyContent: 'center'
										}}
									>
										<i
											className="fa fa-percent"
											aria-hidden="true"
											style={{
												color: secondary,
												fontSize: '0.8em',
												marginRight: '0.3em'
											}}>
										</i>
									</div>
								</Tooltip>
								<Typography variant="body1">
									{`${CBX.showNumParticipations(participant.socialCapital, company, council.statute)}`}
								</Typography>
							</div>
						)}
						<DenyVote
							participant={participant}
							translate={translate}
							refetch={refetch}
						/>
					</React.Fragment>
				)
			}
			{(CBX.isActiveState(participant.state) && participant.firstLoginDate)
				&& <div
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center'
					}}
				>
					<div
						style={{
							width: '2em',
							display: 'flex',
							justifyContent: 'center'
						}}
					>
						<i
							className="fa fa-sign-in"
							aria-hidden="true"
							style={{
								color: secondary,
								fontSize: '0.8em',
								marginRight: '0.3em'
							}}>
						</i>
					</div>
					<Typography variant="body1" className="truncate">
						{moment(participant.firstLoginDate).format('LLL')}
					</Typography>
				</div>
			}
			{(participant.state === PARTICIPANT_STATES.LEFT || participant.online === 2)
				&& <div
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center'
					}}
				>
					<div
						style={{
							width: '2em',
							display: 'flex',
							justifyContent: 'center'
						}}
					>
						<i
							className="fa fa-sign-out"
							aria-hidden="true"
							style={{
								color: secondary,
								fontSize: '0.8em',
								marginRight: '0.3em'
							}}>
						</i>
					</div>
					<Typography variant="body1" className="truncate">
						{moment(participant.lastDateConnection).format('LLL')}
					</Typography>
				</div>
			}
			{edit
				&& <BasicButton
					text={translate.save}
					color={secondary}
					loading={saving}
					success={success}
					textStyle={{
						color: 'white'
					}}
					onClick={updateParticipantContactInfo}
					buttonStyle={{
						marginTop: '0.6em'
					}}
				/>
			}

		</div>
	);
};

export default withApollo(withSharedProps()(ParticipantDisplay));
