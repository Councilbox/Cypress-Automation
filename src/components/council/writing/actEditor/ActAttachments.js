import React from 'react';
import { graphql } from 'react-apollo';
import { councilAndAgendaAttachments } from '../../../../queries';
import { LoadingSection, Grid, GridItem } from '../../../../displayComponents';
import AttachmentDownload from '../../../attachments/AttachmentDownload';
import { Typography } from 'material-ui';
import { getPrimary } from '../../../../styles/colors';

class ActAttachments extends React.PureComponent{

    render(){

        if(this.props.data.loading){
            return (
                <div
                    style={{
                        padding: '5em',
                        width: '100%',
                    }}
                >
                    <LoadingSection />
                </div>
            )
        }
        const { translate } = this.props;
        const primary = getPrimary();

        return(
            <div style={{padding: '1.2em'}}>
                <Grid>
                    <GridItem xs={12} md={12} lg={12}>
                        <Typography variant="title" style={{color: primary, fontWeight: '700'}}>
                            {translate.new_files_title}
                        </Typography>
                    </GridItem>
                    {this.props.data.council &&
                        this.props.data.council.attachments.length > 0?
                            this.props.data.council.attachments.map((attachment) =>
                                <GridItem key={`attachment_${attachment.id}`}>
                                    <AttachmentDownload
                                        attachment={attachment}
                                        translate={translate}
                                        council={this.props.council}
                                    />
                                </GridItem>
                            )
                        :
                            '-'
                    }
                </Grid>
                <Grid style={{marginTop: '2.6em'}}>
                    <Typography variant="title" style={{color: primary, fontWeight: '700'}}>
                        {translate.attachments_to_agenda}
                    </Typography>
                    {this.props.data.council &&
                        this.props.data.council.agendas.map((agenda) =>
                            <React.Fragment key={`agenda_${agenda.id}`}>
                                <GridItem xs={12} lg={12} md={12} style={{display: 'flex', flexDirection: 'column'}}>
                                    <Typography variant="subheading" style={{color: primary, fontWeight: '700'}}>
                                        {`${agenda.orderIndex} - ${agenda.agendaSubject}`}
                                    </Typography>
                                </GridItem>

                                    {agenda.attachments.length > 0?
                                        agenda.attachments.map((attachment) =>
                                            <GridItem key={`agendaAttachment_${attachment.id}`}>
                                                <AttachmentDownload
                                                    agenda={true}
                                                    attachment={attachment}
                                                    translate={translate}
                                                    council={this.props.council}
                                                />
                                            </GridItem>
                                        )
                                    :
                                        '-'
                                    }
                            </React.Fragment>
                        )
                    }
                </Grid>
            </div>
        )
    }
}

export default graphql(councilAndAgendaAttachments, {
    options: props => ({
        variables: {
            councilId: props.council.id
        }
    })
})(ActAttachments);