import React from 'react';
import { Grid, GridItem, CloseIcon,  } from "../../displayComponents/index";
import { getPrimary, getSecondary } from "../../styles/colors";
import { Paper } from 'material-ui';
import { formatSize } from "../../utils/CBX";
import IconButton from "material-ui/es/IconButton/IconButton";


const primary = getPrimary();
const secondary = getSecondary();


const AttachmentItem = ({ attachment, removeAttachment, editName }) => (

    <Paper style={{
        width: '100%',
        padding: '1vw',
        marginTop: '0.6em'
    }}>
        <Grid spacing={16}>
            <GridItem xs={9}>
                <div style={{
                    fontWeight: '600',
                    fontSize: '1em'
                }}>
                    {attachment.filename}
                    <IconButton
                        style={{
                            height: '28px'
                        }}
                        onClick={(event) => {
                            event.stopPropagation();
                            editName(attachment.orderIndex)
                        }}>
                        <i className="fa fa-pencil" style={{ color: secondary }}/>
                    </IconButton>
                </div>
            </GridItem>
            <GridItem xs={2}>
                {formatSize(attachment.filesize)}
            </GridItem>
            <GridItem xs={1}>
                <CloseIcon
                    style={{
                        float: 'right',
                        color: primary
                    }}
                    onClick={(event) => {
                        event.stopPropagation();
                        removeAttachment(attachment.id)
                    }}/>
            </GridItem>
        </Grid>
    </Paper>);

export default AttachmentItem;