import React from 'react'
import { CardPageLayout, EnhancedTable, LoadingSection, CloseIcon } from '../../displayComponents';
import { TableRow, TableCell } from 'material-ui';
import withTranslations from '../../HOCs/withTranslations';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

class PartnersBookPage extends React.PureComponent {

    render(){

        const { translate } = this.props;

        if(this.props.data.loading){
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
			}
		];
        
        return(
            <CardPageLayout title={this.props.translate.simple_book}>
                {!!this.props.data.bookParticipants?
                    this.props.data.bookParticipants.list.length > 0?
                        <EnhancedTable
                            ref={table => (this.table = table)}
                            translate={translate}
                            defaultLimit={10}
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
                                        <React.Fragment
                                            key={`participant${participant.id}`}
                                        >
                                            <HoverableRow
                                                participant={participant}
                                            />
                                        </React.Fragment>
                                    );
                                }
                            )}
                        </EnhancedTable>
                    :
                        translate.no_results
                :
                    <LoadingSection />
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
                onClick={() =>
                    this.setState({
                        editingParticipant: true,
                        participant: participant
                    })
                }
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
                    <div style={{width: '3em'}}>
                        {this.state.showActions &&
                            <CloseIcon />
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

export default graphql(bookParticipants, {
    options: props => ({
        variables: {
            companyId: props.match.params.company
        }
    })
})(withTranslations()(withRouter(PartnersBookPage)));