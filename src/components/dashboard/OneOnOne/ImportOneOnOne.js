import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { getPrimary } from '../../../styles/colors';
import { moment } from '../../../containers/App';
import { AlertConfirm, BasicButton, FileUploadButton, ButtonIcon, LoadingSection } from '../../../displayComponents';

let XLSX;
import('xlsx').then(data => { XLSX = data; });

function to_json(workbook) {
    const result = {};
    workbook.SheetNames.forEach(sheetName => {
        const roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        if (roa.length > 0) {
            result[sheetName] = roa;
        }
    });
    return result;
}

const itemRefs = [];

const ImportOneOneOne = ({ translate, client }) => {
    const [modal, setModal] = React.useState(false);
    const [step, setStep] = React.useState(1);
    const [councilsToCreate, setCouncilsToCreate] = React.useState([]);
    const [createdCouncils, setCreatedCouncils] = React.useState([]);
    const [creatingIndex, setCreatingIndex] = React.useState(-1);
    const [status, setStatus] = React.useState('IDDLE');
    const primary = getPrimary();

    const read = workbook => {
        const wb = XLSX.read(workbook, { type: 'binary' });
        return to_json(wb);
    };

    const createOneOnOneCouncil = async council => client.mutate({
        mutation: gql`
                mutation createOneOnOneCouncil(
                    $council: CouncilInput,
                    $participant: ParticipantInput
                    $agenda: [AgendaPointInput]
                    ){
                    createOneOnOneCouncil(
                        council: $council,
                        participant: $participant,
                        agenda: $agenda
                    ){
                        id
                        dateStart
                    }
                }
            `,
        variables: council
    });

    const cleanAndClose = () => {
        setStep(1);
        setModal(false);
        setCouncilsToCreate([]);
        setCreatedCouncils([]);
        setCreatingIndex(-1);
        setStatus('IDDLE');
    };

    const scrollTo = id => {
        if (itemRefs[id] != null) {
            itemRefs[id].scrollIntoView();
        }
    };

    const startCreating = async () => {
        setStatus('CREATING');
        for (let i = 0; i < councilsToCreate.length; i++) {
            const newCouncil = councilsToCreate[i];
            setCreatingIndex(i);
            const response = await createOneOnOneCouncil(newCouncil);
            createdCouncils.push(response);
            setCreatedCouncils([...createdCouncils]);
            scrollTo(i);
        }
        setStatus('CREATED');
    };



    const handleFile = async event => {
        const file = event.nativeEvent.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.readAsBinaryString(file);

        reader.onload = async () => {
            const result = await read(reader.result);
            const pages = Object.keys(result);
            if (pages.length >= 1) {
                const processedCouncils = result[pages[0]].filter(row => !!row['council.externalId']).map(row => ({
                    'council': {
                        'name': row['council.name'],
                        'externalId': row['council.externalId'],
                        'companyExternalId': row['council.companyExternalId'],
                        'contactEmail': row['council.contactEmail'],
                        'dateStart': moment(row['council.dateStart'], 'MM/DD/YYYY HH:mm').toISOString(),
                        'conveneText': row['council.conveneText']
                    },
                    'participant': {
                        'name': row['participant.name'],
                        'dni': row['participant.dni'],
                        'surname': row['participant.surname'] || '',
                        'email': row['participant.email'],
                        'phone': row['participant.phone']
                    },
                    agenda: [
                        {
                            'type': +row['agenda1.type'] || 9,
                            'templateId': +row['agenda1.id']
                        },
                        {
                            'type': +row['agenda2.type'] || 9,
                            'templateId': +row['agenda2.id']
                        },
                        {
                            'type': +row['agenda3.type'] || 9,
                            'templateId': +row['agenda3.id']
                        },
                        {
                            'type': +row['agenda4.type'] || 9,
                            'templateId': +row['agenda4.id']
                        }
                    ].filter(agenda => !!agenda.templateId)
                }));

                setCouncilsToCreate(processedCouncils);
                setStep(2);
            } else {
                console.error(result);
            }
        };
    };

    const getButtonOptions = () => {
        if (step === 1 || councilsToCreate.length === 0 || status === 'CREATING') {
            return {};
        }

        if (status === 'CREATED') {
            return {
                buttonCancel: translate.close,
            };
        }

        if (step === 2) {
            return {
                buttonCancel: translate.cancel,
                buttonAccept: 'Importar',
                acceptAction: startCreating
            };
        }
    };

    return (
        <>
            <AlertConfirm
                open={modal}
                title={'Importar citas'}
                {...getButtonOptions()}
                bodyText={
                    <div>
                        {step === 1 &&
                            <FileUploadButton
                                accept=".xlsx"
                                //loading={this.state.loading}
                                text={translate.import_template}
                                style={{
                                    width: '100%'
                                }}
                                buttonStyle={{ width: '100%' }}
                                color={primary}
                                textStyle={{
                                    color: 'white',
                                    fontWeight: '700',
                                    fontSize: '0.9em',
                                    textTransform: 'none'
                                }}
                                icon={
                                    <ButtonIcon type="publish" color="white" />
                                }
                                onChange={handleFile}
                            />
                        }
                        {step === 2 &&
                            <>
                                <h5>Citas que se van a crear</h5>
                                {councilsToCreate.length > 0 ?
                                    councilsToCreate.map((item, index) => {
                                        const result = createdCouncils[index];
                                        const hasError = result && result.errors && !!result.errors[0];

                                        return (
                                            <div
                                                key={`council_to_create_${index}`}
                                                ref={el => { itemRefs[index] = el; }}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    color: hasError ? 'red' : 'inherit'
                                                }}
                                            >
                                                <div>
                                                    <b>
                                                        {item.council.externalId && `${item.council.externalId} - `}
                                                        {item.council.name}
                                                    </b>{' - '}
                                                    <span>{moment(item.council.dateStart).format('DD/MM/YYYY HH:mm')}</span>
                                                    {hasError &&
                                                        <>
                                                            <br />
                                                            {result.errors[0].message === 'The request has invalid values' &&
                                                                'La cita contiene valores no válidos'
                                                            }
                                                            {result.errors[0].message === 'External ID already used' &&
                                                                'El código de cita ya está registrado'
                                                            }
                                                        </>
                                                    }
                                                </div>
                                                {status !== 'IDDLE' &&
                                                    <div>
                                                        {result ?
                                                            <>
                                                                {(result.data.createOneOnOneCouncil && result.data.createOneOnOneCouncil.id) &&
                                                                    <i className="fa fa-check" style={{ color: 'green' }}></i>
                                                                }
                                                                {hasError &&
                                                                    <i className="fa fa-times" style={{ color: 'red' }}></i>
                                                                }
                                                            </>
                                                            :
                                                            creatingIndex === index ?
                                                                <LoadingSection size={12} />
                                                                :
                                                                'En cola'
                                                        }
                                                    </div>
                                                }
                                            </div>
                                        );
                                    })
                                    :
                                    'Sin citas válidas'
                                }

                            </>
                        }
                    </div>
                }
                requestClose={cleanAndClose}
            />
            <BasicButton
                text="Importar citas"
                onClick={() => setModal(true)}
                backgroundColor={{
                    fontSize: '12px',
                    fontStyle: 'Lato',
                    fontWeight: 'bold',
                    color: primary,
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)'
                }}
            />
        </>
    );
};

export default withApollo(ImportOneOneOne);
