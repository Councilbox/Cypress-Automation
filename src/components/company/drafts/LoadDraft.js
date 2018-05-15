import React from 'react';
import { EnhancedTable } from "../../../displayComponents/index";
import { graphql } from 'react-apollo';

import { companyDrafts } from '../../../queries/companyDrafts';
import { DRAFTS_LIMITS } from '../../../constants';
import { TableRow, TableCell } from 'material-ui/Table';

class LoadDraft extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            loadDraft: false
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps.councilType.statuteId !== this.props.councilType.statuteId){
            this.props.data.refetch();
        }
    }

    render(){
        const { translate, statutes, statute } = this.props;
        const { companyDrafts, loading } = this.props.data;

        // if (!!statute){
        //     for (let i = 0; i < statutes.length; i++) {
        //         const loadingElement = loading[ i ];
        //
        //     }
        // }

        return(
            <React.Fragment>
                {!!companyDrafts &&
                <EnhancedTable
                    translate={translate}
                    defaultLimit={DRAFTS_LIMITS[0]}
                    defaultFilter={'title'}
                    limits={DRAFTS_LIMITS}
                    page={1}
                    loading={loading}
                    length={companyDrafts.list.length}
                    total={companyDrafts.total}
                    addedFilters={[
                        {field: 'type', text: this.props.draftType}
                    ]}
                    refetch={this.props.data.refetch}
                    action={this._renderDeleteIcon}
                    selectedCategory={{
                        field: 'statuteId',
                        value: '',
                        label: translate.all_plural
                    }}
                    categories={statutes.map(statute => {return({
                        field: 'statuteId',
                        value: statute.id,
                        label: translate[statute.title] || statute.title
                    })})}
                    headers={[
                        {
                            text: translate.title,
                            name: 'title'
                        },
                        {
                            text: translate.type,
                            name: 'type'
                        }
                    ]}
                >
                    {companyDrafts.list.map((draft) => {
                        return(
                            <TableRow
                                key={`draft${draft.id}`}
                                style={{cursor: 'pointer'}}
                                onClick={() => {
                                    this.props.loadDraft(draft);
                                    this.setState({
                                        loadDraft: false
                                    })
                                }}
                            >
                                <TableCell>{draft.title}</TableCell>
                                <TableCell>{draft.type}</TableCell>
                            </TableRow>
                        )
                    })}
                </EnhancedTable>
                }
            </React.Fragment>
        );
    }
}

export default graphql(companyDrafts, {
    options: (props) => ({
        variables: {
            companyId: props.companyId,
            filters: [
                {field: 'type', text: props.draftType},
                {field: 'statuteId', text: props.councilType.statuteId}
            ],
            options: {
                limit: DRAFTS_LIMITS[0],
                offset: 0
            }
        }
    })
})(LoadDraft);