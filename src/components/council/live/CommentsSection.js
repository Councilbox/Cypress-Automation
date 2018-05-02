import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { CollapsibleSection, LoadingSection, Icon } from '../../../displayComponents';
import { darkGrey } from '../../../styles/colors';
import { agendaComments } from '../../../queries';

class CommentsSection extends Component {

    constructor(props){
        super(props);
        this.state = {
            open: false
        }
    }

    _button = () => {
        const { translate, council } = this.props;

        return(
            <div style={{height: '3em', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{width: '25%', height: '3em', display: 'flex', alignItems: 'center', paddingLeft: '1.5em'}}>
                    <Icon className="material-icons" style={{color: 'grey'}}>assignment</Icon>
                    <span style={{marginLeft: '0.7em', color: darkGrey, fontWeight: '700'}}>
                        {council.statute.existsAct? translate.act_comments : translate.council_comments}
                    </span>
                </div>
                <div style={{width: '25%', display: 'flex', justifyContent: 'flex-end', paddingRight: '2em'}}>
                    <Icon className="material-icons" style={{color: 'grey'}}>keyboard_arrow_down</Icon>
                </div>
            </div>
        )
    }

    _section = () => {
        //const comments = this.props.data.agendaVotings;
        if(this.props.data.loading){
            return(
                <LoadingSection />
            )
        }

        return(
            <div style={{width: '100%', padding: '2em'}}>
                {/*comments.map((comment) => {
                    return(
                        <div key={`comment${comment.email}`} style={{paddingBottom: '0.5em', borderBottom: '1px solid black'}}>
                            {comment.comment}<br />
                            {`${comment.name} ${comment.surname} - ${comment.position}`}
                        </div>
                    )
                })*/}
            </div>
        );
    }

    render(){

        return(
            <div
                style={{
                    width: '100%',
                    backgroundColor: 'lightgrey',
                    position: 'relative'
                }}
            >
                <CollapsibleSection trigger={this._button} collapse={this._section} />
            </div>
        );
    }
}

export default graphql(agendaComments, {
    options: (props) => ({
        variables: {
            agendaId: props.agenda.id
        }
    })
})(CommentsSection);