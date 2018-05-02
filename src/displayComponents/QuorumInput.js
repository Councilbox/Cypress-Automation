import React from 'react';
import { TextInput, Grid, GridItem } from './index';
import * as CBX from '../utils/CBX';

const QuorumInput = ({ type, value, divider, onChange, onChangeDivider, style, quorumError, dividerError }) => {
    if (CBX.isQuorumPercentage(type)) {
        return (<div className="row">
                <div style={{
                    ...style,
                    width: '4.2em'
                }}>
                    <TextInput
                        type={"number"}
                        value={value}
                        min="1"
                        max="100"
                        errorText={quorumError}
                        adornment={'%'}
                        onChange={(event) => onChange(event.nativeEvent.target.value)}
                    />
                </div>
            </div>)
    }

    if (CBX.isQuorumFraction(type)) {
        return (<div style={{ maxWidth: '12em' }}>
                <Grid>
                    <GridItem xs={6} lg={6} md={6}>
                        <TextInput
                            type={"number"}
                            value={value}
                            min="1"
                            errorText={quorumError}
                            onChange={(event) => onChange(event.nativeEvent.target.value)}
                        />
                    </GridItem>
                    <GridItem xs={6} lg={6} md={6}>
                        <TextInput
                            type={"number"}
                            value={divider}
                            min="1"
                            errorText={dividerError}
                            adornment={'/'}
                            onChange={(event) => onChangeDivider(event.nativeEvent.target.value)}
                        />
                    </GridItem>
                </Grid>
            </div>)
    }

    if (CBX.isQuorumNumber(type)) {
        return (<div className="row">
                <div style={{
                    ...style,
                    width: '4.2em'
                }}>
                    <TextInput
                        type={"number"}
                        value={value}
                        min="1"
                        errorText={quorumError}
                        onChange={(event) => onChange(event.nativeEvent.target.value)}
                    />
                </div>
            </div>)
    }

    return (<div></div>);
};

export default QuorumInput;