import React from 'react';
import { getPrimary } from '../../styles/colors';
import { TableRow, TableCell } from 'material-ui/Table';
import { Table, DeleteIcon } from '../displayComponents';

const AttachmentList = ({ attachments, deleteAction, translate, loadingId }) => (
    <div style={{display: 'flex', width: '100%'}}>
        <Table
            headers={[
                {name: ''},
                {name: ''},
                {name: ''},                    
            ]}
            action={this._renderDeleteIcon}
        >
            {attachments.map((attachment) => {
                return(
                    <TableRow                         
                        key={`attachment${attachment.id}`} 
                    >
                        <TableCell>{attachment.filename}</TableCell>
                        <TableCell>{attachment.filetype}</TableCell>
                        <TableCell>{
                            attachment.state !== 2?
                                <DeleteIcon
                                    loading={loadingId === attachment.id}
                                    style={{color: getPrimary()}}
                                    onClick={() => deleteAction(attachment.id)}
                                />
                            :
                                ` ${translate.deleted}`
                        }
                        </TableCell>                  
                    </TableRow>
                );
            })}
        </Table>
    </div>
)

export default AttachmentList;
