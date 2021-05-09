import React, { useState } from "react";
import { auth, createUserProfileDocument } from "../../firebase/firebase.utils";
import { useHistory } from "react-router-dom";

interface UserRegister {
  [fieldName: string]: string;
}

const Register = () => {
  const history = useHistory();
  const [userCredentials, setUserCredentials] = useState<UserRegister>({
    fName: "A",
    lName: "Student",
    email: "test@example.com",
    password: "password",
    confirmPassword: "password",
  });

  const {
    fName,
    lName,
    email,
    password,
    confirmPassword,
  } = userCredentials;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setUserCredentials((prevUserCredentials) => ({
      ...prevUserCredentials,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    console.log("Entered handleSubmit");
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      const { user }: any = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      await createUserProfileDocument(user, {
        displayName: `${fName} ${lName}`,
        createdProjects: [""],
        projects: [""],
      });
      setUserCredentials({
        fName: "",
        lName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      history.push("/fitness-tracker/new-log");
    } catch (error) {
      console.error("Error creating user: ", error);
    }
  };

  return (
    <div className={"text-center mb-5 mt-5"}>
      <form className="form-signin" onSubmit={handleSubmit}>
        <h1 className="h3 mb-3 font-weight-normal">Registration Form</h1>
        <div className="form-group">
          <label htmlFor="registerEmail" className="sr-only">
            Email address
          </label>
          <input
            type="email"
            name="email"
            id="registerEmail"
            className="form-control"
            placeholder="Email address"
            onChange={handleChange}
            value={email}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="registerPassword" className="sr-only">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="registerPassword"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="inputConfirmPassword" className="sr-only">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="inputConfirmPassword"
            className="form-control"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button className="btn btn-lg btn-primary btn-block" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
