import React from 'react';
import VotingMenu from './VotingMenu';
import { Typography } from 'material-ui';
import { CollapsibleSection, BasicButton, ButtonIcon } from '../../../displayComponents';
import { getPrimary, getSecondary } from '../../../styles/colors';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { downloadFile } from '../../../utils/CBX';
import { singleVoteCompanies } from '../../../config';

class VotingSection extends React.Component {

    state = {
        loading: false,
        singleVoteMode: singleVoteCompanies.includes(this.props.council.companyId)
    }

    downloadVotePDF = async () => {
        this.setState({
			loading: true
		});
        const response = await this.props.downloadVotePDF({
            variables: {
                id: this.props.agenda.votings[0].id
            }
        })

        if (response) {
			if (response.data.downloadVotePDF) {
				downloadFile(
					response.data.downloadVotePDF,
					"application/pdf",
					`Voto_${this.props.agenda.votings[0].id}`
				);
				this.setState({
					loading: false
				});
			}
		}
    }


    render(){
        const { agenda, translate } = this.props;
        const primary = getPrimary();
        const singleVoteMode = this.state.singleVoteMode;

        return(
            <React.Fragment>
                <div style={{display: 'flex', alignItems: 'center', marginTop: '0.6em'}}>
                    <Typography style={{ fontWeight: '700', fontSize: '14px'}}>
                        {agenda.votings[0].vote === -1 &&
                            translate.you_havent_voted_yet
                        }
                        {agenda.votings[0].vote === 0 &&
                            <React.Fragment>
                                {`${translate.you_have_voted}: ${translate.against_btn}`}
                            </React.Fragment>
                        }
                        {agenda.votings[0].vote === 1 &&
                            <React.Fragment>
                                {`${translate.you_have_voted}: ${translate.in_favor_btn}`}
                            </React.Fragment>
                        }
                        {agenda.votings[0].vote === 2 &&
                            <React.Fragment>
                                {`${translate.you_have_voted}: ${translate.abstention_btn}`}
                            </React.Fragment>
                        }
                    </Typography>
                    {singleVoteMode?
                        <React.Fragment>
                            {agenda.votings[0].vote === -1?
                                <BasicButton
                                    color={this.props.voting && this.props.open? primary : 'white'}
                                    text={this.props.translate.exercise_voting}
                                    textStyle={{
                                        color: this.props.voting && this.props.open? 'white' : primary,
                                        fontWeight: '700',
                                        fontSize: '14px'
                                    }}
                                    buttonStyle={{
                                        float: 'left',
                                        marginLeft: '0.6em',
                                        padding: '0.3em',
                                        border: `2px solid ${primary}`
                                    }}
                                    icon={<ButtonIcon type="thumbs_up_down" color={this.props.voting && this.props.open? 'white' : primary}/>}
                                    onClick={this.props.activateVoting}
                                />
                            :
                                <BasicButton
                                    color={this.props.voting && this.props.open? primary : 'white'}
                                    text={this.props.translate.download_vote_pdf}
                                    loading={this.state.loading}
                                    loadingColor={primary}
                                    textStyle={{
                                        color: this.props.voting && this.props.open? 'white' : primary,
                                        fontWeight: '700',
                                        fontSize: '14px'
                                    }}
                                    buttonStyle={{
                                        float: 'left',
                                        marginLeft: '0.6em',
                                        padding: '0.3em',
                                        border: `2px solid ${primary}`
                                    }}
                                    icon={<ButtonIcon type="save_alt" color={this.props.voting && this.props.open? 'white' : primary}/>}
                                    onClick={this.downloadVotePDF}
                                />
                            }
                        </React.Fragment>
                    :
                        <BasicButton
                            color={this.props.voting && this.props.open? primary : 'white'}
                            text={agenda.votings[0].vote === -1? this.props.translate.exercise_voting : translate.change_vote}
                            textStyle={{
                                color: this.props.voting && this.props.open? 'white' : primary,
                                fontWeight: '700',
                                fontSize: '14px'
                            }}
                            buttonStyle={{
                                float: 'left',
                                marginLeft: '0.6em',
                                padding: '0.3em',
                                border: `2px solid ${primary}`
                            }}
                            icon={<ButtonIcon type="thumbs_up_down" color={this.props.voting && this.props.open? 'white' : primary}/>}
                            onClick={this.props.activateVoting}
                        />
                    }
                </div>
                <CollapsibleSection
                    trigger={() => <span/>}
                    onTriggerClick={() => {}}
                    open={this.props.open}
                    collapse={() =>
                        <VotingMenu
                            translate={this.props.translate}
                            close={this.props.toggle}
                            singleVoteMode={singleVoteMode}
                            refetch={this.props.refetch}
                            agenda={agenda}
                        />
                    }
                />
            </React.Fragment>
        )
    }
}

const downloadVotePDF = gql`
    mutation DownloadVotePDF($id: Int!){
        downloadVotePDF(id: $id)
    }
`;

export default graphql(downloadVotePDF, {
    name: 'downloadVotePDF'
})(VotingSection);