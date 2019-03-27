import React from "react";
import { Radio, HelpPopover } from '../../../displayComponents';

const AssistanceOption = ({ title, value, disabled, subtitle, selected, select }) => {
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
                        title="Advertencia"//TRADUCCION
                        content="Un representante o un participante con votos delegados no puede delegar su voto"//TRADUCCION
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