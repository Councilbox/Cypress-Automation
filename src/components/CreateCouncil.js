import React, { PureComponent } from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as councilActions from '../actions/councilActions';
import { bindActionCreators } from 'redux';

 class CreateCouncil extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            creating: false
        }
    }

    componentDidMount(){
        if(this.props.match.url === "/councils/new" && !this.state.creating){
            this.setState({
                creating: true
            });
            this.props.actions.create(this.props.company.id);
        }
    }
    render(){
        return <p>Spinner spinning...</p>;
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


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateCouncil));