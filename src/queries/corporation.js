import gql from 'graphql-tag';

export const getCorporation = gql`
    query getCorporation{
        corporation{
            id
            businessName
            address
            tin
            logo
            language
        }
    }
`;