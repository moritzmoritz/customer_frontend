import moment from "moment";
import { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Button, Container, Row, Col } from "react-bootstrap";
import Loader from "react-loader-spinner";
import { useAuth0 } from "@auth0/auth0-react";

import { useApi, deleteRequest, patch } from "../api";
import { movingsEndpoint } from "../endpoints";

import styles from "../styles/moving.module.scss";

const Moving = () => {
	const { id } = useParams()
	const { getAccessTokenSilently } = useAuth0();
	const history = useHistory();

	const [state, setState] = useState({
	    isLoading: false
  	});

	const opts = { method: 'GET' };

	const { loading, error, refresh, data: moving, status } = useApi(
		movingsEndpoint + "/" + id,
	    opts
    );

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

	if (status !== 200) {
		// TODO: FIX ME!
		return "";
	}

	const deleteMoving = async id => {
		setState({
			...state,
			isLoading: true
		});

		const accessToken = await getAccessTokenSilently({
          audience: "https://staging.flytternu.io"
        });

		try {
			let endpoint = movingsEndpoint + "/" + id;
			let response = await deleteRequest(endpoint, accessToken);
			if (response.status === 200) {
				history.push("/");
			} else {
				setState({
					...state,
					isLoading: false
				});
			}
		} catch {
			setState({
				...state,
				isLoading: false
			});
		}
	}

	const updateState = async (id, online) => {
		setState({
			...state,
			isLoading: true
		});

		const accessToken = await getAccessTokenSilently({
          audience: "https://staging.flytternu.io"
        });

		try {
			let endpoint = movingsEndpoint + "/" + id;
			let response = await patch(endpoint, { "online": online }, accessToken);
			if (response.status === 200) {
				window.location.reload();
			} else {
				setState({
					...state,
					isLoading: false
				});
			}
		} catch (error) {
			setState({
				...state,
				isLoading: false
			});
		}
	}

	let movingOutDate = moment(moving.moving_out_date);
	let movingInDate = moment(moving.moving_in_date);

	let stateButton;

	if (moving.online) {
		stateButton = <Button disabled={ state.isLoading } onClick={ () => {
			updateState(moving.id, false);
		}}>Set Offline</Button>
	} else {
		stateButton = <Button disabled={ state.isLoading } onClick={ () => {
			updateState(moving.id, true);
		}}>Set Online</Button>
	}

	return (
		<Container>
			<Row>
				<Col>
					<div className={ styles["actions"] }>
						{ stateButton }
						<Button variant="danger" disabled={ state.isLoading } onClick={() => {
							deleteMoving(id);
						}}>Delete</Button>
					</div>
				</Col>
			</Row>
			<Row>
				<Col>
					<div className={ styles["title"] }>
						<span className={ styles["date"] }>{ movingOutDate.format("DD.MM.YYYY") }</span> - <span className={ styles["date"] }>{ movingInDate.format("DD.MM.YYYY") }</span>
					</div>
				</Col>
			</Row>
			<Row>
				<Col>
					<div className={ styles["description"] }>
						{ moving.description }
					</div>
				</Col>
			</Row>
		</Container>
	)
}

export default Moving;