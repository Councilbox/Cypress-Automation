import React from "react";
import { bHistory, store } from "../../containers/App";
import { changeCompany } from "../../actions/companyActions";
import { DropDownMenu } from "../../displayComponents";
import { MenuItem } from "material-ui";
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
			<React.Fragment>
				{this.props.companies.map((company, index) => (
					<MenuItem
						key={company.id}
						selected={company.id === this.props.company.id}
						onClick={() => this.changeCompany(index)}
						style={{
							width: '100%',
							display: 'flex',
							flexDirection: 'row',
							padding: '0.4em',
							paddingRight: '2em',
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
										maxHeight: '2em',
										width: 'auto',
									}}
								/>
							:
								<FontAwesome
									name={'building-o'}
									style={{
										fontSize: '2em',
										color: 'lightgrey',
									}}
								/>
							}
						</div>
						<span
							style={{
								marginRight: '0.8em'
							}}
						>
							{company.businessName}
						</span>
					</MenuItem>
				))}
			</React.Fragment>
		);
	}
}

export default CompanySelector;
