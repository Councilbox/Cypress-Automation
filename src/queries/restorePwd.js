import gql from "graphql-tag";

export const restorePwd = gql`
    mutation restorePwd($email: String!) {
        restorePwd(email: $email) {
            success
        }
    }
`;

export const changePwd = gql`
    mutation changePwd($pwd: String!, $token: String!) {
        changePwd(pwd: $pwd, token: $token) {
            success
        }
    }
`;

export const checkExpiration = gql`
    mutation checkExpiration($token: String!) {
        checkExpiration(token: $token) {
            success
        }
    }
`;