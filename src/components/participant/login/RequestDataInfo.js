import React from 'react';
import withTranslations from '../../../HOCs/withTranslations';
import { getSecondary } from '../../../styles/colors';
import { SERVER_URL } from '../../../config';
import shield from '../../../assets/img/shield.svg';
import shieldFail from '../../../assets/img/shield-fail.svg';
import network from '../../../assets/img/network.svg';
import { ConnectionInfoContext } from '../../../containers/ParticipantContainer';
import { formatCountryName } from '../../../utils/CBX';

const RequestDataInfo = ({ translate, status, message }) => {
    const secondary = getSecondary();
    const { data } = React.useContext(ConnectionInfoContext);

    const getIcon = () => {
        const icons = {
            'SUCCESS': <img src={shield} />,
            'ERROR': <img src={shieldFail} />,
            default: <img src={network} />
        }

        return icons[status]? icons[status] : icons.default;
    }

    return (
        <div style={{
            padding: '1.8em',
            display: 'flex'
        }}>
            <div style={{fontWeight: '700', paddingRight: '1.8em'}}>
                {getIcon()}
            </div>
            <div style={{fontSize: '1.1em', color: status === 'ERROR'? 'red' : secondary}}>
                {data &&
                    <>
                        <div style={{fontWeight: '700', marginBottom: '0.3em'}}>{message? message : translate.secure_connection}</div>
                        <div>
                            <span style={{fontWeight: '700', marginRight: '0.5em'}}>IP:</span>
                            {data.requestInfo && data.requestInfo.ip}
                            {data.geoLocation &&
                                <>
                                    <span style={{fontWeight: '700', marginLeft: '2em'}}>{
                                        `${data.geoLocation.city}, ${formatCountryName(data.geoLocation.country, translate.selectedLanguage)
                                    }`}</span>
                                </>
                            }
                        </div>
                    </>
                }
            </div>

        </div>
    )
}

export default withTranslations()(RequestDataInfo);