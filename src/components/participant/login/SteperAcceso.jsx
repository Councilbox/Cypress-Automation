import React from "react";
import { Tooltip, Card, Stepper, Step, StepButton, StepLabel } from "material-ui";
import * as mainActions from "../../../actions/mainActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { bHistory } from "../../../containers/App";
import withTranslations from "../../../HOCs/withTranslations";
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import withWindowSize from "../../../HOCs/withWindowSize";
import withWindowOrientation from "../../../HOCs/withWindowOrientation";
import { checkValidEmail } from "../../../utils/validation";
import { getPrimary, getSecondary } from "../../../styles/colors";
import { ButtonIcon, TextInput, BasicButton, AlertConfirm, HelpPopover, LoadingSection } from "../../../displayComponents";
import { councilStarted, participantNeverConnected, getSMSStatusByCode } from '../../../utils/CBX';
import { moment } from '../../../containers/App';
import { useOldState } from "../../../hooks";
import { withApollo } from 'react-apollo';
import CouncilKeyModal from "./CouncilKeyModal";
import CouncilKeyButton from "./CouncilKeyButton";
import { withStyles } from "material-ui";


const SteperAcceso = () => {

    return (
        <Stepper nonLinear alternativeLabel style={{ height: '8em' }} >
            <Step className={'stepperAcceso'}>
                <StepLabel >
                    <span style={{ color: getPrimary() }}>  Acceso previo</span>
                </StepLabel>
            </Step>
            <Step className={'stepperAcceso'}>
                <StepLabel>
                    <span style={{ color: getPrimary() }}>  SMS enviado</span>
                </StepLabel>
            </Step>
            <Step className={'stepperAccesoFail'}>
                <StepLabel>
                    <span style={{ color: getPrimary() }}>   SMS Entregado</span>
                </StepLabel>
            </Step>
            <Step className={'stepperAccesoNoActived'}>
                <StepLabel>
                    <span style={{ color: getPrimary() }}>  Clave validada</span>
                </StepLabel>
            </Step>
        </Stepper>

    )

}


export default SteperAcceso;