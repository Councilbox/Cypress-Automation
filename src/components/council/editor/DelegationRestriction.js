import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import DelegationsRestrictionModal from './DelegationsRestrictionModal';
import { AlertConfirm, BasicButton, Checkbox } from '../../../displayComponents';
import { getPrimary, getSecondary, primary, secondary } from '../../../styles/colors';
import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import { TableHead, Toolbar, Card } from 'material-ui';
import { isMobile } from 'react-device-detect';
import { Translate } from 'material-ui-icons';



const councilDelegates = gql`
    query CouncilDelegates($councilId: Int!){
        councilDelegates(councilId: $councilId){
            participant {
                id
                name
                surname
            }
        }
    }
`;

const addCouncilDelegateMutation = gql`
    mutation AddCouncilDelegate($councilId: Int!, $participantId: Int!){
        addCouncilDelegate(councilId: $councilId, participantId: $participantId){
            success
        }
    }
`;

const removeCouncilDelegateMutation = gql`
    mutation RemoveCouncilDelegate($councilId: Int!, $participantId: [Int]){
        removeCouncilDelegate(councilId: $councilId, participantId: $participantId){
            success
        }
    }
`;

const DelegationRestriction = ({ translate, council, client, fullScreen, ...props }) => {
    const [participants, setParticipants] = React.useState([]);
    const [modal, setModal] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [selectedIds, setselectedIds] = React.useState(new Map());
    const [warningModal, setWarningModal] = React.useState(false);

    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: councilDelegates,
            variables: {
                councilId: council.id
            }
        });

        setParticipants(response.data.councilDelegates.map(item => item.participant));

        setLoading(false);
    }, [council.id]);

    const openSelectModal = () => {
        setModal(true);
    }

    const closeModal = () => {
        setModal(false);
    }

    const openDeleteWarning = participantId => {
        setWarningModal(participantId);
    }

    const closeDeleteWarning = () => {
        setWarningModal(false);
    }

    const addCouncilDelegate = async participantId => {
        const response = await client.mutate({
            mutation: addCouncilDelegateMutation,
            variables: {
                councilId: council.id,
                participantId: participantId
            }
        });

        if (response.data.addCouncilDelegate) {
            getData();
        }
    }

    const renderWarningText = () => {
        //TRADUCCION
        return (
            <div>
                Si quita a este usuario de la lista se le borrarán todos las posibles delegaciones que tenga asignadas. ¿Continuar?
            </div>
        )
    }

    const removeCouncilDelegate = async participantId => {
        let arrayIds = []
        if (selectedIds.size > 0) {
            arrayIds = Array.from(selectedIds.keys());
        }
        const response = await client.mutate({
            mutation: removeCouncilDelegateMutation,
            variables: {
                councilId: council.id,
                participantId: selectedIds.size > 0 ? arrayIds : [participantId]
            }
        })
    
        if (response.data.removeCouncilDelegate.success) {
            setselectedIds(new Map());
            getData();
            setWarningModal(false)
        }
    }

    const select = id => {
        if (selectedIds.has(id)) {
            selectedIds.delete(id);
        } else {
            selectedIds.set(id, 'selected');
        }

        setselectedIds(new Map(selectedIds));
    }

    const selectAll = () => {
        const newSelected = new Map();
        if (selectedIds.size !== participants.length) {
            participants.forEach(participant => {
                newSelected.set(participant.id, 'selected');
            })
        }

        setselectedIds(newSelected);
    }

    React.useEffect(() => {
        getData()
    }, [getData]);


    const _renderBody = () => {
        if (!isMobile) {
            return (
                <div style={{ width: "100%", height: "100%" }}>
                    <div style={{ textAlign: "center" }}>
                        <h6>TABLA CON PARTICIPANTES</h6>
                    </div>
                    <div style={{ paddingBottom: "1em" }}>
                        <BasicButton
                            color={"white"}
                            textStyle={{
                                color: getPrimary(),
                                fontWeight: "700",
                                fontSize: "0.9em",
                                textTransform: "none"
                            }}
                            textPosition="after"
                            buttonStyle={{
                                marginRight: "1em",
                                border: `2px solid ${getPrimary()}`
                            }}
                            onClick={openSelectModal}
                            text={'Añadir'}
                        >
                        </BasicButton>
                        {selectedIds.size > 0 &&
                            <BasicButton
                                color={secondary}
                                textStyle={{
                                    color: 'white',
                                    fontWeight: "700",
                                    fontSize: "0.9em",
                                    textTransform: "none"
                                }}
                                textPosition="after"
                                buttonStyle={{
                                    marginRight: "1em",
                                    border: `2px solid ${secondary}`
                                }}
                                onClick={() => setWarningModal(true)}
                                text={'Borrar ' + selectedIds.size + ' elementos'}
                            >
                            </BasicButton>
                        }
                    </div>
                    {
                        !!participants.length &&
                        <Table style={{ maxWidth: "100%", paddingRight: "1.2em" }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Checkbox
                                            onChange={selectAll}
                                            value={selectedIds.size > 0 &&
                                                selectedIds.size === (participants ? participants.length : -1)}
                                        />
                                    </TableCell>
                                    <TableCell>{translate.name}</TableCell>
                                    <TableCell>{translate.surname}</TableCell>
                                    <TableCell>Accion</TableCell>{/**TRADUCCION */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {participants.map(participant => (
                                    <HoverRow
                                        selected={selectedIds.has(participant.id)}
                                        select={select}
                                        key={`participant_${participant.id}`}
                                        participant={participant}
                                        council={council}
                                        removeCouncilDelegate={removeCouncilDelegate}
                                        openDeleteWarning={openDeleteWarning}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    }
                    <DelegationsRestrictionModal
                        translate={translate}
                        council={council}
                        open={modal}
                        addCouncilDelegate={addCouncilDelegate}
                        requestClose={closeModal}
                        participantsTable={participants}
                    />
                    <AlertConfirm
                        requestClose={closeDeleteWarning}
                        open={!!warningModal}
                        title={translate.warning}
                        acceptAction={() => removeCouncilDelegate(warningModal)}
                        buttonAccept={translate.accept}
                        buttonCancel={translate.cancel}
                        bodyText={renderWarningText()}
                    />
                </div>
            )
        } else {
            return (
                <div style={{ width: "100%", height: "100%" }}>
                    <div style={{ textAlign: "center" }}>
                        <h6>TABLA CON PARTICIPANTES</h6>
                    </div>
                    <div style={{ paddingBottom: "1em" }}>
                        <BasicButton
                            color={"white"}
                            textStyle={{
                                color: getPrimary(),
                                fontWeight: "700",
                                fontSize: "0.9em",
                                textTransform: "none"
                            }}
                            textPosition="after"
                            buttonStyle={{
                                marginRight: "1em",
                                border: `2px solid ${getPrimary()}`
                            }}
                            onClick={openSelectModal}
                            text={'Añadir'}
                        >
                        </BasicButton>
                    </div>
                    {participants.map(participant => (
                        <div key={`participant_${participant.id}`}>
                            <Card style={{ padding: "1em", display: "flex", justifyContent: "space-between", marginBottom: "1em" }}>
                                <div>
                                    <div><b> {translate.name} </b>: {participant.name}</div>
                                    <div><b> {translate.surname} </b>: {participant.surname}</div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center" }} >
                                    <i
                                        className={"fa fa-times"}
                                        style={{ color: "#000000de" }}
                                        onClick={() => {
                                            if (council.state < 5) {
                                                removeCouncilDelegate(participant.id)
                                            } else {
                                                openDeleteWarning(participant.id);
                                            }
                                        }}
                                    >
                                    </i>

                                </div>

                            </Card>
                        </div>
                    ))}
                    <DelegationsRestrictionModal
                        translate={translate}
                        council={council}
                        open={modal}
                        addCouncilDelegate={addCouncilDelegate}
                        requestClose={closeModal}
                        participantsTable={participants}
                    />
                    <AlertConfirm
                        requestClose={closeDeleteWarning}
                        open={!!warningModal}
                        title={translate.warning}
                        acceptAction={() => removeCouncilDelegate(warningModal)}
                        buttonAccept={translate.accept}
                        buttonCancel={translate.cancel}
                        bodyText={renderWarningText()}
                    />
                </div>
            )
        }
    }

    return (
        fullScreen ?
            <div>
                {_renderBody()}
            </div>
            :
            <Card style={{ padding: "1em", marginTop: "1em", maxWidth: isMobile ? "100%" : "70%" }}>
                {_renderBody()}
            </Card>
    );

}

const HoverRow = ({ children, participant, council, removeCouncilDelegate, openDeleteWarning, select, selected }) => {
    const [hover, setHover] = React.useState(false)

    const onMouseEnterHandler = () => {
        setHover(true)
    }

    const onMouseLeaveHandler = () => {
        setHover(false)
    }

    return (
        <TableRow
            style={{ background: hover && "#ededed", }}
            onMouseEnter={() => onMouseEnterHandler()}
            onMouseLeave={() => onMouseLeaveHandler()}

        >
            <TableCell style={{ opacity: hover ? "1" : selected ? "1" : "0" }}>
                <Checkbox
                    value={selected}
                    onChange={() =>
                        select(participant.id)
                    }
                />
            </TableCell>
            <TableCell>{participant.name}</TableCell>
            <TableCell>{participant.surname}</TableCell>
            <TableCell
                onClick={() => {
                    if (council.state < 5) {
                        removeCouncilDelegate(participant.id)
                    } else {
                        openDeleteWarning(participant.id);
                    }
                }}
                style={{ opacity: hover ? "1" : "0", cursor: "pointer", }}
            >
                <i
                    className={"fa fa-times"}
                    style={{ color: "#000000de" }}
                >
                </i>
            </TableCell>
        </TableRow>
    )
}


export default withApollo(DelegationRestriction);