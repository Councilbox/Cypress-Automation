import React, { Component, Fragment } from 'react';
import { councils, deleteCouncil } from '../../../queries.js';
import { graphql, compose } from 'react-apollo';
import withSharedProps from '../../../HOCs/withSharedProps';
import {
    LoadingSection, DateWrapper, AlertConfirm, SectionTitle, Table, ErrorWrapper, CloseIcon
} from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import { TableRow, TableCell } from 'material-ui/Table';
import Scrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import TableStyles from '../../../styles/table';
import { bHistory } from "../../../containers/App";


class CouncilDrafts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            councilToDelete: '',
            deleteModal: false
        }
    }

    componentDidMount() {
        this.props.data.refetch();
    }

    openDeleteModal = (councilID) => {
        this.setState({
            deleteModal: true,
            councilToDelete: councilID
        })
    };

    deleteCouncil = async () => {
        this.props.data.loading = true;
        const response = await this.props.mutate({
            variables: {
                councilId: this.state.councilToDelete
            }
        });
        if (response) {
            this.setState({
                deleteModal: false
            });
            this.props.data.refetch();
        }
    };

    _renderDeleteIcon(councilID) {
        const primary = getPrimary();

        return (<CloseIcon
            style={{ color: primary }}
            onClick={(event) => {
                this.openDeleteModal(councilID);
                event.stopPropagation();
            }}
        />);
    }

    render() {
        const { translate } = this.props;
        const { loading, councils, error } = this.props.data;
        return (<div style={{
            height: '100%',
            overflow: 'hidden',
            position: 'relative'
        }}>
            <Scrollbar>
                <div style={{ padding: '2em' }}>
                    <SectionTitle
                        icon="pencil-square-o"
                        title={translate.companies_draft}
                        subtitle={translate.companies_draft_desc}
                    />
                    {loading ?

                        <LoadingSection/>

                        :

                        <Fragment>
                            {error ?

                                <div>
                                    {error.graphQLErrors.map((error) => {
                                        return <ErrorWrapper error={error} translate={translate}/>
                                    })}
                                </div> : councils.length > 0 ?

                                    <Table
                                        headers={[ { name: translate.date_real_start }, { name: translate.name }, { name: translate.delete } ]}
                                        action={this._renderDeleteIcon}
                                        companyID={this.props.company.id}
                                    >
                                        {councils.map((council) => {
                                            return (<TableRow hover style={TableStyles.ROW}
                                                              key={`council${council.id}`}
                                                              onClick={() => {
                                                                  bHistory.push(`/company/${this.props.company.id}/council/${council.id}`)
                                                              }}
                                            >
                                                <TableCell style={TableStyles.TD}>
                                                    <DateWrapper format="DD/MM/YYYY HH:mm" date={council.dateStart}/>
                                                </TableCell>
                                                <TableCell style={{
                                                    ...TableStyles.TD,
                                                    width: '65%'
                                                }}>
                                                    {council.name || translate.dashboard_new}
                                                </TableCell>
                                                <TableCell style={TableStyles.TD}>
                                                    {this._renderDeleteIcon(council.id)}
                                                </TableCell>
                                            </TableRow>)
                                        })}
                                    </Table>

                                    :

                                    <span>{translate.no_results}</span>}
                            <AlertConfirm
                                title={translate.send_to_trash}
                                bodyText={translate.send_to_trash_desc}
                                open={this.state.deleteModal}
                                buttonAccept={translate.send_to_trash}
                                buttonCancel={translate.cancel}
                                modal={true}
                                acceptAction={this.deleteCouncil}
                                requestClose={() => this.setState({ deleteModal: false })}
                            />
                        </Fragment>}
                </div>
            </Scrollbar>
        </div>);
    }

}


export default withSharedProps()(compose(graphql(deleteCouncil), graphql(councils, {
    name: "data",
    options: (props) => ({
        variables: {
            state: [ 0 ],
            companyId: props.company.id,
            isMeeting: false,
            active: 1
        }
    })
}))(CouncilDrafts));