import { useUser } from "@clerk/clerk-react";
import { RecordForm } from "./RecordForm";
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