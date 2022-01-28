import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { checkValidEmail } from '../../utils';
import {
	BasicButton,
	AlertConfirm,
	Scrollbar
} from '../../displayComponents';
import { updateUser } from '../../queries';
import { store } from '../../containers/App';
import { setUserData } from '../../actions/mainActions';
import { getPrimary } from '../../styles/colors';
import UserForm from './UserForm';
import { checkEmailExists } from '../../queries/userAndCompanySignUp';
import CompanyLinksManager from '../corporation/users/CompanyLinksManager';
import ChangePasswordForm from './ChangePasswordForm';
import UserSendsList from '../corporation/users/UserSendsList';


class UpdateUserForm extends React.Component {
	state = {
		data: this.props.user,
		error: false,
		loading: false,
		success: false,
		errors: {},
		modal: false,
		companies: this.props.user.companies,
		showPass: false
		// companies: fixedCompany ? [fixedCompany] : [],
	};


	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.user.id !== prevState.data.id) {
			return {
				data: nextProps.user
			};
		}

		return null;
	}

	saveUser = async () => {
		if (!await this.checkRequiredFields()) {
			this.setState({
				loading: true
			});
			const {
				__typename, type, actived, roles, companies, sends, ...data
			} = this.state.data;
			const response = await this.props.updateUser({
				variables: {
					user: data,
					companies: this.state.companies.map(company => company.id),
				}
			});

			if (response.errors) {
				if (response.errors[0].message === 'Code already used') {
					this.setState({
						errors: {
							code: 'Código ya en uso'
						}
					});
				}

				this.setState({
					error: true,
					loading: false,
					success: false
				});
			} else {
				this.setState({
					success: true,
					error: false,
					loading: false
				});
				store.dispatch(setUserData(response.data.updateUser));
			}
		}
	};

	resetButtonStates = () => {
		this.setState({
			error: false,
			loading: false,
			success: false
		});
	};

	updateState = newValues => {
		this.setState({
			data: {
				...this.state.data,
				...newValues
			}
		});
	}

	async checkRequiredFields() {
		const { translate } = this.props;

		const errors = {
			name: '',
			surname: '',
			phone: '',
			email: '',
			pwd: '',
			confirmPWD: ''
		};

		const { data } = this.state;
		let hasError = false;

		if (!data.name) {
			hasError = true;
			errors.name = translate.field_required;
		}

		if (!checkValidEmail(data.email.toLowerCase())) {
			hasError = true;
			errors.email = translate.tooltip_invalid_email_address;
		} else if (data.email.toLowerCase() !== this.props.user.email.toLowerCase()) {
			if (await this.checkEmailExists()) {
				errors.email = translate.register_exists_email;
			}
		}

		if (!data.surname) {
			hasError = true;
			errors.surname = translate.field_required;
		}

		if (!data.email) {
			hasError = true;
			errors.email = translate.field_required;
		}

		if (!(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(data.email))) {
			hasError = true;
			errors.email = translate.tooltip_invalid_email_address;
		}

		this.setState({
			errors,
			error: hasError
		});
		return hasError;
	}

	onKeyUp = () => {
		this.checkRequiredFields();
	}

	updateStateShow = object => {
		this.setState({
			...object
		});
	}

	async checkEmailExists() {
		const response = await this.props.client.query({
			query: checkEmailExists,
			variables: { email: this.state.data.email }
		});

		return response.data.checkEmailExists.success;
	}

	renderBodyModal = () => (
		<React.Fragment>
			Se va a enviar un Email para confirmar el cambio de Email.
		</React.Fragment>
	)

	render() {
		const { translate, company } = this.props;
		const {
			data, errors, error, success, loading
		} = this.state;
		const primary = getPrimary();

		return (
			<div style={{ height: 'calc(100% - 3.5em)' }} {...(error ? { onKeyUp: this.onKeyUp } : {})}>
				<div style={{ paddingTop: 0, height: '100%' }}>
					<Scrollbar>
						<div style={{ padding: '1.5em' }}>
							<UserForm
								data={data}
								updateState={this.updateState}
								errors={errors}
								admin={this.props.admin}
								onKeyUp={this.onKeyUp}
								languages={this.props.languages}
								translate={translate}
							/>
						</div>
						{!this.state.showPass && !this.props.admin
							&& <div style={{ padding: '1.5em' }}>
								<BasicButton
									text={translate.change_password}
									id="user-change-password-button"
									backgroundColor={{
										fontWeight: '700',
										boxShadow: 'none',
										background: 'white',
										border: `1px solid ${primary}`,
										color: primary,
										width: '200px',
										height: '3em'
									}}
									onClick={() => this.setState({ showPass: true })}
								/>
							</div>
						}
						{this.state.showPass
							&& <div style={{ padding: '1.5em' }}>
								<div>
									<div>
										{!this.props.admin
											&& <div style={{}}>
												<ChangePasswordForm
													translate={translate}
													showPass={this.state.showPass}
													setShowPass={this.updateStateShow}
												/>
											</div>
										}
										<br />
									</div>
								</div>
							</div>
						}
						{this.props.admin
							&& <div style={{ padding: '1.5em' }}>
								<CompanyLinksManager
									linkedCompanies={this.state.companies}
									translate={translate}
									company={company}
									addCheckedCompanies={companies => this.setState({
										companies
									})}
								/>
							</div>
						}
						{this.state.data.actived === 0
							&& <div style={{ padding: '1em' }}>
								<UserSendsList
									enRoot={false}
									user={this.state.data}
									translate={this.props.translate}
									refetch={this.props.refetch}
								/>
							</div>

						}
					</Scrollbar>
				</div>
				<div style={{
					height: '3.5em', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginRight: '1em',
				}}>
					<BasicButton
						text={translate.save}
						id="user-settings-save-button"
						color={primary}
						error={error}
						reset={this.resetButtonStates}
						success={success}
						loading={loading}
						floatRight
						backgroundColor={{
							color: 'white',
							fontWeight: '700',
							width: '195px'
						}}
						onClick={error ? () => { } : this.saveUser}
					// icon={<ButtonIcon type="save" color="white" />}
					/>
				</div>
				<AlertConfirm
					requestClose={() => this.setState({ modal: false })}
					open={this.state.modal}
					acceptAction={() => this.setState({ modal: false })}
					buttonAccept={translate.accept}
					bodyText={this.renderBodyModal()}
					title={'Envio Email'}
				/>
			</div >
		);
	}
}

export default compose(
	graphql(
		updateUser, {
		name: 'updateUser'
	}
	),
)(withApollo(UpdateUserForm));
