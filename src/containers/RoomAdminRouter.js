import React from 'react';
import { Switch, Route } from 'react-router-dom';
import CouncilLiveContainer from './CouncilLiveContainer';
import { bHistory } from './App';
import withSharedProps from '../HOCs/withSharedProps';
import LiveHeader from '../components/council/live/LiveHeader';
import CouncilFinishedPage from '../components/council/writing/CouncilFinishedPage';

const RoomAdminRouter = ({ user, company, translate }) => {
    React.useEffect(() => {
        bHistory.replace(`/council/${user.accessLimitedTo}/live`);
    }, [user.accessLimitedTo]);

    return (
        <Switch>
            <Route
                exact
                path="/council/:id/live"
                component={CouncilLiveContainer}
            />
            <Route
                exact
                path="/company/:company/council/:council/finished"
                component={() => (
                    <div
                        style={{
                            height: '100%',
                            width: '100vw',
                            overflow: 'hidden',
                            backgroundColor: 'white',
                            fontSize: '1em',
                            position: 'relative'
                        }}
                    >
                        <LiveHeader
                            logo={!!company && company.logo}
                            companyName={!!company && company.businessName}
                            councilName={''}
                            translate={translate}
                        />
                        <CouncilFinishedPage />
                    </div>

                )}
            />
        </Switch>
    );
};

export default withSharedProps()(RoomAdminRouter);
