import React from 'react';
import { graphql } from 'react-apollo';
import { Tooltip } from 'material-ui';
import FontAwesome from 'react-fontawesome';
import { GridItem, Icon } from '../../../../displayComponents';
import { getSecondary } from '../../../../styles/colors';
import { liveParticipantsStats } from '../../../../queries';

class ParticipantStatsBanner extends React.Component {

    getStateCount = value => {
		if (this.props.data.loading) {
			return "...";
		}

		if (value !== "all") {
			const data = this.props.data.liveParticipantsStateCount.find(
				item => item.state === value
			);
			if (data) {
				return data.count;
			}
			return "0";
		}

		return this.props.data.liveParticipantsStateCount.reduce(
			(a, b) => a + b.count,
			0
		);
    };

    getTypeCount = value => {
		if (this.props.data.loading) {
			return "...";
		}

		if (value !== "all") {
			const data = this.props.data.liveParticipantsTypeCount.find(
				item => item.type === value
			);
			if (data) {
				return data.count;
			}
			return "0";
		}

		return this.props.data.liveParticipantsTypeCount.reduce(
			(a, b) => a + b.count,
			0
		);
    };

    render(){
        const { translate } = this.props;
        const secondary = getSecondary();

        return(
            <React.Fragment>  
                <GridItem xs={12} lg={12} md={12} style={{backgroundColor: 'whiteSmoke', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '1.5em', paddingRight: '2.5em'}}>         
                    <Tooltip title={translate.customer_initial}>
                        <div>
                            <FontAwesome
                                name={"globe"}
                                style={{
                                    margin: "0.5em",
                                    color: secondary,
                                    fontSize: "1.4em"
                                }}
                            />{this.getStateCount(0)}
                        </div>
                    </Tooltip>
                    <Tooltip title={translate.customer_present}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Icon
                                className="material-icons"
                                style={{
                                    color: secondary,
                                    fontSize: "1.6em",
                                    marginRight: '0.5em'
                                }}
                            >
                                face
                            </Icon>{this.getStateCount(5)}
                        </div>
                    </Tooltip>
                    <Tooltip title={translate.customer_delegated}>
                        <div>
                            <FontAwesome
                                name={"user"}
                                style={{
                                    margin: "0.5em",
                                    color: secondary,
                                    fontSize: "1.2em"
                                }}
                            />
                            <FontAwesome
                                name={"user"}
                                style={{
                                    marginLeft: '-1em',
                                    marginRight: '0.5em',
                                    color: secondary,
                                    fontSize: "0.85em"
                                }}
                            />{this.getStateCount(4)}
                        </div>
                    </Tooltip>
                    <Tooltip title={translate.customer_representated}>
                        <div>
                            <FontAwesome
                                name={"user-o"}
                                style={{
                                    margin: "0.5em",
                                    color: secondary,
                                    fontSize: "1.2em"
                                }}
                            />
                            <FontAwesome
                                name={"user"}
                                style={{
                                    marginLeft: '-1em',
                                    marginRight: '0.5em',
                                    color: secondary,
                                    fontSize: "0.85em"
                                }}
                            />{this.getStateCount(2)}
                        </div>
                    </Tooltip>                      
                    <Tooltip title={translate.all_plural}>
                        <div>
                            <FontAwesome
                                name={"users"}
                                style={{
                                    margin: "0.5em",
                                    color: secondary,
                                    fontSize: "1.4em"
                                }}
                            />{this.getStateCount('all')}
                        </div>
                    </Tooltip>
                    <Tooltip title={translate.guest}>
                        <div>
                            <FontAwesome
                                name={"user-o"}
                                style={{
                                    margin: "0.5em",
                                    color: secondary,
                                    fontSize: "1.2em"
                                }}
                            />{this.getTypeCount(1)}
                        </div>
                    </Tooltip>
                </GridItem>
            </React.Fragment>
        )
    }
}

export default graphql(liveParticipantsStats, {
    options: props => ({
        variables: {
            councilId: props.council.id
        }
    })
})(ParticipantStatsBanner);