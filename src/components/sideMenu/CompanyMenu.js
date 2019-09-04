import React from "react";
import { Drawer, withStyles } from 'material-ui';
import CompaniesManagerButton from '../menus/CompaniesManagerButton';
import CompanySelector from '../menus/CompanySelector';
import withWindowSize from '../../HOCs/withWindowSize';
import { getSecondary } from '../../styles/colors';
import { isLandscape } from '../../utils/screen';
import { isMobile } from "react-device-detect";
let icon;
import('../../assets/img/imago-councilbox-inverse-xl.png').then(data => icon = data);


const sidebarStyle = theme => ({
	paperAnchorLeft: {
		marginLeft:"5em"
	}
})

class CompanyMenu extends React.Component {
	render() {
		const sideWidth = window.innerWidth > 420 ? 420 : window.innerWidth;

		return (
			<Drawer
				style={{
					minWidth: `${sideWidth + isLandscape() ? 100 : 0}px`,
					maxWidth: "100%",
					display: !this.props.open && "none"
				}}
				variant="persistent"
				anchor="left"
				open={this.props.open}
				className={"prueba"}
				classes={{ paperAnchorLeft: isMobile && isLandscape() && this.props.classes.paperAnchorLeft}}
			>
				<div
					style={{
						height: "100%",
						minWidth: `calc(${sideWidth}px - 5em)`,
						maxWidth: '100%',
						backgroundColor: 'white',
						paddingLeft:   !isMobile  ? "5em" : 0 ,
						// paddingLeft: isMobile && !isLandscape() ? 0 : '5em',
						overflow: "hidden",
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<div
						style={{
							height: '3.1em',
							backgroundColor: getSecondary(),
							color: 'white',
							width: '100%',
							cursor: 'pointer',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							paddingLeft: '1.2em',
							paddingRight: '1em',
							fontSize: '1.1em',
							fontWeight: '700',
							marginBottom: '1.6em'
						}}
						onClick={this.props.requestClose}
					>
						{this.props.translate.entities}
						<img
							src={icon}
							style={{
								height: '1.2em',
								width: 'auto'
							}}
							alt={'logo-councilbox'}
						/>
					</div>
					<div style={{ marginBottom: '0.8em', height: '5em', width: '100%' }}>
						<CompaniesManagerButton
							translate={this.props.translate}
							company={this.props.company}
						/>
					</div>
					<div
						style={{ width: '100%', height: 'calc(100vh - 10em)' }}
					>
						<CompanySelector
							{...this.props}
						/>
					</div>
				</div>
			</Drawer>
		);
	}
}

export default withStyles(sidebarStyle)(withWindowSize(CompanyMenu));
