import React from 'react';
import { graphql } from 'react-apollo';
import FontAwesome from 'react-fontawesome';
import * as CBX from '../../../utils/CBX';
import { QUORUM_TYPES } from '../../../constants';
import { liveRecount } from '../../../queries/live';

const QuorumWrapper = ({ translate, council, recount, secondCall }) => {
    const statute = secondCall ?
        {
            type: council.statute.secondCallQuorumType,
            value: council.statute.secondCallQuorum,
            divider: council.statute.secondCallQuorumDivider
        }
    :
        {
            type: council.statute.firstCallQuorumType,
            value: council.statute.firstCallQuorum,
            divider: council.statute.firstCallQuorumDivider
        };

    const quorumType = QUORUM_TYPES.find(quorum => quorum.value === statute.type);
    const neededQuorum = CBX.calculateQuorum(council, recount);

    return(
        <React.Fragment>
            {statute.type !== -1 ?
                <React.Fragment>
                    <span>
                        {`${translate.quorum_type}: ${translate[quorumType.label]} ${
                            CBX.isQuorumPercentage(quorumType.value) ?
                                `(${statute.value} %)`
                            :
                                CBX.isQuorumFraction(quorumType.value) ?
                                    `(${statute.value} / ${statute.divider})`
                                :
                                    CBX.isQuorumNumber(quorumType.value) ?
                                        `(${statute.value})`
                                    :
                                        ''

                        }`}
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <span>
                            {`${translate.required_quorum}: ${neededQuorum}`}
                        </span>
                        {council.statute.quorumPrototype === 0 ?
                            neededQuorum <= recount.partRightVoting ?
                                <ReachedIcon />
                            :
                                <NotReachedIcon />
                        :
                            neededQuorum <= recount.socialCapitalRightVoting ?
                                <ReachedIcon />
                            :
                                <NotReachedIcon />
                        }
                    </div>
                </React.Fragment>
            :
                <span>
                    {`${translate.quorum_type}: ${translate[quorumType.label]}`}
                </span>
            }

        </React.Fragment>
    );
};

const NotReachedIcon = () => (
    <FontAwesome
        name={'times'}
        style={{
            fontSize: '0.9em',
            color: 'red',
            marginLeft: '0.4em'
        }}
    />
);

const ReachedIcon = () => (
    <FontAwesome
        name={'check'}
        style={{
            fontSize: '0.9em',
            color: 'green',
            marginLeft: '0.4em'
        }}
    />
);

export default graphql(liveRecount, {
    options: props => ({
        variables: {
            councilId: props.council.id
        }
    })
})(QuorumWrapper);
