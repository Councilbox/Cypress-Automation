import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { CardPageLayout, LoadingSection } from '../../../displayComponents';
import MenuSuperiorTabs from '../../dashboard/MenuSuperiorTabs';
import withTranslations from '../../../HOCs/withTranslations';
import { getPrimary } from '../../../styles/colors';
import FileInfo from './FileInformacion';
import FileOrgAdm from './FileOrgAdm';
import FileLibrosOfi from './FileLibrosOfi';
import FileAuditoresPode from './FileAuditoresPode';
import FileEstatutos from './FileEstatutos';
import FileCalendario from './FileCalendario';
import { company } from '../../../queries';
import { updateCompany } from '../../../queries/company';


const reducer = (state, action) => {
    console.log(state.data);
    console.log(action.payload);

    const actions = {
        'SET_DATA': () => ({
            ...state,
            loading: false,
            data: {
                ...action.payload,
                file: action.payload.file? action.payload.file : {}
            }
        }),
        'UPDATE_COMPANY_DATA': () => ({
            ...state,
            data: {
                ...state.data,
                ...action.payload
            }
        }),
        'UPDATE_FILE_DATA': () => ({
            ...state,
            data: {
                ...state.data,
                file: {
                    ...state.data.file,
                    ...action.payload
                }
            }
        })
    }

    return actions[action.type]? actions[action.type]() : state;

}


const FileCompany = ({ translate, match, client, ...props }) => {
    const [{ loading, data }, dispatch] = React.useReducer(reducer, {
        loading: true,
        data: null
    });
    const [selecteOptionMenu, setSelecteOptionMenu] = React.useState('Informacion');

    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: company,
            variables: {
                id: match.params.id
            }
        });
        dispatch({ type: 'SET_DATA', payload: response.data.company });
    }, [match.params.id])

    React.useEffect(() => {
        getData();
    }, [getData])

    function checkRequiredFields() {
		let errors = {
			businessName: "",
			tin: ""
		};

		let hasError = false;

		if (!data.businessName) {
			hasError = true;
			errors.businessName = translate.field_required;
		}

		if (!data.tin) {
			hasError = true;
			errors.tin = translate.field_required;
		}

		// setState({
		// 	...state,
		// 	errors: errors
		// });
		return hasError;
	}

    const saveCompany = async () => {
		if (!checkRequiredFields()) {
			const { __typename, creatorId, creationDate, corporationId, ...newData } = data;

			const response = await client.mutate({
                mutation: updateCompany,
				variables: {
					company: newData
				}
            });
            
            console.log(response);
				// toast(
				// 	<LiveToast
				// 		message={translate.changes_saved}
				// 	/>, {
				// 		position: toast.POSITION.TOP_RIGHT,
				// 		autoClose: true,
				// 		className: "successToast"
				// 	}
				// );
				// if (!props.organization) {
				// 	store.dispatch(setCompany(response.data.updateCompany));
				// }
				// bHistory.goBack();

		}
	};

    const updateCompanyData = React.useCallback(object => {
        dispatch({ type: 'UPDATE_COMPANY_DATA', payload: object })
    }, [match.params.id])

    const updateFileData = React.useCallback(object => {
        dispatch({ type: 'UPDATE_FILE_DATA', payload: object })
    }, [match.params.id])

    const getInformacion = () => {
        return (
            <FileInfo
                data={data}
                updateCompanyData={updateCompanyData}
                updateFileData={updateFileData}
                updateCompany={saveCompany}
            />
        )
    }

    const OrgAdministracion = () => {
        return (
            <FileOrgAdm
                data={data}
                updateCompanyData={updateCompanyData}
                updateCompany={saveCompany}
            />
        )
    }

    const librosOficiales = () => {
        return (<FileLibrosOfi></FileLibrosOfi>)
    }

    const auditoresPoderes = () => {
        return (<FileAuditoresPode></FileAuditoresPode>)
    }

    const estatutos = () => {
        return (<FileEstatutos></FileEstatutos>)
    }

    const calendario = () => {
        return (<FileCalendario></FileCalendario>)
    }

    if(loading){
        return <LoadingSection />
    }

    return (
        <CardPageLayout title={`Ficha de ${data.businessName}`} disableScroll avatar={data.logo}>
            {/* company.icon */}
            <div style={{ padding: '1em', height: '100%', paddingTop: "0px" }}>
                <div style={{ display: "flex", padding: '1em', justifyContent: "space-between", paddingTop: "0px", alignItems: "center" }}>
                    <div style={{ fontSize: "13px", }}>
                        <MenuSuperiorTabs
                            items={['Informacion', 'Org. Administración', 'Libros oficiales', 'Auditores y Poderes', translate.statutes, translate.calendar]}
                            setSelect={setSelecteOptionMenu}
                            selected={selecteOptionMenu}
                        />
                    </div>
                </div>
                {selecteOptionMenu === 'Informacion' &&
                    getInformacion()
                }
                {selecteOptionMenu === 'Org. Administración' &&
                    OrgAdministracion()
                }
                {selecteOptionMenu === 'Libros oficiales' &&
                    librosOficiales()
                }
                {selecteOptionMenu === 'Auditores y Poderes' &&
                    auditoresPoderes()
                }
                {selecteOptionMenu === translate.statutes &&
                    estatutos()
                }
                {selecteOptionMenu === translate.calendar &&
                    calendario()
                }
            </div>
        </CardPageLayout>
    )
}

const DividerContenido = ({ titulo, contenido }) => {
    return (
        <div style={{ borderBottom: "1px solid" + getPrimary(), }}></div>
    )
}

export default withTranslations()(withApollo(FileCompany));