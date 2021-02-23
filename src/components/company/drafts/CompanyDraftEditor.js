import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { compose } from 'react-apollo/index';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
	BasicButton,
	ButtonIcon,
	UnsavedChangesModal,
	CardPageLayout,
} from '../../../displayComponents';
import CompanyDraftForm from './CompanyDraftForm';
import {
	getCompanyDraftData,
	updateCompanyDraft as updateCompanyDraftMutation
} from '../../../queries/companyDrafts';
import { checkRequiredFields, removeTypenameField } from '../../../utils/CBX';
import { getPrimary } from '../../../styles/colors';
import { sendGAevent } from '../../../utils/analytics';
import withSharedProps from '../../../HOCs/withSharedProps';
import { bHistory } from '../../../containers/App';
import { isMobile } from '../../../utils/screen';
import { INPUT_REGEX } from '../../../constants';


const CompanyDraftEditor = ({ translate, client, ...props }) => {
	const [dataInit, setDataInit] = React.useState(null);
	const [unsavedAlert, setUnsavedAlert] = React.useState(false);
	const [data, setData] = React.useState({
		companyId: '',
		companyType: '',
		corporationId: '',
		creationDate: '',
		description: '',
		draftId: '',
		id: '',
		language: '',
		lastModificationDate: '',
		majority: '',
		majorityDivider: '',
		majorityType: '',
		statuteId: '',
		text: '',
		title: '',
		type: '',
		userId: '',
		votationType: '',
	});
	const [vars, setVars] = React.useState({});
	const [errors, setErrors] = React.useState({});
	const [fetching, setFetching] = React.useState(true);
	const [loading, setLoading] = React.useState(false);
	const [success, setSuccess] = React.useState(false);

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: getCompanyDraftData,
			variables: {
				id: +props.match.params.id,
				companyId: +props.match.params.company
			}
		});

		setVars(response.data);
		setData(response.data.companyDraft);
		setDataInit(response.data.companyDraft);
		setFetching(false);
	}, [props.match.params.id]);

	React.useEffect(() => {
		getData();
	}, [getData]);

	const updateState = object => {
		setData({
			...data,
			...object
		});
		setSuccess(false);
	};

	const updateErrors = newErrors => {
		setErrors(newErrors);
	};

	const updateCompanyDraft = async () => {
		const newErrors = {
			title: '',
		};
		let hasError = false;
		const regex = INPUT_REGEX;
		if (!checkRequiredFields(translate, data, updateErrors, null, toast)) {
			if (data.title) {
				if (!(regex.test(data.title)) || !data.title.trim()) {
					hasError = true;
					newErrors.title = translate.invalid_field;
					updateErrors(newErrors);
				}
			}

			if (!hasError) {
				setLoading(true);
				const cleanData = removeTypenameField(data);
				const response = await props.updateCompanyDraft({
					variables: {
						draft: {
							...cleanData,
							companyId: +props.match.params.company
						}
					}
				});

				sendGAevent({
					category: 'Borradores',
					action: 'Modificación de borrador',
					label: props.company.businessName
				});


				if (!response.errors) {
					setSuccess(true);
					setLoading(false);
					bHistory.back();
				}
			}
		}
	};

	const comprobateChanges = () => JSON.stringify(data) !== JSON.stringify(dataInit);

	const goBack = () => {
		if (!comprobateChanges()) {
			bHistory.back();
		} else {
			setUnsavedAlert(true);
		}
	};

	return (
		<CardPageLayout title={translate.edit_draft} disableScroll={true}>
			{!fetching && (
				<div style={{ height: 'calc( 100% - 5em )' }}>
					<div style={{
						marginTop: '1.8em', height: '100%', overflow: 'hidden', padding: '0px 25px'
					}}>
						<CompanyDraftForm
							translate={translate}
							errors={errors}
							updateState={updateState}
							draft={data}
							companyStatutes={vars.companyStatutes}
							draftTypes={vars.draftTypes}
							votingTypes={vars.votingTypes}
							majorityTypes={vars.majorityTypes}
							match={props.match}
						/>
					</div>

					<div style={{
						paddingRight: '0.8em',
						width: '100%',
						display: 'flex',
						justifyContent: 'flex-end',
						alignItems: 'center',
						paddingTop: isMobile && '0.5em'
					}}>
						<BasicButton
							floatRight
							type="flat"
							text={translate.back}
							loading={loading}
							success={success}
							color={getPrimary()}
							textStyle={{
								color: 'white',
								fontWeight: '700',
								marginRight: '1em'
							}}
							onClick={goBack}
						/>
						<BasicButton
							id={'saveDraftinEdit'}
							text={translate.save}
							color={getPrimary()}
							loading={loading}
							success={success}
							textStyle={{
								color: 'white',
								fontWeight: '700',
								marginRight: '1em'
							}}
							floatRight
							onClick={updateCompanyDraft}
							icon={<ButtonIcon type="save" color="white" />}
						/>
					</div>
				</div>
			)}
			<UnsavedChangesModal
				acceptAction={updateCompanyDraft}
				cancelAction={() => bHistory.back()}
				requestClose={() => setUnsavedAlert(false)}
				successAction={success}
				loadingAction={loading}
				open={unsavedAlert}
			/>
		</CardPageLayout>
	);
};

export default compose(
	withApollo,
	graphql(updateCompanyDraftMutation, { name: 'updateCompanyDraft' })
)(withRouter(withSharedProps()(CompanyDraftEditor)));
