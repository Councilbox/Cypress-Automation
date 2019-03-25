import React from "react";
import FontAwesome from "react-fontawesome";
import { getPrimary } from "../../../styles/colors";
import { Card } from "material-ui";


const DelegationItem = ({ participant }) => {
    const primary = getPrimary();
    const iconsSize = 1.8;
    return (
        <Card elevation={4} style={{marginTop: "5px", borderTop: "1px solid gainsboro", marginBottom: '10px'}}>
            <div style={{ paddingLeft: "1em" }}>
                <div style={{ display: "flex", }}>
                    <FontAwesome
                        name={'user'}
                        style={{
                            margin: "0.5em",
                            color: primary,
                            fontSize: `${iconsSize}em`,
                            textAlign:"center",
                            width: "25px"
                        }} />
                    <div style={{ margin: '1em' }}>
                        {participant.name} {participant.surname}
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default DelegationItem;