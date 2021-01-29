import React from 'react';
import { BasicButton, ButtonIcon, Link, AlertConfirm } from '../../displayComponents';
import { getSecondary } from '../../styles/colors';
import withSharedProps from '../../HOCs/withSharedProps';
import { userCanCreateCompany } from '../../utils/CBX';
import CBXContactButton from '../noCompany/CBXContactButton';
import { sendGAevent } from '../../utils/analytics';


const CompaniesManagerButton = props => {
    const [modal, setModal] = React.useState(false);
    const secondary = getSecondary();

    const showCantCreateModal = () => {
        setModal(true);
    }

    const hideCantCreateModal = () => {
        setModal(false);
    }

    return(
        <div style={{ width: '100%', padding: '1em', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
                {userCanCreateCompany(props.user, props.companies.list) ?
                    <Link to={`/company/${props.company.id}/create`}>
                        <BasicButton
                            text={props.translate.companies_add}
                            color={secondary}
                            id={'entidadesAddSociedad'}
                            onClick={() => sendGAevent({
                                category: 'Editar entidades',
                                action: 'Acceso añadir sociedad',
                                label: props.company.businessName
                            })}
                            icon={<ButtonIcon type="add" color="white" />}
                            textStyle={{ textTransform: 'none', fontWeight: '700', fontSize: '0.9em', color: 'white' }}
                        />
                    </Link>
                :
                    <BasicButton
                        text={props.translate.companies_add}
                        color={'#A0A0A0'}
                        id={'entidadesAddSociedad'}
                        onClick={showCantCreateModal}
                        icon={<ButtonIcon type="add" color="white" />}
                        textStyle={{ textTransform: 'none', fontWeight: '700', fontSize: '0.9em', color: 'white' }}
                    />
                }
            </div>

            <Link to={`/company/${props.company.id}/link`}>
                <div>
                    <BasicButton
                        text={props.translate.companies_link}
                        color={secondary}
                        onClick={() => sendGAevent({
                            category: 'Editar entidades',
                            action: 'Acceso vincular sociedad',
                            label: props.company.businessName
                        })}
                        icon={<ButtonIcon type="link" color="white" />}
                        textStyle={{ textTransform: 'none', fontWeight: '700', fontSize: '0.9em', color: 'white' }}
                    />
                </div>
            </Link>

            <AlertConfirm
                title={props.translate.warning}
                open={modal}
                hideAccept
                buttonCancel={props.translate.close}
                requestClose={hideCantCreateModal}
                bodyText={
                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ marginBottom: '0.8em' }}>
                            {props.translate.to_create_more_need_premium_account}
                        </div>
                        <CBXContactButton
                            translate={props.translate}
                        />
                    </div>
                }
            />
        </div>
    )
}


export default withSharedProps()(CompaniesManagerButton);
