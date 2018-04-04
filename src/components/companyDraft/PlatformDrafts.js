import React, { Component, Fragment } from 'react';
import { CardPageLayout, BasicButton, Checkbox, ErrorWrapper, Table, LoadingSection, Link } from '../displayComponents';
import { graphql, compose, withApollo } from 'react-apollo';
import { platformDrafts, cloneDrafts } from '../../queries';
import { TableCell, TableRow } from "material-ui/Table";
import FontAwesome from 'react-fontawesome';
import { getSecondary } from '../../styles/colors';
import withSharedProps from '../../HOCs/withSharedProps';
import { withRouter } from 'react-router-dom';
import PlatformDraftDetails from './PlatformDraftDetails';

class PlatformDrafts extends Component {

    constructor(props){
        super(props);
        this.state = {
            selectedIndex: -1,
            selectedValues: []
        }
    }

    componentDidMount(){
        this.props.data.refetch();
    }

    alreadySaved = (id) => {
        const { companyDrafts } = this.props.data;
        const item = companyDrafts.find((draft) => draft.draftId === id);
        return !!item;
    }

    cloneDrafts = async () => {
        const { selectedValues } = this.state;

        if(selectedValues.length > 0){
            const response = await this.props.cloneDrafts({
                variables: {
                    ids: selectedValues,
                    companyId: this.props.company.id
                }
            });
            if(response){
                this.props.data.refetch();
            }
        }
    } 

    updateSelectedValues = (id, selected) => {
        let values = this.state.selectedValues;
        if(selected){
            values.push(id);
        }else{
            values = values.filter(value => value !== id);
        }

        this.setState({
            selectedValues: values
        });
    }

    render(){
        const { translate } = this.props;
        const { loading, error, companyDrafts, corporationDrafts, draftTypes } = this.props.data;
        const { selectedIndex } = this.state;

        return (
            <CardPageLayout title={translate.drafts}>
                {loading ? (
                    <LoadingSection />
                ) : (
                    selectedIndex >= 0 ?
                        <PlatformDraftDetails
                            close={() => this.setState({selectedIndex: -1})}
                            draft={corporationDrafts[selectedIndex]}
                            translate={translate}
                        />
                    :
                        <Fragment>
                            {error ? (
                                <div>
                                    {error.graphQLErrors.map(error => {
                                        return (
                                            <ErrorWrapper
                                                error={error}
                                                translate={translate}
                                            />
                                        );
                                    })}
                                </div>
                            ) : companyDrafts.length > 0 ? (
                                <Fragment>
                                    <div onClick={() => this.cloneDrafts()} style={{cursor: 'pointer'}}>CLONAR</div>
                                    <Table
                                        headers={[
                                            { name: ''},                                            
                                            { name: ''},
                                            { name: translate.name },
                                            { name: translate.type }
                                        ]}
                                        action={this._renderDeleteIcon}
                                        companyID={this.props.company.id}
                                    >
                                        {corporationDrafts.map((draft, index) => {
                                            return (
                                                <TableRow key={`draft${draft.id}`}>
                                                    <TableCell>
                                                        <Checkbox
                                                            onChange={(event, isInputChecked) => this.updateSelectedValues(draft.id, isInputChecked)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {this.alreadySaved(draft.id) &&
                                                            <FontAwesome
                                                                name={'save'}
                                                                style={{cursor: 'pointer', fontSize: '2em', color: getSecondary()}}
                                                            />
                                                        }
                                                    </TableCell>
                                                    <TableCell style={{cursor: 'pointer'}} onClick={() => this.setState({selectedIndex: index})}>
                                                        {draft.title}
                                                    </TableCell>
                                                    <TableCell>
                                                        {translate[draftTypes[draft.type].label]}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </Table>
                                </Fragment>
                            ) : (
                                <span>{translate.no_results}</span>
                            )}
                        </Fragment> 
                )}
            </CardPageLayout>
        );
    }
}

export default withSharedProps()(
    compose(
        graphql(platformDrafts, {
            options: props => ({
                variables: {
                    companyId: props.company.id
                },
                notifyOnNetworkStatusChange: true
            })
        }),
        graphql(cloneDrafts, {
            name: 'cloneDrafts'
        })
)(withRouter(withApollo(PlatformDrafts))));