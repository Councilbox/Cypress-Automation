/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class NotFound extends Component {
	render() {
		return <Redirect to={'/'} />;
	}
}

export default NotFound;
