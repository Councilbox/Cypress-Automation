import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { LoadingSection, TextInput, ButtonIcon, SelectInput, BasicButton, Icon, Link } from '../../../displayComponents';
import CompanyItem from './CompanyItem';
import { MenuItem } from 'material-ui';
import NewCompanyPage from '../../company/new/NewCompanyPage';
import withTranslations from '../../../HOCs/withTranslations';
import { getSecondary } from '../../../styles/colors';

const DEFAULT_OPTIONS = {
    limit: 10,
    offset: 0,
    orderBy: 'id',
    orderDirection: 'DESC'
}

class CompaniesDashboard extends React.PureComponent {
    state = {
        filterText: '',
        limit: DEFAULT_OPTIONS.limit,
        addCompany: false
    }

    timeout = null;

    updateFilterText = (text) => {
        this.setState({
            filterText: text
        }, () => {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => this.refresh(), 450);
        });
    }

    updateLimit = (value) => {
        this.setState({
            limit: value
        }, () => this.refresh());
    }

    refresh = () => {
        let variables = {
            options: DEFAULT_OPTIONS
        };
        variables.options.limit = this.state.limit;
        variables.filters = [{field: 'businessName', text: this.state.filterText}];
        this.props.data.refetch(variables);
    }

    render(){

        if(this.state.addCompany){
            return <NewCompanyPage />
        }

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
                        </SelectInput>
                    </div>
                    <div style={{width: '600px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                        <div>
                            <BasicButton
                                text={this.props.translate.companies_add}
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
                        this.props.data.corporationCompanies.list.map(company => (
                            <Link to={`/companies/edit/${company.id}`} key={`company_${company.id}`}>
                                <CompanyItem
                                    key={`company_${company.id}`}
                                    company={company}
                                />
                            </Link>
                        ))
                    }
                </div>
            </div>
        )
    }
}

const corporationCompanies = gql`
    query corporationCompanies($filters: [FilterInput], $options: OptionsInput){
        corporationCompanies(filters: $filters, options: $options){
            list{
                id
                businessName
                logo
            }
            total
        }
    }
`;

export default graphql(corporationCompanies, {
    options: props => ({
        variables: {
            options: DEFAULT_OPTIONS
        }
    })
})(withTranslations()(CompaniesDashboard));