import React from "react";
import TopSectionBlocks from "./TopSectionBlocks";
import { darkGrey, lightGrey } from "../../styles/colors";
import withSharedProps from '../../HOCs/withSharedProps';
import { Scrollbar, CBXFooter, Block, Icon, BasicButton, ButtonIcon, AlertConfirm } from '../../displayComponents';
import { moment } from '../../containers/App';
import { TRIAL_DAYS } from '../../config';
import { trialDaysLeft } from '../../utils/CBX';



class Dashboard extends React.Component {
	// const Dashboard = ({ translate, company, user }) => {

	state = {
		edit: false,
		modalEdit:false
	}

	editMode = () => {
		this.setState({
			edit: this.state.edit ? false : true,
		})
	}

	modalEditClick = () => {
		this.setState({
			modalEdit: true,
		})
	}

	modalEditClickClose = () => {
		this.setState({
			modalEdit: false,
		})
	}

	render() {
		const { translate, company, user } = this.props;
		const trialDays = trialDaysLeft(company, moment, TRIAL_DAYS);

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
				}}
				className="container-fluid"
			>
				<Scrollbar>
					<div style={{ display: "flex", justifyContent: 'flex-end', marginRight: "1.3em", marginTop: '0.5em' }}>
						{this.state.edit && (
							<BasicButton
								text="Select Items"  //TRADUCCION
								onClick={this.modalEditClick}
								buttonStyle={{ marginRight: "1em" }}
							/>
						)}
						<BasicButton
							text="Edit Dashboard"  //TRADUCCION
							onClick={this.editMode}
							icon={this.state.edit ? <ButtonIcon type="lock_open" color={"red"} /> : <ButtonIcon type="lock" color={"black"} />}
						/>
					</div>
					<AlertConfirm
						requestClose={this.modalEditClickClose}
						open={this.state.modalEdit}
						bodyText={
							<div>ASDASD</div>
						}
						title={"Items"}//TRADUCCION
						widthModal={{ width: "50%" }}
					/>
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
								display: "inline-flex",
								fontWeight: "700",
								color: darkGrey,
								fontSize: "1em",
								marginBottom: '1em'
							}}
						>
						</div>
						{/* <div style={{ display: 'flex', flexDirection: 'column', fontWeight: '700', alignItems: 'center' }}>
						<div>
							{company.logo &&
								<img src={company.logo} alt="company-logo" style={{ height: '4.5em', width: 'auto' }} />
							}
						</div>
						<div>
							{company.businessName}
							{company.demo === 1 && ` (${translate.free_trial_remaining} ${trialDays <= 0 ? 0 : trialDays} ${translate.input_group_days})`}
						</div>
					</div> */}
						<TopSectionBlocks
							translate={translate}
							company={company}
							user={user}
							editMode={this.state.edit}
						/>
					</div>
					<CBXFooter />
				</Scrollbar>

			</div>
		)
	}
}


export default withSharedProps()(Dashboard);
