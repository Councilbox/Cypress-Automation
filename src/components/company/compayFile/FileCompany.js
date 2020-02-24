import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { CardPageLayout, TextInput, Scrollbar, SelectInput } from '../../../displayComponents';
import MenuSuperiorTabs from '../../dashboard/MenuSuperiorTabs';
import withTranslations from '../../../HOCs/withTranslations';
import { Icon, MenuItem, Card, CardHeader, IconButton } from 'material-ui';
import { getPrimary } from '../../../styles/colors';
import { Collapse } from 'material-ui';
import FileInformacion from './FileInformacion';
import FileOrgAdm from './FileOrgAdm';
import FileLibrosOfi from './FileLibrosOfi';
import FileAuditoresPode from './FileAuditoresPode';
import FileEstatutos from './FileEstatutos';
import FileCalendario from './FileCalendario';



const FileCompany = ({ translate, ...props }) => {
    const [state, setState] = React.useState({
        filterText: ""
    });
    const [selecteOptionMenu, setSelecteOptionMenu] = React.useState('Informacion');
    // necesito council
    console.log(props)

    const getInformacion = () => {
        return (<FileInformacion></FileInformacion>)
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

    return (
        <CardPageLayout title={'Ficha de council'} disableScroll avatar={'asdasd'}>
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