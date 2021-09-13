import React, { useEffect, useRef } from 'react';
import gql from 'graphql-tag';
import FileSaver from 'file-saver';
import { checkValidEmail } from './utils';
import { checkUniqueCouncilEmails } from './queries/councilParticipant';
import { SERVER_URL } from './config';


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
			const id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay, ...deps]);
};

export const useOldState = initialValue => {
	const [state, setState] = React.useState(initialValue);

	const oldSetState = object => {
		setState(previousState => ({
			...previousState,
			...object
		}));
	};

	return [state, oldSetState];
};

export const useHoverRow = () => {
	const [showActions, setShowActions] = React.useState(false);

	const mouseEnterHandler = () => {
		setShowActions(true);
	};

	const mouseLeaveHandler = () => {
		setShowActions(false);
	};


	return [showActions, { onMouseOver: mouseEnterHandler, onMouseLeave: mouseLeaveHandler }];
};

export const STATUS = {
	ERROR: 'ERROR',
	SUCCESS: 'SUCCESS',
	LOADING: 'LOADING',
	IDDLE: 'IDDLE'

};

const statusReducer = (state, action) => {
	const actions = {
		[STATUS.ERROR]: () => ({
			...state,
			status: 'ERROR',
			data: action.payload
		}),
		[STATUS.SUCCESS]: () => ({
			...state,
			status: 'SUCCESS',
			data: action.payload
		}),
		[STATUS.LOADING]: () => ({
			...state,
			status: 'LOADING',
			data: null
		}),
		[STATUS.IDDLE]: () => ({
			...state,
			status: 'IDDLE',
			data: null
		}),
	};

	return actions[action.type] ? actions[action.type]() : state;
};

export const useStatus = initialStatus => {
	const [{ status, data }, dispatch] = React.useReducer(statusReducer, {
		status: initialStatus || STATUS.IDDLE
	});

	const setStatus = (type, payload) => {
		dispatch({ type, payload });
	};

	return {
		loading: status === STATUS.LOADING,
		error: status === STATUS.ERROR,
		iddle: status === STATUS.IDDLE,
		success: status === STATUS.SUCCESS,
		data,
		STATUS,
		setStatus
	};
};


export const usePolling = (cb, interval, deps = []) => {
	const [visible, setVisible] = React.useState(!document.hidden);
	const [online, setOnline] = React.useState(navigator.onLine);
	const inThrottle = React.useRef(false);

	function handleVisibilityChange() {
		setVisible(!document.hidden);
	}

	function handleConnectionChange(event) {
		if (event.type === 'online') {
			setOnline(true);
		}

		if (event.type === 'offline') {
			setOnline(false);
		}
	}

	React.useEffect(() => {
		document.addEventListener('visibilitychange', handleVisibilityChange, false);
		window.addEventListener('online', handleConnectionChange);
		window.addEventListener('offline', handleConnectionChange);
		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
			window.removeEventListener('online', handleConnectionChange);
			window.removeEventListener('offline', handleConnectionChange);
		};
	}, []);


	React.useEffect(() => {
		if (visible && online && !inThrottle.current && interval !== null) {
			cb();
			inThrottle.current = true;
			setTimeout(() => {
				inThrottle.current = false;
			}, interval);
		}
	}, [visible, online, interval]);

	useInterval(cb, !online ? interval * 1000 : visible ? interval : interval * 10, deps);
};


export const useRoomUpdated = config => {
	const { refetch, props, participant } = config;

	React.useEffect(() => {
		if (props.subs && props.subs.roomUpdated) {
			const roomConfig = props.subs.roomUpdated;
			if (roomConfig.type) {
				refetch();
			} else if (roomConfig.videoConfig) {
				if (participant) {
					refetch();
				}
			} else {
				refetch();
			}
		}
	}, [JSON.stringify(props.subs.roomUpdated)]);
};


export const useValidRTMP = statute => {
	const [validURL, setValidURL] = React.useState(true);

	React.useEffect(() => {
		if (statute.videoConfig && statute.videoConfig.rtmp) {
			const valid = /rtmp?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(statute.videoConfig.rtmp);
			if (valid !== validURL) {
				setValidURL(valid);
			}
		}
	}, [statute.videoConfig]);

	return {
		validURL
	};
};

export const useParticipantContactEdit = ({
	participant, client, translate, council
}) => {
	const [edit, setEdit] = React.useState(false);
	const [saving, setSaving] = React.useState(false);
	const [success, setSuccess] = React.useState(false);
	const [newValues, setNewValues] = React.useState({
		phone: participant.phone,
		email: participant.email,
		numParticipations: participant.numParticipations,
		socialCapital: participant.socialCapital
	});
	const [errors, setErrors] = React.useState({
		phone: '',
		email: '',
		numParticipations: '',
		socialCapital: ''
	});

	const { email, phone, numParticipations, socialCapital } = newValues;

	React.useEffect(() => {
		let timeout;

		if (success) {
			timeout = setTimeout(() => {
				setSuccess(false);
			}, 3000);
		}
		return () => clearTimeout(timeout);
	}, [success]);

	const checkRequiredFields = async () => {
		const newErrors = {};

		if (email !== participant.email) {
			if (!email) {
				newErrors.email = translate.required_field;
			} else if (!checkValidEmail(email.toLocaleLowerCase())) {
				newErrors.email = translate.valid_email_required;
			} else {
				const response = await client.query({
					query: checkUniqueCouncilEmails,
					variables: {
						councilId: council.id,
						emailList: [email]
					}
				});

				if (!response.data.checkUniqueCouncilEmails.success) {
					newErrors.email = translate.register_exists_email;
				}
			}
		}

		if (phone !== participant.phone) {
			if (!phone) {
				newErrors.phone = translate.required_field;
			} else {
				const response = await client.query({
					query: gql`
						query phoneLookup($phone: String!){
							phoneLookup(phone: $phone){
								success
								message
							}
						}
					`,
					variables: {
						phone
					}
				});

				if (!response.data.phoneLookup.success) {
					errors.phone = translate.invalid_phone;
				}
			}
		}

		if (Number.isNaN(Number(numParticipations)) || numParticipations < 0) {
			newErrors.numParticipations = 'El número no es válido';
		}

		if (Number.isNaN(Number(socialCapital)) || socialCapital < 0) {
			newErrors.socialCapital = 'El número no es válido';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length > 0;
	};

	const updateParticipantContactInfo = async () => {
		setSaving(true);
		if (!await checkRequiredFields()) {
			const response = await client.mutate({
				mutation: gql`
					mutation UpdateParticipantContactInfo($participant: LiveParticipantInput){
						updateLiveParticipant(participant: $participant){
							success
							message
						}
					}
				`,
				variables: {
					participant: {
						id: participant.id,
						email,
						phone,
						numParticipations: Number(numParticipations),
						socialCapital: Number(socialCapital)
					}
				}
			});
			if (response.data.updateLiveParticipant.success) {
				setSuccess(true);
			}
		}
		setSaving(false);
	};

	return {
		edit,
		setEdit,
		saving,
		success,
		email,
		setEmail: value => setNewValues({ ...newValues, email: value }),
		phone,
		setPhone: value => setNewValues({ ...newValues, phone: value }),
		numParticipations,
		setNumParticipations: value => setNewValues({ ...newValues, numParticipations: value }),
		socialCapital,
		setSocialCapital: value => setNewValues({ ...newValues, socialCapital: value }),
		errors,
		updateParticipantContactInfo
	};
};


export const useCouncilAgendas = ({
	councilId,
	participantId,
	client
}) => {
	const [data, setData] = React.useState(null);
	const [loading, setLoading] = React.useState(true);

	const getData = async () => {
		const response = await client.query({
			query: gql`
				query agendas($councilId: Int!, $participantId: Int!){
					agendas(councilId: $councilId){
						id
						agendaSubject
						subjectType
						options {
							maxSelections
							minSelections
						}
						items {
							value
							id
						}
					}
					proxyVotes(participantId: $participantId){
						value
						agendaId
						participantId
						id
					}
				}
			`,
			variables: {
				councilId,
				participantId
			}
		});

		setData(response.data);
		setLoading(false);
	};

	React.useEffect(() => {
		getData();
	}, [councilId]);

	return {
		data,
		loading
	};
};

export const useSendRoomKey = client => {
	const [loading, setLoading] = React.useState(false);

	const sendKey = async () => {
		setLoading(true);
		const response = await client.mutate({
			mutation: gql`
				mutation SendMyRoomKey{
					sendMyRoomKey{
						success
					}
				}
			`,
		});

		setLoading(false);
		return response;
	};


	return [loading, sendKey];
};


export const useCountdown = time => {
	const [secondsLeft, setCountdown] = React.useState(time || 0);

	React.useEffect(() => {
		let timeout;
		if (secondsLeft > 0) {
			timeout = setTimeout(() => setCountdown(secondsLeft - 1), 1000);
		}
		return () => clearTimeout(timeout);
	}, [secondsLeft]);

	return {
		secondsLeft,
		setCountdown
	};
};

const queryReducer = (state, action) => {
	const actions = {
		DATA_LOADED: () => ({
			...state,
			loading: false,
			data: action.payload
		}),
		LOADING: () => ({
			...state,
			loading: true
		})
	};

	return actions[action.type] ? actions[action.type]() : state;
};

export const useQueryReducer = ({
	client, query, variables, pollInterval = 10000
}) => {
	const [{ data, errors, loading }, dispatch] = React.useReducer(queryReducer, { data: null, loading: true, errors: null });

	const getData = React.useCallback(async () => {
		dispatch({ type: 'LOADING' });
		const response = await client.query({
			query,
			variables
		});

		if (!response.errors) {
			dispatch({ type: 'DATA_LOADED', payload: response.data });
		}
	}, [JSON.stringify(variables)]);

	usePolling(getData, pollInterval);

	React.useEffect(() => {
		getData();
	}, [getData]);

	return {
		data,
		errors,
		loading
	};
};

export const useDownloadHTMLAsPDF = () => {
	const [downloading, setDownloading] = React.useState(false);

	const downloadHTMLAsPDF = async ({ name, companyId, html }) => {
		setDownloading(true);
		const response = await fetch(`${SERVER_URL}/pdf/build`, {
			headers: {
				'Content-type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify({
				html,
				companyId
			})
		});

		const blob = await response.blob();
		FileSaver.saveAs(blob, `${name}.pdf`);
		setDownloading(false);
	};

	return {
		downloading,
		downloadHTMLAsPDF
	};
};


export const useCheckValidPhone = client => {
	const checkValidPhone = async phone => {
		const response = await client.query({
			query: gql`
				query PhoneLookup($phone: String!){
					phoneLookup(phone: $phone){
						success
						message
					}
				}
			`,
			variables: {
				phone
			}
		});

		return response.data.phoneLookup;
	};

	return {
		checkValidPhone
	};
};

export const useDownloadDocument = () => {
	const [downloading, setDownloading] = React.useState(false);

	const download = async (path, filename) => {
		setDownloading(true);
		const token = sessionStorage.getItem('token');
		const apiToken = sessionStorage.getItem('apiToken');
		const participantToken = sessionStorage.getItem('participantToken');
		const response = await fetch(path, {
			headers: new Headers({
				'x-jwt-token': token || apiToken || participantToken,
			})
		});

		if (response.status === 200) {
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			a.remove();
		}
		setDownloading(false);
	};

	return [downloading, download];
};
