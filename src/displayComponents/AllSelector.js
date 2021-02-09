import React, { Fragment } from 'react';
import { Checkbox, Menu, MenuItem } from 'material-ui';

class AllSelector extends React.Component {
	state = {
		anchorEl: null
	};

	handleClick = event => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleClose = () => {
		this.setState({ anchorEl: null });
	};

	handleCheckboxClick = event => {
		const { selectAll, deselectAll, anySelected } = this.props;
		if (anySelected) {
			deselectAll();
		} else {
			selectAll();
		}
		event.stopPropagation();
	};

	render() {
		const { anchorEl } = this.state;
		const {
			selectAll,
			deselectAll,
			anySelected,
			allSelected,
			translate
		} = this.props;

		return (
			<Fragment>
				<div
					style={{
						border: 'solid 2px grey',
						width: '92px',
						cursor: 'pointer',
						float: 'left',
						marginRight: '1em'
					}}
					onClick={this.handleClick}
				>
					<Checkbox
						checked={allSelected}
						onClick={event => {
							this.handleCheckboxClick(event);
						}}
						value="checkedF"
						indeterminate={anySelected && !allSelected}
					/>
					<i className="fa fa-chevron-down" />
				</div>
				<Menu
					anchorEl={anchorEl}
					open={Boolean(anchorEl)}
					onClose={this.handleClose}
				>
					<MenuItem
						onClick={() => {
							selectAll();
							this.handleClose();
						}}
					>
						{translate.all}
					</MenuItem>
					<MenuItem
						onClick={() => {
							deselectAll();
							this.handleClose();
						}}
					>
						{translate.none}
					</MenuItem>
				</Menu>
			</Fragment>
		);
	}
}

export default AllSelector;
