import React from 'react';
import Timbrado from './Timbrado';
import { LoadingSection } from '../../displayComponents';
import withTranslations from '../../HOCs/withTranslations';


const CBXDocumentLayout = ({ options, loading, preview, company, finishInModal, translate }) => (
        <div style={{ display: 'flex', height: '100%', maxWidth: '210mm' }} >
            <div style={{ width: '20%', maxWidth: '95px' }}>
                {options.stamp
                    && <Timbrado
                        collapse={true}
                        edit={loading}
                        finishInModal={'actaLienzoModal'}
                    />
                }
            </div>
            <div style={{ width: '100%' }}>
                <div style={{ width: '100%' }}>
                    <div style={{ width: '13%', marginTop: '1em', marginRight: '4em', maxWidth: '125px', float: 'right' }}>
                        <img style={{ maxHeight: '2.8em', width: 'auto', float: 'right' }} src={company.logo}></img>
                    </div>
                </div>
                <div
                    style={{
                        clear: 'both',
                        padding: '1em',
                        paddingLeft: '0.5em',
                        marginRight: '3em',
                        marginBottom: '3em'
                    }}
                    className={finishInModal ? 'actaLienzoModal' : 'actaLienzo'}>
                    {loading ?
                        <div style={{ display: 'flex' }}>
                            <div style={{ marginRight: '0.5em' }}>{translate.generating_document_preview}</div><div> <LoadingSection size={14} /></div>
                        </div>
                    : <div dangerouslySetInnerHTML={{ __html: preview }} />
                    }
                </div>
            </div>
        </div>
    );

export default withTranslations()(CBXDocumentLayout);
