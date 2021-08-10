import moment from "moment";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import Loader from "react-loader-spinner";

import { chunk } from "../helper";
import { useApi } from "../api";
import { movingsEndpoint } from "../endpoints";

import styles from "../styles/movings.module.scss";

const CreateMovingBox = () => {
	return (
		<div className="text-center">
			<h2>No movings</h2>
			<p>Start by creating your first moving.</p>
			<Link to="/movings/create">
				<Button>Create Moving</Button>
			</Link>
		</div>
		);
}

const MovingsList = movings => {
	let chunks = chunk(movings, 3);

	return (
		<Container>
			<Row>
				<Col className={ styles["movings-actions"] }>
					<Link to="/movings/create">
						<Button>Create Moving</Button>
					</Link>
				</Col>
			</Row>

			{
				chunks.map((chunk, index) => {
					let boxes = chunk.map(moving => {
						let movingOutDate = moment(moving.moving_out_date);
						let movingInDate = moment(moving.moving_in_date);
						let description = moving.description.replace(/(\r\n|\n|\r)/gm, " ");
						
						if (description.length > 90) {
							description = description.slice(0, 90) + "...";
						}

						return (
							<Col md={ 4 } key={ moving.id }>
								<div className={ styles["moving-box"] }>
									<div className={ styles["title"] }>
										<span className={ styles["date"] }>{ movingOutDate.format("DD.MM.YYYY") }</span> - <span className={ styles["date"] }>{ movingInDate.format("DD.MM.YYYY") }</span>
									</div>

									{ description }
								</div>
							</Col>
							)
					})


					return (<Row key={ index } className={ styles["movings-row"] }>
								{ boxes }
							</Row>)
				})
			}
		</Container>
		)
}

const Movings = () => {
	// Show create moving comoponent

	const opts = { method: 'GET' };

	const { loading, error, refresh, data: movings, status } = useApi(
	    movingsEndpoint,
	    opts
	    );

	if (loading) {
		return (
			<div className={ styles["container"] }>
				<Container>
					<div className={ styles["box"] + " " + styles["creating"] }>
						<h2>Loading movings</h2>
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

	if (movings.length > 0) {
		return MovingsList(movings);
	}

	return CreateMovingBox();
}

export default Movings;