import React, { useEffect, useRef } from 'react';

export const useInterval = (callback, delay, deps = []) => {
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
    }, [delay, ...deps]);
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

export const usePolling = (cb, interval, deps = []) => {
	const [visible, setVisible] = React.useState(!document.hidden);
	const [online, setOnline] = React.useState(navigator.onLine);

    function handleVisibilityChange(){
        setVisible(!document.hidden);
	}

	function handleConnectionChange(event){
		if(event.type === 'online'){
			setOnline(true);
		}

		if(event.type === 'offline'){
			setOnline(false);
		}
	}

    React.useEffect(() => {
		document.addEventListener("visibilitychange", handleVisibilityChange, false);
		window.addEventListener('online', handleConnectionChange);
		window.addEventListener('offline', handleConnectionChange);
        return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			window.removeEventListener('online', handleConnectionChange);
			window.removeEventListener('offline', handleConnectionChange);
		}
	}, []);

    React.useEffect(() => {
        if(visible && online){
            cb();
        }
	}, [visible, online, ...deps]);

	useInterval(cb, !online? interval * 1000 : visible? interval : interval * 10, deps);
}


export const useRoomUpdated = config => {
	const { refetch, props, participant } = config;

    React.useEffect(() => {
        if(props.subs && props.subs.roomUpdated){
			const roomConfig = props.subs.roomUpdated;
			if(roomConfig.videoConfig){
				if(participant){
					refetch();
				}
			} else {
				refetch();
			}
        }
    }, [JSON.stringify(props.subs.roomUpdated)])
}


export const useValidRTMP = statute => {
	const [validURL, setValidURL] = React.useState(true);

	React.useEffect(() => {
		console.log('salta el effecfo');
		console.log(statute);

		if(statute.videoConfig && statute.videoConfig.rtmp){
			const valid = /rtmp?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(statute.videoConfig.rtmp);
			console.log(valid);
			if(valid !== validURL){
				setValidURL(valid);
			}
		}
	}, [statute.videoConfig])

	return {
		validURL
	}
}