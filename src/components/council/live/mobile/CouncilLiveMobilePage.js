import React from 'react';
import { LoadingMainApp, FabButton, Icon } from '../../../../displayComponents';
import { graphql } from 'react-apollo';
import { councilLiveQuery } from "../../../../queries";
import { Badge } from 'material-ui';
import ParticipantsManager from '../participants/ParticipantsManager';
import LiveMobileHeader from './LiveMobileHeader';
import AgendaManager from '../AgendaManager';
import CommentWall from '../CommentWall';


class CouncilLiveMobilePage extends React.Component {

    state = {
        participants: true,
        wall: false,
        unreadComments: 0,
        selectedPoint: 0,
    }

    updateState = object => {
        this.setState(object);
    }

    closeCommentWall = () => {
        this.setState({
            wall: false
        });
    }

    openCommentWall = () => {
        this.setState({
            wall: true
        })
    }

    render() {
        const { council } = this.props.data;
        const { translate } = this.props;

        const company = this.props.companies.list[
            this.props.companies.selected
        ];

        if (this.props.data.loading) {
            return <LoadingMainApp />
        }

        return (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative'
                }}
            >

                <div
					style={{
						position: "absolute",
						bottom: "5%",
						right: this.state.fullScreen? "5%" : "2%",
						display: "flex",
						flexDirection: "column",
						zIndex: 2
					}}
				>
                {(council.state === 20 || council.state === 30) &&
                        <div>
                            {this.state.unreadComments > 0 ?
                                <Badge
                                    classes={{
                                        badge: 'fadeToggle'
                                    }}
                                    badgeContent={
                                        <span
                                            style={{
                                                color: "white",
                                                fontWeight: "700",
                                            }}
                                        >
                                            {this.state.unreadComments}
                                        </span>
                                    }
                                    color="secondary"
                                >
                                    <div style={{ marginBottom: "0.3em" }}>
                                        <FabButton
                                            icon={
                                                <Icon className="material-icons">
                                                    chat
                                                </Icon>
                                            }

                                            onClick={this.openCommentWall}
                                        />
                                    </div>
                                </Badge>
                            :
                                <div style={{ marginBottom: "0.3em" }}>
                                    <FabButton
                                        icon={
                                            <Icon className="material-icons">
                                                chat
                                            </Icon>
                                        }
                                        updateState={this.updateState}
                                        onClick={() =>
                                            this.setState({
                                                wall: true
                                            })
                                        }
                                    />
                                </div>
                            }
                        </div>
					}
	                <div>
                        <FabButton
                            icon={
                                <React.Fragment>
                                    <Icon className="material-icons">
                                        {this.state.participants
                                            ? "developer_board"
                                            : "group"}
                                    </Icon>
                                    <Icon className="material-icons">
                                        {this.state.participants
                                            ? "keyboard_arrow_left"
                                            : "keyboard_arrow_right"}
                                    </Icon>
                                </React.Fragment>
                            }
                            onClick={() => this.setState({
                                participants: !this.state.participants,
                            })}
                        />
                    </div>
				</div>
                <CommentWall
					translate={translate}
					open={this.state.wall}
					council={council}
					unreadComments={this.state.unreadComments}
					updateState={this.updateState}
					requestClose={this.closeCommentWall}
				/>
                <LiveMobileHeader
                    logo={!!company && company.logo}
                    companyName={!!company && company.businessName}
                    councilName={this.props.data.council.name}
                    translate={this.props.translate}
                />
                <div
                    style={{
                        width: '100%',
                        height: 'calc(100% - 3.5em)'
                    }}
                >
                    {this.state.participants?
                        <ParticipantsManager
                            translate={this.props.translate}
                            participants={
                                this.props.data.council.participants
                            }
                            council={this.props.data.council}
                        />
                    :
                        <AgendaManager
                            ref={agendaManager => (this.agendaManager = agendaManager)}
                            recount={this.props.data.councilRecount}
                            council={council}
                            company={company}
                            translate={translate}
                            fullScreen={this.state.fullScreen}
                            refetch={this.props.data.refetch}
                            openMenu={() =>
                                this.setState({
                                    videoWidth: '100%',
                                    videoHeight: '100%',
                                    fullScreen: false
                                })
                            }
                        />
                    }

                </div>

            </div>
        )
    }
}

export default graphql(councilLiveQuery, {
    name: "data",
    options: props => ({
        variables: {
            councilID: props.councilID
        },
        pollInterval: 10000
    })
})(CouncilLiveMobilePage);