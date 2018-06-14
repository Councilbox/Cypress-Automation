import React from 'react';
import { lightGrey, getSecondary, getPrimary } from '../../../styles/colors';
import { MenuItem } from 'material-ui';
import FontAwesome from 'react-fontawesome';

const CouncilsSectionTrigger = ({ text, description, icon}) => (
    <MenuItem 
        style={{
            height: '3.5em',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '1em',
            paddingRight: '1.5em',
            justifyContent: 'space-between'
        }}
    >
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                width: '70%',
                alignItems: 'center'
            }}
        >
            <div style={{width: '4em'}}>
                <FontAwesome
                    name={icon}
                    style={{
                        cursor: "pointer",
                        fontSize: "1.7em",
                        color: getPrimary()
                    }}
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}    
            >
                <div>
                    {text}
                </div>
                <div>
                    {description}
                </div>
            </div>
        </div>
        <div style={{widht: '3em', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <FontAwesome
                name={'chevron-down'}
                style={{
                    cursor: "pointer",
                    fontSize: "1.4em",
                    color: 'grey'
                }}
            />
        </div>
    </MenuItem>
)

export default CouncilsSectionTrigger;