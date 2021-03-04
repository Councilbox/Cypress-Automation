import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Tooltip } from 'material-ui';
import {
	TabsScreen, FabButton, Icon, AlertConfirm
} from '../displayComponents';
import Signatures from '../components/dashboard/Signatures';
import { lightGrey } from '../styles/colors';
import withWindowSize from '../HOCs/withWindowSize';
import CBXContactButton from '../components/noCompany/CBXContactButton';
import { bHistory, moment } from './App';
import { TRIAL_DAYS } from '../config';
import { trialDaysLeft } from '../utils/CBX';
import CantCreateCouncilsModal from '../components/dashboard/CantCreateCouncilsModal';
import { sendGAevent } from '../utils/analytics';
import { ConfigContext } from './AppControl';

const SignatureContainer = ({
	match, company, translate, windowSize
}) => {
	const [cantCreate, setCantCreate] = React.useState(false);
	const [noPremiumModal, setNoPremiumModal] = React.useState(false);
	const config = React.useContext(ConfigContext);

	React.useEffect(() => {
		sendGAevent({
			category: 'Firmas',
			action: 'Entrada a la sección de firmas',
			label: company.businessName
		});
	}, [sendGAevent]);

	const showCantAccessPremiumModal = () => {
		setNoPremiumModal(true);
	};

	const showCantAccessSignatures = () => {
		setCantCreate(true);
	};

	const canCreateSignature = () => config.signature;

	const closeCantAccessPremiumModal = () => {
		setNoPremiumModal(false);
	};

	const tabsIndex = {
		drafts: 0,
		live: 1,
		finished: 2
	};

	const cantAccessPremium = company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0;
	const tabsInfo = [
		{
			text: translate.document_signature_drafts,
			link: `/company/${company.id}/signatures/drafts`,
			component: () => (
				<Signatures
					company={company}
					disabled={cantAccessPremium}
					translate={translate}
					title={translate.document_signature_drafts}
					desc={translate.signature_of_documents_drafts_desc}
					icon={'pencil-square-o'}
					state={[0]}
				/>
			)
		},
		{
			text: translate.signature_of_documents_sent,
			link: `/company/${company.id}/signatures/live`,
			component: () => (
				<Signatures
					company={company}
					disabled={cantAccessPremium}
					translate={translate}
					title={translate.signature_of_documents_sent}
					desc={translate.signature_of_documents_desc}
					icon={'paper-plane-o'}
					state={[10]}
				/>
			)
		},
		{
			text: translate.signature_of_documents_completed,
			link: `/company/${company.id}/signatures/finished`,
			component: () => (
				<Signatures
					company={company}
					translate={translate}
					disabled={cantAccessPremium}
					title={translate.signature_of_documents_completed}
					desc={translate.signature_of_documents_completed_desc}
					icon={'check-square-o'}
					state={[20]}
				/>
			)
		}
	];

	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				padding: '2em',
				position: 'relative',
				...(windowSize === 'xs' ? {
					padding: 0, paddingTop: '1em', height: 'calc(100% - 1.6rem)', width: '98%', margin: '0px auto'
				} : {}),
				backgroundColor: lightGrey
			}}
		>
			<TabsScreen
				tabsIndex={tabsIndex}
				tabsInfo={tabsInfo}
				selected={match.params.section}
				controlled={true}
				linked={true}
			/>
			<div
				style={{
					position: 'absolute',
					right: '3%',
					bottom: '5%'
				}}
			>
				<Tooltip title={`${translate.dashboard_new_signature}`}>
					<div style={{ marginBottom: '0.3em' }}>
						<FabButton
							{...(cantAccessPremium || !canCreateSignature() ? { color: 'grey' } : {})}
							icon={
								<Icon className="material-icons">
									add
								</Icon>
							}
							onClick={() => (cantAccessPremium ?
								showCantAccessPremiumModal()
								: !canCreateSignature() ?
									showCantAccessSignatures()
									: bHistory.push(`/company/${company.id}/signature/new`))
							}
						/>
					</div>
				</Tooltip>
			</div>
			<AlertConfirm
				title={translate.warning}
				open={cantCreate}
				hideAccept
				buttonCancel={translate.close}
				requestClose={() => setCantCreate(false)}
				bodyText={
					<div style={{
						display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'
					}}>
						<div style={{ marginBottom: '0.8em' }}>
							{translate.you_dont_have_this_feature}
						</div>
						<CBXContactButton
							translate={translate}
						/>
					</div>
				}
			/>
			<CantCreateCouncilsModal
				open={noPremiumModal}
				requestClose={closeCantAccessPremiumModal}
				translate={translate}
			/>
		</div>
	);
};


const mapStateToProps = state => ({
	company: state.companies.list[state.companies.selected],
	user: state.user,
	translate: state.translate
});

export default connect(mapStateToProps)(withRouter(withWindowSize(SignatureContainer)));
