import gql from 'graphql-tag';
import { Icon } from 'material-ui';
import React from 'react';
import { withApollo } from 'react-apollo';
import { BasicButton, FileUploadButton } from '../../../displayComponents';
import { addCouncilAttachment } from '../../../queries';
import { getSecondary } from '../../../styles/colors';


const OneOnOneDocumentation = ({ translate, participant, client, council }) => {
    const [data, setData] = React.useState(null);
    const secondary = getSecondary();

    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: gql`
                query ParticipantCouncilAttachments{
                    participantCouncilAttachments{
                        id
                        filename
                        filesize
                    }
                }
            `
        });

        console.log(response);
        setData(response.data.participantCouncilAttachments);
    });
    
    React.useEffect(() => {
        getData();
    }, [participant.id])

    const handleFile = async event => {
		const file = event.nativeEvent.target.files[0];
		if (!file) {
			return;
		}
		// if (file.size / 1000 + this.state.totalSize > MAX_FILE_SIZE) {
		// 	this.setState({
		// 		alert: true
		// 	});
		// 	return;
		// }
		let reader = new FileReader();
		reader.readAsBinaryString(file);
		reader.onload = async event => {
			let fileInfo = {
                filename: file.name,
				filetype: file.type,
				filesize: event.loaded,
				base64: btoa(event.target.result),
				councilId: council.id
            };
            
            console.log(fileInfo);

            const response = await client.mutate({
                mutation: addCouncilAttachment,
				variables: {
					attachment: fileInfo
				}
            });
            
            console.log(response);

			// this.setState({
			// 	uploading: true
			// });
			// const response = await this.props.addAgendaAttachment({
			// 	variables: {
			// 		attachment: fileInfo
			// 	}
			// });
			// if (response) {
			// 	this.props.refetch();
			// 	this.setState({
			// 		uploading: false
			// 	});
			// }
		};
	};

    return (
        <div>
            {data &&
                data.map(attachment => (
                    <div key={attachment.id}>
                        {attachment.filename}
                    </div>
                ))
            }
            <FileUploadButton
                color={"white"}
                text={translate.add_attachment}
                textStyle={{
                    color: secondary,
                    fontWeight: "700",
                    fontSize: "0.9em",
                    textTransform: "none"
                }}
                //loading={this.state.uploading}
                loadingColor={'primary'}
                buttonStyle={{
                    border: `1px solid ${secondary}`,
                    height: "100%",
                    marginTop: "5px"
                }}
                icon={
                    <Icon
                        className="material-icons"
                        style={{
                            fontSize: "1.5em",
                            color: secondary
                        }}
                    >
                        control_point
                    </Icon>
                }
                onChange={handleFile}
            />
        </div>
    )
}

export default withApollo(OneOnOneDocumentation)