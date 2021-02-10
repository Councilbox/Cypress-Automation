import React from 'react';
import VotingMenu from './VotingMenu';


const VotingSection = ({ translate, agenda, council, disabledColor, hasSession, ...props }) => {

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
hasSession={hasSession}
/>
</React.Fragment>
)
}

export default VotingSection;
