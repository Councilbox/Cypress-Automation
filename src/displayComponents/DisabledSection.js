import React from 'react';


const DisabledSection = ({ children }) => {
    return (
        <div
            style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                zIndex: 10000,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '1.3em'
            }}
            onClick={event => event.stopPropagation()}
        >
            <div style={{ padding: '3em', border: '2px solid black', backgroundColor: 'white', borderRadius: '8px'}}>
                {children}
            </div>
        </div>
    )
}

export default DisabledSection;