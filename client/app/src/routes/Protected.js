import React from 'react'
import { useSelector } from 'react-redux';
import AdminRoute from './protected/AdminRoute';

function Protected() {
    const userInfo = useSelector(({ userInfo }) => userInfo)

    const getProtectedRouteByUserType = () => {
        try {
            console.log(userInfo.modules.userType)
            switch (userInfo.modules.userType) {
                case "ADMIN":
                    return <AdminRoute />;
                // case "DRIVER":
                //     return <DriverRoute />;
                // case "CLIENT":
                //     return <ClientRoute />;
                // case "DEVELOPER":
                //     return <DeveloperRoute />;
            }
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <React.Fragment>
            {getProtectedRouteByUserType()}
        </React.Fragment>
    )
}

export default Protected