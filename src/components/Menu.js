import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import styles from "../styles/menu.module.scss";

const AUTHENTICATED_ITEMS = [
	{
		title: "Movings",
		path: "/"
	},
	{
		title: "Messages",
		path: "/messages"
	}
]
const Menu = () => {
	const { isAuthenticated } = useAuth0();

	if (isAuthenticated) {
		return (
		<Container fluid className={ styles["container"] }>
			<Navbar expand="lg" className={ styles["menu"] }>
			  <Container className={ styles["menu"] }>
			  	<Link to="/" className={ styles["menu-link"] }>
			    	<Navbar.Brand>Flytternu</Navbar.Brand>
			    </Link>
			    <Navbar.Toggle aria-controls="basic-navbar-nav" />
			    <Navbar.Collapse id="basic-navbar-nav">
			      <Nav className="me-auto">
			      	{
			      		AUTHENTICATED_ITEMS.map(item => {
			      			return (
			      				<Link to={ item.path } className={ styles["menu-link"] }>
						        	<Nav.Link href={ item.path }>{ item.title }</Nav.Link>
						        </Link>
			      				)
			      		})
			      	}
			      </Nav>
			    </Navbar.Collapse>
			  </Container>
			</Navbar>
		</Container>
		)
	}

	return (
		<div>
		<Navbar bg="light" expand="lg">
		  <Container>
		  	<Link to="/">
		    	<Navbar.Brand>Flytternu</Navbar.Brand>
		    </Link>
		    <Navbar.Toggle aria-controls="basic-navbar-nav" />
		    <Navbar.Collapse id="basic-navbar-nav">
		      <Nav className="me-auto">
		      	<Link to="/">
		        	<Nav.Link href="/">Home</Nav.Link>
		        </Link>
		        <Link to="/about">
		        	<Nav.Link href="/">About</Nav.Link>
		        </Link>
		      </Nav>
		    </Navbar.Collapse>
		  </Container>
		</Navbar>
		</div>
		)
}

export default Menu;