import React from 'react';
import { CardPageLayout, LoadingSection, Table, DeleteIcon, DateWrapper, AlertConfirm } from '../displayComponents';
import { graphql, compose } from 'react-apollo';
import { censuses, deleteCensus, setDefaultCensus } from '../../queries';
import { TableRow, TableCell } from 'material-ui/Table';
import FontAwesome from 'react-fontawesome';
import { getPrimary } from '../../styles/colors';
import CloneCensusModal from './CloneCensusModal';
import AddCensusButton from './AddCensusButton';
import { bHistory } from '../../containers/App';

class CompanyCensusPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            deleteModal: false,
            cloneModal: false,
            cloneIndex: 0
        }
    }

    deleteCensus = async (censusId) => {
        this.props.data.loading = true;
        const response = await this.props.deleteCensus({
            variables: {
                censusId: this.state.deleteCensus
            }
        })
        if(response){
            this.setState({
                deleteModal: false,
                deleteCensus: -1
            });
            this.props.data.refetch();
        }
    }

    setDefaultCensus = async (censusId) => {
        this.setState({
            changingDefault: censusId
        })
        const response = await this.props.setDefaultCensus({
            variables: {
                censusId: censusId
            }
        })
        if(response){
            this.setState({
                changingDefault: -1
            });
            this.props.data.refetch();
        }  
    }

    openCensusEdit = (censusId) => {
        bHistory.push(`/company/${this.props.company.id}/census/${censusId}`);
    }

    render(){
        const { translate, company } = this.props;
        const { loading, censuses } = this.props.data;
        const primary = getPrimary();

        return(
            <CardPageLayout title={translate.censuses_list}>
                <AddCensusButton
                    translate={translate}      
                    company={company}
                    refetch={this.props.data.refetch}  
                />
                {loading?
                    <LoadingSection />

                :
                    <Table
                        headers={[
                            {name: translate.name},
                            {name: translate.creation_date},
                            {name: translate.last_edit},                 
                            {name: ''},                 
                        ]}
                        action={this._renderDeleteIcon}
                    >
                        {censuses.map((census, index) => {
                            return(
                                <TableRow                         
                                    key={`census_${census.id}`}
                                    onClick={() => this.openCensusEdit(census.id)}
                                    style={{cursor: 'pointer'}}
                                >
                                    <TableCell>{census.censusName}</TableCell>
                                    <TableCell><DateWrapper format="DD/MM/YYYY HH:mm" date={census.creationDate} /></TableCell>
                                    <TableCell><DateWrapper format="DD/MM/YYYY HH:mm" date={census.lastEdit} /></TableCell>
                                    <TableCell>
                                        {census.id === this.state.changingDefault ?
                                            <div style={{display: 'inline-block'}}>
                                                <LoadingSection size={20} />
                                            </div>
                                        : 
                                            <FontAwesome
                                                name={census.defaultCensus === 1? 'star' : 'star-o'}
                                                style={{cursor: 'pointer', fontSize: '2em', color: primary}}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    this.setDefaultCensus(census.id)
                                                }}
                                            /> 
                                        }
                                          
                                        <CloneCensusModal
                                            translate={translate}
                                            open={this.state.cloneModal}
                                            census={censuses[this.state.cloneIndex]}
                                        >
                                            <FontAwesome 
                                                name={'clone'}
                                                style={{cursor: 'pointer', fontSize: '1.8em', marginLeft: '0.2em', color: primary}}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    this.setState({cloneModal: true, cloneIndex: index})
                                                }}
                                            />
                                        </CloneCensusModal>                                     
                                        <DeleteIcon
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                this.setState({
                                                    deleteModal: true,
                                                    deleteCensus: census.id
                                                })
                                            }}
                                            style={{color: 'red'}}
                                        />
                                    </TableCell>                  
                                </TableRow>
                            );
                        })}
                    </Table>
                }  
                <AlertConfirm 
                    title={translate.send_to_trash}
                    bodyText={translate.send_to_trash_desc}
                    open={this.state.deleteModal}
                    buttonAccept={translate.send_to_trash}
                    buttonCancel={translate.cancel}
                    modal={true}
                    acceptAction={this.deleteCensus}
                    requestClose={() => this.setState({ deleteModal: false})}
                />
            </CardPageLayout>
        );
    }
}

export default compose(
    graphql(censuses, {
        name: "data",
        options: (props) => ({
            variables: {
                companyId: props.company.id
            }
        })
    }),
    graphql(deleteCensus, {
        name: 'deleteCensus'
    }),
    graphql(setDefaultCensus, {
        name: 'setDefaultCensus'
    })
)(CompanyCensusPage);