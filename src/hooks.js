import React, { useEffect, useRef } from 'react';
import gql from 'graphql-tag';
import { checkValidEmail } from './utils';
import { checkUniqueCouncilEmails } from './queries/councilParticipant';

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
		if(statute.videoConfig && statute.videoConfig.rtmp){
			const valid = /rtmp?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(statute.videoConfig.rtmp);
			if(valid !== validURL){
				setValidURL(valid);
			}
		}
	}, [statute.videoConfig])

	return {
		validURL
	}
}

export const useParticipantContactEdit = ({ participant, client, translate, council }) => {
	const [edit, setEdit] = React.useState(false);
	const [saving, setSaving] = React.useState(false);
	const [success, setSuccess] = React.useState(false);
	const [email, setEmail] = React.useState(participant.email);
	const [phone, setPhone] = React.useState(participant.phone);
	const [errors, setErrors] = React.useState({
		phone: '',
		email: ''
	});

	React.useEffect(() => {
		let timeout;

		if(success){
			timeout = setTimeout(() => {
				setSuccess(false)
			}, 3000)
		}
		return () => clearTimeout(timeout);
	}, [success])

	const updateParticipantContactInfo = async () => {
		setSaving(true);
		if(!await checkRequiredFields()){
			const response = await client.mutate({
				mutation: gql`
					mutation UpdateParticipantContactInfo($participantId: Int!, $email: String!, $phone: String!){
						updateParticipantContactInfo(participantId: $participantId, email: $email, phone: $phone){
							success
							message
						}
					}
				`,
				variables: {
					participantId: participant.id,
					email,
					phone
				}
			});
			if(response.data.updateParticipantContactInfo.success){
				setSuccess(true);
			}
		}
		setSaving(false);

		
	}
	
	const checkRequiredFields = async () => {
		let errors = {};

		if(email !== participant.email){
			if(!email){
				errors.email = translate.required_field;
			} else {
				if(!checkValidEmail(email.toLocaleLowerCase())){
					errors.email = translate.valid_email_required;
				} else {
					const response = await client.query({
						query: checkUniqueCouncilEmails,
						variables: {
							councilId: council.id,
							emailList: [email]
						}
					});

					if(!response.data.checkUniqueCouncilEmails.success){
						errors.email = translate.register_exists_email;
					}
				}
			}
		}

		if(phone !== participant.phone){
			if(!phone){
				errors.phone = translate.required_field;
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

				if(!response.data.phoneLookup.success){
					errors.phone = translate.invalid_phone;
				}
			}
		}

		setErrors(errors);

		return Object.keys(errors).length > 0;
	}

	return {
		edit,
		setEdit,
		saving,
		success,
		email,
		setEmail,
		phone,
		setPhone,
		errors,
		updateParticipantContactInfo
	}
}


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
                    }
                    proxyVotes(participantId: $participantId){
                        value
                        agendaId
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
	}

	React.useEffect(() => {
        getData();
    }, [councilId])
	
	return {
		data,
		loading
	}
}