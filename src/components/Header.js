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
import Tooltip from "material-ui/Tooltip";
import Paper from 'material-ui/Paper';
import FontAwesome from 'react-fontawesome';
import { isLandscape } from '../utils/screen';


class Header extends React.PureComponent {
	state = {
		companyMenu: false,
		unsavedChanges: false
	}

	logout = () => {
		this.props.actions.logout();
	};

	goBack = () => {
		bHistory.goBack();
/* 		if(!this.props.main.unsavedChanges){
			bHistory.goBack();
		} else {
			this.setState({
				unsavedChanges: true
			})
		} */
	};

	toggleCompanyMenu = () => {
		this.setState({
			companyMenu: !this.state.companyMenu
		});
	}

	closeUnsavedModal = () => {
		this.setState({unsavedChanges: false});
	}

	showVerticalLayout = () => {
		return this.props.windowSize === 'xs' && !isLandscape();
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
					borderBottom: '1px solid gainsboro',
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
					{/* Quitado porque en el header ya se coloca el logo de la empresa en otro lado */}
					{/* {(this.props.companyMenu && this.showVerticalLayout()) &&
						<React.Fragment>
							{!!this.props.company.logo?
								<img src={this.props.company.logo} style={{maxWidth: '4em', height: '1.8em'}} alt="company-logo" />
							:
								<FontAwesome
									name={"building-o"}
								/>}
						</React.Fragment>
					} */}
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
								id="back-button"
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
							src={!this.showVerticalLayout() ? logo : icono}
							className="App-logo"
							style={{
								height: "1.5em",
								marginLeft: "1em",
								// marginLeft: "2em",
								userSelect: 'none'
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
							company={this.props.company}
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
