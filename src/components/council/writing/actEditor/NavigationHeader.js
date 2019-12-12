import React from 'react';
import { getPrimary } from '../../../../styles/colors';


const NavigationHeader = ({ setTab, tabs, active, translate }) => {

    return (
        <div style={{ marginTop: "0.8em", marginLeft: "3em", display: "flex", alignItems: "center", marginBottom: "0.5em", }}>
            <div style={{ borderRadius: '5px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.24)',  background: "white", cursor: "pointer", display: 'flex' }}>
                {tabs.map(tab => {
                    return (
                        <span key={tab.value} onClick={() => setTab(tab.value)}
                            style={{
                                padding: '0.5em',
                                color: active === tab.value ? getPrimary() : "#a09aa0",
                                borderRight: '1px solid #e6e7e8'
                            }}>
                            {tab.label}
                        </span>
                    )
                })}
            </div>
        </div>
    )
}

export default NavigationHeader;