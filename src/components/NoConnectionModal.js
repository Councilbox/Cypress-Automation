import React from 'react';
import Dialog, {
	DialogTitle
} from "material-ui/Dialog";
import withTranslations from '../HOCs/withTranslations';
import { LoadingSection } from '../displayComponents';

const NoConnectionModal = ({ open, translate }) => (
    <Dialog open={open}>
        <DialogTitle id="simple-dialog-title" style={{ borderBottom: '1px solid gainsboro' }}>{translate.connection_lost}</DialogTitle>
        <div style={{
            minWidth: '500px',
            minHeight: '40vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '3em'
        }}>
            <img src={'/img/logo-icono.png'} alt={'Icon'} style={{ width: '6.5em', height: 'auto', marginBottom: '1.2em' }} />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ fontWeight: '700', fontSize: '1.1em' }}>
                    {!navigator.onLine ? `Sin conexión a internet: ${translate.trying_to_reconnect}` : translate.trying_to_reconnect}
                    <LoadingSection size={20} />
                </div>
            </div>
        </div>
    </Dialog>
)

export default withTranslations()(NoConnectionModal);
