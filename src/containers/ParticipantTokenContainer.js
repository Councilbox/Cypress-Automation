import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import { LoadingMainApp } from '../displayComponents';
import ParticipantContainer from './ParticipantContainer'

class ParticipantTokenContainer extends React.PureComponent {

    render(){
        const { translate, participantToken } = this.props;
        if(!translate.send && participantToken.loading){
            return <LoadingMainApp />
        }

        return(
            <ParticipantContainer token={participantToken.participantToken}/>
        );
    }
}

const mapStateToProps = (state) => ({
    main: state.main,
    translate: state.translate
});

const participantToken = gql`
    query participantToken($token: String!){
        participantToken(token: $token)
    }
`;

export default graphql(participantToken, {
    name: 'participantToken',
    options: (props) => ({
        variables: {
            token: props.match.params.token
        }
    })
})(connect(mapStateToProps)(ParticipantTokenContainer));