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


const reducer = (state, action) => {
    const actions = {
        'SET_DATA': () => ({
            ...state,
            loading: false,
            data: action.payload
        }),
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


    const getInformacion = () => {
        return (
            <FileInfo
                data={data}
            />
        )
    }

    const OrgAdministracion = () => {
        return (<FileOrgAdm></FileOrgAdm>)
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
                            items={['Informacion', 'Org. Administración', 'Libros oficiales', 'Auditores y Poderes', 'Estatutos', 'Calendario']}
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
                {selecteOptionMenu === 'Estatutos' &&
                    estatutos()
                }
                {selecteOptionMenu === 'Calendario' &&
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