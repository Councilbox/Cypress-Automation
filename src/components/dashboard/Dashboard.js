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
		{ i: 'buttons', x: 0, y: 0, w: 12, h: 1.5 },
		{ i: 'sectionReuniones', x: 0, y: 0, w: 12, h: 3.5 },
		{ i: 'calendar', x: 0, y: 0, w: 12, h: 4 },
	],
	[
		{ i: 'reuniones', x: 8, y: 0, w: 2.2, h: 2.3 },
		{ i: 'lastActions', x: 0, y: 0, w: 4.1, h: 3.5, minW: 4.3 },
		{ i: 'noSession', x: 6, y: 0, w: 4.1, h: 3.5 },
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
		{ i: 'sectionReuniones', x: 0, y: 0, w: 12, h: 7 },
		{ i: 'calendar', x: 0, y: 0, w: 12, h: 4 },
	],
	sm: [
		{ i: 'buttons', x: 0, y: 0, w: 12, h: 2.5 },
		{ i: 'sectionReuniones', x: 0, y: 0, w: 12, h: 7 },
		{ i: 'calendar', x: 0, y: 0, w: 12, h: 4 },
	],
	xs: [
		{ i: 'buttons', x: 0, y: 0, w: 12, h: 3.5 },
		{ i: 'sectionReuniones', x: 0, y: 0, w: 12, h: 9 },
		{ i: 'calendar', x: 0, y: 6, w: 12, h: 4 },
	],
	xxs: [
		{ i: 'buttons', x: 0, y: 0, w: 12, h: 3 },
		{ i: 'sectionReuniones', x: 0, y: 0, w: 12, h: 2 },
		{ i: 'calendar', x: 0, y: 6, w: 12, h: 4 },
	]
}

const layoutsResizeHorizontal = {
	lg: [
		{ i: 'reuniones', x: 8, y: 0, w: 2.2, h: 2.3 },
		{ i: 'lastActions', x: 0, y: 0, w: 4.1, h: 3.5, minW: 4.3 },
		{ i: 'noSession', x: 6, y: 0, w: 4.1, h: 3.5 },
	],
	md: [
		{ i: 'reuniones', x: 4, y: 0, w: 1.9, h: 2.3 },
		{ i: 'lastActions', x: 0, y: 5, w: 3.5, h: 3.4 },
		{ i: 'noSession', x: 0, y: 0, w: 3.5, h: 3.4 },
	],
	sm: [
		{ i: 'reuniones', x: 4, y: 0, w: 1.9, h: 2.3 },
		{ i: 'lastActions', x: 0, y: 5, w: 3.5, h: 3.4 },
		{ i: 'noSession', x: 0, y: 0, w: 3.5, h: 3.4 },
	],
	xs: [
		{ i: 'reuniones', x: 4, y: 0, w: 1.9, h: 2.3 },
		{ i: 'lastActions', x: 0, y: 5, w: 3.5, h: 3.4 },
		{ i: 'noSession', x: 0, y: 0, w: 3.5, h: 3.4 },
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
	localStorage.setItem("layoutsResizeHorizontal", JSON.stringify(layoutsResizeHorizontal));
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
		localStorage.setItem("layoutsResizeHorizontal", JSON.stringify(layoutsResizeHorizontal));
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
			objectItems = JSON.parse(localStorage.getItem(layout));
			delete objectItems[size]
			objectItems[size] = object
			localStorage.setItem(layout, JSON.stringify(objectItems))
			if (layout === "layoutsResize") {
				let info = mantenerEnTodasLasMedidasPosicionEnResize(size)
				this.setState({
					layout: info
				})
			} else {
				this.setState({
					layoutHorizontal: objectItems
				})
			}
		} else {
			//guardamos en localstorage si se ve en pantalla
			objectItems = JSON.parse(localStorage.getItem("items"));
			let info
			if (value !== "") {
				objectItems[0][item] = value;
				if (value == true) {
					info = removeAddItem("add", value, item)
				} else {
					info = removeAddItem("remove", value, item)
				}
			} else if (grid) {
				objectItems.splice(grid, grid, object)
			}
			localStorage.setItem("items", JSON.stringify(objectItems))
			localStorage.setItem("layoutsResize", JSON.stringify(info))
			this.setState({
				items: objectItems,
				layout: info
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
										text="Por defecto"  //TRADUCCION
										onClick={this.resetDash}
										buttonStyle={{ marginRight: "1em", zIndex: "3" }}
									/>
									<BasicButton
										text="Seleccionar menus"  //TRADUCCION
										onClick={this.modalEditClick}
										buttonStyle={{ marginRight: "1em", zIndex: "3" }}
									/>
								</div>
							)}
							<BasicButton
								buttonStyle={{ zIndex: "3" }}
								text="Configurar dashboard"  //TRADUCCION
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
						title={"Seleccionar menús"}//TRADUCCION
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

function mantenerEnTodasLasMedidasPosicionEnResize(size) {
	let dato = JSON.parse(localStorage.getItem("layoutsResize"));
	let aux = [];
	let auxArray = {};
	dato[size].forEach(element => {
		aux.push({ y: element.y })
	});
	Object.keys(dato).map(function (key) {
		let index = 0
		auxArray[key] = [];
		dato[key].forEach(el => {
			auxArray[key].push({ i: el.i, x: el.x, y: aux[index].y, w: el.w, h: el.h })
			index = index + 1
		})
	});

	return auxArray
}

function removeAddItem(removeAdd, layout, title) {
	let dato = JSON.parse(localStorage.getItem("layoutsResize"));
	let item = JSON.parse(localStorage.getItem("items"));
	let aux = [];
	let auxArray = {};
	let indexItem = 1;
	let width = 0.1 
	let height = 0.1
	if (removeAdd === "add") {
		item[indexItem].forEach(el => {
			if (el.i === title) {
				width = el.w;
				height = el.h;
			}
		})
		Object.keys(dato).map(function (key) {
			let index = 0
			auxArray[key] = [];
			dato[key].forEach(el => {
				if (title == el.i) {
					auxArray[key].push({ i: el.i, x: el.x, y: el.y, w: width, h: height })
				} else {
					auxArray[key].push({ i: el.i, x: el.x, y: el.y, w: el.w, h: el.h })
				}
				index = index + 1
			})
		});
	} else {
		Object.keys(dato).map(function (key) {
			let index = 0
			auxArray[key] = [];
			dato[key].forEach(el => {
				if (title == el.i) {
					auxArray[key].push({ i: el.i, x: el.x, y: el.y, w: width, h: height })
				} else {
					auxArray[key].push({ i: el.i, x: el.x, y: el.y, w: el.w, h: el.h })
				}
				index = index + 1
			})
		});
	}

	return auxArray
}

export default withSharedProps()(Dashboard);
