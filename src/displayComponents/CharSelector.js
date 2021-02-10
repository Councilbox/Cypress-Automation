import React from 'react';
import { MenuItem } from 'material-ui';
import withWindowSize from '../HOCs/withWindowSize';
import SelectInput from './SelectInput';
import { isMobile } from '../utils/screen';

const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

const CharSelector = ({ onClick, ...props }) => {
	if (isMobile && props.orientation === 'landscape') {
		return (
			<div style={{ marginRight: '0.3em' }}>
				<SelectInput
					value={props.selectedChar || ''}
					onChange={event => onClick(event.target.value)}
					style={{
						padding: 0
					}}
				>
					<MenuItem value={null}>
						{props.translate.all_plural}
					</MenuItem>
					{chars.map(char => (
						<MenuItem key={`character_${char}`} value={char} style={{ textTransform: 'uppercase' }}>
							<span style={{ textTransform: 'uppercase' }}>{char}</span>
						</MenuItem>
					))}
				</SelectInput>
			</div>
		);
	}

	return (
		<div style={{
			height: '100%', width: '1.5em', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between'
		}}>
			{chars.map(char => (
				<div
					key={`char_selector_${char}`}
					style={{
						textTransform: 'uppercase',
						height: '14px',
						width: '100%',
						display: 'flex',
						cursor: 'pointer',
						alignItems: 'center',
						justifyContent: 'center',
						...(props.selectedChar === char ? { backgroundColor: 'gainsboro' } : {})
					}}
					className="hoverShadow"
					onClick={() => onClick(char)}
				>
					<span style={{ fontSize: '11px' }}>{char}</span>
				</div>
			))}

		</div>
	);
};

export default withWindowSize(CharSelector);
