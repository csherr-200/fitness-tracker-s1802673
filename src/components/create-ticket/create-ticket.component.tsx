import React, {useContext, useState} from "react";
import CurrentUserContext from "../../typescript-interfaces/current-user.provider";
import {CurrentUser} from "../../typescript-interfaces/current-user.interface";
import {v4} from "uuid";
import {firestore as db} from "../../firebase/firebase.utils";
import firestoreAuth from "firebase";
import {useHistory} from "react-router-dom";


const TicketForm = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("");
    const [environment, setEnvironment] = useState("");
    const [assignee, setAssignee] = useState("")
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

            case "description":
                setDescription(value);
                break;

            case "priority":
                setPriority(value);
                break;

            case "environment":
                setEnvironment(value);
                break;

            case "assignee":
                setAssignee(value);
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
                description,
                priority,
                environment,
                createdAt,
                status: "open",
                assignee,
                comments: [],
            })
            .then(() => {
                setTitle("");
                setDescription("");
                setPriority("");
                setEnvironment("")
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
            <h1 className={"text-center"}>Raising a new ticket</h1>
            <form className={"mb-5"} onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="ticketTitle">Title</label>
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
                    <label htmlFor="bugDescription">Description</label>
                    <textarea
                        className="form-control"
                        name="description"
                        id="bugDescription"
                        placeholder="Insert Error Description here"
                        value={description}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                        className="form-control"
                        name="priority"
                        id="priority"
                        value={priority}
                        onChange={handleChange}
                    >
                        <option>--Select--</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="environment">Environment</label>
                    <select
                        className="form-control"
                        name="environment"
                        id="environment"
                        value={environment}
                        onChange={handleChange}
                    >
                        <option>--Select--</option>
                        <option>Production</option>
                        <option>Testing</option>
                        <option>Development</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="assignee">Assign To: </label>
                    <select
                        className="form-control"
                        name="assignee"
                        id="assignee"
                        value={assignee}
                        onChange={handleChange}
                    >
                        <option>--Select--</option>
                        <option>David Turnbull</option>
                        <option>Max Power</option>
                        <option>Nick Chubb</option>
                        <option>Derek Henry</option>
                    </select>
                </div>
                <button type={"submit"} className={"btn btn-danger"}>
                    Submit
                </button>
            </form>
        </div>
    );
};

export default TicketForm;
