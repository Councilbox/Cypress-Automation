import React from 'react';
import { Grid, GridItem, Table } from '../../../displayComponents';
import { TableRow, TableCell, Tooltip } from 'material-ui';
import { getSecondary } from '../../../styles/colors';
import { graphql } from 'react-apollo';
import { updateAgenda } from "../../../queries/agenda";
import * as CBX from '../../../utils/CBX';
import { Input } from 'material-ui';
import FontAwesome from 'react-fontawesome';
import withSharedProps from '../../../HOCs/withSharedProps';

const columnStyle = {
    display: 'flex',
    fontWeight: '600',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.4em',
    fontSize: '0.8em'
};

const itemStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}



const AgendaRecount = ({ agenda, recount, majorityTypes, council, company, refetch, editable, translate, updateAgenda }) => {
    
    const agendaNeededMajority = CBX.calculateMajorityAgenda(agenda, company, council, recount);
    const activatePresentOneVote = false;

    return(
        <React.Fragment>
            <Grid style={{border: `1px solid ${getSecondary()}`, margin: 'auto', marginTop: '1em'}}>
                <GridItem xs={3} lg={3} md={3} style={columnStyle}>
                    <div style={itemStyle}>
                        {translate.convene_census}
                    </div>
                    <div style={itemStyle}>
                        {`${translate.participants}: ${recount.numTotal || 0}`}
                    </div>
                    <div style={itemStyle}>
                        {`${translate.votes}: ${recount.partTotal || 0}`}
                    </div>
                </GridItem>
                <GridItem xs={3} lg={3} md={3} style={columnStyle}>
                    <div style={itemStyle}>
                        {translate.present_census}
                    </div>
                    <div style={itemStyle}>
                        {`${translate.participants}: ${agenda.numPresentCensus || 0}`}
                    </div>
                    <div style={itemStyle}>
                        {`${translate.votes}: ${editable && activatePresentOneVote? agenda.numPresentCensus : agenda.presentCensus || 0}`}
                    </div>
                </GridItem>
                <GridItem xs={3} lg={3} md={3} style={columnStyle}>
                    <div style={itemStyle}>
                        {translate.current_remote_census}
                    </div>
                    <div style={itemStyle}>
                        {`${translate.participants}: ${agenda.numCurrentRemoteCensus || 0}`}
                    </div>
                    <div style={itemStyle}>
                        {`${translate.votes}: ${editable && activatePresentOneVote? agenda.numCurrentRemoteCensus : recount.currentRemoteCensus || 0}`}
                    </div>
                </GridItem>
                <GridItem xs={3} lg={3} md={3} style={{...columnStyle, backgroundColor: 'lightcyan'}}>
                    <div style={itemStyle}>
                        {translate.voting_rights_census}
                    </div>
                    <div style={itemStyle}>
                        {`${translate.participants}: ${agenda.numCurrentRemoteCensus + agenda.numPresentCensus || 0}`}
                    </div>
                    <div style={itemStyle}>
                        {`${translate.votes}: ${editable && activatePresentOneVote? agenda.numCurrentRemoteCensus + agenda.numPresentCensus : agenda.presentCensus + agenda.currentRemoteCensus || 0}`}
                    </div>
                </GridItem>
            </Grid>
            <Grid style={{border: `1px solid ${getSecondary()}`, margin: 'auto', marginTop: '1em'}}>
                <GridItem xs={4} lg={4} md={4} style={columnStyle}>
                    <div style={itemStyle}>
                        {`${translate.majority_label}: ${translate[majorityTypes.find(item => agenda.majorityType === item.value).label]}`}
                        {CBX.majorityNeedsInput(agenda.majorityType) && agenda.majority}
                        {agenda.majorityType === 0 && '%'}
                        {agenda.majorityType === 5 && `/ ${agenda.majorityDivider}`}
                    </div>
                </GridItem>
                <GridItem xs={4} lg={4} md={4} style={columnStyle}>
                    {CBX.haveQualityVoteConditions(agenda, council) &&
                        <div style={itemStyle}>
                            {CBX.approvedByQualityVote(agenda, council.qualityVoteId)?
                                `${translate.approved} ${translate.by_quality_vote}`
                            :
                                `${translate.not_approved} ${translate.by_quality_vote}`
                            }
                        </div>
                    }
                </GridItem>
                <GridItem xs={4} lg={4} md={4} style={columnStyle}>
                    <div style={itemStyle}>
                        {`${
							translate.votes_in_favor_for_approve
						}: ${agendaNeededMajority}`}
						{agendaNeededMajority > (agenda.positiveVotings + agenda.positiveManual) ? (
							<FontAwesome
								name={"times"}
								style={{
									margin: "0.5em",
									color: "red",
									fontSize: "1.2em"
								}}
							/>
						) : (
							<FontAwesome
								name={"check"}
								style={{
									margin: "0.5em",
									color: 'green',
									fontSize: "1.2em"
								}}
							/>
						)}
                    </div>
                </GridItem>
            </Grid>
            <Table
                headers={[
                    {name: translate.voting},
                    {name: translate.in_favor},
                    {name: translate.against},
                    {name: translate.abstentions},
                    {name: translate.no_vote}
                ]}
            >
                <TableRow>
                    <TableCell>
                        {translate.remote_vote}
                    </TableCell>
                    <TableCell>
                        {agenda.positiveVotings}
                    </TableCell>
                    <TableCell>
                        {agenda.negativeVotings}
                    </TableCell>
                    <TableCell>
                        {agenda.abstentionVotings}
                    </TableCell>
                    <TableCell>
                        {agenda.noVoteVotings}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>
                        {translate.present_vote}
                    </TableCell>
                    {editable?
                        <React.Fragment>
                            <EditableCell
                                value={agenda.positiveManual}
                                translate={translate}
                            />
                            <EditableCell
                                value={agenda.negativeManual}
                                translate={translate}
                            />
                            <EditableCell
                                value={agenda.abstentionManual}
                                translate={translate}
                            />
                            <EditableCell
                                value={agenda.noVoteManual}
                                translate={translate}
                            />
                        </React.Fragment>
                    :
                        <React.Fragment>
                            <TableCell>
                                {agenda.positiveManual}
                            </TableCell>
                            <TableCell>
                                {agenda.negativeManual}
                            </TableCell>
                            <TableCell>
                                {agenda.abstentionManual}
                            </TableCell>
                            <TableCell>
                                {agenda.noVoteManual}
                            </TableCell>
                        </React.Fragment>
                    }
                </TableRow>
                <TableRow>
                    <TableCell>
                        Total
                    </TableCell>
                    <TableCell>
                        {agenda.positiveVotings + agenda.positiveManual}
                    </TableCell>
                    <TableCell>
                        {agenda.negativeVotings + agenda.negativeManual}
                    </TableCell>
                    <TableCell>
                        {agenda.abstentionVotings + agenda.abstentionManual}
                    </TableCell>
                    <TableCell>
                        {agenda.noVoteVotings + agenda.noVoteManual}
                    </TableCell>
                </TableRow>
            </Table>
        </React.Fragment>
    )
}


export default withSharedProps()(graphql(updateAgenda, {
    name: 'updateAgenda'
})(AgendaRecount));

class EditableCell extends React.Component {

    state = {
        showEdit: false,
        edit: false,
        tooltip: false,
        value: this.props.value
    }

    show = () => {
        this.setState({
            edit: true
        });
    }

    hide = () => {
        this.setState({
            showEdit: false
        })
    }

    toggleEdit = () => {
        this.setState({
            edit: !this.state.edit
        })
    }

    showTooltip = () => {
        this.setState({
            tooltip: true
        });
    }

    handleKeyUp = (event) => {
        const key = event.nativeEvent;

        if(key.keyCode === 13){
            this.saveValue();
        }
    }

    saveValue = () => {
        if(this.state.value !== this.props.value){
            this.props.blurAction(this.state.value);
        }
        this.toggleEdit();
    }

    render(){
        return (
            <TableCell
                onMouseOver={this.show}
                onMouseLeave={this.hide}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    {this.state.edit?
                        <Tooltip title={this.props.max === 0? this.props.translate.max_votes_reached : `${this.props.translate.enter_num_between_0_and} ${this.props.max}`}>
                            <div style={{width: '4em'}}>
                                <Input
                                    type="number"
                                    fullWidth
                                    onKeyUp={this.handleKeyUp}
                                    max={this.props.max}
                                    min={0}
                                    onBlur={this.saveValue}
                                    value={this.state.value}
                                    onChange={(event) => {
                                        if(event.target.value >= 0 && event.target.value <= this.props.max){
                                            this.setState({
                                                value: parseInt(event.target.value, 10)
                                            })
                                        } else {
                                            this.showTooltip()
                                        }
                                    }}
                                />
                            </div>
                        </Tooltip>

                    :
                        this.state.value
                    }

                </div>
            </TableCell>
        )
    }
}