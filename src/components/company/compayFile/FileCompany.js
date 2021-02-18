import React from 'react';
import { withApollo } from 'react-apollo';
import { CardPageLayout, LoadingSection } from '../../../displayComponents';
import MenuSuperiorTabs from '../../dashboard/MenuSuperiorTabs';
import withTranslations from '../../../HOCs/withTranslations';
import FileInfo from './FileInformacion';
import FileOrgAdm from './FileOrgAdm';
import FileLibrosOfi from './FileLibrosOfi';
import FileAuditoresPode from './FileAuditoresPode';
import FileEstatutos from './FileEstatutos';
import FileCalendario from './FileCalendario';
import { company } from '../../../queries';
import { updateCompany } from '../../../queries/company';
import SocialCapital from './SocialCapital';


const reducer = (state, action) => {
	const actions = {
		SET_DATA: () => ({
			...state,
			loading: false,
			data: {
				...action.payload,
				file: action.payload.file ? action.payload.file : {}
			}
		}),
		UPDATE_COMPANY_DATA: () => ({
			...state,
			data: {
				...state.data,
				...action.payload
			}
		}),
		UPDATE_FILE_DATA: () => ({
			...state,
			data: {
				...state.data,
				file: {
					...state.data.file,
					...action.payload
				}
			}
		})
	};

	return actions[action.type] ? actions[action.type]() : state;
};


const FileCompany = ({ translate, match, client }) => {
	const [{ loading, data }, dispatch] = React.useReducer(reducer, {
		loading: true,
		data: null
	});
	const [selecteOptionMenu, setSelecteOptionMenu] = React.useState(translate.information);
	const [updateState, setUpdateState] = React.useState(false);

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: company,
			variables: {
				id: +match.params.id
			}
		});
		dispatch({ type: 'SET_DATA', payload: response.data.company });
	}, [match.params.id]);

	React.useEffect(() => {
		getData();
	}, [getData]);

	function checkRequiredFields() {
		const errors = {
			businessName: '',
			tin: ''
		};

		let hasError = false;

		if (!data.businessName) {
			hasError = true;
			errors.businessName = translate.field_required;
		}

		if (!data.tin) {
			hasError = true;
			errors.tin = translate.field_required;
		}
		return hasError;
	}

	const saveCompany = async () => {
		if (!checkRequiredFields()) {
			const {
				__typename, creatorId, creationDate, corporationId, ...newData
			} = data;
			setUpdateState('LOADING');
			await client.mutate({
				mutation: updateCompany,
				variables: {
					company: newData
				}
			});
			setUpdateState('SUCCESS');
			setTimeout(() => setUpdateState('INITIAL'), 2000);
		}
	};

	const updateCompanyData = React.useCallback(object => {
		dispatch({ type: 'UPDATE_COMPANY_DATA', payload: object });
	}, [match.params.id]);

	const updateFileData = React.useCallback(object => {
		dispatch({ type: 'UPDATE_FILE_DATA', payload: object });
	}, [match.params.id]);

	const getInformacion = () => (
		<FileInfo
			data={data}
			updateState={updateState}
			updateCompanyData={updateCompanyData}
			updateFileData={updateFileData}
			updateCompany={saveCompany}
		/>
	);

	const OrgAdministracion = () => (
		<FileOrgAdm
			data={data}
			updateState={updateState}
			updateCompanyData={updateCompanyData}
			updateCompany={saveCompany}
		/>
	);

	const getShareCapital = () => (
		<SocialCapital
			data={data}
			updateState={updateState}
			updateCompanyData={updateCompanyData}
			updateFileData={updateFileData}
			updateCompany={saveCompany}
		/>
	);

	const librosOficiales = () => (
		<FileLibrosOfi
			data={data}
			updateState={updateState}
			updateCompanyData={updateCompanyData}
			updateFileData={updateFileData}
			updateCompany={saveCompany}
		/>
	);

	const auditoresPoderes = () => (
		<FileAuditoresPode
			data={data}
			updateState={updateState}
			updateFileData={updateFileData}
			updateCompany={saveCompany}
		/>
	);

	const estatutos = () => (
		<FileEstatutos
			data={data}
			updateState={updateState}
			updateFileData={updateFileData}
			updateCompany={saveCompany}
		/>
	);

	const calendario = () => (
		<FileCalendario
			company={data}
		/>
	);

	if (loading) {
		return <LoadingSection />;
	}

	return (
		<CardPageLayout title={`Ficha de ${data.businessName}`} disableScroll avatar={data.logo}>
			{/* company.icon */}
			<div style={{ padding: '1em', height: '100%', paddingTop: '0px' }}>
				<div style={{
					display: 'flex', padding: '1em', justifyContent: 'space-between', paddingTop: '0px', alignItems: 'center'
				}}>
					<div style={{ fontSize: '13px' }}>
						<MenuSuperiorTabs
							items={[translate.information, translate.social_capital_desc, translate.board_of_directors, translate.official_books, translate.auditors_and_powers, translate.statutes, translate.calendar]}
							setSelect={setSelecteOptionMenu}
							selected={selecteOptionMenu}
						/>
					</div>
				</div>
				{selecteOptionMenu === translate.information
					&& getInformacion()
				}
				{selecteOptionMenu === translate.board_of_directors
					&& OrgAdministracion()
				}
				{selecteOptionMenu === translate.social_capital_desc
					&& getShareCapital()
				}
				{selecteOptionMenu === translate.official_books
					&& librosOficiales()
				}
				{selecteOptionMenu === translate.auditors_and_powers
					&& auditoresPoderes()
				}
				{selecteOptionMenu === translate.statutes
					&& estatutos()
				}
				{selecteOptionMenu === translate.calendar
					&& calendario()
				}
			</div>
		</CardPageLayout>
	);
};

export default withTranslations()(withApollo(FileCompany));
