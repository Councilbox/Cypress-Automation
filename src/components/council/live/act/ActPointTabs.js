import React from 'react';
import { Tabs, Tab } from 'material-ui';
import * as CBX from '../../../../utils/CBX';
import { Scrollbar } from '../../../../displayComponents';
import Votings from '../Votings';
import RecountSection from '../RecountSection';
import Comments from '../Comments';
import ActHTMLTab from '../../writing/actViewer/ActHTMLTab';
import withSharedProps from '../../../../HOCs/withSharedProps';


const ActPointTabs = ({
	agenda, translate, council, company, ...props
}) => {
	const [selectedTab, setSelectedTab] = React.useState(0);
	const votings = React.useRef(null);

	const handleChange = (event, index) => {
		setSelectedTab(index);
	};


	return (
		<div style={{ height: '100%', backgroundColor: 'white' }}>
			<Tabs
				value={selectedTab}
				indicatorColor="secondary"
				textColor="secondary"
				onChange={handleChange}
			>
				<Tab label={translate.proposed_act} />
				<Tab label={translate.voting} />
				{CBX.councilHasComments(council.statute)
					&& <Tab label={translate.act_comments} />
				}
			</Tabs>
			<div style={{ width: '100%', height: 'calc(100% - 48px)', borderTop: '1px solid gainsboro' }}>
				<Scrollbar>
					{selectedTab === 0
						&& <div style={{ padding: '1.5em', paddingRight: '4.5em' }}>
							<ActHTMLTab
								council={council}
								translate={translate}
								company={company}
								toolbar={() => <>
								</>
								}
							/>
						</div>
					}
					{selectedTab === 1
						&& <div style={{ padding: '1.5em', paddingRight: '4.5em', paddingBottom: '2em' }}>
							<RecountSection
								agenda={agenda}
								key={`agendaRecount_${agenda.id}`}
								council={council}
								translate={translate}
								recount={props.recount}
								refetch={props.refetch}
								majorityTypes={props.majorityTypes}
							/>
							<Votings
								ref={votings}
								council={council}
								agenda={agenda}
								recount={props.recount}
								majorities={props.data.majorities}
								translate={translate}
							/>
						</div>
					}
					{selectedTab === 2
						&& <Comments
							agenda={agenda}
							council={council}
							translate={translate}
						/>

					}
				</Scrollbar>
			</div>
		</div>
	);
};

export default withSharedProps()(ActPointTabs);
