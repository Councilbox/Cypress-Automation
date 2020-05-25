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
import { checkValidEmail } from "../utils";
import { checkUniqueCouncilEmails } from "../queries/councilParticipant";

const ParticipantDisplay = ({ participant, translate, refetch, council, delegate, company, client, canEdit }) => {
	const [edit, setEdit] = React.useState(false);
	const [saving, setSaving] = React.useState(false);
	const [success, setSuccess] = React.useState(false);
	const [email, setEmail] = React.useState(participant.email);
	const [phone, setPhone] = React.useState(participant.phone);
	const [errors, setErrors] = React.useState({
		phone: '',
		email: ''
	});
	const secondary = getSecondary();

	React.useEffect(() => {
		let timeout;

		if(success){
			timeout = setTimeout(() => {
				setSuccess(false)
			}, 3000)
		}
		return () => clearTimeout(timeout);
	}, [success])

	const updateParticipantContactInfo = async () => {
		setSaving(true);
		if(!await checkRequiredFields()){
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
			if(response.data.updateParticipantContactInfo.success){
				setSuccess(true);
			}
		}
		setSaving(false);

		
	}
	
	const checkRequiredFields = async () => {
		let errors = {};

		if(email !== participant.email){
			if(!email){
				errors.email = translate.required_field;
			} else {
				if(!checkValidEmail(email.toLocaleLowerCase())){
					errors.email = translate.valid_email_required;
				} else {
					const response = await client.query({
						query: checkUniqueCouncilEmails,
						variables: {
							councilId: council.id,
							emailList: [email]
						}
					});

					console.log(response)

					if(!response.data.checkUniqueCouncilEmails.success){
						errors.email = translate.register_exists_email;
					}
				}
			}
		}

		if(phone !== participant.phone){
			if(!phone){
				errors.phone = translate.required_field;
			} else {
				const response = await client.query({
					query: gql`
						query phoneLookup($phone: String!){
							phoneLookup(phone: $phone){
								success
								message
							}
						}
					`,
					variables: {
						phone
					}
				});

				if(!response.data.phoneLookup.success){
					errors.phone = translate.invalid_phone;
				}
			}
		}

		setErrors(errors);

		return Object.keys(errors).length > 0;
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
									onClick={() => setEdit(!edit)}
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

			{council.securityType === 2 &&
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
