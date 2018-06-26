import React, { Fragment } from "react";
import { getSecondary } from "../../styles/colors";
import * as mainActions from "../../actions/mainActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { MenuItem, Divider } from "material-ui";
import { DropDownMenu, Icon, Link } from "../../displayComponents";
import FontAwesome from 'react-fontawesome';

const secondary = getSecondary();

const UserMenu = ({ user, actions, translate }) => {
	return (
		<DropDownMenu
			color="transparent"
			text={
				<Icon className="material-icons" style={{ color: secondary }}>
					account_circle
				</Icon>
			}
			textStyle={{ color: secondary }}
			type="flat"
			icon={
				<Icon className="material-icons" style={{ color: secondary }}>
					keyboard_arrow_down
				</Icon>
			}
			items={
				<Fragment>
					<MenuItem>
						<Link to={`/user/${user.id}`}>
							<div
								style={{
									width: '100%',
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'space-between'
								}}
							>
								<FontAwesome
									name={'edit'}
									style={{
										cursor: "pointer",
										fontSize: "1.2em",
										color: secondary
									}}
								/>
								<span style={{marginLeft: '2.5em', fontSize: '0.9em', marginRight: '0.8em'}}>
									{translate.settings}
								</span>
							</div>
						</Link>
					</MenuItem>
					<Divider />
					<MenuItem onClick={() => actions.logout()}>
						<div
								style={{
									width: '100%',
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'space-between'
								}}
							>
								<FontAwesome
									name={'external-link'}
									style={{
										cursor: "pointer",
										fontSize: "1.2em",
										color: 'red'
									}}
								/>
								<span style={{marginLeft: '2.5em', fontSize: '0.9em', marginRight: '0.8em'}}>
									{translate.logout}
								</span>
							</div>
					</MenuItem>
				</Fragment>
			}
		/>
	);
};

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(mainActions, dispatch)
	};
}

export default connect(
	null,
	mapDispatchToProps
)(UserMenu);
