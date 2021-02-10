import React from 'react';
import { withApollo } from 'react-apollo';
import FloatGroup from 'react-float-button';
import { LoadingMainApp, FabButton, Icon, BasicButton } from '../../../../displayComponents';
import { showVideo } from '../../../../utils/CBX';
import { councilLiveQuery } from '../../../../queries';
import ParticipantsManager from '../participants/ParticipantsManager';
import LiveMobileHeader from './LiveMobileHeader';
import AgendaManager from '../AgendaManager';
import CommentWall from '../CommentWall';
import LiveParticipantsDrawer from './LiveParticipantsDrawer';
import { getSecondary } from '../../../../styles/colors';

const CouncilLiveMobilePage = ({ client, companies, data, translate }) => {
    const [state, setState] = React.useState({
        participants: true,
        wall: false,
        unreadComments: 0,
        selectedPoint: 0,
        liveParticipantsDrawer: false,
        open: false
    });
    const [council, setCouncil] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: councilLiveQuery,
            variables: {
                councilID: data.council.id
            }
        });

        setLoading(false);
        setCouncil(response);
    }, []);

    React.useEffect(() => {
        getData();
    }, [getData]);

    const updateState = object => {
        setState(object);
    };

    const toggleLiveParticipantsDrawer = () => {
        const drawer = state.liveParticipantsDrawer;
        setState({
            ...state,
            liveParticipantsDrawer: !drawer,
            open: false
        });
    };

    const closeCommentWall = () => {
        setState({
            ...state,
            wall: false
        });
    };

    const openCommentWall = () => {
        setState({
            ...state,
            wall: true,
            open: false
        });
    };

    const secondary = getSecondary();

    const company = companies.list[
        companies.selected
    ];

    if (loading) {
        return <LoadingMainApp />;
    }

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                position: 'relative'
            }}
        >
            <LiveParticipantsDrawer
                open={state.liveParticipantsDrawer}
                requestClose={toggleLiveParticipantsDrawer}
                council={council}
                translate={translate}
            />
            <div
                style={{
                    position: 'absolute',
                    bottom: '5%',
                    right: state.fullScreen ? '5%' : '2%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    zIndex: 2
                }}
            >
                <FloatGroup delay={0.02} style={{ display: 'flex', justifyContent: 'flex-end', width: state.open ? '13em' : '', marginBottom: '0.4em' }}>
                    <FabButton
                        icon={
                            <Icon className="material-icons">
                                add
                                </Icon>
                        }
                        onClick={() => setState({ ...state, open: !state.open })}
                    />
                    <BasicButton
                        text={translate.wall}
                        color={secondary}
                        textStyle={{ color: 'white', fontWeight: '700' }}
                        buttonStyle={{ marginBottom: '1em' }}
                        onClick={openCommentWall}
                    />
                    {showVideo(council)
                        && <BasicButton
                            text={'Ver participantes remotos'}
                            color={secondary}
                            textStyle={{ color: 'white', fontWeight: '700' }}
                            buttonStyle={{ marginBottom: '1em' }}
                            onClick={toggleLiveParticipantsDrawer}
                        />
                    }
                </FloatGroup>
                <FabButton
                    icon={
                        <React.Fragment>
                            <Icon className="material-icons">
                                {state.participants ?
                                    'developer_board'
                                    : 'group'}
                            </Icon>
                            <Icon className="material-icons">
                                {state.participants ?
                                    'keyboard_arrow_left'
                                    : 'keyboard_arrow_right'}
                            </Icon>
                        </React.Fragment>
                    }
                    onClick={() => setState({
                        ...state,
                        participants: !state.participants,
                    })}
                />
            </div>
            <CommentWall
                translate={translate}
                open={state.wall}
                council={data.council}
                unreadComments={state.unreadComments}
                updateState={updateState}
                requestClose={closeCommentWall}
            />
            <LiveMobileHeader
                logo={!!company && company.logo}
                companyName={!!company && company.businessName}
                councilName={council.name}
                translate={translate}
                council={data.council}
                recount={data.councilRecount}
                participants={data.council.participants}
                refetch={data.refetch}
            />
            <div
                style={{
                    width: '100%',
                    height: 'calc(100% - 3.5em)'
                }}
            >
                {state.participants ?
                    <ParticipantsManager
                        translate={translate}
                        participants={
                            data.council.participants
                        }
                        council={data.council}
                    />
                    : <AgendaManager
                        recount={data.councilRecount}
                        council={council}
                        company={company}
                        translate={translate}
                        fullScreen={state.fullScreen}
                        refetch={data.refetch}
                        openMenu={() => setState({
                                ...state,
                                videoWidth: '100%',
                                videoHeight: '100%',
                                fullScreen: false
                            })
                        }
                    />
                }
            </div>
        </div>
    );
};

export default withApollo(CouncilLiveMobilePage);

