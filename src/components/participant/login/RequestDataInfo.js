import React from 'react';
import withTranslations from '../../../HOCs/withTranslations';
import { getSecondary } from '../../../styles/colors';



const RequestDataInfo = ({ data, translate }) => {
    const secondary = getSecondary();

    if(!data){
        return null;
    }

    //TRADUCCION

    return (
        <div style={{ border: `1px solid ${secondary}`, borderRadius: '5px', padding: '1em', marginTop: '1em'}}>
            {translate.connection_data}
            <div>
                IP: {data.requestInfo.ip}
            </div>
            <div>
                Localización: {`${data.geoLocation.city || ''}, ${data.geoLocation.zip || ''}, ${data.geoLocation.regionName || ''}`}
            </div>
        </div>
    )
}

export default withTranslations()(RequestDataInfo);