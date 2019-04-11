import React from 'react';
import FontAwesome from "react-fontawesome";
import { Tooltip } from 'material-ui';
import * as CBX from '../../../utils/CBX';


const ButtonCopy = ({ value }) => {
    const [state, setState] = React.useState({
        showCopyTooltip: false,
        showActions: false
    });


    const copy = () => {
        console.log(value)
        setState({
            showCopyTooltip: true
        });
        startCloseTimeout();
        CBX.copyStringToClipboard(value);
    }

    const startCloseTimeout = () => {
        let timeout = setTimeout(() => {
            setState({
                showCopyTooltip: false
            });
        }, 2000);
    }


    return (
        <Tooltip title="Copiado" open={state.showCopyTooltip}>
            <FontAwesome
                name={"clone"}
                style={{
                    cursor: "pointer",
                    marginTop: "18px",
                    marginLeft: "0.5em",
                }}
                onClick={copy}
            />
        </Tooltip>
    )
}

export default ButtonCopy