import React from "react";
import { connect } from "react-redux";

const mapStateToProps = state => ({
	companies: state.companies,
	translate: state.translate,
	user: state.user
});

const withSharedProps = () => WrappedComponent => {
	const WithSharedProps = ({ companies, translate, user, ...restProps }) => (
			<WrappedComponent
				company={companies.list.length > 0 ? companies.list[companies.selected] : null}
				companies={companies}
				user={user}
				translate={translate}
				{...restProps}
			/>
		)


	return connect(mapStateToProps)(WithSharedProps);
};

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
