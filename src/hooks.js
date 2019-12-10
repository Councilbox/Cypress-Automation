import React, { useEffect, useRef } from 'react';
import { moment } from './containers/App';
import gql from 'graphql-tag';

export const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    });

    // Set up the interval.
    useEffect(() => {
		function tick() {
			savedCallback.current();
		}
		if (delay !== null) {
			let id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
    }, [delay]);
}

export const useOldState = initialValue => {
	const [state, setState] = React.useState(initialValue);

	const oldSetState = object => {
		setState(state => ({
			...state,
			...object
		}));
	}

	return [state, oldSetState];
}

export const useHoverRow = () => {
	const [showActions, setShowActions] = React.useState(false);

	const mouseEnterHandler = () => {
		setShowActions(true);
	}

	const mouseLeaveHandler = () => {
		setShowActions(false);
	}


	return [showActions, { onMouseOver: mouseEnterHandler, onMouseLeave: mouseLeaveHandler }];
}


export const useSendRoomKey = (client, participant) => {
	const [loading, setLoading] = React.useState(false);

	const sendKey = async () => {
		setLoading(true);
		const response = await client.mutate({
            mutation: gql`
                mutation SendParticipantRoomKey($participantId: Int!, $timezone: String!){
                    sendParticipantRoomKey(participantId: $participantId, timezone: $timezone){
                        success
                        message
                    }
                }
            `,
            variables: {
                participantId: participant.id,
                timezone: moment().utcOffset()
            }
		});
		
		setLoading(false);
		return response;
	}


	return [loading, sendKey];
}


export const useCountdown = () => {
	const [secondsLeft, setCountdown] = React.useState(0);

	React.useEffect(() => {
        let timeout;
        if(secondsLeft > 0){
            timeout = setTimeout(() => setCountdown(secondsLeft - 1), 1000);
        }
        return () => clearTimeout(timeout);
    }, [secondsLeft]);

	return {
		secondsLeft,
		setCountdown
	}
}