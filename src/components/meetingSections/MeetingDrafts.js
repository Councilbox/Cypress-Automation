import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { councils } from '../../queries.js';
import { graphql, compose } from 'react-apollo';
import { LoadingSection, DateWrapper, AlertConfirm, SectionTitle, Table, DeleteIcon } from '../displayComponents';
import gql from 'graphql-tag';
import { urlParser } from '../../utils';
import { getPrimary } from '../../styles/colors';
import { TableRow, TableCell } from 'material-ui/Table';


class MeetingDrafts extends Component {

    constructor(props){
        super(props);
        this.state = {
            meetingToDelete: '',
            deleteModal: false
        }
    }

    openDeleteModal = (councilID) => {
        this.setState({
            deleteModal: true,
            meetingToDelete: councilID
        })
    }

    _renderDeleteIcon(councilID) {
        return(
            <DeleteIcon
                style={{color: getPrimary()}}
                onClick={() => this.openDeleteModal(councilID)}
            />
        );
    }

    render(){
        const { translate } = this.props;

        return(
            <div style={{height: '10em', padding: '2em'}}>
                <SectionTitle
                    icon="pencil-square-o"
                    title={translate.companies_draft}
                    subtitle={translate.companies_draft_desc}
                />
                    <Fragment>
                        Meetings
                        <AlertConfirm 
                            title={translate.send_to_trash}
                            bodyText={translate.send_to_trash_desc}
                            open={this.state.deleteModal}
                            buttonAccept={translate.send_to_trash}
                            buttonCancel={translate.cancel}
                            modal={true}
                            acceptAction={this.deleteCouncil}
                            requestClose={() => this.setState({ deleteModal: false})}
                        />
                    </Fragment>
                }
            </div>
        );
    }

}

const submitRepository = gql `
  mutation UpdateCouncil( $data: String) {
    updateCouncil( data: $data)
  }
`;

export default MeetingDrafts;