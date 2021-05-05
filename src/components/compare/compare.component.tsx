import React, {useContext, useEffect, useState} from "react";
import CurrentUserContext from "../../typescript-interfaces/current-user.provider";
import {CurrentUser} from "../../typescript-interfaces/current-user.interface";
import {firestore as db} from "../../firebase/firebase.utils";
import {firestore} from "firebase/app";
import firestoreAuth from "firebase";
import {useParams, useHistory} from "react-router-dom";

interface Log {
    personName: string;
    timestamp: firestore.Timestamp;
}

const Compare = () => {
    const [title, setTitle] = useState("");
    const [activityGoals, setActivityGoals] = useState("");
    const [predictedDistance, setPredictedDistance] = useState("");
    const [actualDistance, setActualDistance] = useState("");

    const {ticketId} = useParams<{ ticketId: string }>();
    const history = useHistory();
    var user = firestoreAuth.auth().currentUser

    function loginCheck() {
        if (user == null) {
            alert("Please Login")
            history.push("/")
        }
    }

    // loginCheck()

    let currentUser: CurrentUser = useContext(CurrentUserContext);

    // useEffect(() => {
    //     db.collection("tickets")
    //         .doc(ticketId)
    //         .get()
    //         .then((doc: firestore.DocumentData) => {
    //             const {title, activityGoals, predictedDistance, actualDistance} = doc.data();
    //             setTitle(title);
    //             setActivityGoals(activityGoals);
    //             setPredictedDistance(predictedDistance);
    //             setActualDistance(actualDistance)
    //         })
    // }, [ticketId]);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const {name, value} = event.target;
        switch (name) {
            case "title":
                setTitle(value);
                break;

            case "activityGoals":
                setActivityGoals(value);
                break;

            case "predictedDistance":
                setPredictedDistance(value);
                break;

            case "actualDistance":
                setActualDistance(value);
                break;

            default:
                break;
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const updatedAt = new Date();
        let logsArr: Array<Log> = [];

        db.collection("tickets")
            .doc()
            .get()
            .then((doc: firestore.DocumentData) => {
                if (doc.exists) {
                    logsArr = doc.data().logs;
                }
            })
            .then(() => {
                db.collection("tickets")
                    .doc(ticketId)
                    .set(
                        {
                            lastEditedBy: {
                                id: currentUser.id,
                                displayName: currentUser.name,
                                email: currentUser.email,
                            },
                            title,
                            activityGoals,
                            predictedDistance,
                            actualDistance,
                            updatedAt,
                            logs: [
                                ...logsArr,
                                {
                                    personName: currentUser.name,
                                    timestamp: updatedAt,
                                },
                            ],
                        },
                        {merge: true}
                    )
                    .then(() => {
                        console.log("Log updated successfully!");
                    })
                    .then(() => {
                        setTitle("");
                        setActivityGoals("");
                        setPredictedDistance("");
                        setActualDistance("");
                    })
            })
            .finally(() => {
                history.push(`/fitness-tracker/view-log/${ticketId}`);
            });
    };

    return (
        <div
            className={"pt-3 pl-2 pr-2 mt-5 mr-3 ml-3"}
            style={{minHeight: "86vh"}}
        >
            <h1 className={"text-center"}>Compare Logs</h1>
            <form className={"mb-5"} onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="ticketTitle">Week Start Date</label>
                    <input
                        type="text"
                        name="title"
                        className="form-control"
                        id="ticketTitle"
                        placeholder="Issue title here..."
                        value={title}
                        onChange={handleChange}
                    />
                <div className="form-group">
                    <label htmlFor="ticketTitle">Title</label>
                    <input
                        type="text"
                        name="title"
                        className="form-control"
                        id="ticketTitle"
                        placeholder="Issue title here..."
                        value={title}
                        onChange={handleChange}
                    />
                </div>
                </div>
                <div className="form-group">
                    <label htmlFor="activityGoals">Activity Goals</label>
                    <textarea
                        className="form-control"
                        name="activityGoals"
                        id="activityGoals"
                        value={activityGoals}
                        onChange={handleChange}
                    >
                    </textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="predictedDistance">Predicted Distance</label>
                    <textarea
                        className="form-control"
                        name="predictedDistance"
                        id="predictedDistance"
                        value={predictedDistance}
                        onChange={handleChange}
                    >
                    </textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="actualDistance">Actual Distance</label>
                    <textarea
                        className="form-control"
                        name="actualDistance"
                        id="actualDistance"
                        value={actualDistance}
                        onChange={handleChange}
                    >
                    </textarea>
                </div>
                <button type={"submit"} className={"btn btn-danger"}>
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Compare;
