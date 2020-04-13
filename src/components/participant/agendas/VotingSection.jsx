import React from 'react';
import VotingMenu from './VotingMenu';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
//import { downloadFile } from '../../../utils/CBX';
//import { singleVoteCompanies } from '../../../config';

const VotingSection = ({ translate, agenda, council, disabledColor, hasVideo, ...props }) => {
    //const [singleVoteMode, setSingleVoteMode] = React.useState(singleVoteCompanies.includes(council.companyId));


    // const downloadVotePDF = async () => {
    //     setLoading(true);
    //     const response = await props.downloadVotePDF({
    //         variables: {
    //             id: agenda.votings[0].id
    //         }
    //     })

    //     if (response) {
    //         if (response.data.downloadVotePDF) {
    //             downloadFile(
    //                 response.data.downloadVotePDF,
    //                 "application/pdf",
    //                 `Voto_${agenda.votings[0].id}`
    //             );
    //             setLoading(false);
    //         }
    //     }
    // }

    return (
        <React.Fragment>
            <VotingMenu
                translate={translate}
                close={props.toggle}
                council={council}
                ownVote={props.ownVote}
                singleVoteMode={false}
                refetch={props.refetch}
                agenda={agenda}
                disabledColor={disabledColor}
                hasVideo={hasVideo}
            />
        </React.Fragment>
    )

}

const downloadVotePDF = gql`
    mutation DownloadVotePDF($id: Int!){
        downloadVotePDF(id: $id)
    }
`;

export default graphql(downloadVotePDF, {
    name: 'downloadVotePDF'
})(VotingSection);