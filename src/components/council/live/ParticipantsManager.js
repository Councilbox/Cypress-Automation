import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BasicButton, ButtonIcon, Grid, GridItem, Icon, LoadingSection, Radio, TextInput, FilterButton, LoadMoreButton } from '../../../displayComponents';
import { getSecondary, getPrimary } from '../../../styles/colors';
import { Card, MenuItem, Tooltip, Typography } from 'material-ui';
import { liveParticipants, refreshLiveEmails } from '../../../queries';
import { compose, graphql } from 'react-apollo';
import * as CBX from '../../../utils/CBX';
import ParticipantStateIcon from './ParticipantStateIcon';
import LiveParticipantEditor from './participants/LiveParticipantEditor';
import Scrollbar from 'react-perfect-scrollbar';
import Chip from 'material-ui/Chip';
import AddGuestModal from './AddGuestModal';
import { toast } from 'react-toastify';
import ParticipantItem from './participants/ParticipantItem';
import ParticipantStatsBanner from './participants/ParticipantStatsBanner';
import FilterMenu from './participants/FilterMenu';
import FontAwesome from 'react-fontawesome';


class ParticipantsManager extends Component {

	constructor(props) {
		super(props);
		this.state = {
			filterText: "",
			participantType: "all",
			participantState: "all",
            addGuest: false,
            loadingMore: false,
			refreshing: false,
			tableType: "participantState",
			editParticipant: undefined
		};
	}

	componentDidMount() {
		this.props.data.refetch();
		ReactDOM.findDOMNode(this.div).focus();
	}

	updateFilterText = async value => {
		this.setState({
			filterText: value
		});

		clearTimeout(this.timeout);
		this.timeout = setTimeout(() => this.refresh(), 450);
    };
    
	editParticipant = id => {
		this.setState({
			editParticipant: id
		});
    };
    
	updateParticipantType = value => {
        if(value === this.state.participantType){
            value = 'all';
        }
		this.setState({
			participantType: value
		},() => this.refresh());

		let variables = {
			filters: []
		};
    };
    
	refresh = () => {
		let variables = {
			filters: []
		};

		if (this.state.participantType !== "all") {
			variables.filters = [
				{
					field: "type",
					text: +this.state.participantType
				}
			];
		}

		if (this.state.participantState !== "all") {
			variables.filters = [
				...variables.filters,
				{
					field: "state",
					text: +this.state.participantState
				}
			];
		}

		if (this.state.filterText) {
			variables.filters = [
				...variables.filters,
				{ field: "fullName", text: this.state.filterText }
			];
		}
		this.props.data.refetch(variables);
    };
    
	updateParticipantState = value => {
        if(value === this.state.participantState){
            value = 'all';
        }
		this.setState({
				participantState: value
		},
			() => this.refresh()
		);
    };
    
	loadMore = () => {
        this.setState({
            loadingMore: true
        });
		this.props.data.fetchMore({
			variables: {
				options: {
					offset: this.props.data.liveParticipants.list.length,
					limit: 2
				}
			},
			updateQuery: (prev, { fetchMoreResult }) => {
				if (!fetchMoreResult) {
					return prev;
                }
                this.setState({
                    loadingMore: false
                });

				return {
					...prev,
					liveParticipants: {
						...prev.liveParticipants,
						list: [
							...prev.liveParticipants.list,
							...fetchMoreResult.liveParticipants.list
						]
					}
				};
			}
		});
    };
    
    
	handleKeyPress = event => {
		const key = event.nativeEvent;
		if (key.altKey) {
			if (key.code === "KeyG") {
				this.setState({ addGuest: true });
			}
			if (key.code === "KeyR") {
				this.refreshEmailStates();
			}
        }
    };

    updateState = (object) => {
        this.setState({
            ...object
        });
    }
    
	refreshEmailStates = async () => {
		this.setState({
			refreshing: true
		});
		const response = await this.props.refreshLiveEmails({
			variables: {
				councilId: this.props.council.id
			}
		});

		console.log(response);

		if (response) {
			this.setState({ refreshing: false });
			if (!response.data.refreshLiveEmails.success) {
				toast.error(this.props.translate.err_saved);
			}
		}
	};

	render() {
		const { translate } = this.props;
        const columnSize = this.state.editParticipant ? 12 : 9;
        const secondary = getSecondary();
        const primary = getPrimary();

        return (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    padding: 0,
                    margin: 0,
                    outline: 0
                }}
                tabIndex="0"
                onKeyDown={this.handleKeyPress}
                ref={(ref) => this.div = ref}
            >
                <Grid style={{ height: '100%', overflow: 'hidden'}}>
                    <GridItem xs={columnSize} md={columnSize} lg={columnSize} style={{
                        padding: '3em',
                        paddingTop: 0,
                        paddingBottom: 0,
                        overflow: 'hidden'
                    }}>
                        <Card style={{
                            height: '85vh',
                            overflowY: 'hidden',
                            position: 'relative'
                        }}>
                            <Scrollbar option={{ suppressScrollX: true }}>
                                {this.state.editParticipant? 
                                    <LiveParticipantEditor
                                        translate={translate}
                                        council={this.props.council}
                                        refetch={this.props.data.refetch}
                                        id={this.state.editParticipant}
                                        requestClose={() => {
                                            //this.refresh();
                                            this.setState({ editParticipant: undefined })
                                        }}
                                    />

                                    : (
                                        <Grid style={{ paddingTop: '2em' }}>
                                            <ParticipantStatsBanner
                                                council={this.props.council}
                                                translate={translate}
                                            />
                                            {this.props.data.loading ?
                                                <div style={{marginTop: '5em', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                    <LoadingSection/> 
                                                </div>
                                            : this.props.data.liveParticipants.list.length > 0 ? (
                                                    <React.Fragment>
                                                        {this.props.data.liveParticipants.list.map((participant) => (
                                                            <ParticipantItem
                                                                key={`participant_${participant.id}`}
                                                                participant={participant}
                                                                translate={translate}
                                                                mode={this.state.tableType}
                                                                editParticipant={this.editParticipant}
                                                                council={this.props.council}
                                                            />
                                                        ))}
                                                        {this.props.data.liveParticipants.list.length < this.props.data.liveParticipants.total &&
                                                        <LoadMoreButton 
                                                            onClick={this.loadMore}
                                                            loading={this.state.loadingMore}
                                                        />}
                                                    </React.Fragment>) : (<div style={{ marginLeft: '2em' }}>
                                                    {translate.no_results}
                                                </div>
                                            )}
                                    </Grid>
                                    )}
                            </Scrollbar>
                        </Card>
                    </GridItem>
                    {!this.state.editParticipant && <GridItem xs={3} md={3} lg={3} style={{
                        height: '100%',
                        padding: '2em',
                        position: 'relative'
                    }}>
                        <FilterMenu
                            state={this.state}
                            translate={translate}
                            updateFilterText={this.updateFilterText}
                            updateParticipantState={this.updateParticipantState}
                            updateParticipantType={this.updateParticipantType}
                            refreshEmailStates={this.refreshEmailStates}
                            updateState={this.updateState}
                        />
                    </GridItem>}
                    <AddGuestModal
                        show={this.state.addGuest}
                        council={this.props.council}
                        refetch={this.props.data.refetch}
                        requestClose={() => this.setState({ addGuest: false })}
                        translate={translate}
                    />
                </Grid>
            </div>
        );
    }
}

export default compose(graphql(liveParticipants, {
    options: (props) => ({
        variables: {
            councilId: props.council.id,
            options: {
                limit: 3,
                offset: 0
            },
            notificationStatus: 22
        }
    })
}), graphql(refreshLiveEmails, {
    name: 'refreshLiveEmails'
}))(ParticipantsManager);