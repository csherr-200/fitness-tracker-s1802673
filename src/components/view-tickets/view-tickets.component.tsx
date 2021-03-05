import { firestore } from "firebase";
import React, { useContext, useEffect, useState } from "react";
import {Link, useHistory, useLocation} from "react-router-dom";
import { firestore as db } from "../../firebase/firebase.utils";
import CurrentUserContext from "../../typescript-interfaces/current-user.provider";
import { CurrentUser } from "../../typescript-interfaces/current-user.interface";
import { Ticket } from "../../typescript-interfaces/ticket.interface";
import firestoreAuth from "firebase";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const ViewTickets = () => {
  let query = useQuery();
  let type = query.get("type");

  const [ticketsList, setTicketsList] = useState<Array<Ticket>>([]);

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

    let ticketsArray: Array<Ticket> = [];

    db.collection("tickets")
        .orderBy("createdAt", "desc")
        .get()
        .then((querySnapshot: firestore.QuerySnapshot) => {
          querySnapshot.forEach((doc) => {
            const {
              title,
              description,
              priority,
              environment,
              status,
              owner,
              assignee,
              createdAt,
              logs,
              comments,
            } = doc.data();

            ticketsArray.push({
              id: doc.id,
              title,
              description,
              priority,
              environment,
              status,
              owner,
              assignee,
              createdAt,
              logs,
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
        <h2 className={"text-center"}>Bug Tickets</h2>
        {ticketsList.length > 0 ? (
            <table className="table table-bordered table-striped table-light">
              <thead className="thead-light">
              <tr>
                <th scope="col">Ticket No.</th>
                <th scope="col">Bug Title</th>
                <th scope="col">Priority</th>
                <th scope="col">Status</th>
              </tr>
              </thead>
              <tbody>
              {ticketsList.map((ticket, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>
                      <Link
                          className={"text-dark"}
                          to={`/bug-tracker/ticket-details/${ticket.id}`}
                      >
                        {ticket.title}
                      </Link>
                    </td>
                    <td>{ticket.priority}</td>
                    <td>{ticket.status}</td>
                  </tr>
              ))}
              </tbody>
            </table>
        ) : (
            <h2 className={"text-center pt-5"}>No tickets found</h2>
        )}
      </div>
  );
};

export default ViewTickets;
