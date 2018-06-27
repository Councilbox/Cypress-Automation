import React from "react";
import { Drawer } from 'material-ui';
import CompaniesManagerButton from '../menus/CompaniesManagerButton';
import CompanySelector from '../menus/CompanySelector';

class CompanyMenu extends React.Component {
	render() {
		return (
			<Drawer
				style={{
					zIndex: 100,
					width: "500px"
				}}
				variant="persistent"
				anchor="left"
				open={this.props.open}
			>
				<div
					style={{
						height: "100%",
						zIndex: 100,
						width: "400px",
						paddingLeft: '5em',
						paddingTop: "3em",
						overflow: "hidden",
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<div style={{marginBottom: '0.8em'}}>
						<CompaniesManagerButton
							translate={this.props.translate}
							company={this.props.company}
						/>
					</div>
					<CompanySelector
						{...this.props}
					/>
				</div>
			</Drawer>
		);
	}
}

export default CompanyMenu;
