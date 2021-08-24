import React from 'react';
import MenuSuperiorTabs from '../../../../dashboard/MenuSuperiorTabs';
import CompanyFeaturesEditor from './CompanyFeaturesEditor';
import CouncilStatuteEditor from './CouncilStatuteEditor';


const CouncilOptionsEditor = ({ translate, council, refetch }) => {
	const [tab, setTab] = React.useState('Opciones');

	return (
		<>
			<div style={{ fontSize: '13px', display: 'inline-block' }}>
				<MenuSuperiorTabs
					items={[
						'Opciones',
						'Features entidad',
					]}
					selected={tab}
					setSelect={setTab}
				/>
			</div>
			{tab === 'Opciones' &&
				<CouncilStatuteEditor
					translate={translate}
					statute={council.statute}
					council={council}
					refetch={refetch}
				/>
			}
			{tab === 'Features entidad' &&
				<CompanyFeaturesEditor
					companyId={council.companyId}
					translate={translate}
				/>
			}
		</>
	);
};

export default CouncilOptionsEditor;
