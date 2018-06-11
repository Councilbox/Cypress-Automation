import React from "react";
import { ButtonIcon } from "../../../displayComponents";

const AssistanceOption = (option) => {
    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '50px' }}>
                {option.selected ?
                    <ButtonIcon type="check" color="white" />
                    :
                    <ButtonIcon type="square" color="white" />
                }
            </div>
            <div>
                <h4>{option.title}</h4>
            </div>
        </div>
    )
}

export default AssistanceOption;