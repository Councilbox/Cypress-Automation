import React from 'react';
import withTranslations from '../../../HOCs/withTranslations';
import { getSecondary } from '../../../styles/colors';
import { SERVER_URL } from '../../../config';

const RequestDataInfo = ({ translate }) => {
    const secondary = getSecondary();
    const [data, setData] = React.useState(null);

    const getData = React.useCallback(async () => {
        const response = await fetch(`${SERVER_URL}/connectionInfo`);
        const json = await response.json();
        console.log(json);
        setData(json);
    })

    React.useEffect(() => {
        getData();
    }, [getData]);


    //TRADUCCION

    return (
        <div style={{
            padding: '1.8em',
            display: 'flex'
        }}>
            <div style={{fontWeight: '700'}}>
            </div>
            <div style={{fontSize: '1.1em', color: secondary}}>
                {data &&
                    <>
                        <div style={{fontWeight: '700'}}>Conexión segura</div>
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