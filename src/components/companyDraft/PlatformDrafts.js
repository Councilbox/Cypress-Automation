import React, { Component, Fragment } from 'react';
import { CardPageLayout, Checkbox, ErrorWrapper, EnhancedTable } from '../displayComponents';
import { graphql, compose, withApollo } from 'react-apollo';
import { platformDrafts, cloneDrafts } from '../../queries';
import { TableCell, TableRow } from "material-ui/Table";
import FontAwesome from 'react-fontawesome';
import { getSecondary } from '../../styles/colors';
import withSharedProps from '../../HOCs/withSharedProps';
import { withRouter } from 'react-router-dom';
import PlatformDraftDetails from './PlatformDraftDetails';
import { DRAFTS_LIMITS } from '../../constants';
import TableStyles from "../../styles/table";


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
        const item = companyDrafts.list.find((draft) => draft.draftId === id);
        return !!item;
    };

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
    };

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
    };

    render(){
        const { translate } = this.props;
        const { loading, error, platformDrafts, draftTypes } = this.props.data;
        const { selectedIndex } = this.state;

        return (
            <CardPageLayout title={translate.drafts}>
                {selectedIndex >= 0 ?
                    <PlatformDraftDetails
                        close={() => this.setState({selectedIndex: -1})}
                        draft={platformDrafts[selectedIndex]}
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
                        ) : !!platformDrafts &&
                            <Fragment>
                                <div onClick={() => this.cloneDrafts()} style={{cursor: 'pointer'}}>CLONAR</div>
                                <EnhancedTable
                                    translate={translate}
                                    defaultLimit={DRAFTS_LIMITS[0]}
                                    defaultFilter={'title'}
                                    defaultOrder={['title', 'asc']}
                                    limits={DRAFTS_LIMITS}
                                    page={1}
                                    loading={loading}
                                    length={platformDrafts.list.length}
                                    total={platformDrafts.total}
                                    refetch={this.props.data.refetch}
                                    headers={[
                                        { name: ''},                                            
                                        { name: ''},
                                        {
                                            name: 'title',
                                            text: translate.name,
                                            canOrder: true
                                        },
                                        {
                                            name: 'type',
                                            text: translate.type,
                                            canOrder: true
                                        }
                                    ]}
                                >
                                    {platformDrafts.list.map((draft, index) => {
                                        return (
                                            <TableRow key={`draft${draft.id}`}>
                                                <TableCell style={TableStyles.TD}>
                                                    <Checkbox
                                                        onChange={(event, isInputChecked) => this.updateSelectedValues(draft.id, isInputChecked)}
                                                    />
                                                </TableCell>
                                                <TableCell style={TableStyles.TD}>
                                                    {this.alreadySaved(draft.id) &&
                                                        <FontAwesome
                                                            name={'save'}
                                                            style={{cursor: 'pointer', fontSize: '2em', color: getSecondary()}}
                                                        />
                                                    }
                                                </TableCell>
                                                <TableCell style={TableStyles.TD} onClick={() => this.setState({selectedIndex: index})}>
                                                    {draft.title}
                                                </TableCell>
                                                <TableCell>
                                                    {translate[draftTypes[draft.type].label]}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </EnhancedTable>
                            </Fragment>
                        }
                    </Fragment> 
                }
            </CardPageLayout>
        );
    }
}

export default withSharedProps()(
    compose(
        graphql(platformDrafts, {
            options: props => ({
                variables: {
                    companyId: props.company.id,
                    options: {
                        limit: DRAFTS_LIMITS[0],
                        offset: 0
                    }
                },
                notifyOnNetworkStatusChange: true
            })
        }),
        graphql(cloneDrafts, {
            name: 'cloneDrafts'
        })
)(withRouter(withApollo(PlatformDrafts))));