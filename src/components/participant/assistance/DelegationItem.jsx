import React from "react";
import FontAwesome from "react-fontawesome";
import { getPrimary } from "../../../styles/colors";

const DelegationItem = ({ participant }) => {
    const primary = getPrimary();
    const iconsSize = 1.8;
    return (
        <div style={{ border: `solid 1px ${primary}` }}>
            <div style={{ display: 'flex' }}>
                <FontAwesome
                    name={'info'}
                    style={{
                        margin: "0.5em",
                        color: primary,
                        fontSize: `${iconsSize}em`
                    }} />
                    <div style={{ margin: '1em'}}>
                        {participant.name} {participant.surname}
                    </div>
                <FontAwesome
                    name={'id-card'}
                    style={{
                        margin: "0.5em",
                        color: primary,
                        fontSize: `${iconsSize}em`
                    }}
                />
                <div style={{ margin: '1em'}}>
                    {participant.dni} 
                </div>
                <FontAwesome
                    name={'briefcase'}
                    style={{
                        margin: "0.5em",
                        color: primary,
                        fontSize: `${iconsSize}em`
                    }}
                />
                <div style={{ margin: '1em'}}>
                    {participant.position} 
                </div>
            </div>
        </div>
    )
}

export default DelegationItem;