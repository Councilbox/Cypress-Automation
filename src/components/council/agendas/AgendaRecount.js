import React from 'react';
import { Grid, GridItem } from '../../../displayComponents';
import { getSecondary } from '../../../styles/colors';
import * as CBX from '../../../utils/CBX';

const columnStyle = {
    display: 'flex',
    fontWeight: '600',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.4em',
    fontSize: '0.8em'
};

const itemStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
}



const AgendaRecount = ({ agenda, recount, majorityTypes, translate }) => {
    return(
        <React.Fragment>
            <Grid style={{border: `1px solid ${getSecondary()}`, margin: 'auto', marginTop: '1em'}}>
                <GridItem xs={3} lg={3} md={3} style={columnStyle}>
                    <div style={itemStyle}>
                        {translate.convene_census}
                    </div>
                    <div style={itemStyle}>
                        {`${translate.participants}: ${recount.numTotal || 0}`}
                    </div>
                    <div style={itemStyle}>
                        {`${translate.votes}: ${recount.partTotal || 0}`}
                    </div>
                </GridItem>
                <GridItem xs={3} lg={3} md={3} style={columnStyle}>
                    <div style={itemStyle}>
                        {translate.present_census}
                    </div>
                    <div style={itemStyle}>
                        {`${translate.participants}: ${agenda.numPresentCensus || 0}`}
                    </div>
                    <div style={itemStyle}>
                        {`${translate.votes}: ${agenda.presentCensus || 0}`}
                    </div>
                </GridItem>
                <GridItem xs={3} lg={3} md={3} style={columnStyle}>
                    <div style={itemStyle}>
                        {translate.current_remote_census}
                    </div>
                    <div style={itemStyle}>
                        {`${translate.participants}: ${agenda.numCurrentRemoteCensus || 0}`}
                    </div>
                    <div style={itemStyle}>
                        {`${translate.votes}: ${recount.currentRemoteCensus || 0}`}
                    </div>
                </GridItem>
                <GridItem xs={3} lg={3} md={3} style={{...columnStyle, backgroundColor: 'lightcyan'}}>
                    <div style={itemStyle}>
                        {translate.voting_rights_census}
                    </div>
                    <div style={itemStyle}>
                        {`${translate.participants}: ${agenda.numCurrentRemoteCensus + agenda.numPresentCensus || 0}`}
                    </div>
                    <div style={itemStyle}>
                        {`${translate.votes}: ${agenda.presentCensus + agenda.currentRemoteCensus || 0}`}
                    </div>
                </GridItem>
            </Grid>
            <Grid style={{border: `1px solid ${getSecondary()}`, margin: 'auto', marginTop: '1em'}}>
                <GridItem xs={4} lg={4} md={4} style={columnStyle}>
                    <div style={itemStyle}>
                        {`${translate.majority_label}: ${translate[majorityTypes.find(item => agenda.majorityType === item.value).label]}`}
                        {CBX.majorityNeedsInput(agenda.majorityType) && agenda.majority}
                        {agenda.majorityType === 0 && '%'}
                        {agenda.majorityType === 5 && `/ ${agenda.majorityDivider}`}
                    </div>
                </GridItem>
                <GridItem xs={4} lg={4} md={4} style={columnStyle}>
                    <div style={itemStyle}>
                        {`${translate.majority_label}: ${translate[majorityTypes.find(item => agenda.majorityType === item.value).label]}`}
                    </div>
                </GridItem>
                <GridItem xs={4} lg={4} md={4} style={columnStyle}>
                    <div style={itemStyle}>
                        {`${translate.majority_label}: ${translate[majorityTypes.find(item => agenda.majorityType === item.value).label]}`}
                    </div>
                </GridItem>
            </Grid>
        </React.Fragment>
    )
}


export default AgendaRecount;