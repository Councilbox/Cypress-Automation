import React, { Component } from 'react';
import { getPrimary } from '../../styles/colors';
import { TableRow, TableCell } from 'material-ui/Table';
import { Table, DeleteIcon, TextInput, AlertConfirm, LoadingSection } from '../../displayComponents';
import { graphql } from 'react-apollo';
import { updateCouncilAttachment } from '../../queries';

class AttachmentList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            data: {
                name: ''
            },
            errors: {
                name: ''
            }
        }
    }

    updateState = (object) => {
        this.setState({
            data: {
                ...this.state.data, ...object
            }
        })
    };

    _renderModalBody = () => {
        const { translate } = this.props;
        const { errors } = this.state;

        return (<div style={{ width: '650px' }}>
                <TextInput
                    floatingText={translate.name}
                    type="text"
                    errorText={errors.name}
                    value={this.state.data.name}
                    onChange={(event) => this.updateState({
                        name: event.target.value
                    })}
                />
            </div>)
    };

    editIndex = (index) => {
        this.setState({
            showModal: true,
            editId: this.props.attachments[ index ].id,
            data: {
                ...this.state.data,
                name: this.props.attachments[ index ].filename
            }
        })
    };

    updateAttachment = async () => {
        const response = await this.props.updateAttachment({
            variables: {
                id: this.state.editId,
                filename: this.state.data.name
            }
        });
        if (response) {
            this.setState({
                showModal: false
            });
            this.props.refetch();
        }
    };

    deleteAttachment = (id) => {
        this.setState({
            deletingId: id
        });
        this.props.deleteAction(id);
    };


    render() {
        const { attachments, translate, loadingId } = this.props;

        return (<div style={{
                display: 'flex',
                width: '100%'
            }}>
                <Table
                    headers={[ { name: translate.name }, { name: '' }, ]}
                    action={this._renderDeleteIcon}
                >
                    {attachments.map((attachment, index) => {
                        return (<TableRow
                                key={`attachment${attachment.id}`}
                                onClick={() => this.editIndex(index)}
                                hover
                            >
                                <TableCell>{attachment.filename}</TableCell>
                                <TableCell>
                                    <div style={{ width: '4em' }}>
                                        {attachment.id === this.state.deletingId ? (
                                            <LoadingSection size={20}/>) : (attachment.state !== 2 ? (<DeleteIcon
                                                    loading={loadingId === attachment.id}
                                                    style={{ color: getPrimary() }}
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        this.deleteAttachment(attachment.id)
                                                    }}
                                                />) : (` ${translate.deleted}`))}
                                    </div>
                                </TableCell>
                            </TableRow>);
                    })}
                </Table>
                <AlertConfirm
                    requestClose={() => this.setState({ showModal: false })}
                    open={this.state.showModal}
                    acceptAction={this.updateAttachment}
                    buttonAccept={translate.accept}
                    buttonCancel={translate.cancel}
                    bodyText={this._renderModalBody()}
                    title={translate.edit}
                />
            </div>)
    }
}

export default graphql(updateCouncilAttachment, { name: 'updateAttachment' })(AttachmentList);
