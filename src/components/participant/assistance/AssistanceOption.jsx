import React from "react";
import { Radio, HelpPopover } from '../../../displayComponents';

const AssistanceOption = ({ title, value, disabled, subtitle, translate, selected, select }) => {
    return (
        <div>
            <Radio
                onClick={!disabled? select : () => {}}
                value={value}
                disabled={disabled}
                checked={selected === value}
                onChange={!disabled? select : () => {}}
                name="security"
                label={
                    <HelpPopover
                        title={translate.warning}
                        content={translate.delegated_representant_cant_delegate}
                        TriggerComponent={props =>
                            <div onClick={disabled? props.onClick : () => {}}>
                                {title}
                            </div>
                        }
                    >
                    </HelpPopover>
                }
            />
        </div>
    )
}

export default AssistanceOption;