import React from 'react';
import { MenuItem } from 'material-ui';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { getSecondary, getPrimary } from '../../../styles/colors';
import { DateWrapper, BasicButton } from '../../../displayComponents';
import { USER_ACTIVATIONS } from '../../../constants';
import { restorePwd } from '../../../queries/restorePwd';

const UserItem = ({
	user, translate, clickable, closeSession, ...props
}) => {
	const [restoreAccessSend, setRestoreAccessSend] = React.useState(false);
	const secondary = getSecondary();

	const activatePremium = async event => {
		event.stopPropagation();
		const response = await props.activateUserPremium({
			variables: {
				userId: user.id
			}
		});

		if (!response.errors) {
			props.refetch();
		}
	};

	const cancelUserPremium = async event => {
		event.stopPropagation();
		const response = await props.cancelUserPremium({
			variables: {
				userId: user.id
			}
		});

		if (!response.errors) {
			props.refetch();
		}
	};

	const unsubscribeUser = async event => {
		event.stopPropagation();
		await props.blockUser({
			variables: {
				userId: user.id
			}
		});

		props.refetch();
	};

	const blockUser = async event => {
		event.stopPropagation();
		await props.blockUser({
			variables: {
				userId: user.id
			}
		});

		props.refetch();
	};

	const restoreAccess = async event => {
		event.stopPropagation();
		const response = await props.restorePwd({
			variables: {
				email: user.email
			}
		});
		if (response) {
			setRestoreAccessSend(true);
			setTimeout(() => {
				setRestoreAccessSend(false);
			}, 1000);
		}
		props.refetch();
	};

	const verifyAccess = async event => {
		event.stopPropagation();
		const response = await props.sendEmailWelcome({
			variables: {
				userId: user.id
			}
		});
		if (response) {
			setRestoreAccessSend(true);
			setTimeout(() => {
				setRestoreAccessSend(false);
			}, 1000);
		}
		props.refetch();
	};

	const bodyTable = centrado => (
		<React.Fragment>
			<div style={{
				display: 'flex', width: '100%', alignItems: 'center', justifyContent: centrado ? 'space-between' : '', padding: centrado ? '0px 2em' : ''
			}}>
				<div style={{ width: centrado ? '' : '15%', padding: centrado ? '' : '4px 70px 4px 0px' }}>
					<div
						style={{
							width: '100%',
							height: '100%',
							display: 'flex',
							alignItems: 'center',
							flexDirection: 'column',
							justifyContent: 'center'
						}}
					>
						{user.actived === USER_ACTIVATIONS.CONFIRMED &&
							<React.Fragment>
								<i className="fa fa-user" aria-hidden="true" style={{ fontSize: '1.7em', color: 'grey' }}></i>
								Confirmado
							</React.Fragment>
						}
						{user.actived === USER_ACTIVATIONS.NOT_CONFIRMED &&
							<React.Fragment>
								<i className="fa fa-user-times" aria-hidden="true" style={{ fontSize: '1.7em', color: 'grey' }}></i>
								No confirmado
							</React.Fragment>
						}
						{user.actived === USER_ACTIVATIONS.FREE_TRIAL &&
							<React.Fragment>
								<i className="fa fa-user" aria-hidden="true" style={{ fontSize: '1.7em', color: secondary }}></i>
								{translate.free_trial}
							</React.Fragment>
						}
						{user.actived === USER_ACTIVATIONS.UNSUBSCRIBED &&
							<React.Fragment>
								<i className="fa fa-ban" aria-hidden="true" style={{ fontSize: '1.7em', color: secondary }}></i>
								{'Acceso bloqueado'}
							</React.Fragment>
						}
						{user.actived === USER_ACTIVATIONS.PREMIUM &&
							<React.Fragment>
								<i className="fa fa-user" aria-hidden="true" style={{ fontSize: '1.7em', color: getPrimary() }}></i>
								Premium
							</React.Fragment>
						}
					</div>
				</div>
				<div style={{
					width: centrado ? '' : '10%', padding: centrado ? '' : '4px 8px 4px 0px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
				}}>
					<span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{`${user.id}`}</span>
				</div>
				<div style={{
					width: centrado ? '' : '25%', padding: centrado ? '' : '4px 8px 4px 0px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
				}}>
					<span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{`${user.name} ${user.surname || ''}`}</span>
				</div>
				<div style={{
					width: centrado ? '' : '25%', padding: centrado ? '' : '4px 8px 4px 0px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
				}}>
					<span style={{ fontSize: '0.9rem' }}>{`${user.email || '-'}`}</span>
				</div>
				<div style={{
					width: centrado ? '' : '25%', padding: centrado ? '' : '4px 8px 4px 0px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
				}}>
					{user.lastConnectionDate ?
						<DateWrapper
							format="DD/MM/YYYY HH:mm"
							date={user.lastConnectionDate}
							style={{ fontSize: '0.7em' }}
						/>
						:
						'-'
					}
				</div>
			</div>
		</React.Fragment>
	);

	return (
		clickable ?
			<MenuItem
				style={{
					borderBottom: '1px solid gainsboro',
					height: '3.5em',
					width: '100%',
					display: 'flex',
					flexDirection: 'row'
				}}
			>
				{bodyTable()}
			</MenuItem>
			:
			<div style={{ width: '100%' }}>
				<div style={{
					width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '1em'
				}}>
					{props.unsubscribeUser &&
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								width: '10em'
							}}
						>
							<BasicButton
								text="Dar de baja"
								color={secondary}
								textStyle={{ fontWeight: '700', color: 'white' }}
								onClick={unsubscribeUser}
							/>
						</div>
					}
					<div style={{ marginRight: '6px' }}>
						<BasicButton
							text={USER_ACTIVATIONS.NOT_CONFIRMED === user.actived ? translate.verify_email_button : translate.restore_check_in}
							color={secondary}
							textStyle={{ fontWeight: '700', color: 'white' }}
							onClick={USER_ACTIVATIONS.NOT_CONFIRMED === user.actived ? verifyAccess : restoreAccess}
							success={restoreAccessSend}
						/>
					</div>
					{user.actived !== USER_ACTIVATIONS.UNSUBSCRIBED ?
						<BasicButton
							text="Bloquear acceso"
							color={secondary}
							textStyle={{ fontWeight: '700', color: 'white' }}
							onClick={blockUser}
						/>
						:
						<BasicButton
							text="Desbloquear acceso"
							color={secondary}
							textStyle={{ fontWeight: '700', color: 'white' }}
							onClick={activatePremium}
						/>

					}

					{props.activatePremium &&
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								width: '10em'
							}}
						>
							{user.actived !== USER_ACTIVATIONS.NOT_CONFIRMED &&
								<React.Fragment>
									{user.actived !== USER_ACTIVATIONS.PREMIUM ?
										<BasicButton
											text="Activar Premium"
											color={secondary}
											textStyle={{ fontWeight: '700', color: 'white' }}
											onClick={activatePremium}
										/>
										:
										<BasicButton
											text="Cancelar Premium"
											color={secondary}
											textStyle={{ fontWeight: '700', color: 'white' }}
											onClick={cancelUserPremium}
										/>
									}
								</React.Fragment>
							}
						</div>
					}
				</div>
				<div
					style={{
						border: '1px solid gainsboro',
						height: '3.5em',
						width: '100%',
						minHeight: '4.5em',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between'
					}}
				>
					{bodyTable(true)}
				</div>
			</div>

	);
};


const activateUserPremium = gql`
    mutation ActivateUserPremium($userId: Int!){
        activateUserPremium(userId: $userId){
            success
        }
    }
`;

const cancelUserPremium = gql`
	mutation CancelUserPremium($userId: Int!){
		cancelUserPremium(userId: $userId){
			success
		}
	}
`;

const unsubscribeUser = gql`
	mutation unsubscribeUser($userId: Int!){
		unsubscribeUser(userId: $userId){
			success
		}
	}
`;

const sendEmailWelcome = gql`
	mutation sendEmailWelcome($userId: Int!){
		sendEmailWelcome(userId: $userId){
			success
		}
	}
`;

export default compose(
	graphql(activateUserPremium, {
		name: 'activateUserPremium'
	}),
	graphql(unsubscribeUser, {
		name: 'blockUser'
	}),
	graphql(cancelUserPremium, {
		name: 'cancelUserPremium'
	}),
	graphql(restorePwd, {
		name: 'restorePwd',
		options: { errorPolicy: 'all' }
	}),
	graphql(sendEmailWelcome, {
		name: 'sendEmailWelcome',
	})
)(UserItem);
