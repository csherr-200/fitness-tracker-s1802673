import { createContext } from "react";
import { CurrentUser } from "./current-user.interface";

const CurrentUserContext = createContext<CurrentUser>({
  id: "",
  email: "",
  name: "",
  myTickets: [],
});

export default CurrentUserContext;
