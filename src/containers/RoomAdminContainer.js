import React from 'react';



const RoomAdminContainer = ({ match, translate }) => {
    console.log(match.params.token);

    return (
        <div>
            VAMOS QUE AQUI VA LA LOGICA DE LOS PUTOS LINK DE IESA

            {match.params.token}
        </div>
    )
}

export default RoomAdminContainer;