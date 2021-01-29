import React from 'react';
import { AlertConfirm, BasicButton } from '../../../displayComponents';
import TextArea from "antd/lib/input/TextArea";
import { getPrimary } from '../../../styles/colors';
import Stars from './Stars';
import { useSubdomain } from '../../../utils/subdomain';
import { checkCouncilState } from '../../../utils/CBX';

//Reunion finalizada Feedback 3 (texto)
// const CouncilFinishedFeedback3 = ({ translate }) => {
// 	const primary = getPrimary();

// 	return (
// 		<div style={{ width: "100%", background: "white", borderRadius: '3px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)', marginTop: '1em', height: "130px" }}>
// 			<div style={{ height: "50%", display: "flex", justifyContent: "center", alignItems: 'center', padding: "0 1em", background: 'linear-gradient(to top,#b6d1dc -30%, #7976b0 120%)', }}>
// 				<div>
// 					<div style={{ fontWeight: "900", color: "white", fontSize: '.8rem' }} >
// 						<p style={{ margin: '0' }}>
// 							¿Qué aspectos  mejoraría en su experiencia con ? {/* TRADUCCION */}
// 						</p>
// 					</div>
// 				</div>
// 			</div>
// 			<div style={{ height: "50%", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
// 				<div style={{ width: '100%', padding: '.4rem' }}>
// 					<TextArea style={{ width: '100%', resize: 'none', border: 'none', padding: '.2rem' }} placeholder={'Escriba aquí…'} /> {/* TRADUCCION */}
// 				</div>
// 			</div>
// 		</div>
// 	)
// }


const CouncilSurveyModal = ({ open, requestClose, translate }) => {
    const [state, setState] = React.useState({
        satisfaction: 0,
        performance: 0,
        recommend: 0,
        care: 0,
        suggestions:''
    });
    const [errors, setErrors] = React.useState({})
    const subdomain = useSubdomain();

    const checkCouncilState = () => {
        const newErrors = {};

        if(state.satisfaction === 0){
            newErrors.satisfaction = translate.required_field;
        }

        if(state.performance === 0){
            newErrors.performance = translate.required_field;
        }

        if(state.recommend === 0){
            newErrors.recommend = translate.required_field;
        }

        if(state.care === 0){
            newErrors.care = translate.required_field;
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length > 0;
    }

    const sendSurvey = async () => {
        if(!checkCouncilState()){
            alert('se envía');
        }
    }

 
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
                                    <Stars
                                        name={"satisfaction"}
                                        value={state.satisfaction}
                                        error={errors.satisfaction}
                                        onClick={value => {
                                            setState({
                                                ...state,
                                                satisfaction: +value
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div>Valore el funcionamiento general de {subdomain.name || 'Counclibox'}.</div> {/* TRADUCCION */}
                                <div>
                                    <Stars
                                        name={"performance"}
                                        value={state.performance}
                                        error={errors.performance}
                                        onClick={value => {
                                            setState({
                                                ...state,
                                                performance: +value
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div>En qué grado recomendaría y volvería a utilizar  en el futuro</div>{/* TRADUCCION */}
                                <div>
                                    <Stars
                                        name={"recommend"}
                                        value={state.recommend}
                                        error={errors.recommend}
                                        onClick={value => {
                                            setState({
                                                ...state,
                                                recommend: +value
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div>¿Cómo valoraría la atención recibida?</div>{/* TRADUCCION */}
                                <div>
                                    <Stars
                                        name={"care"}
                                        value={state.care}
                                        error={errors.care}
                                        onClick={value => {
                                            setState({
                                                ...state,
                                                care: +value
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div>¿Qué aspectos  mejoraría en su experiencia con ?</div>{/* TRADUCCION */}
                                <div style={{ marginTop: "0.5em" }}>
                                    <TextArea
                                        style={{
                                            width: '100%',
                                            resize: 'none',
                                            border: 'none',
                                            padding: '.2rem',
                                            background: "#d0d0d080"
                                        }}
                                        value={state.suggestions}
                                        onChange={event => {
                                            setState({
                                                ...state,
                                                suggestions: event.target.value
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div style={{ marginTop: "1.5em" }}>
                                <BasicButton
                                    onClick={sendSurvey}
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