import React from 'react';
import { BasicButton, AlertConfirm, ButtonIcon, LoadingSection, TextInput, Icon, Scrollbar, Grid, PaginationFooter, SelectInput, MenuItem } from '../../../displayComponents';
import { getSecondary, getPrimary } from '../../../styles/colors';
import { Typography, Table, TableHead, TableRow, TableCell } from 'material-ui';
import CompanyItem from '../companies/CompanyItem';
import gql from 'graphql-tag';
import { graphql, withApollo } from 'react-apollo';
import { isMobile } from 'react-device-detect';

const DEFAULT_OPTIONS = {
    limit: 10,
    offset: 0,
    orderBy: 'id',
    orderDirection: 'DESC'
}

const CompanyLinksManager = ({ translate, client, ...props }) => {

    const [state, setState] = React.useState({
        checked: props.linkedCompanies || [],
        modal: false,
        step: 1,
        filterText: '',
        filterSelect: 'businessName',
        limit: DEFAULT_OPTIONS.limit
    })
    // const [loading, setLoading] = React.useState(true)
    // const [dataCorporationCompanies, setDataCorporationCompanies] = React.useState({})
    // const [companiesPage, setCompaniesPage] = React.useState(1);

    // static getDerivedStateFromProps(nextProps, prevState) {
    //     if (nextProps.linkedCompanies.length && !prevState.checked.length) {
    //         return {
    //             checked: nextProps.linkedCompanies
    //         }
    //     }

    //     return null
    // }

    // const getData = React.useCallback(async () => {
    //     setLoading(true)
    //     const response = await client.query({
    //         query: corporationCompanies,
    //         variables: {
    //             filters: [{ field: state.filterSelect, text: state.filterText }],
    //             options: {
    //                 limit: 10,
    //                 offset: (companiesPage - 1) * 10,
    //                 orderDirection: 'DESC'
    //             },
    //             corporationId: props.company ? props.company.corporationId : 1
    //         }
    //     });
    //     console.log(response)
    //     if (response.data.corporationCompanies.list) {
    //         setDataCorporationCompanies(response.data.corporationCompanies)
    //         setLoading(false)
    //     }
    // }, [state.filterText, state.filterSelect, companiesPage])

    // React.useEffect(() => {
    //     getData();
    // }, [getData])



    const addCheckedCompanies = () => {
        props.addCheckedCompanies(state.checked);
        setState({
            ...state,
            checked: [],
            step: 1,
            modal: false
        });
    }

    const checkRow = (email, check) => {
        let checked = [...state.checked];
        if (check) {
            checked = [...checked, email];
        } else {
            const index = checked.findIndex(item => item === email);
            checked.splice(index, 1);
        }
        setState({
            ...state,
            checked: checked
        });
    };



    const close = () => {
        setState({
            ...state,
            modal: false
        }, setState({
            ...state,
            step: 1,
            checked: props.linkedCompanies
        }));
    }

    // const updateFilterText = (text) => {
    //     setState({
    //         ...state,
    //         filterText: text
    //     }, () => {
    //         clearTimeout(timeout);
    //         timeout = setTimeout(() => refresh(), 450);
    //     });
    // }

    const refresh = () => {
        let variables = {
            options: DEFAULT_OPTIONS
        };
        variables.options.limit = state.limit;
        variables.filters = [{ field: 'businessName', text: state.filterText }];
        props.data.refetch(variables);
    }
    console.log(props.linkedCompanies)

    return (
        <div> {/**"calc( 100% - 16em )" */}
            < div style={{ width: '100%', display: "flex", flexDirection: 'row', marginTop: '2em', alignItems: 'center', justifyContent: "space-between" }}>
                <Typography variant="subheading" style={{ color: getPrimary(), marginRight: '0.6em' }}>
                    {props.linkedCompanies.length} {translate.linked_companies}
                </Typography>
                <BasicButton
                    text={translate.link_companies}
                    color={getSecondary()}
                    icon={<ButtonIcon type="save" color="white" />}
                    textStyle={{ textTransform: 'none', color: 'white', fontWeight: '700' }}
                    onClick={() => {
                        setState({
                            ...state,
                            modal: true
                        })
                    }}
                />
            </div >
            <div style={{ width: '100%' }}>
                <Table
                    style={{ width: "100%", maxWidth: "100%" }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ width: "15%", padding: '4px 56px 4px 15px', textAlign: "center" }}>Logo</TableCell>
                            <TableCell style={{ width: "10%", padding: '4px 56px 4px 15px' }}>Id</TableCell>
                            <TableCell style={{ width: "75%", padding: '4px 56px 4px 5px' }}>{translate.name}</TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
                {props.linkedCompanies.map(company => (
                    <CompanyItem
                        tableRoot={true}
                        key={`company_${company.id}`}
                        company={company}
                    />
                ))}
            </div>
            {/* {this.props.linkedCompanies.map(company => (
                        <CompanyItem
                            key={`company_${company.id}`}
                            company={company}
                        />
                    ))} */}
            <AlertConfirm
                requestClose={close}
                open={state.modal}
                acceptAction={state.step === 1 ? () => setState({ step: 2 }) : addCheckedCompanies}
                buttonAccept={translate.accept}
                buttonCancel={translate.cancel}
                bodyText={
                    <LinksCompanies
                        translate={translate}
                        linkedCompanies={props.linkedCompanies}
                        client={client}
                        company={props.company}
                    />
                }
                title={translate.link_companies}
            />
        </div >
    )
}


const LinksCompanies = ({ translate, linkedCompanies, client, company }) => {
    const [state, setState] = React.useState({
        checked: linkedCompanies || [],
        modal: false,
        step: 1,
        filterText: '',
        filterSelect: 'businessName',
        limit: DEFAULT_OPTIONS.limit
    })
    const [loading, setLoading] = React.useState(true)
    const [dataCorporationCompanies, setDataCorporationCompanies] = React.useState({})
    const [companiesPage, setCompaniesPage] = React.useState(1);

    const getData = React.useCallback(async () => {
        setLoading(true)
        console.log(company)
        const response = await client.query({
            query: corporationCompanies,
            variables: {
                filters: [{ field: state.filterSelect, text: state.filterText }],
                options: {
                    limit: 10,
                    offset: (companiesPage - 1) * 10,
                    orderDirection: 'DESC'
                },
                corporationId: company ? company.corporationId : 1
            }
        });
        console.log(response)
        if (response.data.corporationCompanies) {
            setDataCorporationCompanies(response.data.corporationCompanies)
            setLoading(false)
        }
    }, [state.filterText, state.filterSelect, companiesPage, state.filterId])

    React.useEffect(() => {
        getData();
    }, [getData])

    const isChecked = id => {
        const item = state.checked.find(item => item.id === id);
        return !!item;
    }

    const checkCompany = (company, check) => {
        let checked = [...state.checked];
        if (check) {
            checked = [...checked, company];
        } else {
            const index = checked.findIndex(item => item.id === company.id);
            checked.splice(index, 1);
        }
        setState({
            ...state,
            checked: checked
        });
    }

    if (state.step === 1) {
        return (
            <div style={{ width: '650px', }}>
                <div style={{ display: "flex" }}>
                    <div style={{ width: '100px', marginRight: "1em" }}>
                        <SelectInput
                            value={state.filterSelect}
                            onChange={event => setState({ ...state, filterSelect: event.target.value })}
                        >
                            <MenuItem value={'businessName'}>{translate.name}</MenuItem>
                            <MenuItem value={'id'}>Id</MenuItem>
                        </SelectInput>
                    </div>
                    <div style={{ width: '100%' }}>
                        <TextInput
                            adornment={<Icon>search</Icon>}
                            floatingText={" "}
                            type="text"
                            value={state.filterText}
                            onChange={event => {
                                setState({
                                    ...state,
                                    filterText: event.target.value
                                })
                            }}
                        />
                    </div>
                </div>
                {loading ?
                    <LoadingSection />
                    :
                    <div>
                        {dataCorporationCompanies.list.map(company => (
                            <CompanyItem
                                key={`company_${company.id}`}
                                company={company}
                                checkable={true}
                                checked={isChecked(company.id)}
                                onCheck={checkCompany}
                            />
                        ))}
                        <Grid style={{ marginTop: "1em" }}>
                            <PaginationFooter
                                page={companiesPage}
                                translate={translate}
                                length={dataCorporationCompanies.list.length}
                                total={dataCorporationCompanies.total}
                                limit={10}
                                changePage={setCompaniesPage}
                                lg={12}
                                md={12}
                            />
                        </Grid>
                    </div>
                }
            </div>
        )
    }

    if (state.step === 2) {
        return (
            <div style={{ width: '650px' }}>
                {state.checked.map(company => (
                    <CompanyItem
                        key={`company_${company.id}`}
                        company={company}
                        checkable={true}
                        checked={isChecked(company.id)}
                        onCheck={checkCompany}
                    />
                ))}
            </div>
        )
    }

}


const corporationCompanies = gql`
    query corporationCompanies($filters: [FilterInput], $options: OptionsInput, $corporationId: Int){
        corporationCompanies(filters: $filters, options: $options, corporationId: $corporationId){
            list{
                id
                businessName
                logo
            }
            total
        }
    }
`;

export default withApollo(CompanyLinksManager)
