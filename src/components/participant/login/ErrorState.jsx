import React from "react";
import { Card, CardHeader, Avatar, CardContent, Dialog, DialogTitle, DialogContent } from "material-ui";
import moment from "moment";
import FontAwesome from 'react-fontawesome';
import Header from '../Header';
import withTranslations from "../../../HOCs/withTranslations";
import withWindowSize from "../../../HOCs/withWindowSize";
import withWindowOrientation from "../../../HOCs/withWindowOrientation";
import {
    councilIsInTrash,
    councilIsNotLiveYet,
    councilIsNotCelebrated,
    councilIsFinished
} from "../../../utils/CBX";
import {
    getPrimary,
    getSecondary,
    lightGrey,
    lightTurquoise,
    secondary
} from "../../../styles/colors";
import background from "../../../assets/img/signup3.jpg";
import emptyMeetingTable from "../../../assets/img/empty_meeting_table.png";

const styles = {
    cardContainer: {
		margin: "20px",
		padding: "20px",
		maxWidth: '100%'
	},
    container: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
    },
    splittedContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
    },
    textContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "15px",
        textAlign: "center"
    },
    imageContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "15px"
    },
    image: {
        maxWidth: "60%"
    }
};

class ErrorState extends React.Component {

    render() {
        const {
            translate,
            code,
            council,
            company,
            windowSize,
            windowOrientation
        } = this.props;

        return (
            <div
                style={{
                    height: "100vh",
                    width: "100vw"
                }}
            >
                <Header />
                <div
                    style={{
                        display: "flex",
                        height: "calc(100% - 48px)",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        background: `url(${background})`
                    }}
                >
                    <Card style={styles.cardContainer}>
                        <div
                            style={
                                windowSize === "xs" && windowOrientation === "portrait"
                                    ? styles.container
                                    : styles.splittedContainer
                            }
                        >
                            <div
                                style={{
                                    ...styles.textContainer,
                                    ...(windowSize === "xs" &&
                                        windowOrientation === "portrait"
                                        ? { maxWidth: '100%' }
                                        : { maxWidth: "50%", minWidth: '50%' })
                                }}
                            >
                                ERROR {code}
                            </div>

                            <div style={styles.imageContainer}>
                                <div style={{
                                    backgroundColor: lightTurquoise,
                                    borderRadius: "4px"
                                }}>
                                    {/* <Avatar
                                        src={company.logo}
                                        aria-label="CouncilLogo"
                                    />   
                                    <h1>{council.name}</h1>  
                                    <h3>{moment(new Date(council.dateStart)).format(
                                        "LLL"
                                    )}</h3> */}                      
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }
}

export default withTranslations()(
    withWindowOrientation(withWindowSize(ErrorState))
);
