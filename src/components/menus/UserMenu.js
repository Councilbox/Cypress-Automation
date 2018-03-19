import React, { Fragment } from 'react';
import { getSecondary } from '../../styles/colors';
import * as mainActions from '../../actions/mainActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { MenuItem } from 'material-ui';
import { Icon, DropDownMenu } from '../displayComponents';
const secondary = getSecondary();

const UserMenu = ({ username, actions }) => {
    return(
        <DropDownMenu
            color="transparent"
            text={username}
            textStyle={{color: secondary}}
            type="flat"
            icon={<Icon className="material-icons" style={{color: secondary}}>keyboard_arrow_down</Icon>}
            items={
                <Fragment>
                    <MenuItem onClick={() => actions.logout()}>Logout</MenuItem>
                </Fragment>
            }
        />
    )

}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(mainActions, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(UserMenu);