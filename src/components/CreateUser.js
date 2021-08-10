import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { userEndpoint } from "../endpoints";
import { post } from "../api";

import styles from "../styles/createUser.module.scss";

const CreateUser = () => {
	const { getAccessTokenSilently } = useAuth0();
	
	const [state, setState] = useState({
   		username: null,
	    creatingUser: false
  	});
	
	const createUser = async username => {
		setState({
			...state,
			creatingUser: true
		});

		const accessToken = await getAccessTokenSilently({
          audience: "https://staging.flytternu.io"
        });

		try {
			let response = await post(userEndpoint, {'username': username }, accessToken);
			if (response.status === 200) {
				window.location.reload();
			} else {
				setState({
					...state,
					creatingUser: false
				});
			}
		} catch {
			setState({
				...state,
				creatingUser: false
			});
		}
	}

	let buttonDisabled = state.username == null;

	const form = () => {
		return (
			<Form onSubmit={e => {
	    			e.preventDefault();

	    			let { username } = state;

	    			createUser(username);
	    		}}>
				  <Form.Group className="mb-3" controlId="formCompanyName">
				    <Form.Label>Username</Form.Label>
				    <Form.Control autocomplete="off" type="text" placeholder="Username" defaultValue={ state.username } onChange={e => {
				    	setState({
				    		...state,
				    		username: e.target.value
				    	})
				    }} />
				  </Form.Group>
				  
				  	<div className="d-grid gap-2">
				  		<Button type="submit" variant="success" size="lg" disabled={ buttonDisabled }>
				    		Complete Profile
			  			</Button>
					</div>
				</Form>
			)
	}

	return (
		<div className={ styles['container'] }>
			<div className={ styles['create-box'] }>
	    		<h1>Complete Profile</h1>
	    		<p>In order to complete your registration we need some information of you.</p>
	    		{
	    			!state.creatingCompany &&
	    			form()
	    		}

	    		{
	    			state.creatingCompany &&
	    			<p>Creating company...</p>
	    		}
	    	</div>
		</div>);
}

export default CreateUser;