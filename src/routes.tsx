import React, {useEffect, useState} from "react";
import {BrowserRouter, Route, Switch, useHistory} from "react-router-dom";
import CreateLog from "./components/create-log/create-log.component";
import EditLogs from "./components/edit-log/edit-log.component";
import Navbar from "./components/navbar/navbar.component";
import ViewTickets from "./components/view-logs/view-logs.component";
import {auth, createUserProfileDocument} from "./firebase/firebase.utils";
import Login from "./components/login/login.component";
import LogDetailsPage from "./components/log-details/log-details.component";
import Compare from "./components/compare/compare.component"
import CurrentUserContext from "./typescript-interfaces/current-user.provider";
import {CurrentUser} from "./typescript-interfaces/current-user.interface";


const Routes = () => {
    const [currentUser, setCurrentUser] = useState<CurrentUser>({
        id: "",
        email: "",
        name: "",
        myTickets: [],
    });

    const history = useHistory();

    // state = { user: null };

    useEffect(() => {
        const unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
            if (userAuth) {
                const userRef = await createUserProfileDocument(userAuth, undefined);

                userRef?.onSnapshot((snapShot) => {
                    setCurrentUser({
                        id: snapShot.id,
                        email: snapShot.data()?.email,
                        name: snapShot.data()?.displayName,
                        myTickets: snapShot.data()?.myTickets,
                    });
                });
            }
        });
        return () => {
            unsubscribeFromAuth();
        };
    }, []);


    return (
        <div>
            <CurrentUserContext.Provider value={currentUser}>
                <BrowserRouter>
                    <Navbar/>
                    <Switch>
                        <Route exact path={"/"} component={Login}/>
                        <Route exact path={"/fitness-tracker"} component={Login}/>
                        <Route
                            exact
                            path={"/fitness-tracker/new-log"}
                            component={CreateLog}
                        />
                        <Route path={"/fitness-tracker/view-logs"} component={ViewTickets}/>
                        <Route exact path={"/fitness-tracker/view-log/:ticketId"} component={LogDetailsPage}
                        />
                        <Route exact path={"/fitness-tracker/edit-ticket/:ticketId"} component={EditLogs}
                        />
                        <Route exact path={"/fitness-tracker/compare"} component={Compare}
                        />
                    </Switch>
                </BrowserRouter>
            </CurrentUserContext.Provider>
        </div>
    );
};

export default Routes;
