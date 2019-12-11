import React from "react";
import {
	Grid,
	GridItem,
	BasicButton,
	Scrollbar,
	TextInput,
	LoadingSection,
	PaginationFooter,
	CardPageLayout,
} from "../../displayComponents";
import { getPrimary } from "../../styles/colors";
import { Avatar, Icon } from "material-ui";
import gql from 'graphql-tag';
import { withApollo } from "react-apollo";
import withTranslations from "../../HOCs/withTranslations";
import NewCompanyPage from "../company/new/NewCompanyPage";




const TablaCompanies = ({ client, translate }) => {
	const [companies, setCompanies] = React.useState(false);
	const [companiesPage, setCompaniesPage] = React.useState(1);
	const [companiesTotal, setCompaniesTotal] = React.useState(false);
	const [addEntidades, setEntidades] = React.useState(false);
	const [state, setState] = React.useState({
		filterTextCompanies: "",
		filterTextUsuarios: "",
		filterFecha: ""
	});
	const getCompanies = async () => {
		const response = await client.query({
			query: corporationCompanies,
			variables: {
				filters: [{ field: 'businessName', text: state.filterTextCompanies }],
				options: {
					limit: 20,
					offset: (companiesPage - 1) * 20,
					orderDirection: 'DESC'
				}
			}
		});
		
		if (response.data.corporationCompanies.list) {
			setCompanies(response.data.corporationCompanies.list)
			setCompaniesTotal(response.data.corporationCompanies.total)
		}
	}

	React.useEffect(() => {
		getCompanies()
	}, [state.filterTextCompanies, companiesPage]);

	const changePageCompanies = value => {
		setCompaniesPage(value)
	}

	if (addEntidades) {
		return <NewCompanyPage requestClose={() => setEntidades(false)} buttonBack={true} />
	}

	return (
		companies.length === undefined ?
			<LoadingSection />
			:
			<CardPageLayout title={translate.entities} stylesNoScroll={{ height: "100%" }} disableScroll={true}>
				<div style={{ fontSize: "13px", padding: '1.5em 1.5em 1.5em', height: "100%" }}>
					<div style={{ display:"flex", justifyContent:"flex-end" }}>
						<div style={{ padding: "0.5em", display: "flex", alignItems: "center" }}>
							<BasicButton
								buttonStyle={{ boxShadow: "none", marginRight: "1em", borderRadius: "4px", border: `1px solid ${getPrimary()}`, padding: "0.2em 0.4em", marginTop: "5px", color: getPrimary(), }}
								backgroundColor={{ backgroundColor: "white" }}
								text={translate.add}
							// onClick={() => setEntidades(true)}
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
					</div>
					<div style={{ display: "flex", justifyContent: "space-between", padding: "1em", }}>
						<div style={{ color: getPrimary(), fontWeight: "bold", width: 'calc( 100% / 3 )', textAlign: 'left' }}>

						</div>
						<div style={{ color: getPrimary(), fontWeight: "bold", width: 'calc( 100% / 3 )', textAlign: 'left' }}>
							Id
						</div>
						<div style={{ color: getPrimary(), fontWeight: "bold", width: 'calc( 100% / 3 )', textAlign: 'left' }}>
							Nombre
					</div>
					</div>
					<div style={{ height: "calc( 100% - 13em )" }}>
						<Scrollbar>
							{companies.map(item => {
								return (
									<div
										key={item.id}
										style={{
											display: "flex",
											justifyContent: "space-between",
											padding: "1em"
										}}>
										<CellAvatar width={3} avatar={item.logo} />
										<Cell width={3} text={item.id} />
										<Cell width={3} text={item.businessName} />
									</div>

								)
							})}
						</Scrollbar>
					</div>
					<Grid style={{ marginTop: "1em" }}>
						<PaginationFooter
							page={companiesPage}
							translate={translate}
							length={companies.length}
							total={companiesTotal}
							limit={10}
							changePage={changePageCompanies}
						/>
					</Grid>
				</div >
			</CardPageLayout>
	)
}

const CellAvatar = ({ avatar }) => {
	return (
		<div style={{ overflow: "hidden", width: 'calc( 100% / 3 )', textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: "10px" }}>
			{avatar ?
				<Avatar src={avatar} alt="Foto" />
				:
				<i style={{ color: 'lightgrey', fontSize: "1.7em", marginLeft: '6px' }} className={'fa fa-building-o'} />
			}
		</div >
	)
}

const Cell = ({ text, avatar, width }) => {

	return (
		<div style={{ overflow: "hidden", width: width ? `calc( 100% / ${width})` : 'calc( 100% / 5 )', textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: "10px" }}>
			{text}
		</div>
	)
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

export default withApollo(withTranslations()(TablaCompanies));
