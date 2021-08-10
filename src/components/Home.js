import { Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";

import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

const Home = () => {
	const { user } = useAuth0();

	if (user) {
		return (
		<div>
			<LogoutButton />
		</div>
		)
	}
	return (
		<div>
			<LoginButton />
		</div>
		)
}

export default Home;