import React from 'react';
import { withApollo } from 'react-apollo';
import { LinearProgress } from 'material-ui/Progress';
import PropTypes from 'prop-types';
import {
	BasicButton,
	ButtonIcon,
	Grid,
	GridItem,
	MenuItem,
	SelectInput,
	TextInput,
	Checkbox
} from '../../../displayComponents';
import { checkValidEmail } from '../../../utils/index';
import { getPrimary } from '../../../styles/colors';
import { checkEmailExists } from '../../../queries/userAndCompanySignUp';
import { getTermsURL } from '../../../utils/CBX';

class SignUpUser extends React.Component {
	state = {
		errorsBar: null,
		porcentaje: 0,
		repeatEmail: '',
		termsAccepted: false,
		termsModal: false,
		confirmPWD: '',
		subscriptions: [],
		languages: [
			{
				columnName: 'es',
				desc: 'Español'
			},
			{
				columnName: 'en',
				desc: 'English'
			},
			{
				columnName: 'pt',
				desc: 'Portugués'
			},
			{
				columnName: 'cat',
				desc: 'Catalá'
			},
			{
				columnName: 'gal',
				desc: 'Galego'
			},
		]
	};

	nextPage = async () => {
		if (!(await this.checkRequiredFields())) {
			// this.props.nextPage();
			this.props.signUp();
		}
	};

	checkRequiredFields = async () => {
		const errors = {
			name: '',
			surname: '',
			phone: '',
			email: '',
			repeatEmail: '',
			pwd: '',
			termsAccepted: '',
			confirmPWD: ''
		};

		const data = this.props.formData;
		const { translate } = this.props;
		let hasError = false;


		if (!this.state.termsAccepted) {
			hasError = true;
			errors.termsCheck = translate.acept_terms;
		}

		if (!data.name) {
			hasError = true;
			errors.name = translate.field_required;
		}

		if (!data.surname) {
			hasError = true;
			errors.surname = translate.field_required;
		}

		if (!data.phone) {
			hasError = true;
			errors.phone = translate.field_required;
		}

		if (!data.email) {
			hasError = true;
			errors.email = translate.field_required;
		} else {
			const existsCif = await this.checkEmailExists();
			if (data.email !== this.state.repeatEmail && data.email) {
				hasError = true;
				errors.repeatEmail = translate.register_unmatch_emails;
			}

			if (!checkValidEmail(data.email) || existsCif) {
				hasError = true;
				errors.email = existsCif ?
					translate.register_exists_email
					: translate.tooltip_invalid_email_address;
			}
			if (!checkValidEmail(data.email) || existsCif) {
				hasError = true;
				errors.email = existsCif ?
					translate.register_exists_email
					: translate.tooltip_invalid_email_address;
			}
			if (!(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g.test(data.phone))) {
				hasError = true;
				errors.phone = translate.enter_valid_phone_number;
			}
		}

		if (this.state.porcentaje < 40) {
			hasError = true;
			errors.pwd = translate.insecure_password;
		}

		if (!data.pwd) {
			hasError = true;
			errors.pwd = translate.no_empty_pwd;
		}

		if (data.pwd !== this.state.confirmPWD) {
			hasError = true;
			errors.confirmPWD = translate.no_match_pwd;
		}

		if (!(/^[A-Za-z-zÀ-ÿ\s]+$/.test(data.name))) {
			hasError = true;
			errors.name = translate.enter_valid_name;
		}

		if (!(/^[A-Za-z-zÀ-ÿ\s]+$/.test(data.surname))) {
			hasError = true;
			errors.surname = translate.enter_valid_last_names;
		}

		// if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,}$/.test(data.pwd))) {
		// hasError = true;
		// errors.pwd = "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"; //TRADUCCION
		// }

		this.props.updateErrors({
			...errors,
			hasError
		});
		return hasError;
	}

	async checkEmailExists() {
		const response = await this.props.client.query({
			query: checkEmailExists,
			variables: { email: this.props.formData.email }
		});

		return response.data.checkEmailExists.success;
	}

	handleKeyUp = event => {
		const data = this.props.formData;
		let errorsBar;
		let porcentaje = 100;
		const { translate } = this.props;
		if (!(/[a-z]/.test(data.pwd))) {
			errorsBar = translate.insecure_password;
			porcentaje -= 20;
		}
		if (!(/(?=.*[A-Z])/.test(data.pwd))) {
			errorsBar = translate.insecure_password;
			porcentaje -= 20;
		}
		if (!(/(?=.*[0-9])/.test(data.pwd))) {
			errorsBar = translate.insecure_password;
			porcentaje -= 20;
		}
		if (!(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(data.pwd))) {
			errorsBar = translate.insecure_password;
			porcentaje -= 20;
		}
		if (!(/.{8,}/.test(data.pwd))) {
			errorsBar = translate.insecure_password;
			porcentaje -= 20;
		}
		let color = 'Green';
		color = porcentaje < 40 ? 'Red' : porcentaje >= 40 && porcentaje <= 80 ? 'Orange' : 'Green';
		this.setState({
			errorsBar,
			porcentaje,
			color,
		});
		if (event.nativeEvent.keyCode === 13) {
			this.nextPage();
		}
		if (this.props.errors.hasError) {
			this.checkRequiredFields();
		}
	};

	render() {
		const primary = getPrimary();
		const { translate } = this.props;
		const data = this.props.formData;

		return (
			<div
				style={{
					width: '100%',
					padding: '6%'
				}}
				onKeyUp={this.handleKeyUp}
			>
				<div
					style={{
						fontSize: '1.3em',
						fontWeight: '700',
						color: primary
					}}
				>
					{translate.user_data}
				</div>
				<Grid style={{ marginTop: '2em' }}>
					<GridItem xs={12} md={6} lg={6}>
						<TextInput
							id="signup-name"
							floatingText={translate.name}
							type="text"
							value={data.name}
							errorText={this.props.errors.name}
							onChange={event => this.props.updateState({
								name: event.target.value
							})
							}
							required
						/>
					</GridItem>
					<GridItem xs={12} md={6} lg={6}>
						<TextInput
							id="signup-surname"
							floatingText={translate.surname || ''}
							type="text"
							value={data.surname || ''}
							onChange={event => this.props.updateState({
								surname: event.target.value
							})
							}
							errorText={this.props.errors.surname || ''}
							required
						/>
					</GridItem>
					<GridItem xs={12} md={6} lg={6}>
						<TextInput
							id="signup-phone"
							floatingText={translate.phone}
							type="text"
							value={data.phone}
							onChange={event => this.props.updateState({
								phone: event.target.value
							})
							}
							errorText={this.props.errors.phone}
							required
						/>
					</GridItem>
					<GridItem xs={12} md={6} lg={6}>
						<SelectInput
							id="signup-language"
							floatingText={translate.language}
							value={data.preferredLanguage}
							errorText={this.props.errors.language}
							onChange={event => this.props.updateState({
								preferredLanguage: event.target.value
							})
							}
							required
						>
							{this.state.languages.map(language => (
								<MenuItem
									key={language.id}
									id={`language-${language.columnName}`}
									value={language.columnName}
								>
									{language.desc}
								</MenuItem>
							))}
						</SelectInput>
					</GridItem>
					<GridItem xs={12} md={6} lg={6}>
						<TextInput
							id="signup-email"
							floatingText={translate.login_email}
							type="text"
							value={data.email}
							onChange={event => this.props.updateState({
								email: event.target.value.toLowerCase()
							})
							}
							errorText={this.props.errors.email}
							required
						/>
					</GridItem>
					<GridItem xs={12} md={6} lg={6}>
						<TextInput
							id="signup-email-check"
							floatingText={translate.repeat_email}
							type="text"
							value={this.state.repeatEmail}
							onChange={event => this.setState({
								repeatEmail: event.target.value
							})
							}
							errorText={this.props.errors.repeatEmail}
							required
						/>
					</GridItem>
					<GridItem xs={12} md={6} lg={6}>
						<TextInput
							id="signup-password"
							floatingText={translate.login_password}
							type="password"
							value={data.pwd}
							onChange={event => this.props.updateState({
								pwd: event.target.value
							})
							}
							errorText={this.props.errors.pwd}
							required
						/>
					</GridItem>
					<GridItem xs={12} md={6} lg={6}>
						<TextInput
							id="signup-password-check"
							floatingText={translate.login_confirm_password}
							type="password"
							value={this.state.confirmPWD}
							onChange={event => this.setState({
								confirmPWD: event.target.value
							})
							}
							errorText={this.props.errors.confirmPWD}
							required
						/>
					</GridItem>
					<GridItem xs={12} md={6} lg={6} style={{ height: '50px' }}>
						<div style={{ width: '100%', marginRight: '3em' }}>
							<LinearProgress
								variant="determinate"
								value={this.state.porcentaje}
								style={{
									height: '18px',
									backgroundColor: 'lightgrey',
									borderRadius: '10px',
									boxShadow: 'rgba(0, 0, 0, 0.15) 0px 12px 20px -10px, rgba(0, 0, 0, 0.18) 0px 4px 20px 0px, rgba(0, 0, 0, 0.23) 0px 7px 8px -5px'
								}}
								className={`barColor${this.state.color}`}
							/>
						</div>
						<div style={{ width: '100%' }}>
							{this.state.errorsBar !== undefined ? this.state.errorsBar : translate.safe_password}
						</div>
					</GridItem>
					<GridItem xs={12} md={6} lg={6}>
						{' '}
					</GridItem>
					<GridItem xs={12} md={12} lg={12}>
						<div style={{ display: 'auto', flexDirection: 'row', alignItems: 'center' }}>
							<Checkbox
								id="accept-legal-checkbox"
								label={
									<div>
										{translate.login_read_terms}
										<a
											style={{
												color: primary,
												fontWeight: '700',
												cursor: 'pointer',
												textTransform: 'lowerCase',
												marginLeft: '0.4em'
											}}
											href={getTermsURL(translate.selectedLanguage)}
											target="_blank"
											rel="noreferrer noopener"
										>
											{translate.login_read_terms2}
										</a>
									</div>
								}
								value={this.state.termsCheck}
								onChange={(event, isInputChecked) => this.setState({
									termsAccepted: isInputChecked
								})
								}
								onClick={() => {
									this.setState({
										termsAccepted: true
									});
								}}
							/>

						</div>
						{this.props.errors.termsCheck && (
							<div style={{ color: 'red' }} id="legal-terms-error-text">
								{this.props.errors.termsCheck}
							</div>
						)}
					</GridItem>
					<GridItem xs={12} md={6} lg={6}>
						<BasicButton
							text={translate.send}
							id="create-user-button"
							loading={this.props.loading}
							color={primary}
							textStyle={{
								color: 'white',
								fontWeight: '700'
							}}
							onClick={this.nextPage}
							fullWidth
							icon={
								<ButtonIcon
									color="white"
									type="send"
								/>
							}
						/>
					</GridItem>
				</Grid>
			</div>
		);
	}
}
SignUpUser.propTypes = {
	classes: PropTypes.object.isRequired,
};


export default withApollo(SignUpUser);
