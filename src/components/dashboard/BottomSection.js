import React from "react";
import { MenuItem } from "material-ui";
import { BasicButton, SelectInput } from "../displayComponents";
import { getPrimary, getSecondary, lightGrey } from "../../styles/colors";

const BottomSection = ({ translate }) => (
	<div
		style={{
			width: "100%",
			backgroundColor: "white",
			display: "flex",
			flexDirection: "row"
		}}
		className="row"
	>
		<div
			className="col-lg-6 col-md-6"
			style={{
				padding: "2em",
				paddingLeft: "10%",
				paddingRight: "10%",
				borderRight: `1px solid ${lightGrey}`
			}}
		>
			<h4>Conferencia Rápida</h4>
			<SelectInput
				floatingText="Censo"
				value={0}
				fullWidth={true}
				errorText=""
			>
				<MenuItem value={0} primaryText="Censo" />
			</SelectInput>
			<br />
			<SelectInput
				floatingText="Sin contraseña"
				value={0}
				fullWidth={true}
				errorText=""
			>
				<MenuItem value={0} primaryText="Sin contraseña" />
			</SelectInput>
			<br />
			<BasicButton
				text="ABRIR SALA"
				fullWidth={true}
				color={"transparent"}
				buttonStyle={{
					backgroundColor: "transparent",
					border: `1px solid ${getPrimary()}`,
					marginRight: "2em"
				}}
				textStyle={{
					color: getPrimary(),
					fontWeight: "700",
					fontSize: "0.8em",
					textTransform: "none"
				}}
				textPosition="before"
				onClick={this.login}
			/>
		</div>
		<div
			className="col-lg-6 col-md-6"
			style={{
				padding: "2em",
				paddingLeft: "10%",
				paddingRight: "10%",
				borderLeft: `1px solid ${lightGrey}`,
				borderTop: `1px solid ${lightGrey}`
			}}
		>
			<h4>Programar reunión</h4>
			<SelectInput
				floatingText="Consejo de administración"
				value={0}
				fullWidth={true}
				errorText=""
			>
				<MenuItem value={0} primaryText="Consejo de administración" />
			</SelectInput>
			<br />
			<SelectInput
				floatingText="Fecha"
				value={0}
				fullWidth={true}
				errorText=""
			>
				<MenuItem value={0} primaryText="Fecha" />
			</SelectInput>
			<br />
			<BasicButton
				text="Organizar Reunión"
				fullWidth={true}
				color={"transparent"}
				buttonStyle={{
					backgroundColor: "transparent",
					border: `1px solid ${getSecondary()}`,
					marginRight: "2em"
				}}
				textStyle={{
					color: getSecondary(),
					fontWeight: "700",
					fontSize: "0.8em"
				}}
				textPosition="before"
				onClick={this.login}
			/>
		</div>
	</div>
);

export default BottomSection;
