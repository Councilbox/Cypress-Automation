import React from "react";
import FontAwesome from "react-fontawesome";
import { getPrimary } from "../../../styles/colors";
import { Card } from "material-ui";


const DelegationItem = ({ participant }) => {
    const primary = getPrimary();
    const iconsSize = 1.8;
    return (
        // <div sstyle={{ border: `solid 1px grey` }}>
        <Card elevation={4} style={{marginTop: "5px", borderTop: "1px solid gainsboro"}}>
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
                <div style={{ display: "flex" }}>
                    <FontAwesome
                        name={'id-card'}
                        style={{
                            margin: "0.5em",
                            color:primary,
                            fontSize: `${iconsSize}em`,
                            textAlign:"center",
                            width: "25px"
                        }}
                    />
                    <div style={{ margin: '1em' }}>
                        {participant.dni}
                    </div>
                </div>
                <div style={{ display: "flex" }}>
                    <FontAwesome
                        name={'briefcase'}
                        style={{
                            margin: "0.5em",
                            color: primary,
                            fontSize: `${iconsSize}em`,
                            textAlign:"center",
                            width: "25px"
                        }}
                    />
                    <div style={{ margin: '1em' }}>
                        {participant.position}
                    </div>
                </div>
            </div>
            </Card>
        // </div>
    )
}

export default DelegationItem;