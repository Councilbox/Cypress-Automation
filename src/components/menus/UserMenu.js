import React, { Fragment } from "react";
import { getSecondary } from "../../styles/colors";
import * as mainActions from "../../actions/mainActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { MenuItem } from "material-ui";
import { DropDownMenu, Icon, Link } from "../../displayComponents";

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
							{translate.settings}
						</Link>
					</MenuItem>
					<MenuItem onClick={() => actions.logout()}>
						{translate.logout}
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
