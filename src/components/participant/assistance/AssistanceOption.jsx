import React from "react";
import { Radio } from '../../../displayComponents';

const AssistanceOption = ({ title, value, subtitle, selected, select }) => {

    return (
        <div>
            <Radio
                onClick={select}
                value={value}
                checked={selected === value}
                onChange={select}
                name="security"
                label={title}
            />
        </div>
    )
}

export default AssistanceOption;