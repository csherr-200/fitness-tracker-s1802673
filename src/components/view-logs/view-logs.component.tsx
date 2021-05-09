import {firestore} from "firebase";
import React, {useContext, useEffect, useState} from "react";
import {Link, useHistory, useLocation} from "react-router-dom";
import {firestore as db} from "../../firebase/firebase.utils";
import CurrentUserContext from "../../typescript-interfaces/current-user.provider";
import {CurrentUser} from "../../typescript-interfaces/current-user.interface";
import {Log} from "../../typescript-interfaces/log.interface";
import firestoreAuth from "firebase";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const ViewTickets = () => {
    let query = useQuery();
    let type = query.get("type");

    const [ticketsList, setTicketsList] = useState<Array<Log>>([]);

    const currentUser: CurrentUser = useContext(CurrentUserContext);

    const history = useHistory();
    var user = firestoreAuth.auth().currentUser

    function loginCheck() {
        if (user == null) {
            alert("Please Login")
            history.push("/")
        }
    }

    loginCheck()

    useEffect(() => {
        setTicketsList([]);

        let ticketsArray: Array<Log> = [];

        db.collection("tickets")
            .orderBy("createdAt", "desc")
            .get()
            .then((querySnapshot: firestore.QuerySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const {
                        title,
                        activityGoals,
                        predictedDistance,
                        actualDistance,
                        owner,
                        logs,
                        createdAt,
                        startDate,
                        endDate,
                        comments,
                    } = doc.data();

                    ticketsArray.push({
                        id: doc.id,
                        title,
                        activityGoals,
                        predictedDistance,
                        actualDistance,
                        startDate: startDate.toDate().toString(),
                        endDate: endDate.toDate().toString(),
                        owner,
                        logs,
                        createdAt: createdAt.toDate().toString(),
                        comments,
                    });
                });
            })
            .then(() => {
                switch (type) {
                    case "all":
                        setTicketsList(
                            ticketsArray.filter((ticket) => {
                                return ticket;
                            })
                        );
                        break;

                    default:
                        break;
                }
            })
            .catch((error) => {
                console.error("Couldn't fetch tickets: ", error);
            });
    }, [type, currentUser]);

    return (
        <div
            className="pt-5 pb-2 mt-5"
        >
            <h2 className={"text-center"}>Fitness Logs</h2>
            {ticketsList.length > 0 ? (
                <table className="table table-bordered table-striped table-light">
                    <thead className="thead-light">
                    <tr>
                        <th scope="col">Log No.</th>
                        <th scope="col">Log Title</th>
                        <th scope="col">Starting Week Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {ticketsList.map((ticket, index) => (
                        <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>
                                <Link
                                    className={"text-dark"}
                                    to={`/fitness-tracker/view-log/${ticket.id}`}
                                >
                                    {ticket.title}
                                </Link>
                            </td>
                            <td>
                                <Link
                                    className={"text-dark"}
                                    to={`/fitness-tracker/view-log/${ticket.id}`}
                                >
                                    {ticket.startDate}
                                </Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <h2 className={"text-center pt-5"}>No Logs Found</h2>
            )}
        </div>
    );
};

export default ViewTickets;
