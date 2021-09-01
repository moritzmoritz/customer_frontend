import moment from "moment";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router-dom";
import { Form, Button, Container, Col, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import Loader from "react-loader-spinner";

import { movingsEndpoint, postcodesEnpoint } from "../endpoints"; 
import { useApi, post } from "../api";

import "react-datepicker/dist/react-datepicker.css";
import styles from "../styles/createMoving.module.scss";

const CreateMoving = () => {
	const { getAccessTokenSilently } = useAuth0();
	const history = useHistory();

	const opts = { method: 'GET' };

	const { loading, error, refresh, data: postcodes, status } = useApi(
		postcodesEnpoint,
	    opts
    );

	const today = new Date()
	const tomorrow = new Date(today)
	tomorrow.setDate(tomorrow.getDate() + 1)

	const twoDays = new Date(today)
	twoDays.setDate(tomorrow.getDate() + 2)

	const [state, setState] = useState({
   		description: null,
   		movingOutDate: tomorrow,
   		movingInDate: twoDays,
   		postcodeFromId: -1,
   		postcodeToId: -1,
	    creatingMoving: false
  	});

	if (loading) {
		return (
			<div className={ styles["container"] }>
				<Container>
					<div className={ styles["box"] + " " + styles["creating"] }>
						<h2>Loading</h2>
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

	const createMoving =  async (description, movingOutDate, movingInDate, postcodeFromId, postcodeToId) => {
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

			let data = {
				'description': description,
				'moving_in_date': movingInDateString,
				'moving_out_date': movingOutDateString, 
				'moving_from_postcode_id': postcodeFromId,
				'moving_to_postcode_id': postcodeToId 
			}

			let response = await post(movingsEndpoint, data, accessToken);
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
	
	let postcodeOptions = postcodes.map(postcode => {
		return <option key={ postcode.id } value={ postcode.id }>{ postcode.name }</option>
	});
	postcodeOptions = [<option key={ -1 } value={ -1 }>Please select</option>].concat(postcodeOptions);

	let buttonDisabled = state.description == null || state.postcodeFromId === -1 || state.postcodeToId === -1;

	return (
		<div className={ styles["container"] }>
			<Container>
				<h2>Create moving</h2>

				<Form onSubmit={e => {
					e.preventDefault();

					let { description, movingOutDate, movingInDate, postcodeFromId, postcodeToId } = state;
					
					createMoving(description, movingOutDate, movingInDate, postcodeFromId, postcodeToId);
				}}>
					<div className={ styles["box"] }>
						<span className={ styles["title"] }>Location</span>
						<Row>
							<Col md={ 6 } >
								<Form.Group className="mb-3" controlId="formPostcodeFrom">
									<Form.Label>Moving from</Form.Label>
									<Form.Select onChange={e => {
								    	setState({
								    		...state,
								    		postcodeFromId: parseInt(e.target.value)
								    	})
								    }}>
										{ postcodeOptions }
									</Form.Select>
								</Form.Group>
							</Col>
							<Col md={ 6 } >
								<Form.Group className="mb-3" controlId="formPostcodeFrom">
									<Form.Label>Moving to</Form.Label>
									<Form.Select onChange={e => {
								    	setState({
								    		...state,
								    		postcodeToId: parseInt(e.target.value)
								    	})
								    }}>
										{ postcodeOptions }
									</Form.Select>
								</Form.Group>
							</Col>
						</Row>
					</div>

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