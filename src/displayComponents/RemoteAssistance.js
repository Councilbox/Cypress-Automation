import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class RemoteAssistance extends React.Component {

    state = {
        pointer: false,
        pointerPosition: {
            x: 0,
            y: 0
        }
    }

    startRemoteAssistance = () => {
        this.props.subscribeToPointerPosition({userId: this.props.user.id});
        this.setState({
            pointer: true
        })
    };

    render(){
        if(this.props.data.loading){
            return <span />
        }
        const { pointerPosition } = this.props.data;

        if(process.env.REACT_APP_POINTER !== "true"){
            return this.props.children;
        }

        return (
            <div
                style={{width: '100%', height: '100%', position: 'relative'}}
                //onMouseMove={handleMouseMove}
                onClick={this.startRemoteAssistance}
            >
                {this.props.children}
                {this.state.pointer &&
                    <div
                        className="withShadow"
                        style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '7px',
                            backgroundColor: '#B00000',
                            opacity: '0.9',
                            position: 'absolute',
                            zIndex: 1000000,
                            top: `${pointerPosition.y - 7}px`,
                            left: `${pointerPosition.x - 7}px`,
                        }}
                    />
                }
            </div>
        )
    }
}

const pointerPosition = gql`
    query PointerPosition($userId: Int!){
        pointerPosition(userId: $userId){
            x
            y
        }
    }
`;

const pointerSubscription = gql`
    subscription pointerPositionChanged($userId: Int!){
        pointerPositionChanged(userId: $userId){
            x
            y
        }
    }
`

export default graphql(pointerPosition, {
    options: props => ({
        variables: {
            userId: props.user.id
        }
    }),
    props: props => {
        return {
            ...props,
            subscribeToPointerPosition: params => {
                return props.data.subscribeToMore({
                    document: pointerSubscription,
                    variables: {
                        userId: params.userId
                    },
                    updateQuery: (prev, { subscriptionData }) => {
                        if(!subscriptionData.data){
                            return prev;
                        }

                        return {
                            pointerPosition: {
                                ...subscriptionData.data.pointerPositionChanged
                            }
                        }
                    }
                })
            }
        }
    }
})(RemoteAssistance);