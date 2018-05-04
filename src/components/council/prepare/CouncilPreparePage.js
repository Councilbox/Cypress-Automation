import React, { Component, Fragment } from 'react';

import { CardPageLayout, BasicButton, LoadingSection, Icon, DropDownMenu, ErrorWrapper, ButtonIcon } from "../../../displayComponents";
import { getPrimary, getSecondary } from '../../../styles/colors';
import { MenuItem, Card, Divider, Typography } from 'material-ui';
import DateHeader from './DateHeader';
import { graphql, withApollo } from 'react-apollo';
import { bHistory } from '../../../containers/App';
import { councilDetails, downloadConvenePDF } from '../../../queries';
import * as CBX from '../../../utils/CBX';
import ParticipantsSection from './ParticipantsSection';
import ReminderModal from './ReminderModal';
import FontAwesome from 'react-fontawesome';
import RescheduleModal from './RescheduleModal';
import SendConveneModal from './SendConveneModal';
import CancelModal from './CancelModal';
import AttachmentDownload from '../../attachments/AttachmentDownload';


class CouncilPreparePage extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            participants: false,
            sendReminder: false,
            sendConvene: false,
            cancel: false,
            rescheduleCouncil: false
        }
    }

    componentDidMount(){
        this.props.data.refetch();
    }

    goToPrepareRoom = () => {
        bHistory.push(`/company/${this.props.companyID}/council/${this.props.councilID}/live`);
    };

    downloadPDF = async () => {
        const response = await this.props.client.query({
            query: downloadConvenePDF,
            variables: {
                councilId: this.props.data.council.id
            }
        });

        if(response){
            if(response.data.downloadConvenePDF){
                CBX.downloadFile(response.data.downloadConvenePDF, 'application/pdf', `${this.props.translate.convene} - ${this.props.data.council.name}`);
            }
        }
        console.log(response);
    };


    render(){
        const { council, error, loading } = this.props.data;
        const { translate } = this.props;
        const primary = getPrimary();
        const secondary = getSecondary();

        if(loading){
            return(
                <LoadingSection />
            );
        }

        if(error){
            return(
                <ErrorWrapper error={error} translate={translate} />
            )
        }

        return(
            <CardPageLayout title={translate.prepare_room}>
                <DateHeader
                    council={council}
                    translate={translate}
                    button={
                        <div>
                            <BasicButton
                                text={translate.export_convene}
                                color={primary}
                                buttonStyle={{margin: '0', height: '100%'}}
                                textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                                icon={<FontAwesome
                                    name={'file-pdf-o'}
                                    style={{fontSize: '1em', color: 'white', marginLeft: '0.3em'}}
                                /> }
                                textPosition="after"
                                onClick={this.downloadPDF}
                            />
                            <BasicButton
                                text={translate.prepare_room}
                                color={primary}
                                buttonStyle={{margin: '0', height: '100%'}}
                                textStyle={{color: 'white', fontWeight: '700', marginLeft: '0.3em', fontSize: '0.9em', textTransform: 'none'}}
                                icon={<FontAwesome
                                    name={'user-plus'}
                                    style={{fontSize: '1em', color: 'white', marginLeft: '0.3em'}}
                                /> }
                                textPosition="after"
                                onClick={this.goToPrepareRoom}
                            />
                            <DropDownMenu 
                                icon={<ButtonIcon color={'white'} type={'list'} />}
                                color={secondary}
                                buttonStyle={{width: '3em', marginLeft: '0.3em'}}
                                items={
                                    <Fragment>
                                        {CBX.councilIsNotified(council)?
                                            <MenuItem onClick={() => this.setState({sendReminder: true})}>
                                                <Icon className="material-icons" style={{color: secondary, marginRight: '0.4em'}}>update</Icon>
                                                {translate.send_reminder}
                                            </MenuItem>
                                        :
                                            <MenuItem onClick={() => this.setState({sendConvene: true})}>
                                                <Icon className="material-icons" style={{color: secondary, marginRight: '0.4em'}}>notifications</Icon>
                                                {translate.new_send}
                                            </MenuItem>
                                        }
                                        <MenuItem onClick={() => this.setState({rescheduleCouncil: true})}>
                                            <Icon className="material-icons" style={{color: secondary, marginRight: '0.4em'}}>schedule</Icon>
                                            {translate.reschedule_council}
                                        </MenuItem>
                                        <Divider light />
                                        <MenuItem onClick={() => this.setState({cancel: true})}>
                                            <Icon className="material-icons" style={{color: 'red', marginRight: '0.4em'}}>highlight_off</Icon>
                                            {translate.cancel_council}
                                        </MenuItem>
                                    </Fragment>
                                } 
                            />
                        </div>
                    }
                />
                <div>
                    <BasicButton
                        text={this.state.page? translate.convene : translate.new_list_called}
                        color={primary}
                        buttonStyle={{margin: '0', height: '100%'}}
                        textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                        icon={<ButtonIcon color='white' type="add" />}
                        textPosition="after"
                        onClick={() => this.setState({
                            page: !this.state.page
                        })} 
                    />
                    
                </div>

                {!this.state.page?
                    <Fragment>
                        {council.attachments.length > 0 &&
                            <Card style={{paddingTop: '1.5em', marginTop: '0.4em', paddingBottom: '1.5em', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <Typography variant="title" style={{color: getPrimary()}}>
                                    {translate.new_files_title}
                                </Typography>
                                <div style={{marginTop: '1em'}}>
                                    {council.attachments.map((attachment) => { return(
                                        <AttachmentDownload attachment={attachment} loading={this.state.downloading} spacing={1} />
                                    )})}
                                </div>
                            </Card>
                        }
                        <Card style={{marginTop: '1.5em'}}>
                            <div
                                dangerouslySetInnerHTML={{__html: council.emailText}}
                                style={{padding: '2em'}} 
                            />
                        </Card>
                    </Fragment>
                :
                    <ParticipantsSection
                        translate={translate}
                        council={council}
                        totalVotes={this.props.data.councilTotalVotes}
                        socialCapital={this.props.data.councilSocialCapital}
                        refetch={this.props.data.refetch}
                    />
                }
                <ReminderModal
                    show={this.state.sendReminder}
                    council={council}
                    requestClose={() => this.setState({sendReminder: false})}
                    translate={translate}
                />
                <CancelModal
                    show={this.state.cancel}
                    council={council}
                    requestClose={() => this.setState({cancel: false})}
                    translate={translate}
                />
                <SendConveneModal
                    show={this.state.sendConvene}
                    council={council}
                    refetch={this.props.data.refetch}
                    requestClose={() => this.setState({sendConvene: false})}
                    translate={translate}
                />
                <RescheduleModal
                    show={this.state.rescheduleCouncil}
                    council={council}
                    requestClose={() => this.setState({rescheduleCouncil: false})}
                    translate={translate}
                />
            </CardPageLayout>
        );
    }
}

export default graphql(councilDetails, {
    name: "data",
    options: (props) => ({
        variables: {
            councilID: props.councilID,
        }
    })
})(withApollo(CouncilPreparePage));