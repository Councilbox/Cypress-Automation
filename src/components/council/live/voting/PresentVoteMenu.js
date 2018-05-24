import React from 'react';
import { getSecondary } from '../../../../styles/colors';
import { VOTE_VALUES } from '../../../../constants';
import VotingValueIcon from './VotingValueIcon';
import { graphql } from 'react-apollo';
import { updateAgendaVoting } from '../../../../queries/agenda';

class PresentVoteMenu extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            loading: false
        }
    }

    updateAgendaVoting = async (value) => {
        const { author, __typename, ...agendaVoting } = this.props.agendaVoting;
        const response = await this.props.updateAgendaVoting({
            variables: {
                agendaVoting: {
                    ...agendaVoting,
                    vote: value
                }
            }
        });

        console.log(response);
        this.props.refetch();
    }

    _block = (value) => {
        return (
            <div
                style={{
                    height: '1.5em',
                    marginRight: '0.2em',
                    width: '1.5em',
                    border: `2px solid ${'grey'}`,
                    borderRadius: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'}}

                    onClick={() => this.updateAgendaVoting(value)}
                >
                <VotingValueIcon vote={value} color={'grey'} />
            </div>
        )
    }

    render(){
        return(
            <div style={{display: 'flex', flexDirection: 'row', marginRight: '0.7em'}}>
                {this._block(VOTE_VALUES.POSITIVE)}
                {this._block(VOTE_VALUES.NEGATIVE)}
                {this._block(VOTE_VALUES.ABSTENTION)}
            </div>
        );
    }
}

export default graphql(updateAgendaVoting, {
    name: 'updateAgendaVoting'
})(PresentVoteMenu);