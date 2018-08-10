import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { TabsScreen, FabButton, Icon } from "../displayComponents";
import { Tooltip } from 'material-ui';
import Signatures from "../components/dashboard/Signatures";
import { lightGrey } from '../styles/colors';
import withWindowSize from '../HOCs/withWindowSize';
import { bHistory } from '../containers/App';

const SignatureContainer = ({ match, company, translate, windowSize }) => {
	const tabsIndex = {
		drafts: 0,
		live: 1,
		finished: 2
	};

	const tabsInfo = [
		{
			text: translate.document_signature_drafts,
			link: `/company/${company.id}/signatures/drafts`,
			component: () => {
				return (
					<Signatures
						company={company}
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
				height: 'calc(100vh - 3em)',
				padding: '2em',
				position: 'relative',
				...(windowSize === 'xs'? { padding: 0, paddingTop: '1em', height: 'calc(100vh - 6.5em)' } : {}),
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
							icon={
								<Icon className="material-icons">
									add
								</Icon>
							}
							onClick={() =>
								bHistory.push(`/company/${company.id}/signature/new`)
							}
						/>
					</div>
				</Tooltip>
			</div>
		</div>
	);
};

const mapStateToProps = state => ({
	company: state.companies.list[state.companies.selected],
	translate: state.translate
});

export default connect(mapStateToProps)(withRouter(withWindowSize(SignatureContainer)));
