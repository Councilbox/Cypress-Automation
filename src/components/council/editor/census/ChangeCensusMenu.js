import React from 'react';
import { Grid, GridItem, SelectInput, BasicButton, ButtonIcon } from '../../../../displayComponents/index';
import { Typography, MenuItem } from 'material-ui';
import * as CBX from '../../../../utils/CBX';
import { getPrimary } from '../../../../styles/colors';
import AddCouncilParticipantButton from "./AddCouncilParticipantButton";

const ChangeCensusMenu = ({ showAddModal, handleCensusChange, council, translate, censuses, totalVotes, totalSocialCapital, participations, refetch }) => (
    <Grid>
        <GridItem lg={3} md={3} xs={6} style={{
            height: '4em',
            verticalAlign: 'middle'
        }}>
            <SelectInput
                floatingText={translate.current_census}
                value={council.selectedCensusId}
                onChange={handleCensusChange}
            >
                {censuses.list.map((census) => {
                    return <MenuItem value={parseInt(census.id, 10)}
                                     key={`census${census.id}`}>{census.censusName}</MenuItem>
                })}
            </SelectInput>
        </GridItem>
        <GridItem lg={3} md={3} xs={6} style={{
            height: '4em',
            display: 'flex',
            alignItems: 'center'
        }}>
            <Typography variant="body2"
                        style={{
                            padding: '1.1em 1em 0 1em',
                            fontWeight: '600',
                            fontSize: '1em'
                        }}>
                {`${translate.total_votes}: ${totalVotes}`}
            </Typography>
        </GridItem>
        {CBX.hasParticipations(council) && <GridItem lg={3} md={3} xs={6} style={{
            height: '4em',
            display: 'flex',
            alignItems: 'center'
        }}>
            <Typography variant="body2"
                        style={{
                            padding: '1.1em 1em 0 1em',
                            fontWeight: '600',
                            fontSize: '1em'
                        }}>
                {`${translate.total_social_capital}: ${totalSocialCapital}`}
            </Typography>
        </GridItem>}
        <GridItem lg={3} md={3} xs={6} style={{
            marginTop: '1em'
        }}>
            <AddCouncilParticipantButton
                participations={participations}
                translate={translate}
                councilId={council.id}
                refetch={refetch}
            />
            {/*<BasicButton*/}
                {/*text={translate.add_participant}*/}
                {/*color={getPrimary()}*/}
                {/*textStyle={{*/}
                    {/*color: 'white',*/}
                    {/*fontWeight: '700',*/}
                    {/*fontSize: '0.9em',*/}
                    {/*textTransform: 'none',*/}
                    {/*width: '100%'*/}
                {/*}}*/}
                {/*icon={<ButtonIcon type="add" color="white"/>}*/}
                {/*textPosition="after"*/}
                {/*onClick={showAddModal}*/}
            {/*/>*/}
        </GridItem>
    </Grid>);

export default ChangeCensusMenu;