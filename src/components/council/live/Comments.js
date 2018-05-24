import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { CollapsibleSection, Icon, LoadingSection } from '../../../displayComponents';
import { darkGrey } from '../../../styles/colors';
import { agendaVotings } from '../../../queries/agenda';
import { LIVE_COLLAPSIBLE_HEIGHT } from '../../../styles/constants';


class CommentsSection extends Component {

    _button = () => {
        const { translate, council } = this.props;

        return (<div style={{
            height: LIVE_COLLAPSIBLE_HEIGHT,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div style={{
                width: '25%',
                height: LIVE_COLLAPSIBLE_HEIGHT,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '1.5em'
            }}>
                <Icon className="material-icons" style={{ color: 'grey' }}>assignment</Icon>
                <span style={{
                    marginLeft: '0.7em',
                    color: darkGrey,
                    fontWeight: '700'
                }}>
                        {council.statute.existsAct ? translate.act_comments : translate.council_comments}
                    </span>
            </div>
            <div style={{
                width: '25%',
                display: 'flex',
                justifyContent: 'flex-end',
                paddingRight: '2em'
            }}>
                <Icon className="material-icons" style={{ color: 'grey' }}>keyboard_arrow_down</Icon>
            </div>
        </div>)
    };
    _section = () => {
        if (this.props.data.loading) {
            return (<LoadingSection/>);
        }


        return (<div style={{
            width: '100%',
            padding: '2em'
        }}>
            {this.props.data.agendaVotings.list.map((voting) => {
                if (voting.comment) {
                    return (<div key={`voting_${voting.author.email}`} style={{
                        paddingBottom: '0.5em',
                        borderBottom: '1px solid black'
                    }}>
                        {voting.comment}<br/>
                        {`${voting.author.name} - ${voting.author.position}`}
                    </div>)
                }
            })}
        </div>);
    };

    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }

    render() {

        return (<div
            style={{
                width: '100%',
                backgroundColor: 'lightgrey',
                position: 'relative'
            }}
        >
            <CollapsibleSection trigger={this._button} collapse={this._section}/>
        </div>);
    }
}

export default graphql(agendaVotings, {
    options: (props) => ({
        variables: {
            agendaId: props.agenda.id,
            options: {
                limit: 10,
                offset: 0
            }
        },
        pollInterval: 4000
    })
})(CommentsSection);