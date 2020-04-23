import React from 'react';
import VotingMenu from './VotingMenu';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const VotingSection = ({ translate, agenda, council, disabledColor, hasVideo, ...props }) => {

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

export default VotingSection;