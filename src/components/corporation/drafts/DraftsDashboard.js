import React from 'react';
import { graphql } from 'react-apollo';
import { corporationDrafts } from "../../../queries";
import { LoadingSection, Grid, GridItem, SelectInput, TextInput, Icon, BasicButton, ButtonIcon } from '../../../displayComponents';
import { MenuItem } from 'material-ui';
import { getSecondary } from '../../../styles/colors';
import withTranslations from '../../../HOCs/withTranslations';

const DEFAULT_OPTIONS = {
    limit: 10,
    offset: 0,
    orderBy: 'id',
    orderDirection: 'DESC'
}

class DraftsDashboard extends React.PureComponent {

    state = {
        filterText: '',
        language: 'es',
        companyType: 'all',
        draftType: 'all',
        limit: DEFAULT_OPTIONS.limit
    }

    timeout = null;

    updateLimit = (value) => {
        this.setState({
            limit: value
        }, this.refresh);
    }

    updateFilterText = (text) => {
        this.setState({
            filterText: text
        }, () => {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => this.refresh(), 450);
        });
    } 


    refresh = () => {
        let variables = {
            options: {
                ...DEFAULT_OPTIONS
            }
        }

        variables.options.limit = this.state.limit;
        variables.filters = [{field: 'title', text: this.state.filterText}];

        this.props.data.refetch(variables);
    }

    render(){
        
        return(
            <div
                style={{
                    height: 'calc(100vh - 3em)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div 
                    style={{
                        marginLeft: '1.4em',
                        marginRight: '1.4em',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid gainsboro'
                    }}
                >
                    <div>
                        <SelectInput
                            value={this.state.limit}
                            onChange={event => {
                                this.updateLimit(event.target.value);
                            }}
                        >
                            <MenuItem value={10}>
                                10
                            </MenuItem>
                            <MenuItem value={20}>
                                20
                            </MenuItem>
                            <MenuItem value={100}>
                                100
                            </MenuItem>
                        </SelectInput>
                    </div>
                    <div style={{width: '600px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                        <div>
                            <BasicButton
                                text={this.props.translate.drafts_new}
                                color={getSecondary()}
                                icon={<ButtonIcon type="add" color="white" />}
                                textStyle={{textTransform: 'none', color: 'white', fontWeight: '700'}}
                                onClick={() => this.setState({
                                    addCompany: true
                                })}
                            />
                        </div>
                        <div style={{marginLeft: '0.6em'}}>
                            <TextInput
                                adornment={<Icon>search</Icon>}
                                floatingText={" "}
                                type="text"
                                value={this.state.filterText}
                                onChange={event => {
                                    this.updateFilterText(event.target.value);
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div style={{
                    height: 'calc(100vh - 6em)',
                    flexDirection: 'column',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                }}>
                    {this.props.data.loading?
                        <LoadingSection />
                    :
                        this.props.data.platformDrafts.list.map(draft => (
                            <div key={`draft_${draft.id}`}>
                                {draft.title}
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default graphql(corporationDrafts, {
    options: props => ({
        variables: {
            options: DEFAULT_OPTIONS
        }
    })
})(withTranslations()(DraftsDashboard));