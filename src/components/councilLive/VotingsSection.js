import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { CollapsibleSection, FileUploadButton, LoadingSection } from '../displayComponents';
import AttachmentList from '../councilEditor/AttachmentList';
import { FontIcon } from 'material-ui';
import { darkGrey, getPrimary, getSecondary } from '../../styles/colors';
import { urlParser } from '../../utils';
import { getVotings } from '../../queries';
import FontAwesome from 'react-fontawesome';


class VotingsSection extends Component {

    constructor(props){
        super(props);
        this.state = {
            open: false
        }
    }

    _button = () => {
        const { agenda, translate, council } = this.props;

        return(
            <div style={{height: '3em', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{width: '25%', height: '3em', display: 'flex', alignItems: 'center', paddingLeft: '1.5em'}}>
                    <FontIcon className="material-icons" color='grey'>thumbs_up_down</FontIcon>
                    <span style={{marginLeft: '0.7em', color: darkGrey, fontWeight: '700'}}>
                        {translate.voting}
                    </span>
                </div>
                <div style={{width: '25%', display: 'flex', justifyContent: 'flex-end', paddingRight: '2em'}}>
                    <FontIcon className="material-icons" color={'grey'}>keyboard_arrow_down</FontIcon>
                </div>
            </div>
        )
    }

    getIcon = (vote) => {
        const primary = getPrimary();
        
        switch (vote){
            case 0:
                return  <FontAwesome
                            name={'times'}
                            color={primary}
                            style={{margin: '0.5em', color: primary, fontSize: '1em'}}
                        />;

            case 1:
                return <FontAwesome
                            name={'check'}
                            color={primary}
                            style={{margin: '0.5em', color: 'green', fontSize: '1em'}}
                        />;

            case 2: 
                return <FontAwesome
                            name={'circle-o'}
                            color={primary}
                            style={{margin: '0.5em', color: getSecondary(), fontSize: '1em'}}
                        />;

            default:
                return <div></div>;
        }
    }

    _section = () => {
        const { agenda, translate } = this.props;
        const votes = this.props.data.getVotings;
        if(this.props.data.loading){
            return(
                <LoadingSection />
            )
        }

        return(
            <div style={{width: '100%', padding: '2em'}}>
                {votes.map((vote) => {
                    return(
                        <div key={`vote_${vote.email}`}>
                            {this.getIcon(vote.vote)}
                            {`${vote.name} ${vote.surname}`}
                        </div>
                  )
              })}
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

export default graphql(getVotings, {
    options: (props) => ({
        variables: {
            request: {
                council_id: props.council.id,
                agenda_id: props.agenda.id,
                order_by: 'name',
                direction: '+ASC',
                page: 1,
                limit: 25
            }
        }
    })
})(VotingsSection);