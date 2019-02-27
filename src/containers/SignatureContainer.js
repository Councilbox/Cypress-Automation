import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { TabsScreen, FabButton, Icon, AlertConfirm } from "../displayComponents";
import { Tooltip } from 'material-ui';
import Signatures from "../components/dashboard/Signatures";
import { lightGrey } from '../styles/colors';
import withWindowSize from '../HOCs/withWindowSize';
import CBXContactButton from '../components/noCompany/CBXContactButton';
import { bHistory } from '../containers/App';
import { TRIAL_DAYS } from "../config";
import { trialDaysLeft } from "../utils/CBX";
import { moment } from "./App";
import CantCreateCouncilsModal from "../components/dashboard/CantCreateCouncilsModal";

class SignatureContainer extends React.Component {

	state = {
		noPremiumModal: false,
		cantCreateSignature: false
	}

	showCantAccessPremiumModal = () => {
		this.setState({
			noPremiumModal: true
		})
	}

	showCantAccessSignatures = () => {
		this.setState({
			cantCreateSignature: true
		});
	}

	canCreateSignature = () => {
		return ['aaron.fuentes.cocodin@gmail.com'].includes(this.props.user.email)
	}

	closeCantAccessPremiumModal = () => {
		this.setState({
			noPremiumModal: false
		})
	}

	render() {
		const { match, company, translate, windowSize } = this.props;
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
				component: () => {
					return (
						<Signatures
							company={company}
							disabled={cantAccessPremium}
							translate={translate}
							title={translate.document_signature_drafts}
							desc={translate.signature_of_documents_drafts_desc}
							icon={"pencil-square-o"}
							state={[0]}
						/>
					);
				}
			},
			{
				text: translate.signature_of_documents_sent,
				link: `/company/${company.id}/signatures/live`,
				component: () => {
					return (
						<Signatures
							company={company}
							disabled={cantAccessPremium}
							translate={translate}
							title={translate.signature_of_documents_sent}
							desc={translate.signature_of_documents_desc}
							icon={"paper-plane-o"}
							state={[10]}
						/>
					);
				}
			},
			{
				text: translate.signature_of_documents_completed,
				link: `/company/${company.id}/signatures/finished`,
				component: () => {
					return (
						<Signatures
							company={company}
							translate={translate}
							disabled={cantAccessPremium}
							title={translate.signature_of_documents_completed}
							desc={translate.signature_of_documents_completed_desc}
							icon={"check-square-o"}
							state={[20]}
						/>
					);
				}
			}
		];

		return (
			<div
				style={{
					width: '100%',
					height: '100%',
					padding: '2em',
					position: 'relative',
					...(windowSize === 'xs'? { padding: 0, paddingTop: '1em', height: 'calc(100% - 1.6rem)',width: '98%',margin: '0px auto'} : {}),
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
						<div style={{ marginBottom: "0.3em" }}>
							<FabButton
								{...(cantAccessPremium || !this.canCreateSignature()? { color: 'grey'} : {})}
								icon={
									<Icon className="material-icons">
										add
									</Icon>
								}
								onClick={() =>
									cantAccessPremium?
										this.showCantAccessPremiumModal()
									:
										!this.canCreateSignature()?
											this.showCantAccessSignatures()
										:
											bHistory.push(`/company/${company.id}/signature/new`)
								}
							/>
						</div>
					</Tooltip>
				</div>
				<AlertConfirm
					title={translate.warning}
					open={this.state.cantCreateSignature}
					hideAccept
					buttonCancel={translate.close}
					requestClose={() => this.setState({ cantCreateSignature: false})}
					bodyText={
						<div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
							<div style={{marginBottom: '0.8em'}}>
								{translate.you_dont_have_this_feature}
							</div>
							<CBXContactButton
								translate={translate}
							/>
						</div>
					}
				/>
				<CantCreateCouncilsModal
					open={this.state.noPremiumModal}
					requestClose={this.closeCantAccessPremiumModal}
					translate={translate}
				/>
			</div>
		);
	}
};

const mapStateToProps = state => ({
	company: state.companies.list[state.companies.selected],
	user: state.user,
	translate: state.translate
});

export default connect(mapStateToProps)(withRouter(withWindowSize(SignatureContainer)));
