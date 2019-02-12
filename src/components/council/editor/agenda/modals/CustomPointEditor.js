import React from 'react';
import { Radio, SectionTitle } from "../../../../../displayComponents";
import { getPrimary, getSecondary } from '../../../../../styles/colors';

const CustomPointEditor = ({ agenda, updateAgenda, translate, ...props }) => {
    
    const primary = getPrimary();
    const secondary = getSecondary();

    return (
        <div>
            <SectionTitle
                text={translate.confirm_assistance}
                color={primary}
            />
            <Radio
                value={"0"}
                checked={false}
                onChange={event => {}}
                name="security"
                label={''}
            />
            <Radio
                value={"1"}
                checked={false}
                onChange={event => {}}
                name="security"
                label={translate.new_security_email}
            />
            CUSTOM POINT EDITOR
        </div>
    )
}

export default CustomPointEditor;