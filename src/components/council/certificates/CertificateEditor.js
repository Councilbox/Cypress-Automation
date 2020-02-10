import React from 'react';
import { TextInput, BasicButton, CardPageLayout, Scrollbar, LoadingSection, SectionTitle, LiveToast } from '../../../displayComponents';
import { graphql, withApollo } from 'react-apollo';
import { createCertificate } from '../../../queries';
import { getSecondary, getPrimary } from '../../../styles/colors';
import { toast } from 'react-toastify';
import { checkForUnclosedBraces, changeVariablesToValues, generateStatuteTag } from '../../../utils/CBX';
import gql from 'graphql-tag';
import { buildDoc, useDoc, buildDocBlock, buildDocVariable } from "../../documentEditor/utils";
import { certBlocks } from "../../documentEditor/actBlocks";
import DocumentEditor2 from "../../documentEditor/DocumentEditor2";
import withSharedProps from '../../../HOCs/withSharedProps';
import { generateActTags, CouncilActData, generateCouncilSmartTagsValues } from '../writing/actEditor/ActEditor';
import GoverningBodyDisplay from '../writing/actEditor/GoverningBodyDisplay';
import { GOVERNING_BODY_TYPES } from '../../../constants';
import DownloadDoc from '../../documentEditor/DownloadDoc';


const initialState = {
    loading: true,
    data: null
}

const dataReducer = (state, action) => {
    const actions = {
        'LOADED': {
            ...state,
            loading: false,
            data: action.value
        },

        default: state
    }

    return actions[action.type]? actions[action.type] : actions.default;

}


const CerficateEditor = ({ translate, council, company, client, ...props }) => {
    //const [loading, setLoading] = React.useState(false);
    const [{ data, loading }, dispatch] = React.useReducer(dataReducer, initialState);
    const [infoMenu, setInfoMenu] = React.useState(false);
    //const [loadingDraftData, setLoadingDraftData] = React.useState(true);
    //const [draftData, setDraftData] = React.useState(null);
    const {
		doc,
        options,
        ...handlers
	} = useDoc({
		transformText: async text => changeVariablesToValues(text, {
			council: {
				...(data),
			},
			company
        }, translate)
	});
    const primary = getPrimary();
    const secondary = getSecondary();


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
		handlers.initializeDoc({
			doc: buildDoc(response.data, translate, 'certificate'),
			options: {
				stamp: true,
				doubleColumn: false,
				language: response.data.council.language,
				secondaryLanguage: 'en'
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
			council: {
                ...generateCouncilSmartTagsValues(data),
                ...(company.governingBodyType === GOVERNING_BODY_TYPES.COUNCIL.value? {
                    president: `${company.governingBodyData.list[0].name} ${company.governingBodyData.list[0].surname}`,
                    secretary: `${company.governingBodyData.list[2].name} ${company.governingBodyData.list[2].surname}`,
                } : {
                    president: '',
                    secretary: ''
                })
            }
		}, translate);
		return correctedText;
	}

	const generatePreview = async () => {
		const response = await client.mutate({
			mutation: gql`
				mutation ACTHTML($doc: Document, $councilId: Int!){
					generateDocumentHTML(document: $doc, councilId: $councilId)
				}
			`,
			variables: {
				doc: buildDocVariable(doc, options),
				councilId: data.council.id
			}
		});
		return response.data.generateDocumentHTML;
	}


    const createCertificate = async () => {
        // if(!checkRequiredFields()){
        //     setLoading(true);
        //     const response = await props.createCertificate({
        //         variables: {
        //             certificate: {
        //                 ...data,
        //                 councilId: council.id,
        //                 date:  new Date().toISOString()
        //             },
        //             points
        //         }
        //     })

        //     if(!response.errors){
        //         if(response.data.createCertificate.success){
        //             setLoading(false);
        //             props.requestClose();
        //         }
        //     }
        // }
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

        //setErrors(errors);

        return Object.keys(errors).length > 0;
    }

    const toggleInfoMenu = () => {
        setInfoMenu(!infoMenu);
    }

    const updateCertificateDate = object => {
        // setData({
        //     ...data,
        //     ...object
        // });
    }

    const updatePoints = (agendaId, check) => {
        // if(check){
        //     setPoints([...points, agendaId]);
        // }else{
        //     const index = points.findIndex(id => agendaId === id);
        //     points.splice(index, 1);
        //     setPoints([...points]);
        // }
    }

    if(loading){
        return <LoadingSection />
    }

    return (
		<React.Fragment>
			<DocumentEditor2
				doc={doc}
				data={data}
				{...handlers}
				blocks={Object.keys(certBlocks).map(key => buildDocBlock(certBlocks[key], data, translate, translate))}
				options={options}
				generatePreview={generatePreview}
				download={true}
				documentMenu={
					<React.Fragment>
						<DownloadDoc
							translate={translate}
							doc={doc}
							options={options}
							council={data.council}
						/>

						{/*}
						<BasicButton
							text={translate.save}
							color={primary}
							onClick={updateAct}
							loading={saving}
							textStyle={{
								color: "white",
								fontSize: "0.9em",
								textTransform: "none"
							}}
							textPosition="after"
							iconInit={<i style={{ marginRight: "0.3em", fontSize: "18px" }} className="fa fa-floppy-o" aria-hidden="true"></i>}
							buttonStyle={{
								marginRight: "1em",
								boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
								borderRadius: '3px'
							}}
						/>
						<BasicButton
							text={translate.finish_and_aprove_act}
							color={secondary}
							textStyle={{
								color: "white",
								fontSize: "0.9em",
								textTransform: "none"
							}}
							onClick={finishAct}
							textPosition="after"
							iconInit={<i style={{ marginRight: "0.3em", fontSize: "18px" }} className="fa fa-floppy-o" aria-hidden="true"></i>}
							buttonStyle={{
								marginRight: "1em",
								boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
								borderRadius: '3px'
							}}
						/> */}

					</React.Fragment>
				}
				translate={translate}
			/>
			{/* <FinishActModal
                show={finishModal}
                generatePreview={generatePreview}
				doc={doc}
				options={options}
				refetch={refetch}
				company={company}
				updateAct={updateAct}
                translate={translate}
                council={data.council}
                requestClose={() => {
                    setFinishModal(false)
                }}
            /> */}
		</React.Fragment>
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