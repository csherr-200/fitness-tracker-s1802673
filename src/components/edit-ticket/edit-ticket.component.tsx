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
    statusChangedTo: string;
}

const EditTicket = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("");
    const [environment, setEnvironment] = useState("");
    const [status, setStatus] = useState("open");
    const [assignee, setAssignee] = useState("")

    const {ticketId} = useParams<{ ticketId: string }>();
    const history = useHistory();
    var user = firestoreAuth.auth().currentUser

    function loginCheck() {
        if (user == null) {
            alert("Please Login")
            history.push("/")
        }
    }

    loginCheck()

    let currentUser: CurrentUser = useContext(CurrentUserContext);

    useEffect(() => {
        db.collection("tickets")
            .doc(ticketId)
            .get()
            .then((doc: firestore.DocumentData) => {
                const {title, description, priority, assignee} = doc.data();
                setTitle(title);
                setDescription(description);
                setPriority(priority);
                setAssignee(assignee);
            })
    }, [ticketId]);

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

            case "status":
                setStatus(value);
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
                            description,
                            priority,
                            updatedAt,
                            assignee,
                            status,
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
                        console.log("Ticket updated successfully!");
                    })
                    .then(() => {
                        setTitle("");
                        setDescription("");
                        setPriority("");
                        setAssignee("")
                        setStatus("")
                    })
            })
            .finally(() => {
                history.push(`/bug-tracker/ticket-details/${ticketId}`);
            });

    };

    return (
        <div
            className={"pt-3 pl-2 pr-2 mt-5 mr-3 ml-3"}
            style={{minHeight: "86vh"}}
        >
            <h1 className={"text-center"}>Updating Ticket</h1>
            <form className={"mb-5"} onSubmit={handleSubmit}>
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
                <div className="form-group">
                    <label htmlFor="ticketDescription">Description</label>
                    <textarea
                        className="form-control"
                        name="description"
                        id="ticketDescription"
                        placeholder="Write a detailed description of the issue here..."
                        rows={3}
                        value={description}
                        onChange={handleChange}
                    />

                </div>
                <div className="form-group">
                    <label htmlFor="ticketPriority">Priority Level</label>
                    <select
                        className="form-control"
                        name="priority"
                        id="ticketPriority"
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
                <div className="form-group">
                    <label htmlFor="environment">Status</label>
                    <select
                        className="form-control"
                        name="status"
                        id="status"
                        value={status}
                        onChange={handleChange}
                    >
                        <option>--Select--</option>
                        <option>open</option>
                        <option>resolved</option>
                        <option>closed</option>
                    </select>
                </div>
                <button type={"submit"} className={"btn btn-danger"}>
                    Submit
                </button>
            </form>
        </div>
    );
};

export default EditTicket;
