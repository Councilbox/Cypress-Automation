import React from 'react';
import { TextInput, BasicButton, CardPageLayout, Scrollbar, LoadingSection, SectionTitle, LiveToast } from '../../../displayComponents';
import { graphql, withApollo } from 'react-apollo';
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
import CreateCertificateModal from './CreateCertificateModal';


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
    const [{ data, loading }, dispatch] = React.useReducer(dataReducer, initialState);
	const [infoMenu, setInfoMenu] = React.useState(false);
	const [error, setError] = React.useState(null);
    const [createModal, setCreateModal] = React.useState(false);
    const {
		doc,
        options,
        ...handlers
	} = useDoc({
		transformText: async text => changeVariablesToValues(text, {
			council: {
				...generateCouncilSmartTagsValues(data),
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


    if(loading){
        return <LoadingSection />
    }

    return (
		<React.Fragment>
			<DocumentEditor2
				doc={doc}
				data={data}
				{...handlers}
				blocks={Object.keys(certBlocks).map(key => buildDocBlock(certBlocks[key], data, data.council.language, 'en'))}
				options={options}
				generatePreview={generatePreview}
				download={true}
				documentMenu={
					<div style={{display: 'flex', flexDirection: 'column'}}>
						<div>
							<DownloadDoc
								translate={translate}
								doc={doc}
								options={options}
								council={data.council}
							/>
							<BasicButton
								text={translate.certificate_generate}
								color={secondary}
								textStyle={{
									color: "white",
									fontSize: "0.9em",
									textTransform: "none"
								}}
								onClick={() => setCreateModal(true)}
								textPosition="after"
								iconInit={<i style={{ marginRight: "0.3em", fontSize: "18px" }} className="fa fa-floppy-o" aria-hidden="true"></i>}
								buttonStyle={{
									marginRight: "1em",
									boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
									borderRadius: '3px'
								}}
							/>
						</div>
						{error &&
							<div style={{color: 'red', fontWeight: '700', marginTop: '1em'}}>
								{error}
							</div>
						}
					</div>
				}
				translate={translate}
			/>
			<CreateCertificateModal
				open={createModal}
				councilId={council.id}
				doc={doc}
				setError={setError}
				company={company}
				options={options}
				generatePreview={generatePreview}
				translate={translate}
				closeEditor={props.requestClose}
				requestClose={() => setCreateModal(false)}
			/>
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


export default withSharedProps()(withApollo(CerficateEditor));