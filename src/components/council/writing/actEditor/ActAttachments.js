import React from 'react';
import { graphql } from 'react-apollo';
import { councilAndAgendaAttachments } from '../../../../queries';
import { LoadingSection, Grid, GridItem } from '../../../../displayComponents';
import AttachmentDownload from '../../../attachments/AttachmentDownload';
import { Typography } from 'material-ui';
import { getPrimary } from '../../../../styles/colors';

class ActAttachments extends React.Component{

    render(){

        if(this.props.data.loading){
            return (
                <LoadingSection />
            )
        }
        const { translate } = this.props;
        return(
            <div style={{padding: '1.2em'}}>
                <Grid>
                    <GridItem xs={12} md={12} lg={12}>
                        <Typography variant="subheading" style={{color: getPrimary()}}>
                            {translate.new_files_title}
                        </Typography>
                    </GridItem>
                    {this.props.data.council && 
                        this.props.data.council.attachments.map((attachment) => 
                            <GridItem>
                                <AttachmentDownload
                                    attachment={attachment}
                                    translate={translate}
                                    council={this.props.council}
                                />
                            </GridItem>
                        )
                    }
                </Grid>
                <Grid style={{marginTop: '1.4em'}}>
                    {this.props.data.council &&
                        this.props.data.council.agendas.map((agenda) => 
                            <React.Fragment>
                                <GridItem xs={12} lg={12} md={12} style={{display: 'flex', flexDirection: 'column'}}>
                                    <Typography variant="subheading" style={{color: getPrimary()}}>
                                        {`${agenda.orderIndex} - ${agenda.agendaSubject}`}
                                    </Typography>
                                </GridItem>                
                                
                                    {agenda.attachments.length > 0? 
                                        agenda.attachments.map((attachment) =>
                                            <GridItem>
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