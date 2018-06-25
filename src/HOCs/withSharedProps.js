import React from "react";
import { connect } from "react-redux";
import { LoadingMainApp } from '../displayComponents';

const withSharedProps = () => WrappedComponent => {
	const WithSharedProps = ({ companies, translate, user, ...restProps }) => {
		return(
			<WrappedComponent
				company={companies.list[companies.selected]}
				user={user}
				translate={translate}
				{...restProps}
			/>		
		);
	}


	return connect(mapStateToProps)(WithSharedProps);
};

const mapStateToProps = state => ({
	companies: state.companies,
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
