import React from 'react';
import { Grid, GridItem, BasicButton, RichTextInput } from "../../../../displayComponents";
import { getPrimary, getSecondary } from "../../../../styles/colors";
import { Paper, IconButton } from 'material-ui';
import { DRAFT_TYPES } from "../../../../constants";

const primary = getPrimary();
const secondary = getSecondary();


const AgendaEditor = ({ agenda, typeText, translate, updateAgenda, loadDraft }) => (

    <div style={{
        width: '100%',
        margin: '0.6em 0'
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
            <GridItem xs={9}>
                <div style={{
                    fontWeight: '600',
                    fontSize: '1em'
                }}>
                    {agenda.agendaSubject}
                </div>
            </GridItem>
            <GridItem xs={2}>
                {typeText}
            </GridItem>
            {/*<GridItem xs={2}>*/}
            {/*<IconButton*/}
            {/*style={{*/}
            {/*float: 'right',*/}
            {/*height: '28px'*/}
            {/*}}*/}
            {/*onClick={(event) => {*/}
            {/*event.stopPropagation();*/}
            {/*saveAsDraft(agenda.orderIndex)*/}
            {/*}}>*/}
            {/*<i className="fa fa-save" style={{ color: secondary }}/>*/}
            {/*</IconButton>*/}
            {/*</GridItem>*/}
        </Grid>

        {agenda.description &&

        <div style={{
            width: '100%',
            marginTop: '1em'
        }}
             dangerouslySetInnerHTML={{ __html: agenda.description }}/>

        }

        <RichTextInput
            ref={(editor) => this.editorAgenda = editor}
            floatingText={translate.conclusion}
            type="text"
            loadDraft={loadDraft}
            tags={[ {
                value: `${agenda.positiveVotings} `,
                label: translate.positive_votings
            }, {
                value: `${agenda.negativeVotings} `,
                label: translate.negative_votings
            } ]}
            value={agenda.conclusion}
            onChange={(value) => updateAgenda({
                id: agenda.id,
                comment: value
            })}
        />

    </div>);

export default AgendaEditor;