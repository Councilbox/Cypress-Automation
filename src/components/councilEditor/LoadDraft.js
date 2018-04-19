import React from 'react';
import { BasicButton, EnhancedTable, ButtonIcon } from "../displayComponents";
import { graphql } from 'react-apollo';
import { companyDrafts } from '../../queries/companyDrafts';
import { getPrimary } from '../../styles/colors';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import { DRAFTS_LIMITS } from '../../constants';
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
        const { translate, statutes, councilType } = this.props;
        const { companyDrafts, loading } = this.props.data;

        return(
            <React.Fragment>
                <BasicButton
                    text={translate.load_draft}
                    color={getPrimary()}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    textPosition="after"
                    onClick={() => this.setState({loadDraft: true})}
                    icon={<ButtonIcon type="save" color="white" />}
                />
                <Dialog
                    open={this.state.loadDraft}
                    maxWidth={false}
                    onClose={() => this.setState({loadDraft: false})}
                >
                    <DialogTitle>
                        {translate.new_location_of_celebrate}
                    </DialogTitle>
                    <DialogContent style={{width: '800px'}}>
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
                                                this.props.loadDraft(draft)
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
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        );
    }
}

export default graphql(companyDrafts, {
    options: (props) => ({
        variables: {
            companyId: props.company.id,
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