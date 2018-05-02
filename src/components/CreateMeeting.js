import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as councilActions from '../actions/councilActions';
import { bindActionCreators } from 'redux';
import { LoadingMainApp } from '../displayComponents';

class CreateMeeting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            creating: false
        }
    }

    componentDidMount() {
        if (this.props.match.url === `/company/${this.props.match.params.company}/meeting/new` && !this.state.creating) {
            console.log('create');
            this.setState({
                creating: true
            });
            this.props.actions.create(this.props.match.params.company, 'meeting');
        }
    }

    render() {
        return <LoadingMainApp/>
    }
}

const mapStateToProps = (state) => ({
    main: state.main,
    company: state.company,
    user: state.user,
    council: state.council
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(councilActions, dispatch)
});


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateMeeting));