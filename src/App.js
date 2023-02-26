import React, {useEffect, useState} from "react";
import { Auth } from "aws-amplify";
import "./App.css";
import Routes from "./Routes";
import {Nav, Navbar} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { AppContext } from "./lib/contextLib";
import {useNavigate} from "react-router-dom";


function App() {
    const nav = useNavigate();
    const [isAuthenticated, userHasAuthenticated] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    useEffect(() => {
        async function onLoad() {
            try {
                await Auth.currentSession();
                userHasAuthenticated(true);
            } catch (e) {
                if (e !== "No current user") {
                    alert(e);
                }
            }

            setIsAuthenticating(false);
        }
        onLoad()
    }, []);

    async function handleLogout() {
        await Auth.signOut();

        userHasAuthenticated(false);

        nav("/login");
    }

    return (
        !isAuthenticating && (
            <div className="App container py-3">
                <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
                    <LinkContainer to="/">
                        <Navbar.Brand className="font-weight-bold text-muted">
                            Scratch
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Nav activeKey={window.location.pathname}>
                            {isAuthenticated ? (
                                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                            ) : (
                                <>
                                    <LinkContainer to="/signup">
                                        <Nav.Link>Signup</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/login">
                                        <Nav.Link>Login</Nav.Link>
                                    </LinkContainer>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
                    <Routes />
                </AppContext.Provider>
            </div>
        )
    );
}

export default App;