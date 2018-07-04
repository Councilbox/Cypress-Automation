// ##############################
// // // App styles
// #############################

import { container, drawerWidth, transition } from "./styles";

const appStyle = theme => ({
	wrapper: {
		position: "relative",
		top: "0",
		height: "100vh"
	},
	mainPanel: {
		[theme.breakpoints.up("md")]: {
			width: `calc(100% - ${drawerWidth}px)`
		},
		overflow: "hidden",
		position: "relative",
		float: "right",
		...transition,
		height: "100vh",
		width: "100%",
		overflowScrolling: "touch"
	},
	mainPanelLite: {
		width: "100%",
		[theme.breakpoints.up("xs")]: {
			width: `calc(100% - 5em)`
		},
		[theme.breakpoints.down("md")]: {
			width: '100%',
			marginLeft: 0
		},
		overflow: "hidden",
		position: "relative",
		marginLeft: '5em',
		...transition,
		height: "100vh",
		overflowScrolling: "touch"
	},
	content: {
		marginTop: "70px",
		padding: "30px 15px",
		minHeight: "calc(100% - 123px)"
	},
	container,
	map: {
		marginTop: "70px"
	}
});

export default appStyle;
