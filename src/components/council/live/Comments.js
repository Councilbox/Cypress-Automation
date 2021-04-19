import React from 'react';
import CommentsTable from './comments/CommentsTable';

const CommentsSection = ({ translate, council, agenda }) => (
	council.statute.existsComments === 1 ?
		<CommentsTable
			translate={translate}
			agenda={agenda}
			council={council}
			key={agenda.id}
		/>
		: <div style={{ padding: '1em' }}>Los comentarios están desactivados en esta reunión</div>
);

export default CommentsSection;
