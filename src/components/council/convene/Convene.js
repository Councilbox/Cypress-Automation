import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import FontAwesome from 'react-fontawesome';
import { getPrimary, getSecondary } from '../../../styles/colors';
import gql from "graphql-tag";
import { Grid, GridItem, BasicButton, ErrorWrapper, LoadingSection } from "../../../displayComponents";
import { Typography } from 'material-ui';
import AttachmentDownload from '../../attachments/AttachmentDownload';
import Scrollbar from 'react-perfect-scrollbar';


export const conveneDetails = gql `
  query CouncilDetails($councilID: Int!) {
        council(id: $councilID) {
            id
            attachments {
                councilId
                filename
                filesize
                filetype
                id
            }
            emailText
        }
  }
`;

class Convene extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    render() {
        const secondary = getSecondary();
        const { translate } = this.props;
        const { council, error, loading } = this.props.data;

        if (loading) {
            return (<LoadingSection/>);
        }

        if (error) {
            return (<ErrorWrapper error={error} translate={translate}/>)
        }

        return (<Scrollbar>
                {council.attachments.length > 0 && <div style={{
                    paddingTop: '1em 0',
                    width: '98%'
                }}>
                    <Typography variant="title" style={{ color: getPrimary() }}>
                        {translate.new_files_title}
                    </Typography>
                    <div style={{ marginTop: '1em' }}>
                        <Grid>
                            {council.attachments.map((attachment) => {
                                return (<GridItem key={`attachment${attachment.id}`}>
                                    <AttachmentDownload attachment={attachment} loading={this.state.downloading}
                                                        spacing={0.5}/>
                                </GridItem>)
                            })}
                        </Grid>
                    </div>
                </div>}
                <BasicButton
                    text={translate.export_convene}
                    color={secondary}
                    buttonStyle={{ marginTop: '0.5em' }}
                    textStyle={{
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '0.9em',
                        textTransform: 'none'
                    }}
                    icon={<FontAwesome
                        name={'file-pdf-o'}
                        style={{
                            fontSize: '1em',
                            color: 'white',
                            marginLeft: '0.3em'
                        }}
                    />}
                    textPosition="after"
                    onClick={this.downloadPDF}
                />
                <div
                    dangerouslySetInnerHTML={{ __html: council.emailText }}
                    style={{
                        padding: '2em',
                        margin: '0 auto'
                    }}/>
            </Scrollbar>)
    }
}

export default graphql(conveneDetails, {
    name: "data",
    options: (props) => ({
        variables: {
            councilID: props.councilID,
        }
    })
})(Convene);