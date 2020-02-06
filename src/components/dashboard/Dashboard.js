import React from "react";
import TopSectionBlocks from "./TopSectionBlocks";
import { darkGrey, lightGrey } from "../../styles/colors";
import withSharedProps from '../../HOCs/withSharedProps';
import { Scrollbar, CBXFooter, CardPageLayout, LoadingMainApp } from '../../displayComponents';
import { moment, store } from '../../containers/App';
import { TRIAL_DAYS } from '../../config';
import { trialDaysLeft, showOrganizationDashboard } from '../../utils/CBX';
import { addSpecificTranslations } from "../../actions/companyActions";
import NewCompanyPage from "../company/new/NewCompanyPage";
import NewUser from "../corporation/users/NewUser";
import { isMobile } from "react-device-detect";
import Loadable from 'react-loadable';
import { ConfigContext } from "../../containers/AppControl";

const OrganizationDashboard = Loadable({
	loader: () => import('./OrganizationDashboard'),
	loading: LoadingMainApp
});

const Dashboard = ({ translate, company, user }) => {
	const trialDays = trialDaysLeft(company, moment, TRIAL_DAYS);
	const [addUser, setAddUser] = React.useState(false);
	const [addEntidades, setEntidades] = React.useState(false);
	const config = React.useContext(ConfigContext);

	React.useEffect(() => {
		store.dispatch(addSpecificTranslations(company.category));
	}, [store, company.category]);

	if (addUser) {
		return <NewUser translate={translate} requestClose={() => setAddUser(false)} styles={{
			width: "100%",
			height: '100%',
			display: 'flex',
			width: '100%',
			overflow: 'hidden'
		}} />
	}

	if (addEntidades) {
		return <NewCompanyPage requestClose={() => setEntidades(false)} buttonBack={true} />
	}

	return (
		<div
			style={{
				overflowY: "hidden",
				width: "100%",
				backgroundColor: lightGrey,
				padding: 0,
				height: "100%",
				display: "flex",
				alignItems: "center",
				flexDirection: "column",
				height: '100%'
			}}
			className="container-fluid"
		>
			<Scrollbar>
				<div
					style={{
						width: "100%",
						backgroundColor: lightGrey,
						display: "flex",
						alignItems: "center",
						flexDirection: "column",
						padding: '1em',
						textAlign: 'center',
						paddingBottom: "1em",
						height: '100%'
					}}
				>

					{showOrganizationDashboard(company, config, user) ?
						<OrganizationDashboard
							translate={translate}
							company={company}
							user={user}
							setAddUser={setAddUser}
							setEntidades={setEntidades}
						/>
						:
						<React.Fragment>
							<div
								style={{
									fontWeight: "700",
									color: darkGrey,
									fontSize: "1em",
									marginBottom: '1em'
								}}
							>
							</div>
							<div style={{ display: 'flex', flexDirection: 'column', fontWeight: '700', alignItems: 'center' }}>
								<div>
									{company.logo &&
										<img src={company.logo} alt="company-logo" style={{ height: '4.5em', width: 'auto' }} />
									}
								</div>
								<div>
									{company.businessName}
									{company.demo === 1 && ` (${translate.free_trial_remaining} ${trialDays <= 0 ? 0 : trialDays} ${translate.input_group_days})`}
								</div>
							</div>
							<TopSectionBlocks
								translate={translate}
								company={company}
								user={user}
								setAddUser={setAddUser}
								setEntidades={setEntidades}
							/>
						</React.Fragment>

					}
					<CBXFooter style={company.id === company.corporationId? {} : { marginTop : '3em' }} />
				</div>
			</Scrollbar>
		</div>
	);
}


export default withSharedProps()(Dashboard);
