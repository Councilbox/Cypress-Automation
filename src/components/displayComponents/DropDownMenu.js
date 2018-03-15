import React from 'react';
import Menu, { MenuItem } from 'material-ui/Menu';
import { BasicButton } from './';

class DropDownMenu extends React.Component {
    state = {
      anchorEl: null,
    };
  
    handleClick = event => {
      this.setState({ anchorEl: event.currentTarget });
    };
  
    handleClose = () => {
      this.setState({ anchorEl: null });
    };
  
    render() {
      const { anchorEl } = this.state;
      const { text, items, id, textStyle, buttonStyle, color, type, icon } = this.props;
  
      return (
        <div>
          <BasicButton
            type={type}
            onClick={this.handleClick}
            textStyle={textStyle}
            color={color}
            icon={icon}
            buttonStyle={buttonStyle}
            text={text}
          />
          <Menu
            id={id}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
          >
            {items}
          </Menu>
        </div>
      );
    }
  }
  
  export default DropDownMenu;
