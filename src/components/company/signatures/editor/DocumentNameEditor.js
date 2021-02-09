import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { AlertConfirm, TextInput } from '../../../../displayComponents';
import { splitExtensionFilename } from '../../../../utils/CBX';

class DocumentNameEditor extends React.Component {
	state = {
		data: {
			...splitExtensionFilename(this.props.attachment.filename)
		},
		errors: {
			filename: ''
		}
	};

	updateState = object => {
		this.setState({
			data: {
				...this.state.data,
				...object
			}
		});
	};

	_renderModalBody = () => {
		const { translate } = this.props;
		const { errors } = this.state;

		return (
			<div style={{ width: '650px' }}>
				<TextInput
					floatingText={translate.name}
					type="text"
					errorText={errors.filename}
					value={this.state.data.filename}
					onChange={event => this.updateState({
							filename: event.target.value
						})
					}
				/>
			</div>
		);
	};

	updateAttachment = async () => {
		const response = await this.props.updateSignatureDocumentName({
			variables: {
				id: this.props.attachment.id,
				name: `${this.state.data.filename}.${this.state.data.extension}`
			}
		});
		if (response) {
            if (response.data.updateSignatureDocumentName.success) {
                this.props.updateAttachment({
                    filename: `${this.state.data.filename}.${this.state.data.extension}`
                });
                this.props.requestClose();
            }
		}
	};

    render() {
        const { translate } = this.props;
        return (
			<div
				style={{
					width: '100%'
				}}
			>
				<AlertConfirm
					requestClose={this.props.requestClose}
					open={this.props.open}
					acceptAction={this.updateAttachment}
					buttonAccept={translate.accept}
					buttonCancel={translate.cancel}
					bodyText={this._renderModalBody()}
					title={translate.edit}
				/>
			</div>
        );
    }
}

const updateSignatureDocumentName = gql`
    mutation updateSignatureDocumentName($id: Int!, $name: String!){
        updateSignatureDocumentName(id: $id, name: $name){
            success
            message
        }
    }
`;
export default graphql(updateSignatureDocumentName, {
    name: 'updateSignatureDocumentName'
})(DocumentNameEditor);
