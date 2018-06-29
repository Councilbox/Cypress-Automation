import React from "react";
import { bHistory, store } from "../../containers/App";
import { changeCompany } from "../../actions/companyActions";
import { Scrollbar } from "../../displayComponents";
import { MenuItem, Divider } from "material-ui";
import FontAwesome from 'react-fontawesome';
import Tooltip from 'material-ui/Tooltip';

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
			<Scrollbar>
				{this.props.companies.map((company, index) => (
					<div style={{width: '100%'}}>
						<MenuItem
							selected={company.id === this.props.company.id}
							onClick={() => this.changeCompany(index)}
							style={{
								width: '300px',
								height: '2em',
								display: 'flex',
								flexDirection: 'row',
								padding: '0.7em',
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
							<Tooltip title={company.businessName}>
								<span
									style={{
										marginRight: '0.2em',
										fontSize: '0.8em',
										maxWidth: '12em',
										paddingRight: '1.5em',
										whiteSpace: 'nowrap',
										overflow: 'hidden',
										textOverflow: 'ellipsis'
									}}
								>
									{company.businessName}
								</span>
							</Tooltip>
						</MenuItem>
						<Divider />
					</div>
				))}
			</Scrollbar>
		);
	}
}

export default CompanySelector;
