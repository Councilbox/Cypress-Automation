import React from 'react';


const PrivateRecountMessage = ({ translate }) => {
    return (
        <div style={{width: '100%', padding: '2em', border: `2px solid gainsboro`}}>
            {translate.hide_votings_privacy_warning}
        </div>
    )
}

export default PrivateRecountMessage;