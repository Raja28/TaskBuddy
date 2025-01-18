
import { Navigate } from "react-router-dom";

import { PropsWithChildren } from "react";

type ProtectedRouteProps = PropsWithChildren

export default function PrivateRoute({ children }: ProtectedRouteProps) {

    const token: string | null = localStorage.getItem('accessToken')
    
    if (token === null) {
        return <Navigate to={"/"} />
    }
    return children;

}

// interface PrivateRouteProps extends RouteProps: {
// }

// interface ProtectedRouteProps {
// //     children: JSX.Element
// //     // allowedRoles: ("admin" | "staff")[]; // set the user-roles
// // }

// export const PrivateRoute: React.FC<ProtectedRouteProps> = ({ children }) => {

//     const token: string | null = localStorage.getItem('accessToken')

//     if (token === null) {
//         return <Navigate to="/" />
//     } else {
//         return children;
//     }
// }

// export default PrivateRoute;
