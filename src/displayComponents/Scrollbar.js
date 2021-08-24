import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars-cbx';
import { actualBarWidth } from 'react-custom-scrollbars-cbx/lib/utils/getScrollbarWidth';

class Scrollbar extends React.Component {
	scrollbar = null;

	scrollToBottom() {
		this.scrollbar.scrollToBottom();
	}

	scrollToTop() {
		return this.scrollbar.scrollToTop();
	}

	getScrollHeight() {
		return this.scrollbar.getScrollHeight();
	}

	getValues() {
		return this.scrollbar.getValues();
	}

	render() {
		const {
			style, autoHide, children, showX, onScrollStop, classFix = '', horizontalScroll = false
		} = this.props;

		let extraClass = '';

		if (classFix === 'scrollflex' && !actualBarWidth()) {
			extraClass = 'macOSFlexFix';
		}


		return (
			<Scrollbars
				ref={ref => {
					this.scrollbar = ref;
				}}
				autoHide={autoHide}
				className={`Scrollbar ${classFix} ${extraClass} ${horizontalScroll ? 'scrollbarBoth' : 'scrollbarOnlyY'} scrollbarFixHeight`}
				onScrollStop={onScrollStop}
				style={{
					width: '100%',
					height: '100%',
					...style
				}}
				{...(!showX ? {
					renderTrackHorizontal: () => <span style={{ display: 'hidden' }} />,
					renderThumbHorizontal: () => <span style={{ display: 'hidden' }} />
				} : {})}
			>
				{children}
			</Scrollbars>
		);
	}
}

export default Scrollbar;
