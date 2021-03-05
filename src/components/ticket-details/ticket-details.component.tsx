import { firestore } from "firebase";
import { firestore as db } from "../../firebase/firebase.utils";
import React, { useContext, useEffect, useState } from "react";
import {Link, useHistory, useParams} from "react-router-dom";
import { Ticket } from "../../typescript-interfaces/ticket.interface";
import CurrentUserContext from "../../typescript-interfaces/current-user.provider";
import { CurrentUser } from "../../typescript-interfaces/current-user.interface";
import firestoreAuth from "firebase";



interface Comment {
  personName: string;
  timestamp: Date;
  comment: string;
}

const TicketDetailsPage = () => {
  let { ticketId } = useParams<{ ticketId: string }>();
  const currentUser: CurrentUser = useContext(CurrentUserContext);

  const [refresh, setRefresh] = useState(true);
  const [assignee, setAssignee] = useState("")
  const [status, setStatus] = useState("");
  const [comment, setcomment] = useState("");
  const [ticket, setTicket] = useState<Ticket>({
    id: "",
    title: "",
    description: "",
    environment: "",
    priority: "",
    status: "",
    owner: {
      displayName: "",
      email: "",
      id: "",
    },
    assignee: "",
    createdAt: "",
    logs: [],
    comments: [],
  });

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
    db.collection("tickets")
        .doc(ticketId)
        .get()
        .then(function (doc: firestore.DocumentData) {
          if (doc.exists) {
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
            setTicket({
              id: doc.id,
              title,
              description,
              priority,
              environment,
              status,
              owner,
              assignee,
              createdAt: createdAt.toDate().toString(),
              logs,
              comments,
            });
            setAssignee(assignee);
            setStatus(status);
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .then(() => {
          db.collection("users")
              .get()
              .then((querySnapshot: firestore.QuerySnapshot) => {
              })
        })
        .catch(function (error: firestore.FirestoreError) {
          console.error("Error getting document:", error);
        });
  }, [ticketId, refresh]);

  const refreshComponent = () => {
    setRefresh((prevState) => !prevState);
  };

  const handleCommentChange = (
      event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setcomment(event.target.value);
  };

  const handleSubmitComment = (event: React.FormEvent) => {
    if (status !== 'closed') {
      event.preventDefault();

      let commentsArray: Array<Comment> = [];

      db.collection("tickets")
          .doc(ticketId)
          .get()
          .then((doc: firestore.DocumentData) => {
            if (doc.exists) {
              commentsArray = doc.data().comments;
            }
          })
          .then(() => {
            db.collection("tickets")
                .doc(ticketId)
                .set(
                    {
                      comments: [
                        ...commentsArray,
                        {
                          personName: currentUser.name,
                          timestamp: new Date(),
                          comment,
                        },
                      ],
                    },
                    {merge: true}
                )
                .finally(() => {
                  refreshComponent();
                });
          })
    } else {
      alert('Ticket in Closed Status cannot Comment')
    }
  };

  return (
      <div
          className={"pt-3 pb-3 pl-2 pr-2 mt-5 mr-3 ml-3 mb-5"}
          style={{ minHeight: "81vh" }}
      >
        <h2 className={"text-center"}>
          Ticket Details Page{" "}
          {currentUser.id === ticket.owner.id ? (
              <Link to={`/bug-tracker/edit-ticket/${ticket.id}`}>
                <button className="btn btn-warning border-dark">Edit Ticket</button>
              </Link>
          ) : undefined}
        </h2>
        <div className="card border-dark mb-5">
          <ul className="list-group">
            <li className="list-group-item">
              Ticket ID: {ticketId}
            </li>
            <li className="list-group-item">
              Title: {ticket.title}
            </li>
            <li className="list-group-item">
              Description: {ticket.description}
            </li>
            <li className="list-group-item">
              Priority: {ticket.priority}
            </li>
            <li className="list-group-item">
              Created At: {ticket.createdAt}
            </li>
            <li className="list-group-item">
              Created By: {ticket.owner.displayName}
            </li>
            <li className="list-group-item">
              Environment: {ticket.environment}
            </li>
            <li className="list-group-item">
              Asignee: {assignee}
            </li>
            <li className="list-group-item">
              Status: {ticket.status}
            </li>
          </ul>
        </div>
        <h5 className={"text-center"}>Comments</h5>
        <table className="table table-bordered table-striped table-light">
          <thead className="thead-light">
          <tr>
            <th scope="col">Comment Number</th>
            <th scope="col">Person</th>
            <th scope="col">Comment</th>
            <th scope="col">Comment Date</th>
          </tr>
          </thead>
          <tbody>
          {ticket.comments.map((comment, index) => {
            return (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{comment.personName}</td>
                  <td>{comment.comment}</td>
                  <td>{comment.timestamp.toDate().toDateString()}</td>
                </tr>
            );
          })}
          </tbody>
        </table>
        <form onSubmit={handleSubmitComment}>
          <div className="form-group">
            <label htmlFor="ticketComment">Add Comment</label>
            <textarea
                className={"form-control"}
                id="ticketComment"
                placeholder={"Enter your comment here..."}
                rows={4}
                value={comment}
                onChange={handleCommentChange}
            />
          </div>
          <button className="btn btn-primary">Submit Comment</button>
        </form>
      </div>
  );
};

export default TicketDetailsPage;
