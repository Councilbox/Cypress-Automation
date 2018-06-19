import React from 'react';
import * as CBX from '../../../utils/CBX';
import { QUORUM_TYPES } from "../../../constants";

const QuorumWrapper = ({ translate, council }) => {

    const quorumType = QUORUM_TYPES.find(quorum => quorum.value === council.statute.firstCallQuorumType);

    return(
        <span>
            {`${translate[quorumType.label]} ${
                CBX.isQuorumPercentage(quorumType.value)?
                    `(${council.statute.firstCallQuorum} %)`
                :
                    CBX.isQuorumFraction(quorumType.value)?
                        `(${council.statute.firstCallQuorum} / ${council.statute.firstCallQuorumDivider})`
                    :
                        CBX.isQuorumNumber(quorumType.value) &&
                            `(${council.statute.firstCallQuorum})`
            }`}
        </span>
    )
}

export default QuorumWrapper;