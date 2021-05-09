import React, {useContext, useState} from "react";
import CurrentUserContext from "../../typescript-interfaces/current-user.provider";
import {CurrentUser} from "../../typescript-interfaces/current-user.interface";
import {v4} from "uuid";
import {firestore as db} from "../../firebase/firebase.utils";
import 'react-day-picker/lib/style.css';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import {useParams, useHistory} from "react-router-dom";
import firestoreAuth from "firebase";


const TicketForm = () => {
    const [title, setTitle] = useState("");
    const [activityGoals, setActivityGoals] = useState("");
    const [predictedDistance, setPredictedDistance] = useState("");
    const [actualDistance, setActualDistance] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

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

    function onDateChange(startDate: Date) {
        setStartDate(startDate)
        setEndDate(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 7))
    }


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
                predictedDistance,
                actualDistance,
                createdAt,
                startDate,
                endDate,
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
                    <label htmlFor="ticketTitle">Title</label>
                    <input
                        type="text"
                        name="title"
                        className="form-control"
                        id="ticketTitle"
                        placeholder="Insert Log Title"
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
                    <label htmlFor="predictedDistance">Predicted Distance (KM)</label>
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
                <div>
                    <label htmlFor="StartDate">Pick Date</label>
                    <br/>
                    <DayPickerInput onDayChange={onDateChange}/>
                </div>
                <br/>
                <button type={"submit"} className={"btn btn-danger"}>
                    Submit
                </button>
            </form>
        </div>
    );
};

export default TicketForm;
