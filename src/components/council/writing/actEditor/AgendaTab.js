import React from 'react';
import { LoadingSection, Scrollbar } from '../../../../displayComponents';
import AgendaEditor from './AgendaEditor';

const AgendaTab = ({ council, translate, data }) => {
	if(data.loading){
		return <LoadingSection />;
	}

	const getTypeText = (subjectType) => {
		const votingType = data.votingTypes.find(item => item.value === subjectType)
		return votingType ? translate[votingType.label] : '';
	}

	return(
		<div style={{ height: "100%", overflow: 'hidden', position: 'relative', paddingBottom: '2em' }}>
			<Scrollbar>
				{!!data.agendas && (
					<React.Fragment>
						{data.agendas.map((agenda, index) => (
								<div style={{ marginTop: '2.5em', padding: '1em' }} key={`agenda${agenda.id}`}>
									<AgendaEditor
										agenda={agenda}
										readOnly={true}
										council={council}
										refetch={data.refetch}
										recount={data.councilRecount}
										translate={translate}
										majorityTypes={data.majorityTypes}
										typeText={getTypeText(agenda.subjectType)}
									/>
									{index < data.agendas.length - 1 &&
										<hr style={{ marginTop: '2.5em' }} />
									}
								</div>
							))}
					</React.Fragment>
				)}
			</Scrollbar>
		</div>
	)
}

export default AgendaTab;

