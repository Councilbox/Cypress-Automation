import React from "react";
import logo from "../assets/img/logo.png";
import icono from "../assets/img/logo-icono.png";
import { Link } from "react-router-dom";
import LanguageSelector from "./menus/LanguageSelector";
import UserMenu from "./menus/UserMenu";
import CommandLine from './dashboard/CommandLine';
import { Icon, UnsavedChangesModal } from "../displayComponents";
import { bHistory } from "../containers/App";
import withWindowSize from "../HOCs/withWindowSize";
import { getSecondary } from "../styles/colors";
import { Tooltip, Paper } from "material-ui";
import FontAwesome from 'react-fontawesome';

class Header extends React.PureComponent {
	state = {
		companyMenu: false,
		unsavedChanges: false
	}

	logout = () => {
		this.props.actions.logout();
	};

	goBack = () => {
		if(!this.props.main.unsavedChanges){
			bHistory.goBack();
		} else {
			this.setState({
				unsavedChanges: true
			})
		}
	};

	toggleCompanyMenu = () => {
		this.setState({
			companyMenu: !this.state.companyMenu
		});
	}

	closeUnsavedModal = () => {
		this.setState({unsavedChanges: false});
	}

	render() {
		const secondary = getSecondary();
		const language =
			this.props.translate && this.props.translate.selectedLanguage;
		const {
			backButton,
			windowSize,
			languageSelector,
			drawerIcon
		} = this.props;

		return (
			<Paper
				elevation={0}
				style={{
					height: "3em",
					zIndex: 1000,
					display: "flex",
					flexDirection: "row",
					width: "100%",
					justifyContent: "space-between",
					alignItems: "center",
					backgroundColor: "white"
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						height: "100%",
						alignItems: "center"
					}}
				>
					{(this.props.companyMenu && this.props.windowSize === 'xs') &&
						<React.Fragment>
							{!!this.props.company.logo?
								<img src={this.props.company.logo} style={{maxWidth: '4em', height: '1.8em'}} alt="company-logo" />
							:
								<FontAwesome
									name={"building-o"}
								/>}
						</React.Fragment>
					}
					{backButton && (
						<Tooltip
							title={this.props.translate.back}
							placement="bottom"
						>
							<div
								style={{
									cursor: "pointer",
									width: "2em",
									height: "60%",
									borderRight: "1px solid darkgrey",
									display: "flex",
									alignItems: "center"
								}}
								onClick={this.goBack}
							>
								<Icon
									className="material-icons"
									style={{ color: secondary }}
								>
									keyboard_arrow_left
								</Icon>
							</div>
						</Tooltip>
					)}
					<Link to="/">
						<img
							src={windowSize !== "xs" ? logo : icono}
							className="App-logo"
							style={{
								height: "1.5em",
								marginLeft: "2em"
							}}
							alt="logo"
						/>
					</Link>
				</div>

				{this.props.commandLine && false &&
					<CommandLine />
				}

				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center"
					}}
				>
					{languageSelector && (
						<LanguageSelector selectedLanguage={language} />
					)}
					{this.props.user && (
						<UserMenu
							user={this.props.user}
							translate={this.props.translate}
						/>
					)}
					{drawerIcon && "DRAWER"}
				</div>
				<UnsavedChangesModal 
					open={this.state.unsavedChanges}
					requestClose={this.closeUnsavedModal}
				/>
			</Paper>
		);
	}
}

export default withWindowSize(Header);
