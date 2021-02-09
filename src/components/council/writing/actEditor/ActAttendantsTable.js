import React from 'react';
import { withApollo } from 'react-apollo';
import { TableRow, TableCell } from 'material-ui';
import { LoadingSection, EnhancedTable, Scrollbar } from '../../../../displayComponents';
import { PARTICIPANTS_LIMITS, PARTICIPANT_STATES } from '../../../../constants';
import { getSecondary } from '../../../../styles/colors';
import { councilAttendants } from '../../../../queries/council';
import DownloadAttendantsPDF from './DownloadAttendantsPDF';
import StateIcon from '../../live/participants/StateIcon';
import { useHoverRow } from '../../../../hooks';
import { moment } from '../../../../containers/App';
import CbxDataModal from './CbxDataModal';


const ActAttendantsTable = ({ data, translate, client, council, ...props }) => {
    const [total, setTotal] = React.useState(null);
    const [councilAttendantsData, setCouncilAttendantsData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const getCouncilAttendants = async value => {
        const response = await client.query({
            query: councilAttendants,
            variables: {
                councilId: council.id,
                filters: value && value.filters,
                options: value && value.filters ? value.options : {
                    limit: PARTICIPANTS_LIMITS[0],
                    offset: 0,
                    orderBy: 'name',
                    orderDirection: 'asc'
                },
            },
        });

        setCouncilAttendantsData(response.data.councilAttendants);
        setLoading(false);
    };

    React.useEffect(() => {
        getCouncilAttendants();
    }, []);

    React.useEffect(() => {
        if (!loading && total === null) {
            setTotal(councilAttendantsData.total);
        }
    }, [loading, setTotal]);

    const secondary = getSecondary();

    return (
        <div style={{ height: '100%', overflow: 'hidden', position: 'relative' }}>
            {loading ?
                <LoadingSection />
                : total <= 0 && total !== null ?
                    <div style={{ display: 'flex', fontSize: '1.2em', flexDirection: 'column', fontWeight: '700', height: '80%', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa fa-user-times" aria-hidden="true" style={{ fontSize: '6em', color: secondary }}></i>
                        {translate.no_participant_attended}
                    </div>
                    : <Scrollbar>
                        <div style={{ padding: '1.5em', overflow: 'hidden' }}>
                            {!!councilAttendantsData && (
                                <React.Fragment>
                                    {councilAttendantsData.total > 0
                                        && <DownloadAttendantsPDF
                                            translate={translate}
                                            color={secondary}
                                            council={council}
                                        />
                                    }
                                    <EnhancedTable
                                        translate={translate}
                                        defaultLimit={PARTICIPANTS_LIMITS[0]}
                                        defaultFilter={'fullName'}
                                        defaultOrder={['name', 'asc']}
                                        limits={PARTICIPANTS_LIMITS}
                                        page={1}
                                        loading={loading}
                                        length={councilAttendantsData.list.length}
                                        total={councilAttendantsData.total}
                                        refetch={getCouncilAttendants}
                                        fields={[
                                            {
                                                value: 'fullName',
                                                translation: translate.participant_data
                                            },
                                            {
                                                value: 'dni',
                                                translation: translate.dni
                                            },
                                            {
                                                value: 'position',
                                                translation: translate.position
                                            }
                                        ]}
                                        headers={[
                                            {
                                                text: '',
                                                name: 'icon',
                                                canOrder: false
                                            },
                                            {
                                                text: translate.participant_data,
                                                name: 'surname',
                                                canOrder: true
                                            },
                                            {
                                                text: translate.entry_date,
                                                name: 'firstLoginDate',
                                                canOrder: true

                                            },
                                            {
                                                text: translate.date_when_left,
                                                name: 'lastPresentDate',
                                                canOrder: false
                                            },
                                            {
                                                text: '',
                                                name: 'download',
                                                canOrder: false
                                            }
                                        ]}
                                    >
                                    {loading ?
                                        <LoadingSection />
                                        : councilAttendantsData.list.map(
                                            participant => (
                                                    <React.Fragment
                                                        key={`participant${participant.id}`}
                                                    >
                                                        <HoverableRow
                                                            translate={translate}
                                                            participant={participant}
                                                            delegatedVotes={participant.delegationsAndRepresentations}
                                                        />
                                                    </React.Fragment>
                                                )
                                        )}
                                    </EnhancedTable>
                                </React.Fragment>
                            )}
                            {props.children}
                        </div>
                    </Scrollbar>
            }
        </div>
    );
};

const HoverableRow = ({ translate, participant, delegatedVotes }) => {
    const [showActions, rowHandlers] = useHoverRow();
    const [cbxDataModal, setCbxDataModal] = React.useState(false);
    const representing = delegatedVotes.find(vote => vote.state === PARTICIPANT_STATES.REPRESENTATED);


    return (
        <>
            <CbxDataModal
                open={cbxDataModal}
                translate={translate}
                requestClose={() => setCbxDataModal(false)}
                participant={participant}
            />
            <TableRow
                {...rowHandlers}
                style={{
                    backgroundColor: showActions ? 'gainsboro' : 'transparent'
                }}
            >
                <TableCell>
                    <StateIcon translate={translate} state={participant.state} />
                </TableCell>
                <TableCell>
                    {representing ?
                        <span style={{ fontWeight: '700' }}>{`${representing.name} ${representing.surname || ''} - ${translate.represented_by} ${participant.name} ${participant.surname || ''}`}</span>
                        : <span style={{ fontWeight: '700' }}>{`${participant.name} ${participant.surname || ''}`}</span>
                    }
                </TableCell>
                <TableCell>
                    {participant.firstLoginDate
                        && moment(participant.firstLoginDate).format('LLL')
                    }
                </TableCell>
                <TableCell>
                    {participant.state === PARTICIPANT_STATES.LEFT
                        && moment(participant.lastDateConnection).format('LLL')
                    }
                </TableCell>
                <TableCell>
                    <div style={{ width: '4em' }}>
                        {showActions
                            && <>
                                <i
                                    className="fa fa-info-circle"
                                    aria-hidden="true"
                                    style={{
                                        fontSize: '24px',
                                        color: getSecondary(),
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => setCbxDataModal(true)}
                                ></i>
                            </>
                        }
                    </div>
                </TableCell>
            </TableRow>
        </>
    );
};

export default withApollo(ActAttendantsTable);
