import moment from "moment";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router-dom";
import { Form, Button, Container, Col, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import Loader from "react-loader-spinner";

import { movingsEndpoint } from "../endpoints"; 
import { post } from "../api";

import "react-datepicker/dist/react-datepicker.css";
import styles from "../styles/createMoving.module.scss";

const CreateMoving = () => {
	const { getAccessTokenSilently } = useAuth0();
	const history = useHistory();

	const today = new Date()
	const tomorrow = new Date(today)
	tomorrow.setDate(tomorrow.getDate() + 1)

	const twoDays = new Date(today)
	twoDays.setDate(tomorrow.getDate() + 2)

	const [state, setState] = useState({
   		description: null,
   		movingOutDate: tomorrow,
   		movingInDate: twoDays,
	    creatingMoving: false
  	});

	if (state.creatingMoving) {
		return (
			<div className={ styles["container"] }>
				<Container>
					<div className={ styles["box"] + " " + styles["creating"] }>
						<h2>Creating moving</h2>
						<Loader
					        type="ThreeDots"
					        color="#00BFFF"
					        height={64}
					        width={64}
					      />
					</div>
				</Container>
			</div>
			)
	}

	const createMoving =  async (description, movingOutDate, movingInDate) => {
		setState({
			...state,
			creatingMoving: true
		});

		const accessToken = await getAccessTokenSilently({
          audience: "https://staging.flytternu.io"
        });

		try {
			let movingOutDateString = moment(movingOutDate).format('YYYY-MM-DD');
			let movingInDateString = moment(movingOutDate).format('YYYY-MM-DD');

			let response = await post(movingsEndpoint, {'description': description, 'moving_in_date': movingInDateString, 'moving_out_date': movingOutDateString }, accessToken);
			if (response.status === 200) {
				history.push("/");
			} else {
				setState({
					...state,
					creatingMoving: false
				});
			}
		} catch {
			setState({
				...state,
				creatingMoving: false
			});
		}
	}
	let buttonDisabled = state.description == null;

	return (
		<div className={ styles["container"] }>
			<Container>
				<h2>Create moving</h2>

				<Form onSubmit={e => {
					e.preventDefault();

					let { description, movingOutDate, movingInDate } = state;
					
					createMoving(description, movingOutDate, movingInDate);
					// createUser(username);
				}}>
					<div className={ styles["box"] }>
						<Form.Group className="mb-3" controlId="formDescription">
					    <Form.Label>Description</Form.Label>
					    <Form.Control autocomplete="off" as="textarea" rows={3} placeholder="Description" defaultValue={ state.description } onChange={e => {
					    	setState({
					    		...state,
					    		description: e.target.value
					    	})
					    }} />
					  </Form.Group>
					</div>

					<div className={ styles["box"] }>
						<Row>
							<Col md={ 6 }>
								<p>Movig Out Date</p>
								<DatePicker selected={ tomorrow } onChange={ date => {

					    		}} />
							</Col>

							<Col md={ 6 }>
								<p>Movig In Date</p>
								<DatePicker selected={ twoDays } onChange={ date => {

					    		}} />
							</Col>
						</Row>
					</div>
				  	
				  	<div className={ styles["actions"] }>
				  		<Button type="submit" variant="success" size="lg" disabled={ buttonDisabled }>
				    		Create moving
			  			</Button>
					</div>
				</Form>
			</Container>
		</div>
		)
}

export default CreateMoving;