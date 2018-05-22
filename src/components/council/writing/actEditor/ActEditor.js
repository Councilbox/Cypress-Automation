import React, { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import { getSecondary } from '../../../../styles/colors';
import gql from "graphql-tag";
import { BasicButton, ErrorWrapper, LoadingSection } from "../../../../displayComponents";
import Scrollbar from 'react-perfect-scrollbar';
import LoadDraft from '../../../company/drafts/LoadDraft';
import RichTextInput from '../../../../displayComponents/RichTextInput';
import AgendaEditor from "./AgendaEditor";
import { DRAFT_TYPES } from "../../../../constants";
import moment from 'moment';
import Dialog, { DialogContent, DialogTitle } from 'material-ui/Dialog';



const CouncilActData = gql `
query CouncilActData($councilID: Int!, $companyID: Int!) {
    council(id: $councilID) { 
        businessName
        country
        countryState  
        currentQuorum 
        secretary
        president
        street
        city
        dateRealStart
        dateEnd
        firstOrSecondConvene
        act {
            id
            intro
            constitution
            conclusion
        }
        agendas {
            id
            orderIndex
            agendaSubject
            subjectType
            description
            comment
        }
        statute {
            id
            prototype
        }
    }
    companyStatutes(companyId: $companyID){
        id
        prototype
        title
    }
    votingTypes {
      label
      value
    }
}
`;

class ActEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            draftType: null,
            loadDraft: false,
            errors: {}
        }
    }


    static getDerivedStateFromProps(nextProps) {
        if (!nextProps.data.loading) {
            if (nextProps.data.council) {
                return {
                    data: {
                        council: {
                            ...nextProps.data.council
                        }
                    }
                }

            }
        }

        return null;

    }


    updateAct = (object) => {
        this.setState({
            data: {
                ...this.state.data,
                council: {
                    ...this.state.data.council,
                    act: {
                        ...this.state.data.council.act, ...object
                    }
                }
            }
        });
    };

    updateAgenda = (object) => {
        let modifiedAgendas = this.state.data.council.agendas.map((agenda) => {
            if (object.id === agenda.id) {
                return {
                    ...agenda,
                    comment: object.comment
                };
            }
            return agenda;
        });

        this.setState({
            data: {
                ...this.state.data,
                council: {
                    ...this.state.data.council,
                    agendas: modifiedAgendas,
                }
            }
        });
    };

    render() {
        const secondary = getSecondary();
        const { translate } = this.props;
        const { error, loading, votingTypes, council, companyStatutes } = this.props.data;
        const { errors, data } = this.state;

        if (loading) {
            return (<LoadingSection/>);
        }

        if (error) {
            return (<ErrorWrapper error={error} translate={translate}/>)
        }

        return (<div style={{ height: '100%' }}>
            <Scrollbar option={{ suppressScrollX: true }}>
                <RichTextInput
                    ref={(editor) => this.editorIntro = editor}
                    floatingText={translate.intro}
                    type="text"
                    loadDraft={<BasicButton
                        text={translate.load_draft}
                        color={secondary}
                        textStyle={{
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '0.8em',
                            textTransform: 'none',
                            marginLeft: '0.4em',
                            minHeight: 0,
                            lineHeight: '1em'
                        }}
                        textPosition="after"
                        onClick={() => this.setState({
                            loadDraft: true,
                            draftType: DRAFT_TYPES.INTRO
                        })}
                    />}
                    tags={[ {
                        value: `${council.businessName} `,
                        label: translate.business_name
                    }, {
                        value: `${moment(council.dateRealStart).format('LLLL')} `,
                        label: translate.date_real_start
                    }, {
                        value: `${council.firstOrSecondConvene ? translate.first : translate.second} `,
                        label: translate.first_or_second_call
                    }, {
                        value: council.street,
                        label: translate.new_location_of_celebrate
                    }, {
                        value: council.city,
                        label: translate.company_new_locality
                    } ]}
                    errorText={errors.intro}
                    value={data.council.act.intro}
                    onChange={(value) => this.updateAct({
                        intro: value
                    })}
                />
                <RichTextInput
                    ref={(editor) => this.editorConstitution = editor}
                    floatingText={translate.constitution}
                    type="text"
                    loadDraft={<BasicButton
                        text={translate.load_draft}
                        color={secondary}
                        textStyle={{
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '0.8em',
                            textTransform: 'none',
                            marginLeft: '0.4em',
                            minHeight: 0,
                            lineHeight: '1em'
                        }}
                        textPosition="after"
                        onClick={() => this.setState({
                            loadDraft: true,
                            draftType: DRAFT_TYPES.CONSTITUTION
                        })}
                    />}
                    tags={[ {
                        value: `${council.businessName} `,
                        label: translate.business_name
                    }, {
                        value: `${council.president} `,
                        label: translate.president
                    }, {
                        value: `${council.secretary} `,
                        label: translate.secretary
                    }, {
                        value: `${moment(council.dateRealStart).format('LLLL')} `,
                        label: translate.date_real_start
                    }, {
                        value: `${council.firstOrSecondConvene ? translate.first : translate.second} `,
                        label: translate.first_or_second_call
                    }, {
                        value: council.street,
                        label: translate.new_location_of_celebrate
                    }, {
                        value: council.city,
                        label: translate.company_new_locality
                    } ]}
                    errorText={errors.constitution}
                    value={data.council.act.constitution}
                    onChange={(value) => this.updateAct({
                        constitution: value
                    })}
                />
                {!!council.agendas && <Fragment>
                    {council.agendas.map((agenda) => {
                        return <AgendaEditor
                            key={`agenda${agenda.id}`}
                            agenda={agenda}
                            loadDraft={<BasicButton
                                text={translate.load_draft}
                                color={secondary}
                                textStyle={{
                                    color: 'white',
                                    fontWeight: '600',
                                    fontSize: '0.8em',
                                    textTransform: 'none',
                                    marginLeft: '0.4em',
                                    minHeight: 0,
                                    lineHeight: '1em'
                                }}
                                textPosition="after"
                                onClick={() => this.setState({
                                    loadDraft: true,
                                    draftType: DRAFT_TYPES.AGENDA
                                })}
                            />}
                            updateAgenda={this.updateAgenda}
                            translate={translate}
                            typeText={translate[ votingTypes.find((item) => item.value === agenda.subjectType).label ]}
                        />
                    })}
                </Fragment>}
                <RichTextInput
                    ref={(editor) => this.editorConclusion = editor}
                    floatingText={translate.conclusion}
                    type="text"
                    loadDraft={<BasicButton
                        text={translate.load_draft}
                        color={secondary}
                        textStyle={{
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '0.8em',
                            textTransform: 'none',
                            marginLeft: '0.4em',
                            minHeight: 0,
                            lineHeight: '1em'
                        }}
                        textPosition="after"
                        onClick={() => this.setState({
                            loadDraft: true,
                            draftType: DRAFT_TYPES.CONCLUSION
                        })}
                    />}
                    tags={[ {
                        value: `${council.president} `,
                        label: translate.president
                    }, {
                        value: `${council.secretary} `,
                        label: translate.secretary
                    }, {
                        value: `${moment(council.dateEnd).format('LLLL')} `,
                        label: translate.date_end
                    } ]}
                    errorText={errors.conclusion}
                    value={data.council.act.conclusion}
                    onChange={(value) => this.updateAct({
                        conclusion: value
                    })}
                />

            </Scrollbar>
            <Dialog
                open={this.state.loadDraft}
                maxWidth={false}
                onClose={() => this.setState({ loadDraft: false })}
            >
                <DialogTitle>
                    {translate.load_draft}
                </DialogTitle>
                <DialogContent style={{ width: '800px' }}>
                    <LoadDraft translate={translate}
                               companyId={this.props.companyID}
                               loadDraft={this.state.loadDraft}
                               statute={council.statute}
                               statutes={companyStatutes}
                               draftType={this.state.draftType}
                    />
                </DialogContent>
            </Dialog>

        </div>)
    }
}

export default graphql(CouncilActData, {
    name: "data",
    options: (props) => ({
        variables: {
            councilID: props.councilID,
            companyID: props.companyID
        }
    })
})(ActEditor);