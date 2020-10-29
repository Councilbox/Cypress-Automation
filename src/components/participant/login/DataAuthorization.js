import { Card } from 'material-ui';
import React from 'react';
import { withApollo } from 'react-apollo';
import { NotLoggedLayout, Scrollbar, BasicButton, Checkbox } from '../../../displayComponents';
import { isMobile } from '../../../utils/screen';
import { ReactComponent as VideoCamera } from '../../../../src/assets/img/video-camera.svg';
import { ReactComponent as Folder } from '../../../../src/assets/img/folder-1.svg';
import { getPrimary, getSecondary } from '../../../styles/colors';
import gql from 'graphql-tag';

const width = window.innerWidth > 450 ? '850px' : '100%'

const styles = {
	viewContainer: {
		width: "100vw",
		height: "100vh",
		position: "relative"
	},
	mainContainer: {
		width: "100%",
		display: "flex",
		height: '100%',
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
		padding: isMobile ? "" : "10px"
	},
	cardContainer: {
		margin: isMobile ? "20%" : "20px",
		marginBottom: '5px',
		minWidth: width,
		maxWidth: "100%",
		//height: '50vh',
		//minHeight: isMobile? '70vh' : '50vh',
	}
};


const DataAuthorization = ({ council, participant, props = {}, client, refetch }) => {
    const [checked, setChecked] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const secondary = getSecondary();

    console.log(participant);

    const sendConfirmation = async () => {
        setLoading(true);
        const response = await client.mutate({
            mutation: gql`
                mutation liveAcceptLegalTermsAndConditions{
                    liveAcceptLegalTermsAndConditions{
                        success
                    }
                }
            `
        });

        console.log(response);
        await refetch();
        setLoading(false);
    }

    return (
        <div style={styles.loginContainerMax}>
            <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                <div style={{
                    width: "100%",
                    paddingLeft: "4px",
                    color: '#154481',
                }}>
                    <div style={{ textAlign: "center", padding: "1em", paddingTop: "2em", }} >
                        <h3 style={{ color: '#154481', fontSize: '14px', }}>Para acceder debe confirmar la aceptacion del tratamiento de sus datos </h3>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", }}>
                        <div style={{ textAlign: "center", padding: "1em", paddingRight: '3em' }}>
                            <VideoCamera style={{ marginRight: '0.6em', marginBottom: "0.5em" }} fill={secondary} />
                            <div>Grabación de voz y video</div>
                        </div>
                        <div style={{ textAlign: "center", padding: "1em", paddingBottom: "2em" }}>
                            <Folder style={{ marginRight: '0.6em', marginBottom: "0.5em" }} fill={secondary} />
                            <div>Almacenamiento de datos</div>
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", color: "black", maxWidth: "600px", marginBottom: "1em" }}>
                        <div>
                            <Checkbox
                                value={checked}
                                onChange={(event, isInputChecked) => {
                                    setChecked(isInputChecked)
                                }}
                                styleLabel={{ alignItems: "unset" }}
                                label={"Confirmo y acepto la normativa de tratatimento de datos del Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016, relativo a la protección de las personas físicas en lo que respecta al tratamiento de datos personales y a la libre circulación de estos datos y por el que se deroga la Directiva 95/46/CE (Reglamento general de protección de datos) (Texto pertinente a efectos del EEE)"}
                            />
                        </div>
                    </div>
                    <div style={{ textAlign: "center", padding: "1em", paddingBottom: "2em", display: "flex", justifyContent: "center" }}>
                        <BasicButton
                            text={'Acceso seguro'}
                            disabled={!checked}
                            loading={loading}
                            loadingColor="white"
                            onClick={sendConfirmation}
                            color={checked ? getPrimary() : 'grey'}
                            textStyle={{
                                color: "white",
                                fontWeight: "700",
                                borderRadius: '4px',
                                boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
                                width: "300px"
                            }}
                            textPosition="before"
                            fullWidth={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withApollo(DataAuthorization)