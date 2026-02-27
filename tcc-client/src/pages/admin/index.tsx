import { useUser } from "@clerk/clerk-react";
import Header from "../../components/Header";
import { RecordForm } from "./RecordForm";
import { RecordFormList } from "./RecordFormList";
import Sidenav from "./Sidenav";
export const AdminDashboard = () =>{
    const {user} = useUser();
    console.log(user)
    return (
        <div>
          {/* <Sidenav /> */}
          {/* <Header/> */}
        <RecordForm />
        {/* <RecordFormList/> */}
      </div>
    )
}