import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import FontAwesome from 'react-fontawesome';
import { Card } from 'material-ui';
import { Redirect, Link } from "react-router-dom";
import { LoadingSection, CollapsibleSection, BasicButton, Scrollbar, TextInput } from '../../../displayComponents';
import withTranslations from '../../../HOCs/withTranslations';
import { lightGrey, getSecondary, getPrimary, secondary } from '../../../styles/colors';
import CouncilItem from './CouncilItem';
import CouncilsSectionTrigger from './CouncilsSectionTrigger';

import { bHistory } from '../../../containers/App';


const CouncilsDashboard = ({ translate, client, ...props }) => {
    const [councils, setCouncils] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const getData = React.useCallback(async () => {
        setLoading(true)
        const response = await client.query({
            query: corporationCouncils,
        });

        setCouncils(response.data);
        setLoading(false)
    }, []);

    React.useEffect(() => {
        getData();
    }, [getData]);


    const _convenedTrigger = () => (
            <CouncilsSectionTrigger
                text={translate.companies_calendar}
                icon={'calendar-o'}
                description={translate.companies_calendar_desc}
            />
        )

    const _convenedSection = () => (
            <div style={{ width: '100%' }}>
                {councils.corporationConvenedCouncils.map(council => <CouncilItem
                        key={`council_${council.id}`}
                        council={council}
                        translate={translate}
                    />)}
            </div>
        )

    const _celebrationTrigger = () => (
            <CouncilsSectionTrigger
                text={translate.companies_live}
                icon={'users'}
                description={translate.companies_live_desc}
            />
        )

    const _celebrationSection = () => (
            <div style={{ width: '100%' }}>
                {councils.corporationLiveCouncils.map(council => (
                    <CouncilItem
                        key={`council_${council.id}`}
                        council={council}
                        translate={translate}
                    />
                ))}
            </div>
        )

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
                        onClick={() => getData()}
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
                {loading ?
                    <LoadingSection />
                    :
                    <React.Fragment>
                        <Card style={{ margin: '1.4em' }}>
                            <CollapsibleSection trigger={_convenedTrigger} collapse={_convenedSection} />
                        </Card>
                        <Card style={{ margin: '1.4em' }}>
                            <CollapsibleSection trigger={_celebrationTrigger} collapse={_celebrationSection} />
                        </Card>
                    </React.Fragment>
                }
            </Scrollbar>
        </div>
    )
}

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
                                if(event.keyCode === 13){
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

const corporationCouncils = gql`
    query corporationCouncils{
        corporationConvenedCouncils{
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

        corporationLiveCouncils{
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
    }
`;

const CouncilDetailsRoot = gql`
    query CouncilDetailsRoot($id: Int!){
        council(id: $id) {
			id
		}
    }
`;

export default withTranslations()(withApollo(CouncilsDashboard));
