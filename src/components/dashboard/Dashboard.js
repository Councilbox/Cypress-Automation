import React from "react";
import TopSectionBlocks from "./TopSectionBlocks";
import { darkGrey, lightGrey, primary, getSecondary } from "../../styles/colors";
import withSharedProps from '../../HOCs/withSharedProps';
import { Scrollbar, CBXFooter, Block, Icon, BasicButton, ButtonIcon, AlertConfirm, GridItem, Grid } from '../../displayComponents';
import { moment } from '../../containers/App';
import { TRIAL_DAYS } from '../../config';
import { trialDaysLeft } from '../../utils/CBX';
import { ButtonBase } from "material-ui";
import { isMobile } from "react-device-detect";
import ModalEditDash from "./ModalEditDash";



const json = [
	{	///// visible //////
		"buttons": true,
		"sectionReuniones": true,
		"lastActions": true,
		"reuniones": true,
		"noSession": true,
		"calendar": true,
	},
	[
		{ i: 'buttons', x: 0, y: 0, w: 12, h: 2 },
		{ i: 'sectionReuniones', x: 0, y: 0, w: 2, h: 2, },
		{ i: 'calendar', x: 0, y: 0, w: 12, h: 5, },
	],
	[
		{ i: 'reuniones', x: 0, y: 0, w: 2, h: 2.3 },
		{ i: 'lastActions', x: 5.5, y: 0, w: 3.8, h: 3.5 },
		{ i: 'noSession', x: 8.5, y: 0, w: 2, h: 2.3 },
	],
]

const layoutsResize = {
	lg: [
		{ i: 'buttons', x: 0, y: 0, w: 12, h: 1.5 },
		{ i: 'sectionReuniones', x: 0, y: 0, w: 12, h: 3.5 },
		{ i: 'calendar', x: 0, y: 0, w: 12, h: 4 },
	],
	md: [
		{ i: 'buttons', x: 0, y: 0, w: 12, h: 1.5 },
		{ i: 'sectionReuniones', x: 0, y: 0, w: 12, h: 5.3 },
		{ i: 'calendar', x: 0, y: 0, w: 12, h: 4 },
	],
	sm: [
		{ i: 'buttons', x: 0, y: 0, w: 12, h: 2.5 },
		{ i: 'sectionReuniones', x: 0, y: 0, w: 12, h: 5.3 },
		{ i: 'calendar', x: 0, y: 0, w: 12, h: 4 },
	],
	xs: [
		{ i: 'buttons', x: 0, y: 0, w: 12, h: 3.5 },
		{ i: 'sectionReuniones', x: 0, y: 0, w: 12, h: 6 },
		{ i: 'calendar', x: 0, y: 6, w: 12, h: 4 },
	],
	xxs: [
		{ i: 'buttons', x: 0, y: 0, w: 12, h: 3 },
		{ i: 'sectionReuniones', x: 0, y: 0, w: 12, h: 2 },
		{ i: 'calendar', x: 0, y: 6, w: 12, h: 4 },
	]
}

const layoutsResize2 = {
	lg: [
		{ i: 'reuniones', x: 0, y: 0, w: 2.1, h: 2.3 },
		{ i: 'lastActions', x: 5.5, y: 0, w: 3.8, h: 3.5 },
		{ i: 'noSession', x: 8.5, y: 0, w: 2.1, h: 2.3 },
	],
	md: [
		{ i: 'reuniones', x: 0, y: 0, w: 2.1, h: 2.3 },
		{ i: 'lastActions', x: 5.5, y: 0, w: 3.7, h: 3.5 },
		{ i: 'noSession', x: 8.3, y: 0, w: 2.1, h: 2.3 },
	],
	sm: [
		{ i: 'reuniones', x: 0, y: 0, w: 2, h: 2.3 },
		{ i: 'lastActions', x: 4.5, y: 0, w: 3.7, h: 3.5 },
		{ i: 'noSession', x: 7.2, y: 0, w: 2, h: 2.3 },
	],
	xs: [
		{ i: 'reuniones', x: 0, y: 0, w: 2, h: 2.5 },
		{ i: 'lastActions', x: 2, y: 0, w: 3, h: 3 },
		{ i: 'noSession', x: 5.5, y: 0, w: 2, h: 2.5 },
	],
	xxs: [
		{ i: 'reuniones', x: 0, y: 0, w: 2, h: 3 },
		{ i: 'lastActions', x: 2, y: 0, w: 3.5, h: 3 },
		{ i: 'noSession', x: 5.5, y: 0, w: 2, h: 3 },
	]
}


if (!localStorage.getItem("items")) {
	localStorage.setItem("items", JSON.stringify(json));
	localStorage.setItem("layoutsResize", JSON.stringify(layoutsResize));
	localStorage.setItem("layoutsResizeHorizontal", JSON.stringify(layoutsResize2));
}

class Dashboard extends React.Component {

	state = {
		edit: false,
		modalEdit: false,
		items: JSON.parse(localStorage.getItem("items")),
		layout: JSON.parse(localStorage.getItem("layoutsResize")),
		layoutHorizontal: JSON.parse(localStorage.getItem("layoutsResizeHorizontal"))
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

	resetDash = () => {
		localStorage.removeItem("items")
		localStorage.removeItem("layoutsResize")
		localStorage.removeItem("layoutsResizeHorizontal")
		localStorage.setItem("items", JSON.stringify(json));
		localStorage.setItem("layoutsResize", JSON.stringify(layoutsResize));
		localStorage.setItem("layoutsResizeHorizontal", JSON.stringify(layoutsResize2));
		this.setState({
			items: JSON.parse(localStorage.getItem("items")),
			layout: JSON.parse(localStorage.getItem("layoutsResize")),
			layoutHorizontal: JSON.parse(localStorage.getItem("layoutsResizeHorizontal"))
		})
	}

	itemStorage = (item, value, object, grid, layout, size) => {
		let objectItems = {};
		if (!localStorage.getItem("items")) {
			localStorage.setItem("items", JSON.stringify({}))
		}
		if (layout) {
			//guardamos el orden segun el tamaño
			console.log("ENTRO EN LAYOUT ITEMSTORAGE")
			objectItems = JSON.parse(localStorage.getItem(layout));
			delete objectItems[size]
			objectItems[size] = object
			localStorage.setItem(layout, JSON.stringify(objectItems))
			if (layout === "layoutsResize") {
				console.log("if")
				console.log(layout)
				this.setState({
					layout: JSON.parse(localStorage.getItem(layout))
				})
			} else {
				console.log("ELSE")
				console.log(layout)
				this.setState({
					layoutHorizontal: JSON.parse(localStorage.getItem(layout))
				})
			}
		} else {
			//guardamos en localstorage si se ve en pantalla
			objectItems = JSON.parse(localStorage.getItem("items"));
			if (value !== "") {
				objectItems[0][item] = value;
			} else if (grid) {
				objectItems.splice(grid, grid, object)
			}
			localStorage.setItem("items", JSON.stringify(objectItems))
			this.setState({
				items: JSON.parse(localStorage.getItem("items"))
			})
		}
	}

	render() {
		const { translate, company, user } = this.props;
		const trialDays = trialDaysLeft(company, moment, TRIAL_DAYS);
		const secondary = getSecondary();


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
					{!isMobile && (
						<div style={{ marginTop: '0.5em', position: 'absolute', right: '1.35em', display: "flex" }}>
							{this.state.edit && (
								<div style={{ display: "flex" }}>
									<BasicButton
										text="Reset Dashboard"  //TRADUCCION
										onClick={this.resetDash}
										buttonStyle={{ marginRight: "1em", zIndex: "3" }}
									/>
									<BasicButton
										text="Select Items"  //TRADUCCION
										onClick={this.modalEditClick}
										buttonStyle={{ marginRight: "1em", zIndex: "3" }}
									/>
								</div>
							)}
							<BasicButton
								buttonStyle={{ zIndex: "3" }}
								text="Edit Dashboard"  //TRADUCCION
								onClick={this.editMode}
								icon={this.state.edit ? <ButtonIcon type="lock_open" color={"red"} /> : <ButtonIcon type="lock" color={"black"} />}
							/>
						</div>
					)}
					<ModalEditDash
						translate={translate}
						itemStorage={this.itemStorage}
						requestClose={this.modalEditClickClose}
						open={this.state.modalEdit}
						title={"Items Dashboard"}//TRADUCCION
						items={this.state.items}
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
							paddingBottom: "4em",
							// marginLeft:"2%"
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
							itemStorage={this.itemStorage}
							statesItems={this.state.items}
							layoutsResize={this.state.layout}
							layoutsResizeHorizontal={this.state.layoutHorizontal}
						/>
					</div>
					<CBXFooter />
				</Scrollbar>

			</div>
		)
	}
}

export default withSharedProps()(Dashboard);
