import React from 'react';
import Timbrado from './Timbrado';
import { withApollo } from 'react-apollo';
import { buildDocVariable } from './utils';
import gql from 'graphql-tag';
import { LoadingSection } from '../../displayComponents';

const spinnerDelay = 2500;

const DocumentPreview = ({ translate, generatePreview, options, collapse, company, client }) => {
    const [loading, setLoading] = React.useState(true);
    const preview = React.useRef(null);
    const mountedDate = React.useRef(new Date().getTime());

    const getPreview = async () => {
        const response = await generatePreview();
        preview.current = response;
        if((new Date().getTime() - mountedDate.current) > spinnerDelay){
			setLoading(false);
		}
    }

    React.useEffect(() => {
        getPreview();
    }, [])


    React.useEffect(() => {
        let interval;
        if(loading){
            interval= setInterval(() => {
                if(preview.current){
                    setLoading(false);
                }
            }, spinnerDelay);
        }
        return () => clearInterval(interval);
    },  [loading])


    return (
        <div style={{ display: "flex", height: "100%", maxWidth: '210mm' }} >
            <div style={{ width: "20%", maxWidth: "95px" }}>
                {options.stamp &&
                    <Timbrado
                        collapse={collapse}
                        edit={loading}
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
                        <div style={{display: 'flex'}}>
                            <div style={{marginRight: '0.5em'}}>Generando vista previa del documento</div><div> <LoadingSection size={14} /></div>
                        </div>
                    :
                        <div dangerouslySetInnerHTML={{ __html: preview.current }} />
                    }
                </div>
            </div>
        </div>
    )
}

export default withApollo(DocumentPreview);