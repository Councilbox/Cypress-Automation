import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { toast } from 'react-toastify';
import withSharedProps from '../../../HOCs/withSharedProps';
import {
	BasicButton,
	ButtonIcon,
	CardPageLayout,
	Grid,
	LiveToast,
	GridItem,
	TextInput
} from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import { bHistory, store } from '../../../containers/App';
import { getCompanies } from '../../../actions/companyActions';
import { linkCompany as linkCompanyMutation } from '../../../queries/company';
import { useOldState } from '../../../hooks';
import { sendGAevent } from '../../../utils/analytics';


const LinkCompanyPage = ({ translate, ...props }) => {
	const [state, setState] = useOldState({
		data: {
			linkKey: '',
			cif: ''
		},
		showPassword: false,
		errors: {},
		success: false,
		request: false,
		requestError: false
	});

	const updateState = object => {
		setState({
			data: {
				...state.data,
				...object
			}
		});
	};

	const checkRequiredFields = () => {
		const errors = {};

		if (!state.data.cif) {
			errors.cif = translate.required_field;
		}

		if (!state.data.linkKey) {
			errors.linkKey = translate.required_field;
		}

		setState({
			errors
		});

		return Object.keys(errors).length > 0;
	};

	const linkCompany = async () => {
		if (!checkRequiredFields()) {
			sendGAevent({
				category: 'Editar entidades',
				action: 'Vincular sociedad',
				label: props.company ? props.company.businessName : 'Sin compañía'
			});

			const response = await props.linkCompany({
				variables: {
					companyTin: state.data.cif,
					linkKey: state.data.linkKey
				}
			});

			if (response.errors) {
				if (response.errors[0].message === 'Tin-noExists') {
					setState({
						errors: {
							cif: translate.company_not_exist
						}
					});
					return;
				}
			}

			if (response.data.linkCompany.success) {
				toast(
					<LiveToast
						message={translate.company_link_success_title}
					/>, {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: true,
					className: 'successToast'
				}
				);
				store.dispatch(getCompanies(props.user.id));
				bHistory.push('/');
			} else {
				switch (response.data.linkCompany.message) {
					case 'Wrong linkKey':
						setState({
							errors: {
								linkKey: translate.incorrect_master_key
							}
						});
						break;
					case 'Already Linked':
						setState({
							errors: {
								cif: translate.company_already_linked
							}
						});
						break;
					default:
						setState({
							errors: {
								linkKey: translate.incorrect_master_key
							}
						});
				}
			}
		}
	};

	const {
 data, errors, requestError, success, request
} = state;


	return (
		<CardPageLayout title={translate.companies_link_company}>
			<Grid style={{ marginTop: '4em' }}>
				<GridItem xs={12} md={12} lg={12}>
					<div
						style={{
							width: '400px',
							margin: 'auto'
						}}
					>
						<TextInput
							floatingText={translate.entity_cif}
							type="text"
							required
							value={data.cif}
							errorText={errors.cif}
							onChange={event => updateState({
									cif: event.target.value
								})
							}
						/>
					</div>
				</GridItem>
				<GridItem xs={12} md={12} lg={12}>
					<div
						style={{
							width: '400px',
							margin: 'auto'
						}}
					>
						<TextInput
							floatingText={translate.company_new_key}
							type={
								state.showPassword ?
									'text'
									: 'password'
							}
							passwordToggler={() => setState({
									showPassword: !state.showPassword
								})
							}
							showPassword={state.showPassword}
							required
							helpPopover={true}
							helpTitle={translate.company_new_key}
							helpDescription={translate.link_key_tooltip}
							value={data.linkKey}
							errorText={errors.linkKey}
							onChange={event => updateState({
									linkKey: event.target.value
								})
							}
						/>
						<br />

					</div>
				</GridItem>
				<GridItem xs={12} md={12} lg={12} style={{ maxWidth: '400px', margin: '0 auto' }}>
					<div
						style={{
							display: 'flex',
							justifyContent: 'flex-end'
						}}>
						<BasicButton
							text={translate.link}
							color={getPrimary()}
							error={requestError}
							success={success}
							loading={request}
							floatRight
							buttonStyle={{
								marginTop: '1.5em'
							}}
							textStyle={{
								color: 'white',
								fontWeight: '700'
							}}
							onClick={linkCompany}
							icon={<ButtonIcon type="link" color="white" />}
						/>
					</div>
				</GridItem>
			</Grid>
		</CardPageLayout>
	);
};


export default graphql(linkCompanyMutation, {
	name: 'linkCompany',
	options: {
		errorPolicy: 'all'
	}
})(withSharedProps()(withApollo(LinkCompanyPage)));
