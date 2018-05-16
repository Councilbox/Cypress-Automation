import React from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { LoadingMainApp } from '../displayComponents';


class ParticipantContainer extends React.PureComponent {

    render(){
        const { participantRoomInfo } = this.props;
        if(participantRoomInfo.loading){
            return <LoadingMainApp />
        }

        return(
            <div style={{display: 'flex', flex: 1, flexDirection: 'column', height: '100vh', overflow: 'auto', padding: 0, margin: 0}}>
                Id: {this.props.match.params.id}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    main: state.main,
    translate: state.translate
});

const participantRoomInfo = gql`
    query participantRoomInfo{
        participantRoomInfo {
            name
            surname
            id
            phone
            email
            language
        }
    }
`;

export default graphql(participantRoomInfo, {
    name: 'participantRoomInfo',
    options: (props) => ({
        variables: {},
        fetchPolicy: 'network-only'
    })
})(connect(mapStateToProps)(ParticipantContainer));