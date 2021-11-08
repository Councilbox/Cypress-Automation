import React from 'react';
import { TextInput, Icon } from '../../displayComponents';
import { isMobile } from '../../utils/screen';


class CouncilsFilters extends React.Component {
	state = {
		filterText: '',
		inputSearchE: ''
	}

	updateFilterText = text => {
		this.props.updateFilterText(text);
	}


	render() {
		return (
			<div style={{ width: isMobile ? '85%' : '100%', float: 'right', paddingRight: !isMobile && '1.2em' }}>
				<TextInput
					className={isMobile && !this.state.inputSearchE ? 'openInput' : ''}
					styleInInput={{
						fontSize: '12px', color: 'rgba(0, 0, 0, 0.54)', background: '#f0f3f6', padding: isMobile && this.state.inputSearch && '4px 5px', paddingLeft: !isMobile && '5px'
					}}
					stylesAdornment={{ background: '#f0f3f6', marginLeft: '0', paddingLeft: isMobile && this.state.inputSearch ? '8px' : '4px' }}
					floatingText={' '}
					styles={{ marginTop: '-16px', marginBottom: '-8px' }}
					adornment={<Icon onClick={() => this.setState({ inputSearchE: !this.state.inputSearchE })} style={{
						background: '#f0f3f6', paddingLeft: isMobile ? '' : '5px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'
					}}>search</Icon>}
					placeholder={isMobile ? '' : this.props.translate.search}
					type="text"
					value={this.props.filterText}
					disableUnderline={true}
					onChange={event => {
						this.updateFilterText(event.target.value);
					}}
				/>
			</div>
		);
	}
}

export default CouncilsFilters;
