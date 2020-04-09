import React from "react";
import FontAwesome from "react-fontawesome";
import { getPrimary, getSecondary } from "../../../styles/colors";
import { Card } from "material-ui";


const DelegationItem = ({ participant }) => {
    const primary = getPrimary();
    const iconsSize = 1.8;
    return (
        <Card elevation={4} style={{ marginTop: "5px", borderTop: "1px solid gainsboro", marginBottom: '10px', borderRadius: '5px', color: "white", background: getSecondary() }}>
            <div style={{}}>
                <div style={{ display: "flex", }}>
                    <div style={{ margin: '0.5em 1em' }}>
                        {participant.name} {participant.surname || ''}
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default DelegationItem;