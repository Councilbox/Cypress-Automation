import React from "react";
import { bHistory, store } from "../../containers/App";
import { changeCompany } from "../../actions/companyActions";
import { DropDownMenu } from "../../displayComponents";
import { MenuItem, Divider } from "material-ui";
import FontAwesome from 'react-fontawesome';

class CompanySelector extends React.Component {
	tate = {
		popover: false
	};

	changeCompany = index => {
		const { companies } = this.props;
		store.dispatch(changeCompany(index));
		bHistory.push(`/company/${companies[index].id}`);
	};


	render() {
		return (
			<div
				style={{
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				{this.props.companies.map((company, index) => (
					<React.Fragment key={company.id}>
						<MenuItem
							selected={company.id === this.props.company.id}
							onClick={() => this.changeCompany(index)}
							style={{
								width: '100%',
								display: 'flex',
								flexDirection: 'row',
								padding: '0.7em',
								paddingRight: '1em',
								paddingLeft: '1.2em',
								justifyContent: 'space-between'
							}}
						>
							<div
								style={{
									width: '4em',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}
							>
								{!!company.logo?
									<img
										src={company.logo}
										alt="company-logo"
										style={{
											maxWidth: '4em',
											maxHeight: '1.8em',
											height: 'auto'
										}}
									/>
								:
									<FontAwesome
										name={'building-o'}
										style={{
											fontSize: '2em',
											color: 'darkgrey',
										}}
									/>
								}
							</div>
							<span
								style={{
									marginRight: '0.8em',
									fontSize: '0.8em'
								}}
							>
								{company.businessName}
							</span>
						</MenuItem>
						<Divider />
					</React.Fragment>
				))}
			</div>
		);
	}
}

export default CompanySelector;
