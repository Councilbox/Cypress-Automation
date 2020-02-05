import React from 'react';
import Timbrado from './Timbrado';
import { withApollo } from 'react-apollo';


const DocumentPreview = ({ doc, translate, options, collapse, company, client }) => {
    const [loading, setLoading] = React.useState(true);
    const [preview, setPreview] = React.useState(null);

    const getPreview = async () => {

    }


    return (
        <div style={{ display: "flex", height: "100%" }} >
            <div style={{ width: "20%", maxWidth: "95px" }}>
                {options.stamp &&
                    <Timbrado
                        collapse={collapse}
                        edit={false}
                    />
                }
            </div>
            <div style={{ width: "100%" }}>
                <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                    <div style={{ width: "13%", marginTop: "1em", marginRight: "4em", maxWidth: "125px" }}>
                        <img style={{ width: "100%" }} src={company.logo}></img>
                    </div>
                </div>
                <div style={{ padding: "1em", paddingLeft: "0.5em", marginRight: "3em", marginBottom: "3em" }} className={"actaLienzo"}>
                    {loading?
                        <div>
                            Generando vista preview del documento
                        </div>
                    :
                        <div dangerouslySetInnerHTML={{ __html: preview }} />
                    }
                </div>
            </div>
        </div>
    )
}

export default withApollo(DocumentPreview);