import React, { Fragment } from 'react';
import { Checkbox, Menu, MenuItem } from 'material-ui';

class AllSelector extends React.Component {
    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };
    handleClose = () => {
        this.setState({ anchorEl: null });
    };
    handleCheckboxClick = (event) => {
        const { selectAll, deselectAll, anySelected, allSelected } = this.props;
        if (anySelected) {
            deselectAll()
        } else {
            selectAll();
        }
        event.stopPropagation();
    }

    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null
        }
    }

    render() {
        const { anchorEl } = this.state;
        const { selectAll, deselectAll, anySelected, allSelected, translate } = this.props;

        return (<Fragment>
            <div style={{
                border: 'solid 2px grey',
                width: '85px',
                cursor: 'pointer',
                float: 'left',
                marginRight: '1em'
            }}
                 onClick={this.handleClick}>
                <Checkbox
                    checked={allSelected}
                    onClick={(event) => {
                        this.handleCheckboxClick(event)
                    }}
                    value="checkedF"
                    indeterminate={anySelected && !allSelected}
                />
                <i className="fa fa-chevron-down"></i>
            </div>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleClose}>
                <MenuItem onClick={() => {
                    selectAll();
                    this.handleClose();
                }}>{translate.all}</MenuItem>
                <MenuItem onClick={() => {
                    deselectAll();
                    this.handleClose();
                }}>{translate.none}</MenuItem>
            </Menu>
        </Fragment>);
    }
}

export default AllSelector;
