import React from "react";
import TopSectionBlocks from "./TopSectionBlocks";
import { darkGrey, lightGrey } from "../../styles/colors";
import withSharedProps from '../../HOCs/withSharedProps';
import { Scrollbar, CBXFooter } from '../../displayComponents';
import { moment, store } from '../../containers/App';
import { TRIAL_DAYS } from '../../config';
import { trialDaysLeft } from '../../utils/CBX';
import { addSpecificTranslations } from "../../actions/companyActions";

const Dashboard = ({ translate, company, user }) => {
	const trialDays = trialDaysLeft(company, moment, TRIAL_DAYS);

	React.useEffect(() => {
		store.dispatch(addSpecificTranslations(company.type === 10? 'realEstate' : 'society'));
	}, [store, company.type]);

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
				flexDirection: "column"
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
						paddingBottom: "4em"
					}}
				>
					<div
						style={{
							fontWeight: "700",
							color: darkGrey,
							fontSize: "1em",
							marginBottom: '1em'
						}}
					>
					</div>
					<div style={{display: 'flex', flexDirection: 'column', fontWeight: '700', alignItems: 'center'}}>
						<div>
							{company.logo &&
								<img src={company.logo} alt="company-logo" style={{height: '4.5em', width: 'auto'}} />
							}
						</div>
						<div>
							{company.businessName}
							{company.demo === 1 && ` (${translate.free_trial_remaining} ${trialDays <= 0? 0 : trialDays} ${translate.input_group_days})`}
						</div>
					</div>
					<TopSectionBlocks
						translate={translate}
						company={company}
						user={user}
					/>
				</div>
				<CBXFooter />
			</Scrollbar>
		</div>
	);
}


export default withSharedProps()(Dashboard);
