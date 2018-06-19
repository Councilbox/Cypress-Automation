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