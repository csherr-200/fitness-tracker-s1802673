import React, {useContext, useState} from "react";
import CurrentUserContext from "../../typescript-interfaces/current-user.provider";
import {CurrentUser} from "../../typescript-interfaces/current-user.interface";
import {v4} from "uuid";
import {firestore as db} from "../../firebase/firebase.utils";
import firestoreAuth from "firebase";
import {useHistory} from "react-router-dom";


const TicketForm = () => {
    const [title, setTitle] = useState("");
    const [activityGoals, setActivityGoals] = useState("");
    const [predictedDistance, setPredictedDistance] = useState("");
    const [actualDistance, setActualDistance] = useState("");
    const currentUser: CurrentUser = useContext(CurrentUserContext);

    const history = useHistory();
    var user = firestoreAuth.auth().currentUser

    // function loginCheck() {
    //     if (user == null) {
    //         alert("Please Login")
    //         history.push("/")
    //     }
    // }
    //
    // loginCheck()

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
        const uid = v4();
        const createdAt = new Date();

        db.collection("tickets")
            .doc(uid)
            .set({
                owner: {
                    id: currentUser.id,
                    displayName: currentUser.name,
                    email: currentUser.email,
                },
                title,
                activityGoals,
                createdAt,
                status: "open",
                comments: [],
            })
            .then(() => {
                setTitle("");
                setActivityGoals("");
                setPredictedDistance("");
                setActualDistance("");
            })
            .catch(function (error) {
                console.error("Error creating ticket: ", error);
            });


        db.collection("users")
            .doc(currentUser.id)
            .set(
                {
                    myTickets: [...currentUser.myTickets, uid],
                },
                {merge: true}
            );
    };

    return (
        <div
            className={"pt-3 pl-2 pr-2 mt-5"}
            style={{minHeight: "75vh"}}
        >
            <h1 className={"text-center"}>Create a New Fitness Log</h1>
            <form className={"mb-5"} onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="ticketTitle">Week Starting</label>
                    <input
                        type="text"
                        name="title"
                        className="form-control"
                        id="ticketTitle"
                        placeholder="Insert Issue Title (Brief Description)"
                        value={title}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="activityGoals">Activity Goals</label>
                    <textarea
                        className="form-control"
                        name="activityGoals"
                        id="activityGoals"
                        placeholder="Insert Activity Goals here"
                        value={activityGoals}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="priority">Predicted Distance</label>
                    <textarea
                        className="form-control"
                        name="predictedDistance"
                        id="predictedDistance"
                        placeholder="Enter Predicted Distance here"
                        value={predictedDistance}
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

export default TicketForm;
