import React from 'react';
import { Card, CardContent } from 'material-ui';
import { graphql } from 'react-apollo';
import SignUpUser from './SignUpUser';
import { getPrimary } from '../../../styles/colors';
import SignUpStepper from './SignUpStepper';
import { BasicButton, NotLoggedLayout, Scrollbar } from '../../../displayComponents';
import { bHistory } from '../../../containers/App';
import withWindowSize from '../../../HOCs/withWindowSize';
import { userAndCompanySignUp } from '../../../queries/userAndCompanySignUp';
import withTranslations from '../../../HOCs/withTranslations';

const stateReducer = (state, action) => {
	const actions = {
		UPDATE_ERRORS: () => ({
			...state,
			errors: action.payload
		}),
		SUCCESS: () => ({
			...state,
			loading: false,
			success: true
		}),
		LOADING: () => ({
			...state,
			loading: true,
			success: false
		})
	};

	return actions[action.type] ? actions[action.type]() : state;
};


const SignUpPage = ({ translate, windowSize, mutate }) => {
	const [data, setData] = React.useState({
		name: '',
		surname: '',
		phone: '',
		preferredLanguage: translate.selectedLanguage,
		email: '',
		pwd: '',
	});
	const [{ success, loading, errors }, dispatch] = React.useReducer(stateReducer, {
		success: false,
		loading: false,
		errors: {}
	});
	const primary = getPrimary();

	const createUser = async () => {
		dispatch({ type: 'LOADING' });
		const response = await mutate({
			variables: {
				user: data
			}
		});
		if (response.errors) {
			switch (response.errors[0].message) {
				default:
					return;
			}
		}
		if (response.data.userAndCompanySignUp.success) {
			dispatch({ type: 'SUCCESS' });
		}
	};


	const updateData = object => {
		setData({
			...data,
			...object
		});
	};


	return (
		<NotLoggedLayout
			translate={translate}
			languageSelector={true}
			helpIcon={true}
		>
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center'
				}}
			>
				<div
					style={{
						height: '13%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					<h3 style={{ color: 'white', fontWeight: '700' }}>
						{translate.sign_up_user}
					</h3>
				</div>
				{!success ? (
					<Card
						elevation={8}
						style={{
							width: windowSize !== 'xs' ? '65%' : '100%',
							height: windowSize !== 'xs' ? null : '100%',
							padding: 0,
							borderRadius: windowSize !== 'xs' ? '0.3em' : '0',
							overflow: 'hidden'
						}}
					>
						<CardContent
							style={{
								padding: 0,
								width: '100%',
								height: '100%',
							}}
						>
							<div
								style={{
									display: 'flex',
									flexDirection:
										windowSize !== 'xs' ? 'row' : 'column',
									height:
										windowSize !== 'xs' ?
											'72vh'
											: '100%',
									width: '100%'
								}}
							>
								<div
									style={{
										backgroundColor: 'WhiteSmoke',
										height:
											windowSize !== 'xs' ? '100%' : '5em'
									}}
								>
									<SignUpStepper
										translate={translate}
										active={0}
										windowSize={windowSize}
									/>
								</div>
								<div
									style={{
										backgroundColor: 'white',
										width: '100%',
										position: 'relative',
										overflowY: 'hidden',
										height:
											windowSize !== 'xs' ?
												'100%'
												: '100%'
									}}
								>
									<Scrollbar>
										<div style={{}}>
											<SignUpUser
												formData={data}
												errors={errors}
												loading={loading}
												signUp={createUser}
												updateState={updateData}
												updateErrors={errs => dispatch({ type: 'UPDATE_ERRORS', payload: errs })}
												translate={translate}
											/>
										</div>
									</Scrollbar>
								</div>
							</div>
						</CardContent>
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
								fontSize: '1.2em',
								textAlign: 'center',
								color: primary
							}}
						>
							{translate.register_successfully}
							<div style={{
								marginTop: '0.9em', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'
							}}>
								<BasicButton
									text={translate.back}
									id="signup-back-button"
									textStyle={{ fontWeight: '700', textTransform: 'none', color: 'white' }}
									onClick={() => bHistory.push('/')}
									color={primary}
								/>
							</div>
						</div>
					</Card>
				)}
			</div>
		</NotLoggedLayout>
	);
};

export default graphql(userAndCompanySignUp, {
	options: { errorPolicy: 'all' }
})(withWindowSize(withTranslations()(SignUpPage)));
