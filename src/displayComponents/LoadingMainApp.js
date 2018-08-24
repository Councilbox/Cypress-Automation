import React from "react";
import Spinner from "react-spinkit";
import { getPrimary } from "../styles/colors";

const LoadingMainApp = ({ message }) => (
	<div
		style={{
			display: "flex",
			height: "100vh",
			width: "100vw",
			alignItems: "center",
			justifyContent: "center",
			flexDirection: 'column'
		}}
	>
		<Spinner
			name="double-bounce"
			color={getPrimary()}
			className="spinner"
		/>
		{/* <img src="icono" alt="councilbox logo" className='splash' /> */}
		<div>
			{message}
		</div>
	</div>
);

export default LoadingMainApp;
