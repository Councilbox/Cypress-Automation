import React from "react";
import { getSecondary } from "../styles/colors";
import FontAwesome from "react-fontawesome";
import { Typography, Tooltip } from "material-ui";
import * as CBX from "../utils/CBX";
import { withApollo } from 'react-apollo';
import DenyVote from "../components/council/live/participants/DenyVote";
import withSharedProps from "../HOCs/withSharedProps";
import BasicButton from "./BasicButton";
import TextInput from "./TextInput";
import gql from "graphql-tag";

const ParticipantDisplay = ({ participant, translate, refetch, council, delegate, company, client, canEdit }) => {
	const [edit, setEdit] = React.useState(false);
	const [saving, setSaving] = React.useState(false);
	const [email, setEmail] = React.useState(participant.email);
	const [phone, setPhone] = React.useState(participant.phone);
	const [errors, setErrors] = React.useState({
		phone: '',
		email: ''
	});
	const secondary = getSecondary();

	const updateParticipantContactInfo = async () => {
		setSaving(true);
		const response = await client.mutate({
			mutation: gql`
				mutation UpdateParticipantContactInfo($participantId: Int!, $email: String!, $phone: String!){
					updateParticipantContactInfo(participantId: $participantId, email: $email, phone: $phone){
						success
						message
					}
				}
			`,
			variables: {
                participantId: participant.id,
                email,
				phone
			}
		});
		console.log(response);

		setSaving(false);
    }

	return (
		<div style={{padding: '0.5em'}}>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center"
				}}
			>
				<div
					style={{
						width: "2em",
						display: "flex",
						justifyContent: "center"
					}}
				>
					<i
						className="fa fa-info"
						aria-hidden="true"
						style={{
							color: secondary,
							fontSize: "0.8em",
							marginRight: "0.3em"
						}}
					></i>
				</div>
				<Typography variant="subheading" className="truncate">
					<b>{`${participant.name} ${participant.surname || ''}`}</b> {
						canEdit &&
							<>
								<i
									onClick={() => setEdit(true)}
									className="fa fa-pencil-square-o"
									aria-hidden="true"
									style={{
										color: secondary,
										fontSize: "0.8em",
										cursor: 'pointer',
										marginLeft: "0.3em"
									}}>
								</i>
							</>
					}
				</Typography>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center"
				}}
			>
				<div
					style={{
						width: "2em",
						display: "flex",
						justifyContent: "center"
					}}
				>
					<i
						className="fa fa-id-card"
						aria-hidden="true"
						style={{
							color: secondary,
							fontSize: "0.8em",
							marginRight: "0.3em"
						}}>
					</i>
				</div>
				<Typography variant="body1" className="truncate">{`${participant.dni || '-'}`}</Typography>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center"
				}}
			>
				<div
					style={{
						width: "2em",
						display: "flex",
						justifyContent: "center"
					}}
				>
					<i
						className="fa fa-tag"
						aria-hidden="true"
						style={{
							color: secondary,
							fontSize: "0.8em",
							marginRight: "0.3em"
						}}>
					</i>
				</div>
				<Typography variant="body1" className="truncate">
					{`${participant.position || '-'}`}
				</Typography>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center"
				}}
			>
				<div
					style={{
						width: "2em",
						display: "flex",
						justifyContent: "center"
					}}
				>
					<i
						className="fa fa-at"
						aria-hidden="true"
						style={{
							color: secondary,
							fontSize: "0.8em",
							marginRight: "0.3em"
						}}>
					</i>
				</div>
				{edit?
 					<TextInput
					 	floatingText={translate.email}
						type="text"
						required
						value={email}
						errorText={errors.email}
						onChange={event =>
							setEmail(event.target.value)
						}
					/>
				:
					<Typography variant="body1" className="truncate">
					{`${participant.email || '-'}`}
					</Typography>
				}

			</div>

			{/*council.securityType === 2*/ true &&
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center"
					}}
				>
					<div
						style={{
							width: "2em",
							display: "flex",
							justifyContent: "center"
						}}
					>
						<i
							className="fa fa-phone"
							aria-hidden="true"
							style={{
								color: secondary,
								fontSize: "0.8em",
								marginRight: "0.3em"
							}}>
						</i>
					</div>
					{edit?
						<TextInput
							type="text"
							floatingText={translate.phone}
							required
							value={phone}
							errorText={errors.phone}
							onChange={event =>
								setPhone(event.target.value)
							}
						/>
					:
						<Typography variant="body1" className="truncate">
						{`${participant.phone || '-'}`}
						</Typography>
					}

				</div>
			}
			
			{!CBX.participantIsGuest(participant) && !CBX.participantIsRepresentative(participant) &&
				!delegate && (
					<React.Fragment>
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center"
							}}
						>
							<Tooltip title={translate.votes}>
								<div
									style={{
										width: "2em",
										display: "flex",
										justifyContent: "center"
									}}
								>
									<i
										className="fa fa-ticket"
										aria-hidden="true"
										style={{
											color: secondary,
											fontSize: "0.8em",
											marginRight: "0.3em"
										}}>
									</i>
								</div>
							</Tooltip>
							<Typography variant="body1">
								{`${CBX.showNumParticipations(participant.numParticipations, company)}`}
							</Typography>
						</div>
						{CBX.hasParticipations(council.statute) && (
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center"
								}}
							>
								<Tooltip
									title={translate.census_type_social_capital}
								>
									<div
										style={{
											width: "2em",
											display: "flex",
											justifyContent: "center"
										}}
									>
										<i
											className="fa fa-percent"
											aria-hidden="true"
											style={{
												color: secondary,
												fontSize: "0.8em",
												marginRight: "0.3em"
											}}>
										</i>
									</div>
								</Tooltip>
								<Typography variant="body1">
									{`${participant.socialCapital}`}
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
			{edit &&
				<BasicButton
					text={translate.save}
					color={secondary}
					loading={saving}
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
