import React from 'react';
import Timbrado from './Timbrado';
import { LoadingSection } from '../../displayComponents';


const CBXDocumentLayout = ({ options, loading, preview, company, finishInModal }) => {
    
    return (
        <div style={{ display: "flex", height: "100%", maxWidth: '210mm' }} >
            <div style={{ width: "20%", maxWidth: "95px" }}>
                {options.stamp &&
                    <Timbrado
                        collapse={true}
                        edit={loading}
                        finishInModal={"actaLienzoModal"}
                    />
                }
            </div>
            <div style={{ width: "100%" }}>
                <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                    <div style={{ width: "13%", marginTop: "1em", marginRight: "4em", maxWidth: "125px" }}>
                        <img style={{ maxHeight: '3em', width: "auto" }} src={company.logo}></img>
                    </div>
                </div>
                <div
                    style={{
                        padding: "1em",
                        paddingLeft: "0.5em",
                        marginRight: "3em",
                        marginBottom: "3em"
                    }}
                    className={finishInModal ? "actaLienzoModal" : "actaLienzo"}>
                    {loading?
                        <div style={{display: 'flex'}}>
                            <div style={{marginRight: '0.5em'}}>Generando vista previa del documento</div><div> <LoadingSection size={14} /></div>
                        </div>
                    :
                        <div dangerouslySetInnerHTML={{ __html: preview }} />
                    }
                </div>
            </div>
        </div>
    )
}

export default CBXDocumentLayout;