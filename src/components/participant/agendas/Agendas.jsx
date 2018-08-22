import React from "react";
import { Steps, Step } from 'antd';
import { Paper  } from "material-ui";
import Scrollbar from '../../../displayComponents/Scrollbar';
import AgendaNumber from '../../../displayComponents/AgendaNumber';
import withTranslations from "../../../HOCs/withTranslations";
import { getPrimary, getSecondary } from "../../../styles/colors";

const styles = {
	container: {
		width: "100%",
		height: "100%",
        overflow: 'hidden'
	}
};

class Agendas extends React.Component {
    state = {
        selected: 0
    }

    selectAgenda = (index) => {
        this.setState({selected: index});
    }

	render() {
		const { translate, participant, council } = this.props;
        const { selected } = this.state;

		return (
            <Paper style={styles.container} elevation={4}>
                <Scrollbar>
                    <div style={{padding: '8px'}}>
                        <Steps direction="vertical" size="small" current={selected}>
                            {council.agendas.map((agenda, index) => {
                                return (
                                    <Steps.Step
                                        icon={
                                            <AgendaNumber
                                                index={index + 1}
                                                open={agenda.pointState === 1}
                                                active={selected === index}
                                                activeColor={getPrimary()}
                                                voting={agenda.votingState === 1 && agenda.subjectType !== 0}
                                                translate={translate}
                                                secondaryColor={getSecondary()}
                                                onClick={() => this.selectAgenda(index)}
                                                small={true}
                                            />
                                        }
                                        title={
                                            <div onClick={() => this.selectAgenda(index)}>
                                                {agenda.agendaSubject}
                                            </div>
                                        }
                                        description={ selected === index ?
                                                <div dangerouslySetInnerHTML={{__html: agenda.description}}></div>
                                            :
                                                ''
                                        }
                                        key={agenda.id}
                                    />
                                )
                            })}
                        </Steps>
                    </div>
                </Scrollbar>
			</Paper>
		);
	}
}


export default withTranslations()(Agendas);
