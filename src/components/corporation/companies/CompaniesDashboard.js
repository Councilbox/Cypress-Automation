import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { MenuItem, Table, TableCell, TableRow, TableHead, InputAdornment } from 'material-ui';
import { LoadingSection, TextInput, ButtonIcon, SelectInput, BasicButton, Link, Scrollbar } from '../../../displayComponents';
import CompanyItem from './CompanyItem';
import NewCompanyPage from '../../company/new/NewCompanyPage';
import withTranslations from '../../../HOCs/withTranslations';
import { getSecondary } from '../../../styles/colors';


const DEFAULT_OPTIONS = {
    limit: 25,
    offset: 0,
    orderBy: 'id',
    orderDirection: 'DESC'
};

class CompaniesDashboard extends React.PureComponent {
    state = {
        filterText: '',
        limit: DEFAULT_OPTIONS.limit,
        addCompany: false
    }

    timeout = null;

    updateFilterText = text => {
        this.setState({
            filterText: text
        }, () => {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => this.refresh(), 450);
        });
    }

    updateLimit = value => {
        this.setState({
            limit: value
        }, () => this.refresh());
    }

    refresh = () => {
        const variables = {
            options: DEFAULT_OPTIONS
        };
        variables.options.limit = this.state.limit;
        variables.filters = [{ field: 'businessName', text: this.state.filterText }];
        this.props.data.refetch(variables);
    }

    render() {
        if (this.state.addCompany) {
            return <NewCompanyPage />;
        }

        return (
            <div
                style={{
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        paddingLeft: '1.4em',
                        paddingRight: '1.4em',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid gainsboro'
                    }}
                >

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <div style={{ marginLeft: '0.6em' }}>
                            <TextInput
                                startAdornment={
                                    <InputAdornment position="start" style={{ marginRight: '1em' }}>
                                        <i className="fa fa-search" aria-hidden="true"></i>
                                    </InputAdornment>
                                }
                                floatingText={' '}
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
                    height: 'calc(100% - 6em)',
                    flexDirection: 'column',
                    padding: '1em'
                }}>
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <div>
                            <BasicButton
                                text={this.props.translate.companies_add}
                                color={getSecondary()}
                                icon={<ButtonIcon type="add" color="white" />}
                                textStyle={{ textTransform: 'none', color: 'white', fontWeight: '700' }}
                                onClick={() => this.setState({
                                    addCompany: true
                                })}
                            />
                        </div>
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
                    </div>
                    <Table
                        style={{ width: '100%', maxWidth: '100%' }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ width: '15%', padding: '4px 56px 4px 15px', textAlign: 'center' }}>Logo</TableCell>
                                <TableCell style={{ width: '10%', padding: '4px 56px 4px 15px' }}>Id</TableCell>
                                <TableCell style={{ width: '75%', padding: '4px 56px 4px 15px' }}>Nombre</TableCell>
                            </TableRow>
                        </TableHead>
                    </Table>
                    <div style={{ height: 'calc( 100% - 5em)' }}>
                        <Scrollbar>
                            {this.props.data.loading ?
                                <LoadingSection />
                                : this.props.data.corporationCompanies.list.map(company => (
                                    <Link to={`/companies/edit/${company.id}`} key={`company_${company.id}`}>
                                        <CompanyItem
                                            tableRoot={true}
                                            key={`company_${company.id}`}
                                            company={company}
                                        />
                                    </Link>
                                ))
                            }
                        </Scrollbar>
                    </div>
                </div>
                {/* <div style={{
                    height: 'calc(100vh - 6.5em)',
                    flexDirection: 'column',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                }}>
                    {this.props.data.loading ?
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
                </div> */}
            </div>
        );
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
    options: () => ({
        variables: {
            options: DEFAULT_OPTIONS
        }
    })
})(withTranslations()(CompaniesDashboard));
