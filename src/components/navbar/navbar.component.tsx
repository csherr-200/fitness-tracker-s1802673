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
                <Link to={"/fitness-tracker"} className={"navbar-brand"}>
                    FITNESS TRACKER
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
                                history.location.pathname === "fitness-tracker/new-log" ? "active" : ""
                            }`}
                        >
                            <Link to={"/fitness-tracker/new-log"} className={"nav-link"}>
                                Create New Fitness Log <span className="sr-only">(current)</span>
                            </Link>
                        </li>
                        <li
                            className={`nav-item ${
                                history.location.pathname === "fitness-tracker/new-log" ? "active" : ""
                            }`}
                        >
                            <Link to={"/fitness-tracker/view-logs?type=all"} className={"nav-link"}>
                                View All Previous Logs <span className="sr-only">(current)</span>
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
                                    to={"/fitness-tracker/register-and-login"}
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
                                        history.push("/fitness-tracker");
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
