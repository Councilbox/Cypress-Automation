import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const RemoteMouseTracking = ({ updatePointer, children }) => {
    if(process.env.REACT_APP_POINTER !== "true"){
        return children;
    }

    let lastCall = 0;

    const handleMouseMove = async event => {

        const now = (new Date).getTime();

        //console.log(lastCall, now);

        if(now - lastCall < 30) {
            return;
        }

        lastCall = now;
        const response = await updatePointer({
            variables: {
                pointer: {
                    x: event.clientX,
                    y: event.clientY,
                    userId: 320
                }
            }
        })

        //console.log(response);
    }

    return (
        <div
            style={{
                width: '100%',
                height: '100%'
            }}

            onMouseMove={handleMouseMove}
        >
            {children}
        </div>
    )
}
const updatePointer = gql`
    mutation UpdatePointer($pointer: PointerInput!){
        updatePointer(pointer: $pointer)
    }
`;

export default graphql(updatePointer, {
    name: 'updatePointer'
})(RemoteMouseTracking)