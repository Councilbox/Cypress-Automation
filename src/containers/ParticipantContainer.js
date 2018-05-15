import React from 'react';
import { connect } from 'react-redux';
import { LoadingMainApp } from '../displayComponents';


class ParticipantContainer extends React.PureComponent {

    render(){
        return(
            <div style={{display: 'flex', flex: 1, flexDirection: 'column', height: '100vh', overflow: 'auto', padding: 0, margin: 0}}>
                Token: {this.props.token}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    main: state.main,
    translate: state.translate
});

export default connect(mapStateToProps)(ParticipantContainer);