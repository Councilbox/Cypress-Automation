import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { getPrimary } from '../../../styles/colors';
import { AlertConfirm, BasicButton, FileUploadButton, ButtonIcon } from '../../../displayComponents';
let XLSX;
import('xlsx').then(data => XLSX = data);

function to_json(workbook) {
	let result = {};
	workbook.SheetNames.forEach(sheetName => {
		let roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
		if (roa.length > 0) {
			result[sheetName] = roa;
		}
	});
	return result;
}

const ImportOneOneOne = ({ translate, company }) => {
    const [modal, setModal] = React.useState(false);
    const primary = getPrimary();

    const read = workbook => {
		const wb = XLSX.read(workbook, { type: 'binary' });
		return to_json(wb);
	};

    const handleFile = async event => {
		const file = event.nativeEvent.target.files[0];
		if (!file) {
			return;
		}

		let reader = new FileReader();
		reader.readAsBinaryString(file);

		reader.onload = async () => {
            /*
                : "112"
                : "4186"
                Id. Consentimiento #2: "4187"
                : "9"
                Tipo Consentimiento #2: "9"
                Tipo Consentimiento #3: "9"
                Tipo Consentimiento #4: "9"

            */


			const result = await read(reader.result);
			const pages = Object.keys(result);
			if (pages.length >= 1) {
                console.log(result[pages[0]].filter(row => !!row['Identificador de la Cita Previa']).map(row => {
                    return {
                        "council": {
                            "name": row['Nombre del tramite'],
                            "externalId": row['Identificador de la Cita Previa'],
                            "companyExternalId": row['ID de la Sede'],
                            "contactEmail": row['Buzon de soporte'],
                            "dateStart": row['Fecha y Hora'],
                            "conveneText": row['Observaciones']
                        },
                        "participant": {
                            "name": row['Nombre del Solicitante'],
                            "dni": row['Documento del Solicitante'],
                            "surname": row['Datos complementarios Solicitante'] || '',
                            "email": row['Email del Solicitante'],
                            "phone": row['Teléfono del solicitante']
                        },
                        agenda: [
                            {
                                "subjectType": row['Tipo Consentimiento #1'],
                                "template": row['Id. Consentimiento #1']
                            },
                            {
                                "subjectType": row['Tipo Consentimiento #2'],
                                "template": row['Id. Consentimiento #2']
                            },
                            {
                                "subjectType": row['Tipo Consentimiento #3'],
                                "template": row['Id. Consentimiento #3']
                            },
                            {
                                "subjectType": row['Tipo Consentimiento #4'],
                                "template": row['Id. Consentimiento #4']
                            }
                        ].filter(agenda => !!agenda.template)
                    }
                }));
                

			} else {
				console.error(result);
			}
		};
	};

    return (
        <>
            <AlertConfirm
                open={modal}
                title={'Importar citas'}
                bodyText={
                    <div>
                        <FileUploadButton
                            accept=".xlsx"
                            //loading={this.state.loading}
                            text={translate.import_template}
                            style={{
                                width: "100%"
                            }}
                            buttonStyle={{ width: "100%" }}
                            color={primary}
                            textStyle={{
                                color: "white",
                                fontWeight: "700",
                                fontSize: "0.9em",
                                textTransform: "none"
                            }}
                            icon={
                                <ButtonIcon type="publish" color="white" />
                            }
                            onChange={handleFile}
                        />
                    </div>
                }
                requestClose={() => setModal(false)}
            />
            <BasicButton
                text="Importar citas"
                onClick={() => setModal(true)}
                backgroundColor={{
                    fontSize: "12px",
                    fontStyle: "Lato",
                    fontWeight: 'bold',
                    color: primary,
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)'
                }}
            />
        </>
    )
}

export default ImportOneOneOne;