import React from 'react';
import { Redirect } from 'react-router-dom';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import { LoadingMainApp } from '../displayComponents';
import InvalidUrl from '../components/participant/InvalidUrl.jsx';

class ParticipantTokenContainer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading:true,
            error: false,
            participantId: null
        }
    }

    async componentDidUpdate(prevProps){
        if(!prevProps.translate.send && this.props.translate.send){
            this.setState({loading: true});

            try {
                const response = await this.props.participantToken();
                if(response){
                    const token = response.data.participantToken;
                    sessionStorage.setItem('participantToken', token);
                    const responseQueryMe = await this.props.client.query({
                        query: getMe,
                        variables: {},
                        fetchPolicy: 'network-only'
                    });
                    const participant = responseQueryMe.data.participantMe;

                    this.setState({token: token, loading: false, participantId: participant.id});
                }
                else{
                    throw new Error('Error getting participant token');
                }
            } catch (error) {
                console.log(error);
                //TODO ADD TOAST OR LOAD MESSAGE VIEW
                this.setState({error: true, loading: false});
            }
        }
    }

    render(){
        const { loading, error, participantId } = this.state;
        const { translate } = this.props;
        if(Object.keys(translate).length === 0 && loading){
            return <LoadingMainApp />
        }

        if(error){
            return(<InvalidUrl />)
        }

        return(
            <React.Fragment>
                {participantId &&
                    <Redirect to={`/participant/${participantId}/login`} />
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    main: state.main,
    translate: state.translate
});

const participantToken = gql`
    mutation participantToken($token: String!){
        participantToken(token: $token)
    }
`;

const getMe = gql`
    query participantMe{
        participantMe {
            name
            surname
            id
            phone
            email
            language
        }
    }
`;

export default graphql(participantToken, {
    name: 'participantToken',
    options: (props) => ({
        variables: {
            token: props.match.params.token
        },
        errorPolicy: 'all'
    })
})(withApollo(connect(mapStateToProps)(ParticipantTokenContainer)));