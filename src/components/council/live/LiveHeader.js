import React from "react";
import { getPrimary } from "../../../styles/colors";
import { bHistory } from "../../../containers/App";
import { AlertConfirm, Icon, BasicButton, ButtonIcon } from "../../../displayComponents";
import { Paper, Tooltip, IconButton } from 'material-ui';
import logo from "../../../assets/img/logo.png";
import icono from "../../../assets/img/logo-icono.png";
import withWindowSize from '../../../HOCs/withWindowSize';



class LiveHeader extends React.Component {
	state = {
		showConfirm: false,
	};

	exitAction = () => {
		bHistory.push("/");
	};

	render() {
		const {
			councilName,
			translate,
			windowSize,
			participants,
			toggleScreens,
		} = this.props;
		const primary = getPrimary();

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
					<div style={{ width: "20%" }}>
						<img
							src={windowSize !== "xs" ? logo : icono}
							className="App-logo"
							style={{
								height: "1.5em",
								marginLeft: "2em"
							}}
							alt="logo"
						/>
					</div>
					<div
						style={{
							width: "35%",
							// marginRight: "10%",
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						}}
					>
						<Tooltip title={councilName}>
							<div style={{ textAlign: "center", color: primary, fontWeight: '700', fontSize: '1.1em' }}>
								{councilName}
							</div>
						</Tooltip>
					</div>
					<div
						style={{
							width: "20%",
							display: "flex",
							flexDirection: "row",
							justifyContent: "flex-end",
							paddingRight: "2em",
							alignItems: "center"
						}}
					>
						{/*<Icon
                     className="material-icons"
                     style={{fontSize: '1.5em', color: 'white'}}
                     >
                     help
					 </Icon>*/}
						<BasicButton
							text={
								participants
									? translate.agenda
									: translate.participants
							}
							color={"white"}
							textStyle={{
								color: primary,
								fontWeight: "700",
								fontSize: "0.9em",
								textTransform: "none",
							}}
							textPosition="after"
							icon={
								<i className="material-icons" style={{ marginLeft: "5px" }}>
									{participants
										? "developer_board"
										: "group"
									}
								</i>
							}
							onClick={toggleScreens}
							buttonStyle={{
								marginRight: "1em",
								border: `2px solid ${primary}`,
								paddingBottom: "0",
								paddingTop: "0"
							}}
						/>
						
						<Icon
							className="material-icons"
							style={{
								fontSize: "1.5em",
								color: primary,
								cursor: "pointer"
							}}
							onClick={() =>
								this.setState({
									showConfirm: true
								})
							}
						>
							exit_to_app
						</Icon>
						<AlertConfirm
							title={translate.exit}
							bodyText={translate.exit_desc}
							acceptAction={this.exitAction}
							buttonCancel={translate.cancel}
							buttonAccept={translate.accept}
							open={this.state.showConfirm}
							requestClose={() =>
								this.setState({
									showConfirm: false
								})
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
}

export default withWindowSize(LiveHeader);
