import React from 'react';
import withTranslations from '../../../HOCs/withTranslations';
import withWindowSize from '../../../HOCs/withWindowSize';
import withWindowOrientation from '../../../HOCs/withWindowOrientation';
import { getPrimary, getSecondary } from '../../../styles/colors';
import emptyMeetingTable from '../../../assets/img/empty_meeting_table.png';

const styles = {
    container:{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    splittedContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    textContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '15px',
        textAlign: 'center'
    },
    imageContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '15px'
    },
    image:{
        maxWidth: '60%'
    }
};

class CouncilState extends React.Component {
    render(){
        const { translate, council, windowSize, windowOrientation } = this.props;
        const primaryColor = getPrimary();
        const secondaryColor = getSecondary();
        return (
            <div style={(windowSize === 'xs' && windowOrientation === "portrait") ?  styles.container : styles.splittedContainer}>
                <div style={{...styles.textContainer, ...(windowSize === 'xs' && windowOrientation === "portrait") ? {} : {maxWidth: '50%'}}}>
                    <h3 style={{color: primaryColor}}>{translate.we_are_sorry}</h3>
                    <p>
                        askljglkasgj kl jsklajg klasj glkjsd gkl sjdgkl sdfjklglsdfjg lkdfslkgj sfldkj glksdjfgkl jsdfg sdgsdgsd gsdgsd gsdgsd gsdgsdg sdgsdgsd gsdgsd gsdgsdg sdgsdgsd gsdgsdgsd gsdgsdgsd gsdgsdgsdg sdgsdgsdgsdgsd gsdgsdg sdgsdgsd gsdgsdgsd
                    </p>
                </div>
                
                <div style={styles.imageContainer}>
                    <img src={emptyMeetingTable} style={styles.image}/>
                </div>
            </div>
        );
    }
};

export default withTranslations()(withWindowOrientation(withWindowSize(CouncilState)));