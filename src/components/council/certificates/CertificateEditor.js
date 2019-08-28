import React from 'react';
import { TextInput, BasicButton, CardPageLayout, Scrollbar, LoadingSection, SectionTitle, LiveToast } from '../../../displayComponents';
import RichTextInput from "../../../displayComponents/RichTextInput";
import AgendaCheckItem from './AgendaCheckItem';
import { graphql, withApollo } from 'react-apollo';
import { createCertificate } from '../../../queries';
import { getSecondary, getPrimary } from '../../../styles/colors';
import { toast } from 'react-toastify';
import { checkForUnclosedBraces, changeVariablesToValues } from '../../../utils/CBX';
import gql from 'graphql-tag';
import withSharedProps from '../../../HOCs/withSharedProps';
import LoadDraftModal from '../../company/drafts/LoadDraftModal';
import { generateActTags, CouncilActData, generateCouncilSmartTagsValues } from '../writing/actEditor/ActEditor';
import GoverningBodyDisplay from '../writing/actEditor/GoverningBodyDisplay';

const initialState = {
    loadingDraftData: true,
    draftData: null
}

const dataReducer = (state, action) => {
    const actions = {
        'LOADED': {
            ...state,
            loadingDraftData: false,
            draftData: action.value
        },

        default: state
    }

    return actions[action.type]? actions[action.type] : actions.default;

}


const CerficateEditor = ({ translate, council, company, client, ...props }) => {
    const [loading, setLoading] = React.useState(false);
    const [{ loadingDraftData, draftData }, dispatch] = React.useReducer(dataReducer, initialState);
    const [infoMenu, setInfoMenu] = React.useState(false);
    //const [loadingDraftData, setLoadingDraftData] = React.useState(true);
    //const [draftData, setDraftData] = React.useState(null);
    const [data, setData] = React.useState({
        title: '',
        header: '',
        footer: '',
    });
    const [points, setPoints] = React.useState([]);
    const [errors, setErrors] = React.useState({
        title: '',
        header: '',
        footer: ''
    });
    const primary = getPrimary();
    const secondary = getSecondary();
    const footerEditor = React.useRef();
    const headerEditor = React.useRef();

    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: CouncilActData,
            variables: {
                councilID: council.id,
                companyId: council.companyId,
                options: {
                    limit: 10000,
                    offset: 0
                }
            }
        });
        dispatch({ type: 'LOADED', value: response.data });
    }, [council.id]);

    React.useEffect(() => {
        getData();
    }, [getData]);

    const getCorrectedText = async text => {
		const correctedText = await changeVariablesToValues(text, {
			company,
			council: generateCouncilSmartTagsValues(draftData),
		}, translate);
		return correctedText;
	}


    const loadFooterDraft = async draft => {
		const correctedText = await getCorrectedText(draft.text);
		footerEditor.current.paste(correctedText);
    }

    const loadHeaderDraft = async draft => {
        const correctedText = await getCorrectedText(draft.text);
		headerEditor.current.paste(correctedText);
    }

    const createCertificate = async () => {
        if(!checkRequiredFields()){
            setLoading(true);
            const response = await props.createCertificate({
                variables: {
                    certificate: {
                        ...data,
                        councilId: council.id,
                        date:  new Date().toISOString()
                    },
                    points
                }
            })

            if(!response.errors){
                if(response.data.createCertificate.success){
                    setLoading(false);
                    props.requestClose();
                }
            }
        }
    }

    function checkRequiredFields() {

        let errors = {};
        let notify = false;

        if(!data.title){
            errors.title = translate.field_required;
        }

        if(!data.header){
            errors.header = translate.field_required;
        } else {
            if(checkForUnclosedBraces(data.header)){
                errors.header = true;
                notify = true;
            }
        }

        if(!data.footer){
            errors.footer = translate.field_required;
        } else {
            if(checkForUnclosedBraces(data.footer)){
                errors.footer = true;
                notify = true;
            }
        }

        if(notify){
            toast(
                <LiveToast
                    message={translate.revise_text}
                />, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: true,
                    className: "errorToast"
                }
            );
        }

        setErrors(errors);

        return Object.keys(errors).length > 0;
    }

    const toggleInfoMenu = () => {
        setInfoMenu(!infoMenu);
    }

    const updateCertificateDate = object => {
        setData({
            ...data,
            ...object
        });
    }

    const updatePoints = (agendaId, check) => {
        if(check){
            setPoints([...points, agendaId]);
        }else{
            const index = points.findIndex(id => agendaId === id);
            points.splice(index, 1);
            setPoints([...points]);
        }
    }

    if(loadingDraftData){
        return <LoadingSection />
    }

    console.log(draftData);

    return(
        <div style={{width: '100%', height: '100%', display: 'flex'}}>
            <div style={{width: infoMenu? '65%' : '100%', height: '100%', transition: 'width 0.6s'}}>
                <CardPageLayout title={translate.certificate_generate} disableScroll={true}>
                    <div style={{height: 'calc(100% -  3.5em)'}}>
                        <Scrollbar>
                            <div style={{padding: '2em', paddingTop: '1em', paddingBottom: '1em'}}>
                                <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
                                    <BasicButton
                                        text={'Miembros órgano de gobierno'}//TRADUCCION
                                        color={'white'}
                                        type="flat"
                                        textStyle={{ color: secondary }}
                                        buttonStyle={{border: `1px solid ${secondary}`, marginLeft: '0.6em', alignSelf: 'flex-end'}}
                                        onClick={toggleInfoMenu}
                                    />
                                </div>
                                <SectionTitle text={translate.edit_company} color={primary} style={{marginTop: '1.6em'}}/>
                                <div style={{marginBottom: '1.2em', maxWidth: '50em'}}>
                                    <TextInput
                                        floatingText={translate.certificate_title_of}
                                        value={data.title}
                                        errorText={errors.title}
                                        onChange={(event) => updateCertificateDate({
                                            title: event.target.value
                                        })}
                                    />
                                </div>
                                <div style={{marginBottom: '1.2em'}}>
                                    <RichTextInput
                                        floatingText={translate.certificate_header}
                                        value={data.header}
                                        ref={headerEditor}
                                        translate={translate}
                                        errorText={errors.header}
                                        tags={generateActTags('certHeader', {
                                            council: {
                                                attendants: draftData.councilAttendants.list,
                                                agenda: draftData.agendas,
                                                delegatedVotes: draftData.participantsWithDelegatedVote,
                                                ...generateCouncilSmartTagsValues(draftData),
                                            },
                                            company,
                                            recount: draftData.councilRecount
                                        }, translate)}
                                        loadDraft={
                                            <LoadDraftModal
                                                translate={translate}
                                                companyId={council.companyId}
                                                loadDraft={loadHeaderDraft}
                                                statute={draftData.council.statute}
                                                statutes={draftData.companyStatutes}
                                                draftType={7}
                                            />
                                        }
                                        onChange={value => updateCertificateDate({
                                            header: value
                                        })}
                                    />
                                </div>

                                <SectionTitle text={`${translate.include_agenda_points}:`} color={primary} style={{marginTop: '1.6em'}}/>
                                <div style={{marginBottom: '1.2em'}}>
                                    {council.agendas.map(agenda => (
                                        <AgendaCheckItem
                                            key={`agenda_${agenda.id}`}
                                            agenda={agenda}
                                            updatePoints={updatePoints}
                                            checked={points}
                                        />
                                    ))}
                                </div>

                                <SectionTitle text={translate.certificate_footer} color={primary} style={{marginTop: '1.6em'}}/>
                                <RichTextInput
                                    ref={footerEditor}
                                    value={data.footer}
                                    translate={translate}
                                    errorText={errors.footer}
                                    tags={generateActTags('certFooter', {
                                            council: {
                                                attendants: draftData.councilAttendants.list,
                                                agenda: draftData.agendas,
                                                delegatedVotes: draftData.participantsWithDelegatedVote,
                                                ...generateCouncilSmartTagsValues(draftData),
                                            },
                                            company,
                                            recount: draftData.councilRecount
                                        }, translate)}
                                        loadDraft={
                                            <LoadDraftModal
                                                translate={translate}
                                                companyId={council.companyId}
                                                loadDraft={loadFooterDraft}
                                                statute={draftData.council.statute}
                                                statutes={draftData.companyStatutes}
                                                draftType={8}
                                            />
                                        }
                                    onChange={value => updateCertificateDate({
                                        footer: value
                                    })}
                                />
                            </div>
                        </Scrollbar>
                    </div>
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            paddingRight: '1.2em',
                            borderTop: '1px solid gainsboro',
                            justifyContent: 'flex-end',
                            height: '3.5em'
                        }}
                    >
                        <BasicButton
                            text={translate.back}
                            onClick={props.requestClose}
                            loading={loading}
                            type="flat"
                            textStyle={{textTransform: 'none', fontWeight: '700'}}
                            color={'white'}
                            buttonStyle={{marginTop: '0.8em', margingRight: '0.6em'}}
                        />
                        <BasicButton
                            text={translate.certificate_generate}
                            onClick={createCertificate}
                            loading={loading}
                            textStyle={{textTransform: 'none', fontWeight: '700', color: 'white'}}
                            color={secondary}
                            buttonStyle={{marginTop: '0.8em'}}
                        />
                    </div>
                </CardPageLayout>
            </div>
            <div style={{backgroundColor: 'white', width: infoMenu? '35%' : '0', transition: 'width 0.6s', height: '100%'}}>
                <GoverningBodyDisplay
                    translate={translate}
                    company={company}
                    open={infoMenu}
                />
            </div>
        </div>
    )
}

export const query = gql`
	query DraftData($companyId: Int!, $councilId: Int!, $options: OptionsInput) {
        council(id: $councilId) {
			id
			businessName
			country
			countryState
			currentQuorum
			quorumPrototype
			secretary
            president
            emailText
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

		agendas(councilId: $councilId) {
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

		councilRecount(councilId: $councilId){
			socialCapitalTotal
			partTotal
			partPresent
			partRemote
			weighedPartTotal
			numTotal
		}

		participantsWithDelegatedVote(councilId: $councilId){
			id
			name
			surname
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
			councilId: $councilId
			options: $options
		) {
			list {
				id
				name
				surname
				lastDateConnection
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


export default withSharedProps()(withApollo(graphql(createCertificate, {
    name: 'createCertificate'
})(CerficateEditor)));