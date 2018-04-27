import React from 'react';
import { Grid, GridItem, SelectInput, BasicButton, ButtonIcon } from '../displayComponents';
import { Typography, MenuItem } from 'material-ui';
import * as CBX from '../../utils/CBX';
import { getPrimary } from '../../styles/colors';


const ChangeCensusMenu = ({ showAddModal, handleCensusChange, council, translate, censuses, totalVotes }) => (
    <Grid>
        <GridItem lg={3} md={3} xs={6} style={{height: '4em', verticalAlign: 'middle'}}>
            <SelectInput
                floatingText={translate.current_census}
                value={council.selectedCensusId}
                onChange={handleCensusChange}
            >
                {censuses.list.map((census) => {
                        return <MenuItem value={parseInt(census.id, 10)} key={`census${census.id}`}>{census.censusName}</MenuItem>
                    })
                }
            </SelectInput>
        </GridItem>
        <GridItem lg={3} md={3} xs={6} style={{height: '4em', display: 'flex', alignItems: 'center'}}>
            <BasicButton
                text={translate.add_participant}
                color={getPrimary()}
                textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                icon={<ButtonIcon type="add" color="white" />}
                textPosition="after"
                onClick={showAddModal} 
            />
        </GridItem>
        <GridItem lg={3} md={3} xs={6} style={{height: '4em', display: 'flex', alignItems: 'center'}}>
            <Typography variant="body2">
                {`${translate.total_votes}: ${totalVotes}`}
            </Typography>
        </GridItem>
        {CBX.hasParticipations(council) &&
            <GridItem lg={3} md={3} xs={6} style={{height: '4em', display: 'flex', alignItems: 'center'}}>
                <Typography variant="body2">
                    {`${translate.total_social_capital}: ${this.props.data.councilSocialCapital}`}
                </Typography>
            </GridItem>
        }
    </Grid>
)

export default ChangeCensusMenu;