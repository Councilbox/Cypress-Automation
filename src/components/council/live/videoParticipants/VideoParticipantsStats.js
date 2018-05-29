import React from 'react';
import { Tooltip } from 'material-ui';
import { Icon } from '../../../../displayComponents';
import { getSecondary, mediumGrey, lightGrey } from '../../../../styles/colors';


const VideoParticipantsStats = ({ videoFullScreen, translate, toggleFullScreen, stats }) => (
    <div
        style={{
            height: videoFullScreen? '100%' : "3em",
            width: '100%',
            display: "flex",
            cursor: videoFullScreen? 'pointer' : '',
            flexDirection: videoFullScreen? 'column' : 'row',
            backgroundColor: mediumGrey,
            alignItems: "center"
        }}
        {...(videoFullScreen? {onClick: toggleFullScreen} : {})}
        className="withShadow"
    >
        <Tooltip title={translate.current_remote_census}>
            <div
                style={{
                    marginLeft: "1em",
                    marginRight: "0.5em",
                    height: videoFullScreen? '3em' : "100%",
                    display: "flex",
                    alignItems: "center"
                }}
            >
                <Icon
                    className="material-icons"
                    style={{
                        fontSize: "1.1em",
                        marginRight: "0.3em",
                        color: lightGrey
                    }}
                >
                    person
                </Icon>
                <span
                    style={{
                        fontWeight: "700",
                        color: "white",
                        fontSize: "0.8em"
                    }}
                >
                    {stats.total}
                </span>
            </div>
        </Tooltip>
        <Tooltip title={translate.present}>
            <div
                style={{
                    marginLeft: "1em",
                    marginRight: "0.5em",
                    height: videoFullScreen? '3em' : "100%",
                    display: "flex",
                    alignItems: "center"
                }}
            >
                <Icon
                    className="material-icons"
                    style={{
                        fontSize: "1.1em",
                        marginRight: "0.3em",
                        color: getSecondary()
                    }}
                >
                    language
                </Icon>
                <span
                    style={{
                        fontWeight: "700",
                        color: "white",
                        fontSize: "0.8em"
                    }}
                >
                    {stats.online}
                </span>
            </div>
        </Tooltip>
        <Tooltip title={translate.absents}>
            <div
                style={{
                    marginLeft: "1em",
                    marginRight: "0.5em",
                    height: videoFullScreen? '3em' : "100%",
                    display: "flex",
                    alignItems: "center"
                }}
            >
                <Icon
                    className="material-icons"
                    style={{
                        fontSize: "1.1em",
                        marginRight: "0.3em",
                        color: 'crimson'
                    }}
                >
                    language
                </Icon>
                <span
                    style={{
                        fontWeight: "700",
                        color: "white",
                        fontSize: "0.8em"
                    }}
                >
                    {stats.offline}
                </span>
            </div>
        </Tooltip>
        <Tooltip title={'EMITIENDO'}>
            <div
                style={{
                    marginLeft: "1em",
                    marginRight: "0.5em",
                    height: videoFullScreen? '3em' : "100%",
                    display: "flex",
                    alignItems: "center"
                }}
            >
                <Icon
                    className="material-icons"
                    style={{
                        fontSize: "1.1em",
                        marginRight: "0.3em",
                        color: getSecondary()
                    }}
                >
                    videocam
                </Icon>
                <span
                    style={{
                        fontWeight: "700",
                        color: "white",
                        fontSize: "0.8em"
                    }}
                >
                    {stats.broadcasting}
                </span>
            </div>
        </Tooltip>
        <Tooltip title={translate.banned}>
            <div
                style={{
                    marginLeft: "1em",
                    marginRight: "0.5em",
                    height: videoFullScreen? '3em' : "100%",
                    display: "flex",
                    alignItems: "center"
                }}
            >
                <Icon
                    className="material-icons"
                    style={{
                        fontSize: "1.1em",
                        marginRight: "0.3em",
                        color: 'crimson'
                    }}
                >
                    block
                </Icon>
                <span
                    style={{
                        fontWeight: "700",
                        color: "white",
                        fontSize: "0.8em"
                    }}
                >
                    {stats.banned}
                </span>
            </div>
        </Tooltip>
    </div>
)

export default VideoParticipantsStats;