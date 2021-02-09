import React from 'react';
import { IconButton } from 'material-ui';
import { AlertConfirm } from '../../../displayComponents';
import { getSecondary } from '../../../styles/colors';
import CouncilInfo from '../../council/convene/CouncilInfo';
import withTranslations from '../../../HOCs/withTranslations';
import { moment } from '../../../containers/App';
import * as CBX from '../../../utils/CBX';


const CouncilInfoMenu = ({ translate, council, noSession }) => {
    const [state, setState] = React.useState({
        showConvene: false,
        showCouncilInfo: false,
        showParticipantInfo: false
    });

    const closeInfoModal = () => {
        setState({
            ...state,
            showCouncilInfo: false
        });
    };

    const renderCouncilInfo = () => (
        <CouncilInfo
            council={council}
            translate={translate}
        />
    );

    const secondary = getSecondary();
    const fecha1 = moment(new Date(council.closeDate));
    const fecha2 = moment(new Date());

    const duration = fecha1.diff(fecha2);
    const diffDuration = moment.duration(duration);
    const dias = diffDuration.days() ? `${diffDuration.days()}d ` : '';
    let finalizado = false;
    if (diffDuration.hours() < 0 && (diffDuration.minutes() == 0 && diffDuration.seconds() == 0)) {
        finalizado = '00:00';
    }
    const date = dias + (finalizado || `${diffDuration.hours() < 10 ? `0${diffDuration.hours()}` : diffDuration.hours()}:${diffDuration.minutes() < 10 ? `0${diffDuration.minutes()}` : diffDuration.minutes()}:${diffDuration.seconds() < 10 ? `0${diffDuration.seconds()}` : diffDuration.seconds()}`);
    return (
        <React.Fragment>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {!noSession && !CBX.checkSecondDateAfterFirst(fecha1, fecha2)
                    && <div style={{ display: 'flex', color: secondary, alignItems: 'center' }} >
                        {date}
                        <i className="fa fa-hourglass-half"
                            style={{
                                outline: 0,
                                color: secondary,
                                fontSize: '16px',
                                paddingLeft: ' 0.2em'
                            }}
                        ></i>
                    </div>
                }

                <IconButton
                    size={'small'}
                    onClick={() => setState({
                            ...state,
                            showCouncilInfo: true
                        })
                    }
                    style={{
                        outline: 0,
                        color: secondary,
                        cursor: 'pointer',
                        width: '42px'
                    }}
                    title={'information'}
                >
                    <i className="fa fa-info"></i>
                </IconButton>
            </div>
            {state.showCouncilInfo
                && <AlertConfirm
                    requestClose={closeInfoModal}
                    open={state.showCouncilInfo}
                    acceptAction={closeInfoModal}
                    buttonAccept={translate.accept}
                    bodyText={renderCouncilInfo()}
                    title={translate.council_info}
                    bodyStyle={{ paddingTop: '5px', margin: '10px' }}
                />
            }
        </React.Fragment>
    );
};

export default (withTranslations()(CouncilInfoMenu));
