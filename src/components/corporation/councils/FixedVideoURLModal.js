import React from 'react';
import { AlertConfirm, BasicButton, TextInput, LoadingSection } from '../../../displayComponents';
import { primary } from '../../../styles/colors';
import { withApollo, graphql } from 'react-apollo';
import gql from 'graphql-tag';

let interval = null;


const FixedVideoURLModal = ({ council, client, ...props }) => {
    const [state, setState] = React.useState({
        modal: false,
        loading: false,
        success: false
    })

    const [data, setData] = React.useState(null);
    const [videoConfig, setVideoConfig] = React.useState(null);

    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: gql`
                query CouncilRoom($councilId: Int!){
                    councilRoom(councilId: $councilId){
                        platformVideo
                        videoConfig
                        videoLink
                    }
                    videoConfig
                }
            `,
            variables: {
                councilId: council.id
            }
        });

        console.log(response);

        if(response.data.councilRoom){
            const { __typename, ...councilRoom } = response.data.councilRoom;
            setData(councilRoom);
        } else {
            setData({
                platformVideo: '',
                videoConfig: '',
                videoLink: ''
            })
        }
        setVideoConfig(JSON.parse(response.data.videoConfig));
    }, [council.id]);

    React.useEffect(() => {
        getData();
    }, [getData]);
    
    React.useEffect(() => {
        return () => clearInterval(interval);
    }, [state.modal]);

    if(!data){
        return <LoadingSection />
    }


    const openURLModal = event => {
        event.preventDefault();
        event.stopPropagation();
        setState({
            ...state,
            modal: true
        });
    }

    const closeURLModal = () => {
        setState({
            ...state,
            modal: false
        });
    }

    const updateCouncilRoomLink = async () => {
        clearInterval(interval);
        setState({
            ...state,
            loading: true,
            success: false
        })
        await props.updateCouncilRoomLink({
            variables: {
                councilId: council.id,
                councilRoom: data
            }
        });

        setState({
            ...state,
            loading: false,
            success: true
        });
        interval = setInterval(refreshButtons, 3000);
    }

    const refreshButtons = () => {
        setState({
            ...state,
            success: false,
            loading: false,
            error: false
        });
    }


    const handleEnter = event => {
        refreshButtons();
		if (event.nativeEvent.keyCode === 13) {
			updateCouncilRoomLink();
		}
	};

    const _renderBody = () => {
        return (
            <>
                {videoConfig &&
                    <div style={{marginBottom: '1em'}}>
                        <h5>Video config:</h5>
                        <div>
                            Número de instancias disponibles: {videoConfig.instances}
                        </div>
                        <div>
                            En rotación: {videoConfig.availableSlots}
                        </div>
                    </div>
                }

                <TextInput
                    value={data.platformVideo}
                    onKeyUp={handleEnter}
                    floatingText="Fijado al número"
                    onChange={event => setData({ ...data, platformVideo: +event.target.value })}
                />

                <TextInput
                    value={data.videoLink}
                    onKeyUp={handleEnter}
                    floatingText="Video URL"
                    onChange={event => setData({ ...data, videoLink: event.target.value })}
                />

                <TextInput
                    value={data.videoConfig.rtmp}
                    onKeyUp={handleEnter}
                    floatingText="URL RTMP"
                    onChange={event => setData({ ...data, videoConfig: {
                        ...data.videoConfig,
                        rtmp: event.target.value
                    }})}
                />
            </>
        )
    }

    const setValue = event => {
        setData({
            ...data,
            videoLink: event.target.value
        });
    }

    return (
        <>
            <BasicButton
                text="Video config"
                type="flat"
                color="white"
                textStyle={{color: primary, fontWeight: '700'}}
                onClick={openURLModal}
                buttonStyle={{border: "1px solid "}}
            />
            <AlertConfirm
                requestClose={closeURLModal}
                open={state.modal}
                loadingAction={state.loading}
                successAction={state.success}
                acceptAction={updateCouncilRoomLink}
                buttonAccept={'Aceptar'}
                buttonCancel={'Cancelar'}
                bodyText={_renderBody()}
                title={"Fijar video URL"}
            />
        </>
    );

}

const updateCouncilRoomLink = gql`
    mutation UpdateCouncilRoomLink($councilRoom: CouncilRoomInput!, $councilId: Int!){
        updateCouncilRoom(councilRoom: $councilRoom, councilId: $councilId){
            success
            message
        }
    }
`;

export default graphql(updateCouncilRoomLink, {
    name: "updateCouncilRoomLink"
})(withApollo(FixedVideoURLModal));