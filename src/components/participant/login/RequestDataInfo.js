import React from 'react';
import withTranslations from '../../../HOCs/withTranslations';
import { getSecondary } from '../../../styles/colors';
import { SERVER_URL } from '../../../config';
import shield from '../../../assets/img/shield.svg';
import shieldFail from '../../../assets/img/shield-fail.svg';
import network from '../../../assets/img/network.svg';

const RequestDataInfo = ({ translate, status, message }) => {
    const secondary = getSecondary();
    const [data, setData] = React.useState(null);

    const getData = React.useCallback(async () => {
        const response = await fetch(`${SERVER_URL}/connectionInfo`);
        const json = await response.json();
        console.log(json);
        setData(json);
    }, [])

    React.useEffect(() => {
        getData();
    }, [getData]);


    const getIcon = () => {
        const icons = {
            'SUCCESS': <img src={shield} />,
            'ERROR': <img src={shieldFail} />,
            default: <img src={network} />
        }

        return icons[status]? icons[status] : icons.default;
    }

    console.log(status);

    //TRADUCCION

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
                        <div style={{fontWeight: '700', marginBottom: '0.3em'}}>{message? message : 'Conexión segura'}</div>
                        <div>
                            <span style={{fontWeight: '700'}}>IP</span>
                            {data.requestInfo.ip}
                            <span style={{fontWeight: '700', marginLeft: '2em'}}>{`${data.geoLocation.city}, ${data.geoLocation.zip}`}</span>
                        </div>
                    </>
                }
            </div>

        </div>
    )
}

export default withTranslations()(RequestDataInfo);