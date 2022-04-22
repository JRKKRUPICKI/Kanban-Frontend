import { Navigate } from "react-router-dom";
import { useAuth } from "./Auth";

export default function RequireNoAuth({children}){
    const auth = useAuth();
    if(auth.user){
        return <Navigate to='/'/>;
    }
    return children;
}
