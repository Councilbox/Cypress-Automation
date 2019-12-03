import React from 'react';


const NavigationHeader = ({ setTab, tabs, active, translate }) => {

    return (
        <div style={{width: '100%', height: '2em'}}>
            {tabs.map(tab => {
                return (
                    <span onClick={() => setTab(tab.value)} style={{
                        padding: '0.5em',
                        border: '1px solid black',
                        borderRadius: '3px',
                        backgroundColor: active === tab.value? 'grey' : 'white'
                    }}>
                        {tab.label}
                    </span>
                )
            })}
        </div>
    )
}

export default NavigationHeader;