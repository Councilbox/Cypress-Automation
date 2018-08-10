import gql from 'graphql-tag';

export const liveRecount = gql`
    query LiveRecount($councilId: Int!){
        councilRecount(councilId: $councilId){
            id
            socialCapitalTotal
            partTotal
            numTotal
            socialCapitalRightVoting
            numRightVoting
        }
    }
`;

export const openCouncilRoom = gql`
	mutation openCouncilRoom(
		$councilId: Int!
		$sendCredentials: Boolean!
		$timezone: String!
	) {
		openCouncilRoom(
			councilId: $councilId
			sendCredentials: $sendCredentials
			timezone: $timezone
		) {
			success
		}
	}
`;