import React from "react";
import TopSectionBlocks from "./TopSectionBlocks";
import { darkGrey, lightGrey, primary, getSecondary } from "../../styles/colors";
import withSharedProps from '../../HOCs/withSharedProps';
import { Scrollbar, CBXFooter } from '../../displayComponents';
import { moment, store } from '../../containers/App';
import { TRIAL_DAYS } from '../../config';
import { trialDaysLeft } from '../../utils/CBX';
import { addSpecificTranslations } from "../../actions/companyActions";


	React.useEffect(() => {
		store.dispatch(addSpecificTranslations(company.category));
	}, [store, company.category]);

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
