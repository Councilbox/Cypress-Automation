import React from 'react';
import FontAwesome from "react-fontawesome";
import { Tooltip } from 'material-ui';


const ButtonCopy = ({ val }) => {
    const [state, setState] = React.useState({
        showCopyTooltip: false,
        showActions: false
    });


    const copy = () => {
        setState({
            showCopyTooltip: true
        });
        startCloseTimeout();
        // var element = document.createElement('input');
        // element.type = 'hidden'
        // element.value = val;
        // element.id = '';
        // console.log(element)
        // element.select();
        // document.execCommand('copy');
        // CBX.copyStringToClipboard(value);
    }

    const startCloseTimeout = () => {
        const timeout = setTimeout(() => {
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
