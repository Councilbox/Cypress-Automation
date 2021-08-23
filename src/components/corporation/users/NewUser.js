import React from 'react';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import gql from 'graphql-tag';
import {
	CardPageLayout, ButtonIcon, BasicButton, LoadingSection
} from '../../../displayComponents';
import { languages } from '../../../queries/masters';
import UserForm from '../../userSettings/UserForm';
import { getPrimary } from '../../../styles/colors';
import CompanyLinksManager from './CompanyLinksManager';
import { bHistory } from '../../../containers/App';
import { checkValidEmail } from '../../../utils/validation';
import { useOldState } from '../../../hooks';
import withSharedProps from '../../../HOCs/withSharedProps';
import { isMobile } from '../../../utils/screen';

const NewUser = ({
	fixedCompany, translate, company, ...props
}) => {
	const [state, setState] = useOldState({
		data: {
			email: '',
			surname: '',
			name: '',
			preferredLanguage: 'es'
		},
		companies: fixedCompany ? [fixedCompany] : [],
		errors: {}
	});
	const [success, setSuccess] = React.useState(false);

	const updateState = object => {
		setState({
			data: {
				...state.data,
				...object
			}
		});
	};

	function checkRequiredFields() {
		const errors = {
			email: '',
			name: '',
			surname: '',
			phone: ''
		};

		let hasError = false;
		const { data } = state;

		if (data.email.trim().length === 0) {
			hasError = true;
			errors.email = translate.required_field;
		} else if (!checkValidEmail(data.email)) {
			hasError = true;
			errors.email = translate.tooltip_invalid_email_address;
		}

		if (data.name.trim().length === 0) {
			hasError = true;
			errors.name = translate.required_field;
		}

		if (data.surname.trim().length === 0) {
			hasError = true;
			errors.surname = translate.required_field;
		}

		setState({
			errors
		});

		return hasError;
	}

	const createUserWithoutPassword = async () => {
		if (!checkRequiredFields()) {
			const response = await props.createUserWithoutPassword({
				variables: {
					user: state.data,
					companies: state.companies.map(item => item.id),
					corporationId: company ? company.corporationId : null
				}
			});

			if (!response.errors) {
				if (response.data.createUserWithoutPassword.id && !fixedCompany) {
					bHistory.push(`/users/edit/${response.data.createUserWithoutPassword.id}`);
				} else {
					setSuccess(true);
				}
			} else if (response.errors[0].message === 'Email already registered') {
				setState({
					errors: {
						email: translate.register_exists_email
					}
				});
			}
		}
	};

	if (props.data.loading) {
		return <LoadingSection />;
	}

	const body = () => (
		<div style={{ height: '100%', padding: isMobile ? '1.5em 1.5em 1em' : '1.5em 1.5em 2em' }}> {/* 6em */}
			<div style={{ height: '100%' }} >
				<UserForm
					translate={translate}
					data={state.data}
					admin={true}
					errors={state.errors}
					updateState={updateState}
					languages={props.data.languages}
				/>
				{success
					&& <div style={{ margin: '2em 0em' }}>
						Se le ha enviado un <b>email de confirmación</b> al usuario para que pueda completar su registro indicando su <b>contraseña</b>.
					</div>
				}
				{!fixedCompany
					&& <CompanyLinksManager
						linkedCompanies={state.companies}
						translate={translate}
						company={company}
						addCheckedCompanies={companies => setState({
							companies
						})}
					/>
				}
			</div>
			<div style={{
				width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: '2em'
			}}>
				{!success ?
					<React.Fragment>
						<BasicButton
							text={translate.back}
							onClick={props.requestClose}
							buttonStyle={{ marginRight: '1em' }}
							textStyle={{
								textTransform: 'none',
								fontWeight: '700',
							}}
							primary={true}
							color='transparent'
							type="flat"
						/>
						<BasicButton
							text={translate.save}
							color={getPrimary()}
							id='create-user-button'
							icon={<ButtonIcon type="save" color="white" />}
							textStyle={{ textTransform: 'none', color: 'white', fontWeight: '700' }}
							onClick={createUserWithoutPassword}
						/>
					</React.Fragment>
					: <BasicButton
						text={translate.back}
						textStyle={{ textTransform: 'none', color: 'black', fontWeight: '700' }}
						onClick={props.requestClose}
						buttonStyle={{ marginRight: '5em' }}
					/>
				}

			</div>
		</div>
	);

	return (
		<div style={{ height: !fixedCompany ? 'calc(100vh - 3em)' : '100%', ...props.styles }}>
			{fixedCompany ?
				body()
				: <CardPageLayout title={translate.users_add} >
					{/* stylesNoScroll={{ height: "100%" }} */}
					{body()}
				</CardPageLayout>
			}

		</div>
	);
};


const createUserWithoutPassword = gql`
	mutation CreateUserWithoutPassword($user: UserInput!, $companies: [Int], $corporationId: Int){
		createUserWithoutPassword(user: $user, companies: $companies, corporationId: $corporationId){
			id
		}
	}
`;


export default compose(
	graphql(languages),
	graphql(createUserWithoutPassword, {
		name: 'createUserWithoutPassword'
	}),
	withSharedProps()
)(NewUser);
