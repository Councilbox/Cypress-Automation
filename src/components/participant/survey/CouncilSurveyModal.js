import React from 'react';
import { AlertConfirm, BasicButton } from '../../../displayComponents';
import TextArea from "antd/lib/input/TextArea";
import { getPrimary } from '../../../styles/colors';
import Stars from './Stars';
import { useSubdomain } from '../../../utils/subdomain';


const CouncilSurveyModal = ({ open, requestClose, translate }) => {
    const subdomain = useSubdomain();

    console.log(subdomain);

    return (
        <AlertConfirm
            bodyStyle={{ minWidth: "60vw", }}
            bodyText={
                <div style={{ marginTop: "3em" }}>
		            <div style={{
                        width: "100%",
                        borderRadius: '3px',
                        marginBottom: '1em',
                        marginTop: '1em',
                        background: 'linear-gradient(to top,#b6d1dc -30%, #7976b0 120%)'
                    }}>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: 'center', padding: "0 1em" }}>
                            <div>
                                <div style={{ fontWeight: "800", color: "white", fontSize: '.9rem', padding: '1rem' }} >
                                    <p style={{ margin: '0' }}>
                                        {`Valore el funcionamiento general de ${subdomain.name || 'Councilbox'}.`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ border: "none", borderRadius: "1px", textAlign: 'left', color: "black", fontSize: '14px' }}>
                        <div>
                            <div>
                                <div>Valore el grado de satisfacción con el uso de</div> {/* TRADUCCION */}
                                <div>
                                    <Stars num={0} />
                                </div>
                            </div>
                            <div>
                                <div>Valore el funcionamiento general de .</div> {/* TRADUCCION */}
                                <div><Stars num={1} /></div>
                            </div>
                            <div>
                                <div>En qué grado recomendaría y volvería a utilizar  en el futuro</div>{/* TRADUCCION */}
                                <div><Stars num={2} /></div>
                            </div>
                            <div>
                                <div>¿Cómo valoraría la atención recibida?</div>{/* TRADUCCION */}
                                <div><Stars num={3} /></div>
                            </div>
                            <div>
                                <div>¿Qué aspectos  mejoraría en su experiencia con ?</div>{/* TRADUCCION */}
                                <div style={{ marginTop: "0.5em" }}>
                                    <TextArea style={{ width: '100%', resize: 'none', border: 'none', padding: '.2rem', background: "#d0d0d080" }} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div style={{ marginTop: "1.5em" }}>
                                <BasicButton
                                    // onClick={() => setModal(true)}
                                    text={translate.send}
                                    backgroundColor={{
                                        background: getPrimary(),
                                        color: "white",
                                        borderRadius: "1px",
                                        padding: "1em 3em 1em 3em",
                                        marginRight: "1em"
                                    }}
                                >
                                </BasicButton>
                                <BasicButton
                                    onClick={requestClose}
                                    text={translate.close}
                                    backgroundColor={{
                                        background: 'white',
                                        color: getPrimary(),
                                        borderRadius: "1px",
                                        padding: "1em 3em 1em 3em",
                                        boxShadow: "none"
                                    }}
                                >
                                </BasicButton>
                            </div>
                        </div>
                    </div>
                </div>
            }
            open={open}
            requestClose={requestClose}
        />
    )
}

export default CouncilSurveyModal;