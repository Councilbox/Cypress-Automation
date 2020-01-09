import React, { useEffect, useRef } from 'react';

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

export const usePolling = (cb, interval) => {
	const [visible, setVisible] = React.useState(!document.hidden);
	const [online, setOnline] = React.useState(navigator.onLine);

    function handleVisibilityChange(){
        setVisible(!document.hidden);
	}

	function handleConnectionChange(event){
		console.log(event);
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
	}, [visible, online]);

	useInterval(cb, !online? interval * 1000 : visible? interval : interval * 10);
}
