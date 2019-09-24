import React from 'react';


const councilID = 7021;

const DocumentEditor = ({ council }) => {
    const [data, setData] = React.useState(false);

    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: CouncilActData,
            variables: {
                companyId: 569, //props.companyID,
                councilID,
                options: {
                    limit: 10000,
                    offset: 0
                }
            }
        });

        if (response) {
            setData(response)
            setLoading(false)
            generateArrastrable(response.data.council.act, response.data.agendas, response.data.councilAttendants.list)
        }
    }, [councilID])
    

    React.useEffect(() => {
        getData()
    }, [getData])

    return (
        
    )
}

export default DocumentEditor;