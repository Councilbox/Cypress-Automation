import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import withSharedProps from '../../../HOCs/withSharedProps';
import { corporationUsers } from '../../../queries/corporation';
import { getPrimary } from '../../../styles/colors';
import { Icon } from 'material-ui';
import { Scrollbar, Grid, PaginationFooter, LoadingSection, CardPageLayout, BasicButton, TextInput } from '../../../displayComponents';
import { moment } from '../../../containers/App';



const OrganizationUsers = ({ client, translate, company }) => {
	const [users, setUsers] = React.useState(false);
    const [usersPage, setUsersPage] = React.useState(1);
    const [total, setTotal] = React.useState(null);
	const [companiesTotal, setCompaniesTotal] = React.useState(false);
	const [addEntidades, setEntidades] = React.useState(false);
	const [selectedCompany, setSelectedCompany] = React.useState(null);
	const [state, setState] = React.useState({
		filterTextCompanies: "",
		filterTextUsuarios: "",
		filterFecha: ""
	});
	const primary = getPrimary();

	const getCompanies = async () => {
		const response = await client.query({
			query: corporationUsers,
			variables: {
				filters: [{ field: 'businessName', text: state.filterTextCompanies }],
				options: {
					limit: 20,
					offset: (usersPage - 1) * 20,
					orderDirection: 'DESC'
				},
				corporationId: company.id
			}
		});

		if (response.data.corporationUsers.list) {
            setUsers(response.data.corporationUsers.list);
            setTotal(response.data.corporationUsers.total);
		}
	}

	React.useEffect(() => {
		getCompanies()
	}, [state.filterTextCompanies, usersPage]);

	const changePageUsuarios = value => {
		setUsersPage(value)
    }
    
    if(!users){
        return <LoadingSection />;
    }

	// if (addEntidades) {
	// 	return <NewCompanyPage requestClose={() => setEntidades(false)} buttonBack={true} />
	// }

	return (
        <CardPageLayout title={translate.entities} stylesNoScroll={{ height: "100%" }} disableScroll={true}>
            <div style={{ fontSize: "13px", padding: '1.5em 1.5em 1.5em', height: "100%" }}>
                {/* <div style={{ display:"flex", justifyContent:"flex-end" }}>
                    <div style={{ padding: "0.5em", display: "flex", alignItems: "center" }}>
                        <BasicButton
                            buttonStyle={{ boxShadow: "none", marginRight: "1em", borderRadius: "4px", border: `1px solid ${primary}`, padding: "0.2em 0.4em", marginTop: "5px", color: primary, }}
                            backgroundColor={{ backgroundColor: "white" }}
                            text={translate.add}
                            onClick={() => setEntidades(true)}
                        />

                        <div style={{ padding: "0px 8px", fontSize: "24px", color: "#c196c3" }}>
                            <i className="fa fa-filter"></i>
                        </div>

                        <TextInput
                            placeholder={translate.search}
                            adornment={<Icon style={{ background: "#f0f3f6", paddingLeft: "5px", height: '100%', display: "flex", alignItems: "center", justifyContent: "center" }}>search</Icon>}
                            type="text"
                            value={state.filterTextCompanies || ""}
                            styleInInput={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.54)", background: "#f0f3f6", marginLeft: "0", paddingLeft: "8px" }}
                            disableUnderline={true}
                            stylesAdornment={{ background: "#f0f3f6", marginLeft: "0", paddingLeft: "8px" }}
                            onChange={event => {
                                setState({
                                    ...state,
                                    filterTextCompanies: event.target.value
                                })
                            }}
                        />
                    </div>
                </div> */}
                <div style={{ fontSize: "13px", height: '100%' }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "1em", }}>
                        <div style={{ color: getPrimary(), fontWeight: "bold", width: 'calc( 100% / 5 )', textAlign: 'left' }}>
                            Estado
                    </div>
                        <div style={{ color: getPrimary(), fontWeight: "bold", width: 'calc( 100% / 5 )', textAlign: 'left' }}>
                            Id
                    </div>
                        <div style={{ color: getPrimary(), fontWeight: "bold", width: 'calc( 100% / 5 )', textAlign: 'left' }}>
                            Nombre
                    </div>
                        <div style={{ color: getPrimary(), fontWeight: "bold", overflow: "hidden", width: 'calc( 100% / 5 )', textAlign: 'left' }}>
                            Email
                    </div>
                        <div style={{ color: getPrimary(), fontWeight: "bold", overflow: "hidden", width: 'calc( 100% / 5 )', textAlign: 'left' }}>
                            Últ.Conexión
                    </div>
                    </div>
                    <div style={{ height: '100%'}}>
                        <Scrollbar>
                            {users.map(item => {
                                return (
                                    <div
                                        key={item.id}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            padding: "1em"
                                        }}>
                                        <Cell text={item.actived} width={20}/>
                                        <Cell text={item.id} width={20}/>
                                        <Cell text={item.name + " " + item.surname} width={20}/>
                                        <Cell text={item.email} width={20}/>
                                        <Cell text={moment(item.lastConnectionDate).format("LLL")} width={20}/>
                                    </div>

                                )
                            })}
                        </Scrollbar>
                    </div>
                    <Grid style={{ marginTop: "1em" }}>
                        <PaginationFooter
                            page={usersPage}
                            translate={translate}
                            length={users.length}
                            total={total}
                            limit={10}
                            changePage={changePageUsuarios}
                            md={12}
                            xs={12}
                        />
                    </Grid>
                </div>
            </div>
        </CardPageLayout>
	)
}

const CellAvatar = ({ avatar, width }) => {
	return (
		<div style={{ overflow: "hidden", width: `calc(${width}%)`, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: "10px" }}>
			{avatar ?
				<div style={{height: '1.7em', width: '1.7em', borderRadius: '0.9em'}}>
					<img src={avatar} alt="Foto" style={{height: '100%', width: '100%'}} />
				</div>
				:
				<i style={{ color: 'lightgrey', fontSize: "1.7em", marginLeft: '6px' }} className={'fa fa-building-o'} />
			}
		</div>
	)
}

const Cell = ({ text, avatar, width, children, style }) => {
	return (
		<div style={{
				overflow: "hidden",
				width: width ?`calc(${width}%)` : 'calc( 100% / 5 )',
				textAlign: 'left',
				whiteSpace: 'nowrap',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				paddingRight: "10px",
				...style
			}}>
			{children}
		</div>
	)
}

export default withApollo(withSharedProps()(OrganizationUsers));
