import React, {useEffect, useState} from "react";
import {Redirect} from 'react-router';
import {BrowserRouter, Switch, Route, useHistory} from "react-router-dom";
import CreateTicket from "./components/create-ticket/create-ticket.component";
import EditTicket from "./components/edit-ticket/edit-ticket.component";
import Navbar from "./components/navbar/navbar.component";
import ViewTickets from "./components/view-tickets/view-tickets.component";
import {auth, createUserProfileDocument} from "./firebase/firebase.utils";
import Login from "./components/login/login.component";
import TicketDetailsPage from "./components/ticket-details/ticket-details.component";
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
                        <Route exact path={"/bug-tracker"} component={Login}/>
                        <Route
                            exact
                            path={"/bug-tracker/new-ticket"}
                            component={CreateTicket}
                        />
                        <Route path={"/bug-tracker/view-tickets"} component={ViewTickets}/>
                        <Route exact path={"/bug-tracker/ticket-details/:ticketId"} component={TicketDetailsPage}
                        />
                        <Route exact path={"/bug-tracker/edit-ticket/:ticketId"} component={EditTicket}
                        />
                    </Switch>
                </BrowserRouter>
            </CurrentUserContext.Provider>
        </div>
    );
};

export default Routes;
