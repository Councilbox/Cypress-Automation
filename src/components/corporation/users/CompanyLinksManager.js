import React from 'react';
import { BasicButton, AlertConfirm, ButtonIcon, LoadingSection, TextInput, Icon, Scrollbar } from '../../../displayComponents';
import { getSecondary, getPrimary } from '../../../styles/colors';
import { Typography, Table, TableHead, TableRow, TableCell } from 'material-ui';
import CompanyItem from '../companies/CompanyItem';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const DEFAULT_OPTIONS = {
    limit: 10,
    offset: 0,
    orderBy: 'id',
    orderDirection: 'DESC'
}

class CompanyLinksManager extends React.PureComponent {

    state = {
        checked: this.props.linkedCompanies || [],
        modal: false,
        step: 1,
        filterText: '',
        limit: DEFAULT_OPTIONS.limit
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.linkedCompanies.length && !prevState.checked.length) {
            return {
                checked: nextProps.linkedCompanies
            }
        }

        return null
    }

    checkCompany = (company, check) => {
        let checked = [...this.state.checked];
        if (check) {
            checked = [...checked, company];
        } else {
            const index = checked.findIndex(item => item.id === company.id);
            checked.splice(index, 1);
        }
        this.setState({
            checked: checked
        });
    }

    addCheckedCompanies = () => {
        this.props.addCheckedCompanies(this.state.checked);
        this.setState({
            checked: [],
            step: 1,
            modal: false
        });
    }

    checkRow = (email, check) => {
        let checked = [...this.state.checked];
        if (check) {
            checked = [...checked, email];
        } else {
            const index = checked.findIndex(item => item === email);
            checked.splice(index, 1);
        }
        this.setState({
            checked: checked
        });
    };

    isChecked = id => {
        const item = this.state.checked.find(item => item.id === id);
        return !!item;
    }

    close = () => {
        this.setState({
            modal: false
        }, this.setState({
            step: 1,
            checked: this.props.linkedCompanies
        }));
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
            options: DEFAULT_OPTIONS
        };
        variables.options.limit = this.state.limit;
        variables.filters = [{ field: 'businessName', text: this.state.filterText }];
        this.props.data.refetch(variables);
    }


    _renderBody = () => {
        if (this.state.step === 1) {
            return (
                <div style={{ width: '650px' }}>
                    <TextInput
                        adornment={<Icon>search</Icon>}
                        floatingText={" "}
                        type="text"
                        value={this.state.filterText}
                        onChange={event => {
                            this.updateFilterText(event.target.value);
                        }}
                    />
                    {this.props.data.loading ?
                        <LoadingSection />
                        :
                        this.props.data.corporationCompanies.list.map(company => (
                            <CompanyItem
                                key={`company_${company.id}`}
                                company={company}
                                checkable={true}
                                checked={this.isChecked(company.id)}
                                onCheck={this.checkCompany}
                            />
                        ))
                    }
                </div>
            )
        }

        if (this.state.step === 2) {
            return (
                <div style={{ width: '650px' }}>
                    {this.state.checked.map(company => (
                        <CompanyItem
                            key={`company_${company.id}`}
                            company={company}
                            checkable={true}
                            checked={this.isChecked(company.id)}
                            onCheck={this.checkCompany}
                        />
                    ))}
                </div>
            )
        }

    }



    render() {
        const { translate } = this.props;

        return (
        <div style={{height: "calc( 100% - 16em )", overflow: "hidden"}}> {/**"calc( 100% - 16em )" */}
                <div style={{ width: '100%', display: "flex", flexDirection: 'row', marginTop: '2em', alignItems: 'center', justifyContent: "space-between" }}>
                    <Typography variant="subheading" style={{ color: getPrimary(), marginRight: '0.6em' }}>
                        {this.props.linkedCompanies.length} {translate.linked_companies}
                    </Typography>
                    <BasicButton
                        text={this.props.translate.link_companies}
                        color={getSecondary()}
                        icon={<ButtonIcon type="save" color="white" />}
                        textStyle={{ textTransform: 'none', color: 'white', fontWeight: '700' }}
                        onClick={() => {
                            this.setState({
                                modal: true
                            })
                        }}
                    />
                </div>
                <div style={{ width: '100%',height: "100%"  }}> {/**flexDirection: 'column',display: 'flex',  marginTop: '0.9em', marginBottom: '0.9em', height: "100%", overflow: "hidden" */}
                    <Table
                        style={{ width: "100%", maxWidth: "100%", height: "100%"  }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ width: "15%", padding: '4px 56px 4px 15px', textAlign: "center" }}>Logo</TableCell>
                                <TableCell style={{ width: "10%", padding: '4px 56px 4px 15px' }}>Id</TableCell>
                                <TableCell style={{ width: "75%", padding: '4px 56px 4px 5px' }}>Nombre</TableCell>
                            </TableRow>
                        </TableHead>
                    </Table>
                    <div style={{ height: "calc( 100% - 10em )", overflow: "hidden" }}>
                        <Scrollbar>
                            {this.props.data.loading ?
                                <LoadingSection />
                                :
                                this.props.linkedCompanies.map(company => (
                                    <CompanyItem
                                        tableRoot={true}
                                        key={`company_${company.id}`}
                                        company={company}
                                    />
                                )) 
                            }
                        </Scrollbar>
                    </div>
                    {/* {this.props.linkedCompanies.map(company => (
                        <CompanyItem
                            key={`company_${company.id}`}
                            company={company}
                        />
                    ))} */}
                </div>
                <AlertConfirm
                    requestClose={this.close}
                    open={this.state.modal}
                    acceptAction={this.state.step === 1 ? () => this.setState({ step: 2 }) : this.addCheckedCompanies}
                    buttonAccept={translate.accept}
                    buttonCancel={translate.cancel}
                    bodyText={this._renderBody()}
                    title={translate.link_companies}
                />
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
})(CompanyLinksManager);
