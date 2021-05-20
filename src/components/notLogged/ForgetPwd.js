import React from 'react';
import { Card } from 'material-ui';
import { graphql } from 'react-apollo';
import { restorePwd } from '../../queries/restorePwd';
import { getPrimary, secondary } from '../../styles/colors';
import withWindowSize from '../../HOCs/withWindowSize';
import withSharedProps from '../../HOCs/withSharedProps';
import {
	BasicButton, ButtonIcon, TextInput, NotLoggedLayout
} from '../../displayComponents';
import { checkValidEmail } from '../../utils/validation';

class ForgetPwd extends React.PureComponent {
	state = {
		user: '',
		errors: {
			user: ''
		},
		sent: false
	};

	restorePdw = async () => {
		const { translate } = this.props;
		const { user } = this.state;
		if (!this.checkRequiredFields()) {
			const response = await this.props.mutate({
				variables: {
					email: user.trim()
				}
			});
			if (response.errors) {
				switch (response.errors[0].message) {
					case 'Not found':
						this.setState({
							errors: {
								user: translate.email_not_found
							}
						});

						break;
					case 'Not actived':
						this.setState({
							errors: {
								user: translate.email_not_found
							}
						});
						break;
					default:
				}
			} else if (response.data.restorePwd.success) {
				this.setState({
					sent: true
				});
			}
		}
	};

	logout = () => {
		this.props.actions.logout();
	};

	handleKeyUp = event => {
		if (event.nativeEvent.keyCode === 13) {
			this.restorePdw();
		}
	};

	checkRequiredFields() {
		const errors = {
			user: ''
		};
		let hasError = false;

		if (!(this.state.user.length > 0)) {
			hasError = true;
			errors.user = this.props.translate.email_not_valid;
		}

		if (!checkValidEmail(this.state.user.trim())) {
			hasError = true;
			errors.user = this.props.translate.email_not_valid;
		}

		this.setState({
			...this.state,
			errors
		});

		return hasError;
	}

	render() {
		const { translate, windowSize } = this.props;
		const primary = getPrimary();
		return (
			<NotLoggedLayout
				translate={translate}
				helpIcon={true}
				languageSelector={true}
			>
				<div
					style={{
						width: '100%',
						margin: 0,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: '0.85em',
						height: '100%'
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							width: '100%',
							padding: 0
						}}
					>
						{!this.state.sent ? (
							<Card
								style={{
									width: windowSize === 'xs' ? '100%' : '50%',
									padding: '4vw'
								}}
							>
								<div
									style={{
										marginBottom: 0,
										paddingBottom: 0,
										fontWeight: '700',
										fontSize: '1.5em',
										color: primary
									}}
								>
									{`${translate.restore_header} Councilbox`}
								</div>
								<br />
								<div
									style={{
										marginBottom: 0,
										paddingBottom: 0,
										fontWeight: '500',
										fontSize: '0.8rem',
										color: secondary
									}}
								>
									{translate.restore_subheader}
								</div>
								<br />
								<div>
									<TextInput
										onKeyUp={this.handleKeyUp}
										id="restore-password-email-input"
										floatingText={translate.login_email}
										errorText={this.state.errors.user}
										type="text"
										value={this.state.user}
										onChange={event => this.setState({
											user: event.nativeEvent.target.value
										})
										}
									/>
								</div>
								<div style={{ marginTop: '3em' }}>
									<BasicButton
										text={translate.restore_check_in}
										id="restore-password-button"
										color={primary}
										textStyle={{
											color: 'white',
											fontWeight: '700'
										}}
										textPosition="before"
										onClick={this.restorePdw}
										fullWidth={true}
										icon={
											<ButtonIcon
												color="white"
												type="arrow_forward"
											/>
										}
									/>
								</div>
							</Card>
						) : (
							<Card
								style={{
									width: windowSize === 'xs' ? '100%' : '50%',
									padding: '3vw'
								}}
							>
								<div
									style={{
										marginBottom: 0,
										paddingBottom: 0,
										fontWeight: '600',
										fontSize: '1.5em',
										color: primary
									}}
								>
									{translate.sent_reset_pwd}
								</div>
							</Card>
						)}
					</div>
				</div>
			</NotLoggedLayout>
		);
	}
}

export default graphql(restorePwd, {
	options: { errorPolicy: 'all' }
})(withSharedProps()(withWindowSize(ForgetPwd)));

