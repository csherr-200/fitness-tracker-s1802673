import React, {useContext} from "react";
import {Link, withRouter, useHistory} from "react-router-dom";
import {auth} from "../../firebase/firebase.utils";
import CurrentUserContext from "../../typescript-interfaces/current-user.provider";
import {CurrentUser} from "../../typescript-interfaces/current-user.interface";

const Navbar = () => {
    const history = useHistory();
    const currentUser: CurrentUser = useContext(CurrentUserContext);

    const refreshComponent = () => {
        window.location.reload();
    };

    return (
        <div className={"bootstrap-navbar"}>
            <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-primary">
                <Link to={"/bug-tracker"} className={"navbar-brand"}>
                    SSTS BUG TRACKER
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                >
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li
                            className={`nav-item ${
                                history.location.pathname === "bug-tracker/new-ticket" ? "active" : ""
                            }`}
                        >
                            <Link to={"/bug-tracker/new-ticket"} className={"nav-link"}>
                                Create Ticket <span className="sr-only">(current)</span>
                            </Link>
                        </li>
                        <li
                            className={`nav-item ${
                                history.location.pathname === "bug-tracker/new-ticket" ? "active" : ""
                            }`}
                        >
                            <Link to={"/bug-tracker/view-tickets?type=all"} className={"nav-link"}>
                                View Tickets <span className="sr-only">(current)</span>
                            </Link>
                        </li>
                        <li
                            className={`nav-item ${
                                history.location.pathname === "/"
                                    ? "active"
                                    : ""
                            }`}
                        >
                            {!currentUser.email && (
                                <Link
                                    to={"/bug-tracker/register-and-login"}
                                    className={"nav-link"}
                                >
                                    Login and Register
                                </Link>
                            )}
                        </li>
                        <li>
                            {currentUser.email && (
                                <div
                                    className={"nav-link"}
                                    style={{cursor: "pointer"}}
                                    onClick={() => {
                                        auth.signOut();
                                        history.push("/bug-tracker");
                                        refreshComponent();
                                    }}
                                >
                                    Logout
                                </div>
                            )}
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
};

export default withRouter(Navbar);
