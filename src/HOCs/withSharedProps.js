import React from 'react';
import { connect } from 'react-redux';

const withSharedProps = () => WrappedComponent => {
    const WithSharedProps = ({ company, translate, user, ...restProps }) => (<WrappedComponent
        company={company}
        user={user}
        translate={translate}
        {...restProps}
    />);

    return connect(mapStateToProps)(WithSharedProps);
};

const mapStateToProps = (state) => ({
    company: state.companies.list[ state.companies.selected ],
    translate: state.translate,
    user: state.user
});

export default withSharedProps;

/*
 EJEMPLO DE USO
 import React from 'react';
 import withSharedProps from '../../HOCs/withSharedProps';

 const Pruebas = ({ company, translate }) => {
 return(
 <div style={{width: '10em', border: '3px solid red'}}>{translate.accept}</div>
 )
 }

 export default withSharedProps()(Pruebas);

 */