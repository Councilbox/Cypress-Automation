import React from "react";
import { getPrimary } from "../../../styles/colors";
import { bHistory } from "../../../containers/App";
import { AlertConfirm, Icon } from "../../../displayComponents";
import { Paper, Tooltip } from 'material-ui';
import logo from "../../../assets/img/logo.png";
import icon from "../../../assets/img/logo-icono.png";
import withWindowSize from '../../../HOCs/withWindowSize';
import { getCustomLogo, getCustomIcon } from "../../../utils/subdomain";

const LiveHeader = ({ councilName, translate, windowSize, participants, toggleScreens,}) => {
	const [showConfirm, setShowConfirm] = React.useState(false);
	const primary = getPrimary();
	const customLogo = getCustomLogo();
	const customIcon = getCustomIcon();

	const exitAction = () => {
		bHistory.push("/");
	}

	return (
		<React.Fragment>
			<Paper
				elevation={0}
				style={{
					background: 'white',
					borderBottom: '1px solid gainsboro',
					display: "flex",
					width: "100%",
					userSelect: "none",
					position: "absolute",
					zIndex: 1000,
					height: "3em",
					alignItems: "center",
					justifyContent: "space-between"
				}}
			>
				<div > {/**style={{ width: "20%" }} */}
					<img
						src={windowSize !== "xs" ? customLogo? customLogo : logo : customIcon? customIcon : icon}
						className="App-logo"
						style={{
							height: "1.5em",
							marginLeft: "1em",
							// marginLeft: "2em",
							userSelect: 'none'
						}}
						alt="logo"
					/>
				</div>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						maxWidth: '60%'
					}}
				>{/**style={{width: "35%",}} */}
					<Tooltip title={councilName}>
						<div
							style={{
								textAlign: "center",
								color: primary,
								fontWeight: '700',
								fontSize: '1.1em',
								maxWidth: '100%'
							}}
							className="truncate"
						>
							{councilName}
						</div>
					</Tooltip>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "flex-end",
						paddingRight: "2em",
						alignItems: "center"
					}}
				>{/**style={{width: "20%",}} */}
					{/*<Icon
				 className="material-icons"
				 style={{fontSize: '1.5em', color: 'white'}}
				 >
				 help
				 </Icon>*/}
					<Icon
						className="material-icons"
						style={{
							fontSize: "1.5em",
							color: primary,
							cursor: "pointer"
						}}
						onClick={() =>
							setShowConfirm(true)
						}
					>
						exit_to_app
					</Icon>
					<AlertConfirm
						title={translate.exit}
						bodyText={translate.exit_desc}
						acceptAction={exitAction}
						buttonCancel={translate.cancel}
						buttonAccept={translate.accept}
						open={showConfirm}
						requestClose={() =>
							setShowConfirm(false)
						}
					/>
				</div>
			</Paper>
			<div
				style={{
					height: "3em",
					width: "100%"
				}}
			/>
		</React.Fragment>
	);
}

export default withWindowSize(LiveHeader);
