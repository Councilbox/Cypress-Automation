import React from "react";
import TopSectionBlocks from "./TopSectionBlocks";
import { darkGrey, lightGrey, primary, getSecondary } from "../../styles/colors";
import withSharedProps from '../../HOCs/withSharedProps';
import { Scrollbar, CBXFooter, Block, Icon, BasicButton, ButtonIcon, AlertConfirm, GridItem, Grid } from '../../displayComponents';
import { moment } from '../../containers/App';
import { TRIAL_DAYS } from '../../config';
import { trialDaysLeft } from '../../utils/CBX';



class ModalEditDash extends React.Component {

	render() {
		const { translate, itemStorage, requestClose, open, title, items } = this.props;
		const secondary = getSecondary();

		return (
			<AlertConfirm
				requestClose={requestClose}
				open={open}
				bodyText={ //TRADUCCION
					<Grid
						style={{
							width: "100%",
							// marginTop: "4vh"
						}}
					>
						<GridItem xs={12} md={4} lg={4} style={{ display: "inline-block", textAlign: "center", alignItems: "center" }}>
							<b>Buttons</b>
							<div>
								Descripcion grid botones
									</div>
							<div>
								<BasicButton
									text={items.buttons ? "Desactive" : "Active"}  //TRADUCCION
									onClick={() => itemStorage("buttons", items.buttons ? false : true)}
									backgroundColor={{ backgroundColor: secondary }}
								/>
							</div>
						</GridItem>
						<GridItem xs={12} md={4} lg={4} style={{ display: "inline-block", textAlign: "center", alignItems: "center" }}>
							<b>Reuniones</b>
							<div>
								Descripcion de la grafica
									</div>
							<div>
								<BasicButton
									text={items.reuniones ? "Desactive" : "Active"}  //TRADUCCION
									onClick={() => itemStorage("reuniones", items.reuniones ? false : true)}
									backgroundColor={{ backgroundColor: secondary }}
								/>
							</div>
						</GridItem>
						<GridItem xs={12} md={4} lg={4} style={{ display: "inline-block", textAlign: "center", alignItems: "center" }}>
							<b>Calendar</b>
							<div>
								Descripcion del calendario
									</div>
							<div>
								<BasicButton
									text={items.calendar ? "Desactive" : "Active"}  //TRADUCCION
									onClick={() => itemStorage("calendar", items.calendar ? false : true)}
									backgroundColor={{ backgroundColor: secondary }}
								/>
							</div>
						</GridItem>
						<GridItem xs={12} md={4} lg={4} style={{ display: "inline-block", textAlign: "center", alignItems: "center" }}>
							<b>Ultimas acciones</b>
							<div>
								Descripcion de ultimas acciones
									</div>
							<div>
								<BasicButton
									text={items.lastActions ? "Desactive" : "Active"}  //TRADUCCION
									onClick={() => itemStorage("lastActions", items.lastActions ? false : true)}
									backgroundColor={{ backgroundColor: secondary }}
								/>
							</div>
						</GridItem>
						<GridItem xs={12} md={4} lg={4} style={{ display: "inline-block", textAlign: "center", alignItems: "center" }}>
							<b>Reuniones sin sesión</b>
							<div>
								Descripcion de reuniones sin sesion
									</div>
							<div>
								<BasicButton
									text={items.noSession ? "Desactive" : "Active"}  //TRADUCCION
									onClick={() => itemStorage("noSession", items.noSession ? false : true)}
									backgroundColor={{ backgroundColor: secondary }}
								/>
							</div>
						</GridItem>
					</Grid>

				}
				title={title}//TRADUCCION
				widthModal={{ width: "50%" }}
			/>
		)
	}
}


export default ModalEditDash;
