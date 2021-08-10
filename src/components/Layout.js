import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { Container } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";

import { useApi } from '../api';
import { meEndpoint } from '../endpoints';

import CreateUser from "./CreateUser";
import Menu from "./Menu";
import Home from "./Home";
import Movings from "./Movings";
import Messages from "./Messages";
import CreateMoving from "./CreateMoving";

import "../styles/main.scss";
import styles from "../styles/home.module.scss";

const ROUTES = [
	{
		path: "/",
		component: Home	
	},
	{
		path: "/about",
		component: Home
	},
	{
		path: "*",
		component: Home	
	}
]

const AUTHENTICATED_ROUTES = [
	{
		path: "/messages",
		component: Messages	
	},
	{
		path: "/movings/create",
		component: CreateMoving	
	},
	{
		path: "/",
		component: Movings	
	},
	{
		path: "*",
		component: Movings	
	}
]

const Layout = () => {
	const { user, isAuthenticated } = useAuth0();

	// Try to get user
	const opts = { method: 'GET' };

	const { loading, error, refresh, data: profile, status } = useApi(
	    meEndpoint,
	    opts
	  );

	if (loading) {
		return <div />;
	}

	if (status === 404) {
		return (<CreateUser />);
	}

	if (error && isAuthenticated) {
		// TODO: What should we show here?
		return (<div>Error!</div>);
	}

	var routes = ROUTES;

	if (isAuthenticated) {
		routes = AUTHENTICATED_ROUTES;
	}

	return (
		<Router>
			<Menu />
			<Container className={ styles["container"] } fluid>
				<Switch>
						{
							routes.map(route => (
								<Route path={ route.path }>
									<route.component />
								</Route>
							))
						}
				</Switch>
			</Container>
		</Router>
		)
}

export default Layout;