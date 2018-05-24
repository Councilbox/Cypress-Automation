import React, { Component } from 'react';
import { CollapsibleSection, LoadingSection, Icon, ErrorWrapper } from '../../../displayComponents';
import { darkGrey, getPrimary, getSecondary } from '../../../styles/colors';
import FontAwesome from 'react-fontawesome';
import { councilHasComments } from '../../../utils/CBX';
import Votings from './Votings';
import Comments from './Comments';

const VotingsSection = ({ agenda, council, majorities, translate }) => {
    return(
        <React.Fragment>
            {councilHasComments(council.statute) &&
                <div style={{width: '100%', marginTop: '0.4em'}} className="withShadow">
                    <Comments
                        agenda={agenda}
                        council={council}
                        translate={translate}
                    />
                </div>
            }
            <div style={{width: '100%', marginTop: '0.4em'}} className="withShadow">
                <Votings
                    agenda={agenda}
                    majorities={majorities}
                    translate={translate}
                />
            </div>
        </React.Fragment>
    );
}

export default VotingsSection;