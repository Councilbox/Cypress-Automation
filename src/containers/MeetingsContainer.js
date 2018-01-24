import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import TabsScreen from '../components/TabsScreen';
import Drafts from '../components/Drafts';

const MeetingsContainer = ({main, company, user, match}) => {

    const tabsIndex = {
        drafts: 0,
        live: 1,
        writing: 2,
        trash: 3
    }

    const tabsInfo = [
        {
            text: 'Borradores',
            link: '/meetings/drafts',
            component: Drafts(user)
        }, {
            text: 'En celebración',
            link: '/meetings/live',
            component: <div
                    style={{
                    height: '10em',
                    padding: '2em'
                }}>EN CELEBRACION prueba</div>
        }, {
            text: 'Redactando acta',
            link: '/meetings/writing',
            component: <div
                    style={{
                    height: '10em',
                    padding: '2em'
                }}>REDACTANDO ACTA</div>
        }, {
            text: 'Papelera',
            link: '/meetings/trash',
            component: <div
                    style={{
                    height: '10em',
                    padding: '2em'
                }}>PAPELERA</div>
        }
    ]

    return (
        <div
            style={{
            height: '100vh',
            width: '100%',
            display: 'flex'
        }}>
            <TabsScreen
                tabsIndex={tabsIndex}
                tabsInfo={tabsInfo}
                selected={match.params.section}/>
        </div>
    );
}

const mapStateToProps = (state) => ({
    main: state.main,
    company: state.company,
    user: state.user
});

export default connect(mapStateToProps)(withRouter(MeetingsContainer));