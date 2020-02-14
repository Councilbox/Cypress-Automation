import React from 'react';
import QrReader from 'react-qr-reader';
import { AlertConfirm } from '../../../../../displayComponents';


const QRSearchModal = ({ updateSearch, open, requestClose, translate }) => {

    const handleError = error => {
        console.log(error);
    }

    const handleScan = data => {
        if (data) {
            console.log(data);
        }
    }

    const renderBody = () => (
        <div
            style={{
                borderRadius: '27px',
                background: "white",
                display: 'flex',
                flexGrow: 1,
                alignItems: 'center',
                justifyContent: 'center',
                overflow: "hidden",
                minHeight: '300px',
                minWidth: '300px',
                zIndex: "1", 
            }}
        >
            <QrReader
                delay={300}
                onError={handleError}
                onScan={handleScan}
                className={'qrEscaner'}
                style={{
                    borderRadius: '27px',
                    width: '100%',
                    height: '100%',
                    border: '1px solid gainsboro !important',
                    boxShadow: 'none !important'
                }}
            />
        </div>
    )

    return (
        <AlertConfirm
            open={open}
            bodyStyle={{padding: '1em 2em', margin: '0'}}
            requestClose={requestClose}
            title={translate.search}
            bodyText={renderBody()}
        />
    )
}

export default QRSearchModal;