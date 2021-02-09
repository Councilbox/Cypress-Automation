import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { secondary } from '../../../../styles/colors';
import { isAskingForWord, exceedsOnlineTimeout } from '../../../../utils/CBX';

class LiveParticipantStats extends React.Component {
    render() {
        let online = 0;
		let offline = 0;
		let broadcasting = 0;
		let askingForWord = 0;
		if (this.props.data.videoParticipants) {
			this.props.data.videoParticipants.list.forEach(
				participant => {
					if (isAskingForWord(participant)) {
						askingForWord++;
					}
					if (exceedsOnlineTimeout(participant.lastDateConnection)) {
						offline++;
					} else {
						if (participant.requestWord === 2) {
							broadcasting++;
						}
						online++;
					}
				}
			);
        }

        return (
            <React.Fragment>
                <div
                    style={{
                        width: '100%',
                        border: `2px solid ${secondary}`,
                        fontSize: '18px',
                        color: secondary,
                        fontWeight: '700',
                        padding: '1em',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    Remotos {`(Online: ${online} || Offline: ${offline} || Palabra concedida: ${broadcasting} || Pidiendo Palabra: ${askingForWord})`}
                </div>
            </React.Fragment>
        );
    }
}

const participantsQuery = gql`
    query VideoParticipants($id: Int!){
        videoParticipants(councilId: $id){
            list {
                id
                name
                requestWord
                lastDateConnection
            }
        }
    }

`;

export default graphql(participantsQuery, {
    options: props => ({
        variables: {
            id: props.council.id
        }
    })
})(LiveParticipantStats);
