import { firestore } from "firebase";
import { firestore as db } from "../../firebase/firebase.utils";
import React, { useContext, useEffect, useState } from "react";
import {Link, useHistory, useParams} from "react-router-dom";
import { Log } from "../../typescript-interfaces/log.interface";
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
  const [comment, setcomment] = useState("");
  const [ticket, setTicket] = useState<Log>({
    id: "",
    title: "",
    activityGoals: "",
    predictedDistance: "",
    actualDistance: "",
    startDate: "",
    endDate: "",
    owner: {
      displayName: "",
      email: "",
      id: "",
    },
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
              activityGoals,
              predictedDistance,
              actualDistance,
              startDate,
              endDate,
              owner,
              createdAt,
              logs,
              comments,
            } = doc.data();
            setTicket({
              id: doc.id,
              title,
              activityGoals,
              predictedDistance,
              actualDistance,
              startDate: startDate.toDate().toString(),
              endDate: endDate.toDate().toString(),
              owner,
              createdAt: createdAt.toDate().toString(),
              logs,
              comments,
            });
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

  };

  function getURL() {
    alert("Share this Log with your Friends here: " + window.location.href);
  }

  return (
      <div
          className={"pt-3 pb-3 pl-2 pr-2 mt-5 mr-3 ml-3 mb-5"}
          style={{ minHeight: "81vh" }}
      >
        <h2 className={"text-center"}>
          Log Details{" "}
          {currentUser.id === ticket.owner.id ? (
              <Link to={`/fitness-tracker/edit-ticket/${ticket.id}`}>
                <button className="btn btn-warning border-dark">Edit Log</button>
              </Link>
          ) : undefined}
          <p></p>
                <button onClick={getURL} className="btn btn-warning border-dark">Share Log</button>
        </h2>
        <div className="card border-dark mb-5">
          <ul className="list-group">
            <li className="list-group-item">
              Log ID: {ticketId}
            </li>
            <li className="list-group-item">
              Title: {ticket.title}
            </li>
            <li className="list-group-item">
              Activity Goals {ticket.activityGoals}
            </li>
            <li className="list-group-item">
              Predicted Distance: {ticket.predictedDistance} KM
            </li>
            <li className="list-group-item">
                Actual Distance: {ticket.actualDistance} KM
            </li>
            <li className="list-group-item">
              Created At: {ticket.createdAt}
            </li>
            <li className="list-group-item">
              Start Date: {ticket.startDate}
            </li>
            <li className="list-group-item">
              End Date: {ticket.endDate}
            </li>
            <li className="list-group-item">
              Owner: {ticket.owner.email}
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
                  <td>{comment.email}</td>
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
