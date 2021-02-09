import React from 'react';
import Avatar from 'antd/lib/avatar';


const CellAvatar = ({ avatar }) => (
		<div style={{
			overflow: 'hidden',
			width: 'calc( 100% / 3 )',
			textAlign: 'left',
			whiteSpace: 'nowrap',
			textOverflow: 'ellipsis',
			paddingRight: '10px'
		}}>
			{avatar ?
				<Avatar src={avatar} alt="Foto" />
				: <i style={{ color: 'lightgrey', fontSize: '1.7em', marginLeft: '6px' }} className={'fa fa-building-o'} />
			}
		</div>
	);

export default CellAvatar;
