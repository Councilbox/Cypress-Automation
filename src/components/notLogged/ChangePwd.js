import React from 'react';
import { withRouter } from 'react-router-dom';
import { Card } from 'material-ui';
import { compose, graphql } from 'react-apollo';
import { changePwd, checkExpiration } from '../../queries/restorePwd';
import { getPrimary } from '../../styles/colors';
import { bHistory } from '../../containers/App';
import withWindowSize from '../../HOCs/withWindowSize';
import withSharedProps from '../../HOCs/withSharedProps';
import {
	BasicButton,
	ButtonIcon,
	Link,
	TextInput,
	NotLoggedLayout
} from '../../displayComponents';

const DEFAULT_ERRORS = {
	pwd: '',
	repeatPwd: ''
};

class ChangePwd extends React.PureComponent {
	state = {
		pwd: '',
		repeatPwd: '',
		linkExpired: false,
		changed: false,
		errors: DEFAULT_ERRORS
	};

	changePwd = async () => {
		if (!this.checkRequiredFields()) {
			const response = await this.props.changePwd({
				variables: {
					token: this.props.match.params.token,
					pwd: this.state.pwd
				}
			});
			if (response.errors) {
				switch (response.errors[0].code) {
				case 402:
					this.setState({
						linkExpired: true
					});
					break;

				default:
					return;
				}
			}
			if (response.data.changePwd.success) {
				this.setState({
					changed: true
				});
			}
		}
	};

	checkExpiration = async () => {
		const response = await this.props.checkExpiration({
			variables: {
				token: this.props.match.params.token
			}
		});
		if (response.errors) {
			switch (response.errors[0].code) {
			case 440:
				this.setState({
					linkExpired: true
				});
				break;

			default:
			}
		}
	};

	handleKeyUp = event => {
		if (event.nativeEvent.keyCode === 13) {
			this.changePwd();
		}
	};

	componentDidMount() {
		this.checkExpiration();
	}

	checkRequiredFields() {
		const { translate } = this.props;

		const errors = DEFAULT_ERRORS;

		let hasError = false;

		if (!this.state.pwd) {
			hasError = true;
			errors.pwd = translate.no_empty_pwd;
		}
		if (this.state.pwd !== this.state.repeatPwd) {
			hasError = true;
			errors.repeatPwd = translate.no_match_pwd;
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
					className="row justify-content-md-center"
					style={{
						width: '100%',
						margin: 0,
						fontSize: '0.85em',
						height: '100%'
					}}
				>
					<div
						className="col-lg-8 col-md-8 col-xs-12 "
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							padding: 0
						}}
					>
						{!this.state.linkExpired ? (
							!this.state.changed ? (
								<Card
									style={{
										width: windowSize === 'xs' ? '100%' : '70%',
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
										{`${
											translate.change_pwd_header
										} Councilbox`}
									</div>
									<br />
									<div>
										<TextInput
											onKeyUp={this.handleKeyUp}
											floatingText={translate.new_password}
											errorText={this.state.errors.pwd}
											type="password"
											value={this.state.pwd}
											onChange={event => this.setState({
												pwd:
														event.nativeEvent.target
															.value
											})
											}
										/>
									</div>
									<div>
										<TextInput
											onKeyUp={this.handleKeyUp}
											floatingText={
												translate.login_confirm_password
											}
											errorText={this.state.errors.repeatPwd}
											type="password"
											value={this.state.repeatPwd}
											onChange={event => this.setState({
												repeatPwd:
														event.nativeEvent.target
															.value
											})
											}
										/>
									</div>
									<div style={{ marginTop: '3em' }}>
										<BasicButton
											text={translate.change_pwd}
											color={primary}
											textStyle={{
												color: 'white',
												fontWeight: '700'
											}}
											textPosition="before"
											onClick={this.changePwd}
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
										width: windowSize === 'xs' ? '100%' : '70%',
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
										{translate.password_changed}
									</div>
									<br />
									<BasicButton
										text={translate.go_login}
										color={primary}
										textStyle={{
											color: 'white',
											fontWeight: '700'
										}}
										textPosition="before"
										onClick={() => bHistory.push('/')}
										fullWidth={true}
										icon={
											<ButtonIcon
												color="white"
												type="arrow_forward"
											/>
										}
									/>
								</Card>
							)
						) : (
							<Card
								style={{
									width: windowSize === 'xs' ? '100%' : '70%',
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
									{translate.link_expired}
								</div>
								<br />
								<Link to={'/forgetPwd'}>
									<BasicButton
										text={translate.back}
										color={primary}
										textStyle={{
											color: 'white',
											fontWeight: '700'
										}}
										textPosition="before"
										onClick={this.goRestorePwd}
										fullWidth={true}
										icon={
											<ButtonIcon
												color="white"
												type="arrow_forward"
											/>
										}
									/>
								</Link>
							</Card>
						)}
					</div>
				</div>
			</NotLoggedLayout>
		);
	}
}

export default compose(
	graphql(changePwd, {
		name: 'changePwd',
		options: { errorPolicy: 'all' }
	}),
	graphql(checkExpiration, {
		name: 'checkExpiration',
		options: { errorPolicy: 'all' }
	})
)(withSharedProps()(withWindowSize(withRouter(ChangePwd))));
