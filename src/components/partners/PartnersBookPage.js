import React from 'react'
import { CardPageLayout, EnhancedTable, LoadingSection, CloseIcon, BasicButton } from '../../displayComponents';
import { TableRow, TableCell } from 'material-ui';
import { bHistory } from '../../containers/App';
import { getPrimary } from '../../styles/colors';
import withTranslations from '../../HOCs/withTranslations';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

class PartnersBookPage extends React.Component {

    componentDidMount() {
        this.props.data.refetch();
    }

    addPartner = () => {
        bHistory.push(`/company/${this.props.match.params.company}/book/new`);
    }

    deleteBookParticipant = async id => {
        const response = await this.props.mutate({
			variables: {
				participantId: id
			}
		});

		if (response) {
            this.props.data.refetch();
		}
    }

    render() {

        const { translate } = this.props;
        const primary = getPrimary();

        if (!this.props.data.bookParticipants) {
            return <LoadingSection />;
        }

        let headers = [
            {
                text: translate.participant_data,
                name: "fullName",
                canOrder: true
            },
            {
                text: translate.dni,
                name: "dni",
                canOrder: true
            },
            {
                text: translate.position,
                name: "position",
                canOrder: true
            },
            {
                text: '',
                name: '',
                canOrder: false
            }
        ];

        return (
            <CardPageLayout title={this.props.translate.simple_book}>
                {this.props.data.bookParticipants.list.length > 0 ?
                        <EnhancedTable
                            ref={table => (this.table = table)}
                            translate={translate}
                            defaultLimit={10}
                            menuButtons={
                                <div style={{ marginRight: '0.9em' }}>
                                    <BasicButton
                                        text={this.props.translate.add_partner}
                                        onClick={this.addPartner}
                                        color={'white'}
                                        buttonStyle={{ border: `2px solid ${primary}` }}
                                        textStyle={{ color: primary, textTransform: 'none', fontWeight: '700' }}
                                    />
                                </div>
                            }
                            defaultFilter={"fullName"}
                            defaultOrder={["fullName", "asc"]}
                            limits={[10, 20]}
                            page={1}
                            loading={this.props.data.loading}
                            length={this.props.data.bookParticipants.list.length}
                            total={this.props.data.bookParticipants.total}
                            refetch={this.props.data.refetch}
                            fields={[
                                {
                                    value: "fullName",
                                    translation: translate.participant_data
                                },
                                {
                                    value: "dni",
                                    translation: translate.dni
                                },
                                {
                                    value: "position",
                                    translation: translate.position
                                }
                            ]}
                            headers={headers}
                        >
                            {this.props.data.bookParticipants.list.map(
                                (participant, index) => {
                                    return (
                                        <HoverableRow
                                            key={`participant${participant.id}`}
                                            deleteBookParticipant={this.deleteBookParticipant}
                                            participant={participant}
                                            companyId={this.props.match.params.company}
                                        />
                                    );
                                }
                            )}
                        </EnhancedTable>
                        :
                        translate.no_results
                }
            </CardPageLayout>
        )
    }
}

class HoverableRow extends React.PureComponent {

    state = {
        showActions: false
    }

    mouseEnterHandler = () => {
        this.setState({
            showActions: true
        })
    }

    mouseLeaveHandler = () => {
        this.setState({
            showActions: false
        })
    }


    render() {
        const { participant } = this.props;

        return (
            <TableRow
                hover={true}
                onMouseEnter={this.mouseEnterHandler}
                onMouseLeave={this.mouseLeaveHandler}
                onClick={() => bHistory.push(`/company/${this.props.companyId}/book/${participant.id}`)}
                style={{
                    cursor: "pointer",
                    fontSize: "0.5em"
                }}
            >
                <TableCell>
                    {`${participant.name} ${participant.surname}`}
                </TableCell>
                <TableCell>
                    {`${participant.dni}`}
                </TableCell>
                <TableCell>
                    {`${participant.position}`}
                </TableCell>
                <TableCell>
                    <div style={{ width: '3em' }}>
                        {this.state.showActions &&
                            <CloseIcon onClick={event => {
                                event.stopPropagation();
                                this.props.deleteBookParticipant(participant.id);
                            }}/>
                        }
                    </div>
                </TableCell>
            </TableRow>
        )
    }
}

const bookParticipants = gql`
    query BookParticipants($companyId: Int!){
        bookParticipants(companyId: $companyId){
            list {
                name
                id
                dni
                position
                surname
            }
            total
        }
    }
`;
const deleteBookParticipant = gql`
    mutation deleteBookParticipant($participantId: Int!){
        deleteBookParticipant(participantId: $participantId){
            success
            message
        }
    }
`;

export default compose(
    graphql(bookParticipants, {
    options: props => ({
        variables: {
            companyId: props.match.params.company
        },
        notifyOnNetworkStatusChange: true
    })
}),
graphql(deleteBookParticipant)
)(withTranslations()(withRouter(PartnersBookPage)));