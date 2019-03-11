import React from 'react';
import { AlertConfirm, SelectInput, Grid, GridItem, MajorityInput } from '../../../displayComponents';
import { filterAgendaVotingTypes, hasVotation, majorityNeedsInput } from '../../../utils/CBX';
import { checkValidMajority } from '../../../utils/validation';
import { MenuItem } from 'material-ui';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { updateAgenda } from "../../../queries/agenda";

class PointEditorLive extends React.Component {

    state = {
        id: this.props.agenda.id,
        councilId: this.props.council.id,
        subjectType: this.props.agenda.subjectType,
        majorityType: this.props.agenda.majorityType,
        majority: this.props.agenda.majority,
        majorityDivider: this.props.agenda.majorityDivider
    }

    updateState = object => {
        this.setState({
            ...object,
            majorityError: ''
        });
    }

    updateAgenda = async () => {
        const majorityCheckResult = checkValidMajority(this.state.majority, this.state.majorityDivider, this.state.majorityType);
        if(majorityCheckResult.error){
            this.setState({
                majorityError: majorityCheckResult.message
            });
            return;
        }
        const { majorityError, items, ballots, options, ...agenda } = this.state;
        const response = await this.props.updateAgenda({
            variables: {
                agenda: agenda
            }
        })

        this.props.refetch();
        this.props.requestClose();
    }

    _renderModalBody = () => {
        const filteredTypes = filterAgendaVotingTypes(this.props.votingTypes, this.props.council.statute, this.props.council);
        const { translate, agenda } = this.props;

        return (
            <React.Fragment>
                <SelectInput
                    floatingText={this.props.translate.type}
                    value={"" + this.state.subjectType}
                    onChange={event => this.updateState({subjectType: +event.target.value})}
                >
                    {filteredTypes.map(voting => {
                        return (
                            <MenuItem
                                value={"" + voting.value}
                                key={`voting${voting.value}`}
                            >
                                {this.props.translate[voting.label]}
                            </MenuItem>
                        );
                    })}
                </SelectInput>
                {hasVotation(this.state.subjectType) && (
                    <Grid>
                        <GridItem xs={6} lg={3} md={3}>
                            <SelectInput
                                floatingText={translate.majority_label}
                                value={''+this.state.majorityType}
                                //errorText={errors.majorityType}
                                onChange={event =>
                                    this.updateState({
                                        majorityType: +event.target.value
                                    })
                                }
                                required
                            >
                                {this.props.majorityTypes.map(majority => {
                                    return (
                                        <MenuItem
                                            value={"" + majority.value}
                                            key={`majorityType_${
                                                majority.value
                                            }`}
                                        >
                                            {translate[majority.label]}
                                        </MenuItem>
                                    );
                                })}
                            </SelectInput>
                        </GridItem>
                        <GridItem xs={6} lg={3} md={3}>
                            {majorityNeedsInput(this.state.majorityType) && (
                                <MajorityInput
                                    type={this.state.majorityType}
                                    value={this.state.majority}
                                    //majorityError={!!this.state.majorityError}
                                    //dividerError={!!this.state.majorityError}
                                    divider={this.state.majorityDivider}
                                    onChange={value =>
                                        this.updateState({
                                            majority: +value
                                        })
                                    }
                                    onChangeDivider={value =>
                                        this.updateState({
                                            majorityDivider: +value
                                        })
                                    }
                                />
                            )}
                        </GridItem>
                        {this.state.majorityError &&
                            <div>
                                <span style={{color: 'red'}}>{this.state.majorityError}</span>
                            </div>
                        }
                    </Grid>
                )}

            </React.Fragment>
        )
    }

    render() {
        const { translate } = this.props;

        return(
            <AlertConfirm
                open={this.props.open}
                requestClose={this.props.requestClose}
                bodyText={this._renderModalBody()}
                title={translate.edit}
                buttonAccept={translate.save}
                buttonCancel={translate.cancel}
                acceptAction={this.updateAgenda}
                cancelAction={this.props.requestClose}
            />
        )
    }
}



export default graphql(updateAgenda, {
    name: 'updateAgenda'
})(PointEditorLive);