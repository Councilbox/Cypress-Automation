import React from 'react';
import { CardPageLayout, LoadingSection, Table, DeleteIcon, DateWrapper, AlertConfirm, TextInput, Grid, GridItem, SelectInput } from '../displayComponents';
import { graphql, compose } from 'react-apollo';
import { censuses, deleteCensus, setDefaultCensus } from '../../queries';
import { TableRow, TableCell } from 'material-ui/Table';
import { MenuItem } from 'material-ui';
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
            cloneIndex: 0,
            censusName: '',
            limit: 1,
            page: 1,
            orderBy: '',
            orderDirection: 'asc'
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


    filterByCensusName = async (censusName) => {
        if(!!censusName){
            this.setState({
                censusName: censusName
            });
            this.props.data.refetch({
                companyId: this.props.company.id,
                filters: {
                    censusName: censusName
                }
            });
        }
    }

    changeLimit = async (limit) => {
        if(!!limit){
            let variables = {
                companyId: this.props.company.id,
                options: {
                    limit: limit
                }
            }
            if(!!this.state.censusName){
                variables = {
                    ...variables,
                    filters: {
                        censusName: this.state.censusName
                    }
                }
            }
            this.props.data.refetch(variables);
            this.setState({
                limit: limit
            });
        }
    }

    changePage = (page) => {
        if(!!page){
            let variables = {
                companyId: this.props.company.id,
                options: {
                    limit: this.state.limit,
                    offset: this.state.limit * (page - 1)
                }
            }
            if(!!this.state.censusName){
                variables = {
                    ...variables,
                    filters: {
                        censusName: this.state.censusName
                    }
                }
            }
            this.props.data.refetch(variables);
            this.setState({
                page: page
            });
        }
    }

    orderBy = async (field) => {
        const { orderBy } = this.state;
        let direction = 'asc';
        
        if(field === orderBy){
            direction = this.state.orderDirection === 'asc'? 'desc' : 'asc';
        }

        let variables = {
            companyId: this.props.company.id,
            options: {
                limit: this.state.limit,
                orderBy: field,
                orderDirection: direction,
                offset: 0
            }
        }
        if(!!this.state.censusName){
            variables = {
                ...variables,
                filters: {
                    censusName: this.state.censusName
                }
            }
        }
        this.props.data.refetch(variables);
        this.setState({
            orderBy: field,
            orderDirection: direction
        });

    }

    render(){
        const { translate, company } = this.props;
        const { loading, censuses } = this.props.data;
        const primary = getPrimary();

        return(
            <CardPageLayout title={translate.censuses_list}>
                <Grid>
                    <GridItem xs={6} lg={3} md={3}>
                        <AddCensusButton
                            translate={translate}      
                            company={company}
                            refetch={this.props.data.refetch}  
                        />
                    </GridItem>
                    <GridItem xs={2} lg={2} md={2}>
                        <TextInput
                            floatingText={translate.find}
                            type="text"
                            onChange={(event) => {
                                this.filterByCensusName(event.target.value)
                            }}
                        />
                    </GridItem>
                    <GridItem xs={3} lg={3} md={3}>
                        <SelectInput
                            onChange={(event) => this.changeLimit(event.target.value)}
                            value={this.state.limit}
                        >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>    
                            <MenuItem value={3}>3</MenuItem>    
                        </SelectInput>
                    </GridItem>
                    <GridItem xs={3} lg={3} md={3}>
                        <SelectInput
                            onChange={(event) => this.changePage(event.target.value)}
                            value={this.state.page}
                        >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>    
                            <MenuItem value={3}>3</MenuItem>    
                        </SelectInput>
                    </GridItem>
                </Grid>

                {loading?
                    <LoadingSection />

                :
                    <Table
                        headers={[
                            {
                                name: translate.name,
                                canOrder: true,
                                order: this.state.orderDirection,
                                active: this.state.orderBy === 'censusName',
                                handler: () => this.orderBy('censusName')
                            },
                            {
                                name: translate.creation_date,
                                canOrder: true,
                                order: this.state.orderDirection,
                                active: this.state.orderBy === 'creationDate',
                                handler: () => this.orderBy('creationDate')
                            },
                            {
                                name: translate.last_edit,
                                canOrder: true,
                                order: this.state.orderDirection,
                                active: this.state.orderBy === 'lastEdit',
                                handler: () => this.orderBy('lastEdit')
                            },                 
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
                companyId: props.company.id,
                options: {
                    limit: 1,
                    offset: 0
                }
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