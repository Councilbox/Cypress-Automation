import React from 'react';
import HomePage from "../components/HomePage";
import Header from '../components/Header';
import { connect } from 'react-redux';


const HomeContainer = ({main, company, user}) => {
    return(
        <div style={{height: '100vh', width: '100%', display: 'flex'}}>
            <HomePage
                main={main}
                company={company}
                user={user}    
            />
        </div>
    );
}

const mapStateToProps = (state) => ({
    main: state.main,
    company: state.company,
    user: state.user
});


export default connect(mapStateToProps)(HomeContainer);