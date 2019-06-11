import React from 'react';


const PrivateRecountMessage = ({ translate }) => {
    return (
        <div style={{width: '100%', padding: '2em', border: `2px solid gainsboro`}}>
            {'Por motivos de privacidad en los puntos de votación anónima, el recuento está oculto hasta el cierre de votaciones' /*TRADUCCION*/}
        </div>
    )
}

export default PrivateRecountMessage;