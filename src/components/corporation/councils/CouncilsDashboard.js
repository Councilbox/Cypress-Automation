import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { LoadingSection, CollapsibleSection, BasicButton, Scrollbar, TextInput, Grid, PaginationFooter } from '../../../displayComponents';
import withTranslations from '../../../HOCs/withTranslations';
import { lightGrey, getSecondary, getPrimary, secondary } from '../../../styles/colors';
import FontAwesome from 'react-fontawesome';
import { Card, Table, TableBody, TableRow } from 'material-ui';
import CouncilItem from './CouncilItem';
import CouncilsSectionTrigger from './CouncilsSectionTrigger';
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import { bHistory } from '../../../containers/App';
import { TableHead } from 'material-ui';
import { TableCell } from 'material-ui';



const CouncilsDashboard = ({ translate, client, ...props }) => {
    const [councilsConvenedCouncils, setCouncilsConvenedCouncils] = React.useState([]);
    const [loadingConvenedCouncils, setLoadingConvenedCouncils] = React.useState(true);
    const [pageConvenedCouncils, setPageConvenedCouncils] = React.useState(1);

    // const getDataConvenedCouncils = React.useCallback(async () => {
    //     setLoadingConvenedCouncils(true)
    //     const response = await client.query({
    //         query: corporationConvenedCouncils,
    //         variables: {
    //             options: {
    //                 limit: 10,
    //                 offset: (pageConvenedCouncils - 1) * 10
    //             },
    //         },
    //     });

    //     setCouncilsConvenedCouncils(response.data);
    //     setLoadingConvenedCouncils(false)
    // }, [pageConvenedCouncils]);

    // React.useEffect(() => {
    //     getDataConvenedCouncils();
    // }, [getDataConvenedCouncils]);

    // ---------------------------

    // const _convenedTrigger = () => {
    //     return (
    //         <CouncilsSectionTrigger
    //             text={translate.companies_calendar}
    //             icon={'calendar-o'}
    //             description={translate.companies_calendar_desc}
    //         />
    //     )
    // }

    // const _convenedSection = () => {
    //     return (
    //         <div style={{ width: '100%' }}>
    //             {councils.corporationConvenedCouncils.map(council =>
    //                 <CouncilItem
    //                     key={`council_${council.id}`}
    //                     council={council}
    //                     translate={translate}
    //                 />
    //             )}
    //         </div>
    //     )
    // }

    // const _celebrationTrigger = () => {
    //     return (
    //         <CouncilsSectionTrigger
    //             text={translate.companies_live}
    //             icon={'users'}
    //             description={translate.companies_live_desc}
    //         />
    //     )
    // }

    // const _celebrationSection = () => {
    //     return (
    //         <div style={{ width: '100%' }}>
    //             {councils.corporationLiveCouncils.map(council => (
    //                 <CouncilItem
    //                     key={`council_${council.id}`}
    //                     council={council}
    //                     translate={translate}
    //                 />
    //             ))}
    //         </div>
    //     )
    // }

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: lightGrey
            }}
        >
            <Scrollbar>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        paddingBottom: '2em',
                        alignItems: 'center',
                        margin: '1.4em'
                    }}
                >
                    <BasicButton
                        icon={
                            <FontAwesome
                                name={'refresh'}
                                style={{
                                    color: getSecondary()
                                }}
                            />
                        }
                    // onClick={() => getData()}
                    />
                    <BasicButton
                        text={'KPI'}
                        color="white"
                        onClick={() => bHistory.push('/kpi')}
                        buttonStyle={{
                            marginLeft: '1em',
                            border: `1px solid ${secondary}`
                        }}
                    />
                </div>
                <SearchCouncils />
                <LiveCouncils
                    translate={translate}
                    client={client}
                />
            </Scrollbar>
        </div>
    )
}

const LiveCouncils = ({ translate, client }) => {
    const [councilsLiveCouncils, setCouncilsLiveCouncils] = React.useState([]);
    const [loadingLiveCouncils, setLoadingLiveCouncils] = React.useState(true);
    const [pageLiveCouncils, setPageLiveCouncils] = React.useState(1);


    const getDataLiveCouncils = React.useCallback(async () => {
        setLoadingLiveCouncils(true)
        const response = await client.query({
            query: corporationLiveCouncils,
            variables: {
                options: {
                    limit: 10,
                    offset: (pageLiveCouncils - 1) * 10
                },
            },
        });

        setCouncilsLiveCouncils(response.data);
        setLoadingLiveCouncils(false)
    }, [pageLiveCouncils]);

    React.useEffect(() => {
        getDataLiveCouncils();
    }, [getDataLiveCouncils]);


    return (
        <div>
            {loadingLiveCouncils ?
                <LoadingSection />
                :
                <div>
                    <Table
                        style={{ width: "100%", maxWidth: "100%" }}
                    >
                        <TableHead>
                            <TableRow>
                                {/* <TableCell style={{ width: "15%", padding: '4px 56px 4px 15px', textAlign: "center" }}>Fecha</TableCell>
                            <TableCell style={{ width: "10%", padding: '4px 56px 4px 15px' }}>Nombre de entidad</TableCell>
                            <TableCell style={{ width: "25%", padding: '4px 56px 4px 15px' }}>Tipo de reunión</TableCell>
                            <TableCell style={{ width: "25%", padding: '4px 56px 4px 15px' }}>Nombre de la reunión</TableCell>
                            <TableCell style={{ width: "25%", padding: '4px 56px 4px 15px' }}>Numero de convocados</TableCell> */}
                                <TableCell style={{}}>Total</TableCell>
                                <TableCell style={{}}>ID</TableCell>
                                <TableCell style={{}}>Entidad</TableCell>
                                <TableCell style={{}}>Nombre</TableCell>
                                <TableCell style={{}}>Fecha</TableCell>
                                <TableCell style={{}}>Estado</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {councilsLiveCouncils.corporationLiveCouncils.list.map(council => (
                                <CouncilItem
                                    key={`council_${council.id}`}
                                    council={council}
                                    translate={translate}
                                />
                            ))}
                        </TableBody>
                    </Table>

                    <Grid style={{ marginTop: "1em" }}>
                        <PaginationFooter
                            page={pageLiveCouncils}
                            translate={translate}
                            length={councilsLiveCouncils.corporationLiveCouncils.list.length}
                            total={councilsLiveCouncils.corporationLiveCouncils.total}
                            limit={10}
                            changePage={setPageLiveCouncils}
                        />
                    </Grid>
                </div>
            }
        </div>
    )
}



// const CouncilsDashboard = ({ translate, client, ...props }) => {
//     const [councils, setCouncils] = React.useState([]);
//     const [loading, setLoading] = React.useState(true);

//     const getData = React.useCallback(async () => {
//         setLoading(true)
//         const response = await client.query({
//             query: corporationCouncils,
//         });
//       
//         setCouncils(response.data);
//         setLoading(false)
//     }, []);

//     React.useEffect(() => {
//         getData();
//     }, [getData]);


//     const _convenedTrigger = () => {
//         return (
//             <CouncilsSectionTrigger
//                 text={translate.companies_calendar}
//                 icon={'calendar-o'}
//                 description={translate.companies_calendar_desc}
//             />
//         )
//     }

//     const _convenedSection = () => {
//         return (
//             <div style={{ width: '100%' }}>
//                 {councils.corporationConvenedCouncils.map(council =>
//                     <CouncilItem
//                         key={`council_${council.id}`}
//                         council={council}
//                         translate={translate}
//                     />
//                 )}
//             </div>
//         )
//     }

//     const _celebrationTrigger = () => {
//         return (
//             <CouncilsSectionTrigger
//                 text={translate.companies_live}
//                 icon={'users'}
//                 description={translate.companies_live_desc}
//             />
//         )
//     }

//     const _celebrationSection = () => {
//         return (
//             <div style={{ width: '100%' }}>
//                 {councils.corporationLiveCouncils.map(council => (
//                     <CouncilItem
//                         key={`council_${council.id}`}
//                         council={council}
//                         translate={translate}
//                     />
//                 ))}
//             </div>
//         )
//     }

//     return (
//         <div
//             style={{
//                 width: '100%',
//                 height: '100%',
//                 backgroundColor: lightGrey
//             }}
//         >
//             <Scrollbar>
//                 <div
//                     style={{
//                         display: 'flex',
//                         flexDirection: 'row',
//                         paddingBottom: '2em',
//                         alignItems: 'center',
//                         margin: '1.4em'
//                     }}
//                 >
//                     <BasicButton
//                         icon={
//                             <FontAwesome
//                                 name={'refresh'}
//                                 style={{
//                                     color: getSecondary()
//                                 }}
//                             />
//                         }
//                         onClick={() => getData()}
//                     />
//                     <BasicButton
//                         text={'KPI'}
//                         color="white"
//                         onClick={() => bHistory.push('/kpi')}
//                         buttonStyle={{
//                             marginLeft: '1em',
//                             border: `1px solid ${secondary}`
//                         }}
//                     />
//                 </div>
//                 <SearchCouncils />
//                 {loading ?
//                     <LoadingSection />
//                     :
//                     <React.Fragment>
//                         <Card style={{ margin: '1.4em' }}>
//                             <CollapsibleSection trigger={_convenedTrigger} collapse={_convenedSection} />
//                         </Card>
//                         <Card style={{ margin: '1.4em' }}>
//                             <CollapsibleSection trigger={_celebrationTrigger} collapse={_celebrationSection} />
//                         </Card>
//                     </React.Fragment>
//                 }
//             </Scrollbar>
//         </div>
//     )
// }

export const SearchCouncils = withApollo(({ client, reload }) => {
    const [idCouncilSearch, setIdCouncilSearch] = React.useState(0);
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const goToId = async () => {
        if (!isNaN(idCouncilSearch) || idCouncilSearch !== 0) {
            setLoading(true)
            const response = await client.query({
                query: CouncilDetailsRoot,
                variables: {
                    id: parseInt(idCouncilSearch)
                }
            });
            if (response.data.council && response.data.council.id) {
                setError("")
                bHistory.push(`/council/${idCouncilSearch}`);
                if (reload) {
                    window.location.reload(true);
                }
                setLoading(false)
            } else {
                setError("Esta reunion no existe")
                setLoading(false)
            }
        } else {
            setError("Escribe un numero")
            setLoading(false)
        }

    };
    return (
        <div
            style={{
                margin: '1.4em',
                boxShadow: 'rgba(0, 0, 0, 0.5) 0px 2px 4px 0px',
                border: '1px solid' + getSecondary(),
                borderRadius: '4px',
                padding: '0.5em',
                color: "black"
            }}>
            <div>
                <div>Id de reunión:</div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ marginRight: "10px" }}>Id</div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <TextInput
                            type="text"
                            value={idCouncilSearch == 0 ? "" : idCouncilSearch}
                            disableUnderline={true}
                            styles={{ fontWeight: "bold", width: '300px', }}
                            styleInInput={{ backgroundColor: "#ececec", paddingLeft: "5px", border: !!error && "2px solid red" }}
                            onKeyUp={event => {
                                if (event.keyCode === 13) {
                                    goToId(event);
                                }
                            }}
                            onChange={event => setIdCouncilSearch(event.target.value)}
                        />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", marginTop: "6px" }}>
                        <BasicButton
                            text={<i className={loading ? 'fa fa-circle-o-notch fa-spin' : "fa fa-search"} style={{ color: "black" }} />}
                            onClick={goToId}
                            backgroundColor={{ backgroundColor: "white", minWidth: "0", marginLeft: '1em', minHeight: '0px', boxShadow: "none", borderRadius: "4px", border: " 1px solid black" }}
                        />
                    </div>
                    {error &&
                        <div style={{ display: "flex", alignItems: "center", marginTop: "6px", marginLeft: "15px", color: "red", fontWeight: "bold" }}>
                            {error}
                        </div>
                    }
                </div>
            </div>
        </div>
    )
})

const corporationConvenedCouncils = gql`
    query corporationConvenedCouncils($options: OptionsInput){
        corporationConvenedCouncils(options: $options){
            list{
                id
                name
                state
                dateStart
                councilType
                prototype
                participants {
                    id
                }
                company{
                    id
                    businessName
                }
            }
            total
        }
    }
`;
const corporationLiveCouncils = gql`
    query corporationLiveCouncils($options: OptionsInput){
        corporationLiveCouncils(options: $options){
            list{
                id
                name
                state
                dateStart
                councilType
                prototype
                participants {
                    id
                }
                company{
                    id
                    businessName
                }
            }
            total
        }
    }
`;

// const corporationCouncils = gql`
//     query corporationCouncils{
//         corporationConvenedCouncils{
//             id
//             name
//             state
//             dateStart
//             councilType
//             prototype
//             participants {
//                 id
//             }
//             company{
//                 id
//                 businessName
//             }
//         }

//         corporationLiveCouncils{
//             id
//             name
//             state
//             dateStart
//             councilType
//             prototype
//             participants {
//                 id
//             }
//             company{
//                 id
//                 businessName
//             }
//         }
//     }
// `;

const CouncilDetailsRoot = gql`
    query CouncilDetailsRoot($id: Int!){
        council(id: $id) {
			id
		}
    }
`;

export default withTranslations()(withApollo(CouncilsDashboard));