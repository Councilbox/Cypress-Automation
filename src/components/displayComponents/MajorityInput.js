import React from 'react';
import { TextInput, Grid, GridItem } from './';
import * as CBX from '../../utils/CBX';

const MajorityInput = ({ type, value, divider, onChange, onChangeDivider, style, majorityError, dividerError }) => {
    if(CBX.isMajorityPercentage(type)){
        return(
            <div className="row">
                <div style={{...style, width: '4.2em'}}>
                    <TextInput
                        type={"number"}
                        value={value}
                        errorText={majorityError}
                        adornment={'%'}
                        onChange={(event) => onChange(event.nativeEvent.target.value)}
                    />
                </div>
            </div>
        )
    }

    if(CBX.isMajorityFraction(type)){
        return(
            <div style={{maxWidth: '12em'}}>
                <Grid>
                    <GridItem xs={6} lg={6} md={6}>
                        <TextInput
                            type={"number"}
                            value={value}
                            errorText={majorityError}
                            onChange={(event) => onChange(event.nativeEvent.target.value)}
                        />
                    </GridItem>
                    <GridItem xs={6} lg={6} md={6}>                
                        <TextInput
                            type={"number"}
                            value={divider}
                            errorText={dividerError}
                            adornment={'/'}
                            onChange={(event) => onChangeDivider(event.nativeEvent.target.value)}
                        />
                    </GridItem>
                </Grid>
            </div>
        )
    }

    if(CBX.isMajorityNumber(type)){
        return(
            <div className="row">
                <div style={{...style, width: '4.2em'}}>
                    <TextInput
                        type={"number"}
                        value={value}
                        errorText={majorityError}
                        onChange={(event) => onChange(event.nativeEvent.target.value)}
                    />
                </div>
            </div>
        )
    }

    return(<div></div>);
}

export default MajorityInput;