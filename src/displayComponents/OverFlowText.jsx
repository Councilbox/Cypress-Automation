import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import FontAwesome from 'react-fontawesome';

function isTextOverflow (element) {
  return element.clientWidth < element.scrollWidth
}

export default class OverflowText extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      overflow: false,
      children: null
    }
  }

  componentDidMount () {
    this.checkOverflow()
  }

  static getDerivedStateFromProps(nextProps, prevState){
    const element = ReactDOM.findDOMNode(this);
    if(nextProps.children !== prevState.children) return nextProps.children;
  }

  /* componentWillReceiveProps () {
    this.setState({ overflow: false })
  }*/

  componentDidUpdate (prevProps, prevState) {
    if(this.state.children !== prevState.children){
      this.checkOverflow();
    }
  }

  checkOverflow () {
    const element = ReactDOM.findDOMNode(this)

    const overflow = isTextOverflow(element)
    if (overflow !== this.state.overflow) {
      this.setState({ overflow: overflow })
    }
  }

  render () {
    return (
      <React.Fragment>
        {this.state.overflow &&
          <FontAwesome name='info-circle' />
        }
        {this.props.children}
      </React.Fragment>
    );
  }
}

OverflowText.displayName = 'OverflowText'
OverflowText.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}