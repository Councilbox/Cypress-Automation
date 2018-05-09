import React from 'react';
import { Grid, GridItem, CloseIcon, } from "../../../../displayComponents";
import { getPrimary, getSecondary } from "../../../../styles/colors";
import { Paper, IconButton } from 'material-ui';


const primary = getPrimary();
const secondary = getSecondary();


const AgendaItem = ({ agenda, typeText, selectAgenda, removeAgenda, saveAsDraft }) => (

    <Paper style={{
        width: '100%',
        padding: '1vw',
        marginTop: '0.6em',
        cursor: 'pointer'
    }}
           onClick={(event) => {
               selectAgenda(agenda.orderIndex)
           }}>
        <Grid spacing={16}>
            <GridItem xs={1}>
                <div style={{
                    color: primary,
                    width: '30px',
                    margin: '-0.25em 0',
                    fontWeight: '700',
                    fontSize: '1.5em'
                }}>
                    {agenda.orderIndex}
                </div>
            </GridItem>
            <GridItem xs={8}>
                <div style={{
                    fontWeight: '600',
                    fontSize: '1em'
                }}>
                    {agenda.agendaSubject}
                </div>
            </GridItem>
            <GridItem xs={1}>
                {typeText}
            </GridItem>
            <GridItem xs={2}>
                <CloseIcon
                    style={{
                        float: 'right',
                        color: primary
                    }}
                    onClick={(event) => {
                        event.stopPropagation();
                        removeAgenda(agenda.id)
                    }}/>
                <IconButton
                    style={{
                        float: 'right',
                        height: '28px'
                    }}
                    onClick={(event) => {
                        event.stopPropagation();
                        saveAsDraft(agenda.orderIndex)
                    }}>
                    <i className="fa fa-save" style={{ color: secondary }}/>
                </IconButton>
            </GridItem>
        </Grid>
        {agenda.description && <div style={{
            width: '100%',
            marginTop: '1em'
        }}
                                    dangerouslySetInnerHTML={{ __html: agenda.description }}/>}

    </Paper>);

export default AgendaItem;