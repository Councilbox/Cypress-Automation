import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { councilActEmail } from '../../../../queries';
import { LoadingSection } from '../../../../displayComponents';



const ActHTML = ({ council, client }) => {
    const [act, setAct] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    const getData = async () => {
        const response = await client.query({
            query: councilActEmail,
            variables: {
                councilId: +council.id
            }
        });

        setAct(response.data.councilAct);
        setLoading(false);
    }

    React.useEffect(() => {
        getData();
    }, [council.id]);


    if(loading){
        return <LoadingSection />
    }

    return(
        <div style={{ width: '100%', position: 'relative' }}>
            <div dangerouslySetInnerHTML={{ __html: act.emailAct }} />
        </div>
    )
}



export default withApollo(ActHTML);
