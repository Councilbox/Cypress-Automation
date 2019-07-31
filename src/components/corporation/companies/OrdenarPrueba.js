import React from 'react';
import { arrayMove } from "react-sortable-hoc";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { Card, Button, MenuItem } from 'material-ui';
import { Grid, GridItem, Scrollbar, AlertConfirm, SelectInput, LoadingSection } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import RichTextInput from '../../../displayComponents/RichTextInput';
import withTranslations from '../../../HOCs/withTranslations';
import { generateActTags } from '../../council/writing/actEditor/ActEditor';
import LoadDraftModal from '../../company/drafts/LoadDraftModal';
import { withApollo } from "react-apollo";
import gql from 'graphql-tag';



const OrdenarPrueba = ({ translate, client }) => {
    const [data, setData] = React.useState(false)
    const [editInfo, setEditInfo] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const [modal, setModal] = React.useState(false)
    const [agendas, setAgendas] = React.useState({ items: [], });
    const [arrastrables, setArrastrables] = React.useState({ items: [] });
    const [act, setAct] = React.useState(false)

    React.useEffect(() => {
        getData()
    }, []) //Poner datos de la url

    const getData = async () => {
        const response = await client.query({
            query: CouncilActData,
            variables: {
                companyId: 569, //props.companyID,
                councilID: 7021,//props.councilID,
                options: {
                    limit: 10000,
                    offset: 0
                }
            }
        });

        if (response) {
            setData(response)
            setLoading(false)
            generateArrastrable(response.data.council.act, response.data.agendas, response.data.councilAttendants.list)
        }
    }

    const generateArrastrable = (act, agendas, attendants) => {
        let objetoArrayAct = Object.entries(act);
        let newArray = []
        objetoArrayAct.forEach(element => {
            if (element[0] !== "id" && element[0] !== '__typename' && element[1] !== "") {
                newArray.push({ id: Math.random().toString(36).substr(2, 9), name: element[0], text: element[1], originalName: element[0], editButton: true })
            }
        });

        agendas.forEach((element, index) => {
            // console.log("-------------")
            // let objetoArrayAgendas = Object.entries(element);
            // console.log(objetoArrayAgendas)
            // console.log("-------------")
            newArray.push({ id: Math.random().toString(36).substr(2, 9), name: "Punto " + (index + 1) + " - " + translate.title, text: element.agendaSubject, editButton: true })//TRADUCCION
            if (element.description) {
                newArray.push({ id: Math.random().toString(36).substr(2, 9), name: "Punto " + (index + 1) + " - " + translate.description, text: element.description, editButton: true })//TRADUCCION
            }
            if (element.comment) {
                newArray.push({ id: Math.random().toString(36).substr(2, 9), name: "Punto " + (index + 1) + " - Toma de acuerdos", text: element.comment, editButton: true }) //TRADUCCION
            }
            newArray.push({ id: Math.random().toString(36).substr(2, 9), name: "Punto " + (index + 1) + " - Votaciones", text: " A FAVOR: ... | EN CONTRA: ... | ABSTENCIONES: ... | NO VOTAN: ...", editButton: false }) //TRADUCCION
            newArray.push({ id: Math.random().toString(36).substr(2, 9), name: "Punto " + (index + 1) + " - Votos", text: element.description, editButton: false })//TRADUCCION
            newArray.push({ id: Math.random().toString(36).substr(2, 9), name: "Punto " + (index + 1) + " - Comentarios", text: element.description, editButton: false })//TRADUCCION
        });
        let assistants = ""
        attendants.forEach(element => {
            assistants = element.name + " " + element.surname + " con DNI " + element.dni + "  Firma: ..."
        });
        newArray.push({ id: Math.random().toString(36).substr(2, 9), name: translate.assistants_list, text: assistants, editButton: false })

        setArrastrables({ items: newArray })
    }

    const addItem = (id) => {
        if (agendas.items[0] === undefined) {
            agendas.items = new Array;
        }
        const resultado = arrastrables.items.find(arrastrable => arrastrable.id === id);
        let arrayArrastrables = arrastrables.items.filter(arrastrable => arrastrable.id !== id)
        setArrastrables({ items: arrayArrastrables })
        agendas.items.push(resultado)
        setAgendas(agendas)
        onSortEnd(0, 0)
    }

    const onSortEnd = ({ oldIndex, newIndex }) => {
        setAgendas(({ items }) => ({
            items: arrayMove(items, oldIndex, newIndex),
        }));
    };

    const shouldCancelStart = (event) => {
        if (event.target.tagName.toLowerCase() === 'i' && event.target.classList[2] !== undefined) {

            return true
        }
        if (event.target.tagName.toLowerCase() === 'i' && event.target.classList[2] === undefined) {
            return true
        }
        if (event.target.tagName.toLowerCase() === 'button' ||
            event.target.tagName.toLowerCase() === 'span') {
            return true
        }

    };

    const openModal = (item) => {
        setEditInfo(item)
        setModal(true)
    };

    const _renderModal = () => {
        if (editInfo) {
            console.log(data.data)
            return (
                <div>
                    <div style={{ paddingBottom: "1em", fontWeight: "700" }}>{editInfo.name}</div>
                    <RichTextInput
                        value={editInfo.text || ''}
                        translate={translate}
                        tags={generateActTags(editInfo.originalName, { council: data.data.council, company: 7021, recount: data.data.councilRecount }, translate)}
                    // errorText={"asdasd"}
                    // onChange={value => this.updateState({ description: value })}
                    // loadDraft={
                    //     <LoadDraftModal
                    //         translate={translate}
                    //         companyId={council.companyId}
                    //         loadDraft={loadHeaderDraft}
                    //         statute={draftData.council.statute}
                    //         statutes={draftData.companyStatutes}
                    //         draftType={7}
                    //     />
                    // }
                    />
                </div>
            );
        }
    };

    const remove = (id, index) => {
        let resultado = agendas.items.find(agendas => agendas.id === id);
        let arrayAgendas = agendas.items.filter(agendas => agendas.id !== id)
        setAgendas({ items: arrayAgendas })
        arrastrables.items.push(resultado)
        setArrastrables(arrastrables)
    };

    const moveUp = (id, index) => {
        if (index > 0) {
            setAgendas(({ items }) => ({
                items: arrayMove(items, index, (index - 1)),
            }));
        }
    };

    const moveDown = (id, index) => {
        if ((index + 1) < agendas.items.length) {
            setAgendas(({ items }) => ({
                items: arrayMove(items, index, (index + 1)),
            }));
        }
    };

    return (
        <div style={{ width: "100%", height: "100%" }}>
            {loading ?
                <LoadingSection></LoadingSection>
                :
                <React.Fragment>
                    <div style={{ borderBottom: "1px solid gainsboro" }}>{/*height: "3em" */}
                        <div style={{ display: "flex", alignItems: "center", padding: "0px 1em" }}>
                            <div>
                                <SelectInput
                                    value={0}
                                    floatingText={'Plantillas'}
                                >
                                    <MenuItem value={0}>Default</MenuItem>
                                </SelectInput>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", height: "100%" }}>
                        <div style={{ borderRight: "1px solid gainsboro", width: "40%", overflow: "hidden", height: "calc( 100% - 3em )" }}>
                            <div style={{ margin: "1.5em", height: "calc( 100% - 3em )", borderRadius: "8px", background: "white" }}>
                                <Scrollbar>
                                    <Grid style={{ justifyContent: "space-between", width: "98%", padding: "1em", paddingTop: "1.5em" }}>
                                        {arrastrables.items.map((item, index) => (
                                            <ActionToInsert
                                                xs={12}
                                                md={12}
                                                lg={12}
                                                addItem={addItem}
                                                text={item.text}
                                                name={item.name}
                                                itemInfo={item.id}
                                                key={index + item.id}
                                            />
                                        ))
                                        }
                                    </Grid>
                                </Scrollbar>
                            </div>
                        </div>
                        <div style={{ width: "60%", height: "calc( 100% - 3em )", }}>
                            <div style={{ margin: "1.5em", height: "calc( 100% - 3em )", borderRadius: "8px", background: "white" }}>
                                <Scrollbar>
                                    <div style={{ padding: "1em" }}>
                                        <SortableList
                                            items={agendas.items}
                                            offset={agendas.items.lenght}
                                            onSortEnd={onSortEnd}
                                            helperClass="draggable"
                                            shouldCancelStart={event => shouldCancelStart(event)}
                                            moveUp={moveUp}
                                            moveDown={moveDown}
                                            openModal={openModal}
                                            remove={remove}
                                        />
                                    </div>
                                </Scrollbar>
                            </div>
                        </div>
                    </div>
                    <AlertConfirm
                        requestClose={() => setModal(false)}
                        open={modal}
                        // acceptAction={this.updateAttachment}
                        buttonAccept={translate.accept}
                        buttonCancel={translate.cancel}
                        bodyText={_renderModal()}
                        title={translate.edit}
                    />
                </React.Fragment>
            }
        </div>
    )

}

const ActionToInsert = ({ xs, md, lg, addItem, icon, text, name, itemInfo }) => {
    const [hover, setHover] = React.useState(false);

    const onMouseEnter = () => {
        setHover(true)
    }

    const onMouseLeave = () => {
        setHover(false)
    }

    return (
        <GridItem
            key={itemInfo}
            xs={xs}
            md={md}
            lg={lg}
            style={{ overflow: "hidden", marginRight: "1em" }}
        >
            <div
                style={{
                    border: "1px solid gainsboro",
                    borderRadius: "3px",
                    boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
                    // background: hover ? "#dcdcdc59" : "white",
                    background: "white",
                    padding: "1em",
                }}
            >
                <div style={{}}>
                    <div style={{ fontWeight: 700, display: "flex", justifyContent: "space-between" }}>
                        <div style={{ textTransform: "capitalize" }}>
                            {name}
                        </div>
                        <div
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                            style={{ cursor: "pointer", }}
                            onClick={() => addItem(itemInfo)}
                        >
                            <i className={"fa fa-arrow-right"} style={{ color: hover && "black" }} aria-hidden="true"></i>
                        </div>
                    </div>
                    <div style={{
                        marginTop: "1em",
                        maxHeight: "6.6em",
                        overflow: "hidden",
                        border: "1px solid gainsboro",
                        padding: "1em",
                    }}>
                        <div style={{
                            overflow: "hidden",
                            display: '-webkit-box',
                            WebkitLineClamp: '3',
                            WebkitBoxOrient: 'vertical',
                        }}
                            dangerouslySetInnerHTML={{
                                __html: text
                            }}  >
                        </div>
                    </div>
                </div>
            </div>
        </GridItem>
    );
};


const SortableList = SortableContainer(({ items, offset = 0, moveUp, moveDown, openModal, remove }) => {

    return (
        <div >
            {items &&
                items.map((item, index) => (
                    <DraggableBlock
                        key={`item-${item.id}`}
                        index={offset + index}
                        value={item}
                        id={item.id}
                        indexItem={index}
                        moveUp={moveUp}
                        moveDown={moveDown}
                        openModal={openModal}
                        remove={remove}
                    />
                ))

            }
        </div>
    );
});


const DraggableBlock = SortableElement((props) => {

    return (
        props.value !== undefined && props.value.text !== undefined &&
        <Card
            key={props.id}
            style={{
                opacity: 1,
                width: "100%",
                display: "flex",
                alignItems: "center",
                padding: "0.5em",
                border: `2px solid gainsboro}`,
                listStyleType: "none",
                borderRadius: "3px",
                cursor: "grab",
                marginTop: "0.5em",
                justifyContent: "space-between",
                position: "relative"
            }}
            className="draggable"
        >
            <div style={{ width: "25px", cursor: "pointer", position: "absolute", top: "5px", right: "0" }}>
                <IconsDragActions
                    clase={`fa fa-times ${props.id}`}
                    aria-hidden="true"
                    click={props.remove}
                    id={props.id}
                    indexItem={props.indexItem}
                />
            </div>
            <div style={{ width: "25px", cursor: "pointer", position: "absolute", top: "35px", right: "1px", }}>
                <div>
                    <IconsDragActions
                        clase={`fa fa-arrow-up`}
                        aria-hidden="true"
                        click={props.moveUp}
                        id={props.id}
                        indexItem={props.indexItem}
                    />
                </div>
                <div>
                    <IconsDragActions
                        clase={`fa fa-arrow-down`}
                        aria-hidden="true"
                        click={props.moveDown}
                        id={props.id}
                        indexItem={props.indexItem}
                    />
                </div>
            </div>
            <div style={{ padding: "1em", paddingRight: "1.5em" }}>
                <div style={{ fontWeight: "700" }}>
                    {props.value.name}
                </div>
                <div style={{ marginTop: "1em" }} dangerouslySetInnerHTML={{
                    __html: props.value.text
                }}>
                </div>
                <div style={{ marginTop: "1em", }}>
                    {props.value.editButton &&
                        <Button style={{ color: getPrimary(), minWidth: "0", padding: "0" }} onClick={() => props.openModal(props.value)}>
                            Editar
                        </Button>
                    }
                </div>
            </div>
        </Card>
    );
});


const IconsDragActions = ({ clase, click, id, indexItem }) => {
    const [hover, setHover] = React.useState(false);

    const onMouseEnter = () => {
        setHover(true)
    }
    const onMouseLeave = () => {
        setHover(false)
    }

    return (
        <i
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={clase}
            style={{ background: hover && "gainsboro", padding: "2px 3px 2px 3px", borderRadius: "10px" }}
            aria-hidden="true"
            onClick={() => click(id, indexItem)}
        >
        </i>
    )
}


const CouncilActData = gql`
	query CouncilActData($councilID: Int!, $companyId: Int!, $options: OptionsInput ) {
		council(id: $councilID) {
			id
			businessName
			country
			countryState
			currentQuorum
			quorumPrototype
			secretary
			president
			street
			city
			name
			remoteCelebration
			dateStart
			dateStart2NdCall
			dateRealStart
			dateEnd
			qualityVoteId
			firstOrSecondConvene
			act {
				id
				intro
				constitution
				conclusion
			}
			statute {
				id
				statuteId
				prototype
				existsQualityVote
			}
		}

		agendas(councilId: $councilID) {
			id
			orderIndex
			agendaSubject
			subjectType
			abstentionVotings
			abstentionManual
			noVoteVotings
			noVoteManual
			positiveVotings
			positiveManual
			negativeVotings
			negativeManual
			description
			majorityType
			majority
			majorityDivider
			items {
				id
				value
			}
			options {
				id
				maxSelections
			}
			ballots {
				id
				participantId
				weight
				value
				itemId
			}
			numNoVoteVotings
			numPositiveVotings
			numNegativeVotings
			numAbstentionVotings
			numPresentCensus
			presentCensus
			numCurrentRemoteCensus
			currentRemoteCensus
			comment
		}

		councilRecount(councilId: $councilID){
			socialCapitalTotal
			partTotal
			partPresent
			partRemote
			weighedPartTotal
			numTotal
		}

		participantsWithDelegatedVote(councilId: $councilID){
			id
			name
            surname
            dni
			state
			representative {
				id
				name
				surname
			}
		}

		votingTypes {
			label
			value
		}

		councilAttendants(
			councilId: $councilID
			options: $options
		) {
			list {
				id
				name
				surname
                lastDateConnection
                dni
			}
		}

		companyStatutes(companyId: $companyId) {
			id
			title
			censusId
		}

		majorityTypes {
			label
			value
		}
	}
`;

export default withApollo(withTranslations()(OrdenarPrueba));