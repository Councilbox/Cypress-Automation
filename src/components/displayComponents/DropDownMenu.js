import React from 'react';
import { DropdownMenu, MenuItem, DropdownButton } from 'react-bootstrap';

const DropDownMenu = ( {items, title} ) => (
    <DropdownButton
        bsStyle={'default'}
        title={'hola'}
        key={'default'}
        id={`dropdown-basic-Default`}
    >
        <MenuItem eventKey="1">Action</MenuItem>
        <MenuItem eventKey="2">Another action</MenuItem>
        <MenuItem eventKey="3" active>
            Active Item
        </MenuItem>
        <MenuItem divider />
        <MenuItem eventKey="4">Separated link</MenuItem>
    </DropdownButton>
);

export default DropDownMenu;
