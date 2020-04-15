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
        let json = await response.json();

        if(!json.geoLocation){
            if('geolocation' in navigator){
                navigator.geolocation.getCurrentPosition(async position => {
                    const geoRequest = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${
                        position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=${translate.selectedLanguage}`);
                    if(geoRequest.status === 200){
                        const geoLocation = await geoRequest.json();
                        json.geoLocation = {
                            city: geoLocation.locality,
                            state: geoLocation.principalSubdivision,
                            country: geoLocation.countryCode
                        }
                    }
                });
                
            }
        }

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

    //TRADUCCION

    if(data){
        if(!data.geoLocation){
            //alert('no pilla geo');
        }
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
                            <span style={{fontWeight: '700'}}>IP</span>
                            {data.requestInfo.ip}
                            {data.geoLocation &&
                                <>
                                    <span style={{fontWeight: '700', marginLeft: '2em'}}>{`${data.geoLocation.city}, ${data.geoLocation.zip? data.geoLocation.zip : data.geoLocation.state}`}</span>
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