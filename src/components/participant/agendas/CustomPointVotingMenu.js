import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton, Radio, ButtonIcon, Checkbox } from '../../../displayComponents';
import { getPrimary, secondary } from '../../../styles/colors';
import { AGENDA_TYPES } from '../../../constants';
import { VotingButton } from './VotingMenu';
import { createMuiTheme, FormControl } from 'material-ui';




const example = {
    agendaSubject: "Prueba de punto selección unica",
    attachments: [],
    councilId: 6561,
    dateEndVotation: null,
    dateStart: null,
    dateStartVotation: "Wed Apr 03 2019 12:13:20 GMT+0200 (Hora de verano romance)",
    description: "",
    id: 8940,
    items: [
        { id: 369, value: "Lorem ipsum d" },
        { id: 370, value: "Aaron" },
        { id: 371, value: "Alberto" },
        { id: 372, value: "Miguel" }
    ],
    options: {
        maxSelections: 2,
        id: 140
    },
    orderIndex: 1,
    pointState: 0,
    subjectType: 6,
    votingState: 1,
}

const ownVoteExample = {
    agendaId: 8940,
    author: {
        id: 20840,
        name: "Aaron",
        representative: null,
        state: 0,
        surname: "Fuentes",
        type: 0
    },
    ballots: [],
    comment: null,
    delegateId: null,
    id: 10079,
    numParticipations: 20,
    participantId: 20840,
    vote: -1
}


const createSelectionsFromBallots = (ballots = [], participantId) => {
    return ballots
        .filter(ballot => ballot.participantId === participantId)
        .map(ballot => {
            return {
                id: ballot.itemId,
                value: ballot.value
            }
        });
}

const CustomPointVotingMenu = ({ agenda = example, translate, updateCustomPointVoting, ...props }) => {
    const [selections, setSelections] = React.useState(createSelectionsFromBallots(ownVoteExample.ballots, ownVoteExample.participantId)); //(props.ownVote.ballots, props.ownVote.participantId));
    const [loading, setLoading] = React.useState(false);
    const primary = getPrimary();

    const addSelection = item => {
        const newSelections = [...selections, cleanObject(item)];
        setSelections(newSelections);
    }

    const getSelectedRadio = id => {
        return !!selections.find(selection => selection.id === id)
    }

    const removeSelection = item => {
        setSelections(selections.filter(selection => selection.id !== item.id));
    }

    const setSelection = item => {
        setSelections([cleanObject(item)]);
    }

    const sendCustomAgendaVote = async () => {
        setLoading(true);
        const response = await updateCustomPointVoting({
            variables: {
                selections,
                votingId: ownVoteExample.id
            }
        });
        await props.refetch();
        setLoading(false);
    }


    if (ownVoteExample.vote !== -1 && ownVoteExample.ballots.length === 0 && agenda.subjectType === AGENDA_TYPES.CUSTOM_PRIVATE) {
        //TRADUCCION
        return 'Tu voto ha sido registrado en la apertura de votos anterior, para preservar el anonimato de los votos, los registrados antes del cierre no pueden ser cambiados';
    }

    // console.log(agenda.options.maxSelections )
    // console.log(selections.length )

    return (
        <div>
            {agenda.options.maxSelections === 1 ?
                <React.Fragment>
                    <FormControl>
                        {agenda.items.map((item, index) => (
                            <React.Fragment>
                                <div key={`item_${item.id}`}>
                                    <VotingButton
                                        styleButton={{ padding: '0' }}
                                        selectCheckBox={getSelectedRadio(item.id)}
                                        onClick={() => setSelection(item)}
                                        text={item.value
                                            // <div style={{ width: "100%" }}>
                                            //     <Radio
                                            //         checked={getSelectedRadio(item.id)}
                                            //         onChange={() => setSelection(item)}
                                            //         name="security"
                                            //         label={item.value}//TRADUCCION
                                            //         styleLabel={{ width: "100%", marginLeft: "0", padding: '8px 16px', marginBottom: "0", marginRight: '0',  }}
                                            //     />
                                            // </div>
                                        }
                                    />
                                </div>
                                {agenda.items.length - 1 === index &&
                                    <React.Fragment>
                                        <VotingButton
                                            text={"Votar"} //TRADUCCION
                                            selectCheckBox={getSelectedRadio(item.id)}
                                        // onClick={() => {
                                        //     if (singleVoteMode) {
                                        //         this.showModal(-1)
                                        //     } else {
                                        //         this.updateAgendaVoting(-1)
                                        //     }
                                        // }}
                                        />
                                        <div>
                                            <VotingButton
                                                text={"Abstencion"} //TRADUCCION
                                                selectCheckBox={getSelectedRadio(item.id)}
                                            // onClick={() => {
                                            //     if (singleVoteMode) {
                                            //         this.showModal(-1)
                                            //     } else {
                                            //         this.updateAgendaVoting(-1)
                                            //     }
                                            // }}
                                            />
                                            <VotingButton
                                                text={"No votar"} //TRADUCCION
                                                selectCheckBox={getSelectedRadio(item.id)}
                                                onClick={() => setSelection(-1)}
                                            // onClick={() => {
                                            //     if (singleVoteMode) {
                                            //         this.showModal(-1)
                                            //     } else {
                                            //         this.updateAgendaVoting(-1)
                                            //     }
                                            // }}
                                            />
                                        </div>
                                    </React.Fragment>
                                }
                            </React.Fragment>
                        ))
                        }
                    </FormControl>
                </React.Fragment>
                :
                <React.Fragment>
                    {agenda.items.map((item, index) => (
                        <React.Fragment key={`item_${item.id}`}>
                            <div >
                                <VotingButton //TODO hacer que se desmarque bien
                                    styleButton={{ padding: '0' }}
                                    selectCheckBox={getSelectedRadio(item.id)}
                                    disabled={agenda.options.maxSelections === selections.length && !getSelectedRadio(item.id)}
                                    styleButton={{ width: "100%" }}
                                    onClick={() => {
                                        if (!getSelectedRadio(item.id)) {
                                            addSelection(item)
                                        } else {
                                            removeSelection(item)
                                        }
                                    }}
                                    text={item.value
                                        // <div style={{ width: "100%" }}>
                                        //     <Checkbox
                                        //         label={item.value}
                                        //         value={getSelectedRadio(item.id)}
                                        //         disabled={agenda.options.maxSelections === selections.length && !getSelectedRadio(item.id)}
                                        //         onChange={(event, isInputChecked) => {
                                        //             if (isInputChecked) {
                                        //                 addSelection(item)
                                        //             } else {
                                        //                 removeSelection(item)
                                        //             }
                                        //         }}
                                        //         styleLabel={{ width: "100%", marginLeft: "0", padding: '8px 16px' }}
                                        //     />
                                        // </div>
                                    }
                                />
                            </div>
                            {agenda.items.length - 1 === index &&
                                <div style={{ paddingTop: "20px" }}>
                                    <VotingButton
                                        text={"Votar"} //TRADUCCION
                                        styleButton={{ width: "100%" }}
                                        color={"silver"}
                                    // selectCheckBox={getSelectedRadio(item.id)}
                                    // onClick={() => {
                                    //     if (singleVoteMode) {
                                    //         this.showModal(-1)
                                    //     } else {
                                    //         this.updateAgendaVoting(-1)
                                    //     }
                                    // }}
                                    />
                                    <div style={{ display: "flex", width: "52.5%" }}>
                                        <VotingButton
                                            styleButton={{ width: "90%" }}
                                            text={"Abstencion"} //TRADUCCION
                                        // selectCheckBox={getSelectedRadio(item.id)}
                                        // onClick={() => {
                                        //     if (singleVoteMode) {
                                        //         this.showModal(-1)
                                        //     } else {
                                        //         this.updateAgendaVoting(-1)
                                        //     }
                                        // }}
                                        />
                                        <VotingButton
                                            styleButton={{ width: "90%" }}
                                            text={"No votar"} //TRADUCCION
                                            selectCheckBox={selections.length === 0}
                                        // onClick={() => }
                                        // onClick={() => {
                                        //     if (singleVoteMode) {
                                        //         this.showModal(-1)
                                        //     } else {
                                        //         this.updateAgendaVoting(-1)
                                        //     }
                                        // }}
                                        />
                                    </div>
                                </div>
                            }
                        </React.Fragment>
                    ))}

                </React.Fragment>
            }
            {/* <BasicButton
                text="Enviar selección"
                textStyle={{fontWeight: '700', color: 'white', marginTop: "12px", color: primary}}
                // color={"gainsboro"}
                icon={<ButtonIcon type="save" color={primary} />}
                loading={loading}
                loadingColor={primary}
                onClick={sendCustomAgendaVote}
            /> */}
        </div>
    )
}


// const CheckRadioButton = ({ value, label, onChange, disabled, }) => (

//         <VotingButton
//             text={
//                 <div
//                     style={{
//                         width:'100%',

//                         flexDirection: 'row',
//                     }}
//                 >
//                 <div style={{justifyContent: "space-between",display: 'flex',}}>
//                     <div style={{ lineHeight: '3' }}>
//                         <span>{label}</span>
//                     </div>
//                     <FormControlLabel
//                         control={<Checkbox checked={value} onChange={onChange} disabled={disabled} />}
//                         style={{marginRight: '0', marginBottom: "0"}}
//                     />
//                 </div>
//             </div>
//             }
//         />
// );



const updateCustomPointVoting = gql`
    mutation updateCustomPointVoting($selections: [PollItemInput]!, $votingId: Int!){
        updateCustomPointVoting(selections: $selections, votingId: $votingId){
            success
        }
    }
`;

const cleanObject = object => {
    const { __typename, ...rest } = object;
    return rest;
}

export default graphql(updateCustomPointVoting, {
    name: 'updateCustomPointVoting'
})(CustomPointVotingMenu);
