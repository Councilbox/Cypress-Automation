import React from "react";
import { Icon } from "material-ui";
import { primary } from "../../../styles/colors";
import { Radio } from '../../../displayComponents';

const AssistanceOption = ({ title, value, subtitle, selected, select }) => {
    return (
        <div>
            <Radio
                value={value}
                checked={selected === value}
                onChange={select}
                name="security"
                label={title}
            />
        </div>
    )
}

/*
<div style={{margin: '1em', cursor: 'pointer'}} onClick={select}>
            <div style={{ display: 'flex' }}>
                <div style={{ width: '50px' }}>
                    {selected ?
                        <Icon className="material-icons" style={{ color: primary, fontSize: '1.8em' }}>
						check_box
					</Icon>
                        :
                        <Icon className="material-icons" style={{ color: "grey", fontSize: '1.8em' }}>
						check_box_outline_blank
					</Icon>
                    }
                </div>
                <div>
                    <h5>{title}</h5>
                </div>
            </div>
            {
                subtitle &&
                <div>
                    <h6>{subtitle}</h6>
                </div>
            }
        </div>
*/

export default AssistanceOption;