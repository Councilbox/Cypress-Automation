import React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "./Header.jsx";
import Iframe from "../../Iframe";
import NeedHelpModal from "./NeedHelpModal.jsx";
import {
BasicButton,
ButtonIcon,
LoadingMainApp
} from "../../../displayComponents";
import { primary, lightGrey } from "../../../styles/colors";
import withWindowSize from "../../../HOCs/withWindowSize";
import withTranslations from "../../../HOCs/withTranslations";
import * as mainActions from "../../../actions/mainActions";
import DetectRTC from "detectrtc";
import { IncomingMessage } from "http";
import IncompatibleDeviceBrowser from "../IncompatibleDeviceBrowser.jsx";

const styles = {
viewContainer: {
width: "100vw",
height: "100vh"
},
container: {
width: "100%",
height: "calc(100% - 3em)",
display: "flex",
flexDirection: "row"
}
};

class Test extends React.Component {

state = {
loading: true,
language: this.props.match.params.language,
detectRTC: DetectRTC,
modal: false,
isiOSDevice: false,
iframeRandomValue: Math.round(Math.random() * 10000000)
};

static getDerivedStateFromProps(nextProps, prevState) {
if (prevState.language === nextProps.translate.selectedLanguage) {
return {
loading: false
};
}
return null;
}

componentDidMount() {
if (this.state.language !== this.props.translate.selectedLanguage) {
this.props.actions.setLanguage(this.props.match.params.language);
}
DetectRTC.load(() => {
const isiOSDevice =
DetectRTC.isMobileDevice && DetectRTC.osName === "iOS"
? true
: false;
this.setState({
detectRTC: DetectRTC,
isiOSDevice: isiOSDevice
});
});
}

// MODAL
openModal = () => {
this.setState({
modal: true
});
};
closeModal = () => {
this.setState({
modal: false
});
};

render() {
const { translate, windowSize, getTestIframe } = this.props;
const { detectRTC, isiOSDevice, iframeRandomValue } = this.state;

if (this.state.loading) {
return <LoadingMainApp />;
}

if(getTestIframe.loading){
return <LoadingMainApp />;
}


return (
<div style={styles.viewContainer}>
<Header helpModal={true} helpModalAction={this.openModal} />

{!!getTestIframe.error?
<div
style={{
width: '100%',
height: '100%',
display: 'flex',
backgroundColor: lightGrey,
justifyContent: 'center',
paddingTop: '5em',
}}
>
{translate.video_error}
</div>
:
<React.Fragment>
<div style={styles.container}>
<Iframe
src={`https://${
getTestIframe.participantTestIframe
}?rand=${iframeRandomValue}`}
/>

{windowSize !== "xs" && (
<BasicButton
text={translate.need_help}
color={"white"}
textStyle={{
color: primary,
fontWeight: "700",
fontSize: "0.9em",
textTransform: "none"
}}
textPosition="after"
icon={
<ButtonIcon
type="message"
color={primary}
style={{ marginLeft: "15px" }}
/>
}
onClick={() => this.setState({ modal: true })}
buttonStyle={{
marginRight: "1em",
border: `2px solid ${primary}`,
boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
position: "absolute",
bottom: "40px",
right: "40px"
}}
/>
)}
</div>

<NeedHelpModal
show={this.state.modal}
translate={translate}
requestClose={this.closeModal}
detectRTC={detectRTC}
/>
</React.Fragment>
}
</div>
);
}
}

const mapDispatchToProps = dispatch => ({
actions: bindActionCreators(mainActions, dispatch)
});

const getTestIframe = gql`
    query participantTestIframe($language: String!) {
        participantTestIframe(language: $language)
    }
`;

export default graphql(getTestIframe, {
name: "getTestIframe",
options: props => ({
variables: {
language: props.match.params.language
}
})
})(
connect(
null,
mapDispatchToProps
)(withTranslations()(withWindowSize(Test)))
);
