import axios from "axios";
import React, { useEffect, useState } from "react";
import { getToken, getUserRoute } from "../services/Authentication.service";
import AdminProtected from "./protected/AdminProtected";
import Authetication from "./Authetication";
import { useDispatch, useSelector } from "react-redux";
import DriverRoute from "./protected/DriverRoute";
import ClientRoute from "./protected/ClientRoute";
import DeveloperRoute from "./protected/DeveloperRoute";
import { SESSION_INFO } from "../services/store/slice/userInfoSlice";

function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const userInfo = useSelector((state) => state.userInfo.userInfo);
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState({});
  const getSession = async () => {
    try {
      const token = getToken();

      if (!token) {
        setIsAuthenticated(false);
      } else {
        const { data } = await axios({
          url: "/api/auth/session",
          method: "GET",
          params: {
            token,
          },
        });
        setSession(data);
        dispatch(SESSION_INFO(data.session))
        // localStorage.setItem("persistantState", JSON.stringify({}));
        localStorage.setItem('state', JSON.stringify({ token: data.session.jwtToken }))
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProtectedRouteByUserType = () => {
    try {
    const userRoute = getUserRoute(userInfo?.modules?.userType)
      switch (userInfo.modules.userType) {
        case "ADMIN":
          return <AdminProtected userRoute={userRoute} />;
        case "DRIVER":
          return <DriverRoute userRoute={userRoute} />;
        case "CLIENT":
          return <ClientRoute userRoute={userRoute} />;
        case "DEVELOPER":
          return <DeveloperRoute userRoute={userRoute} />;
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSession();
  }, []);

  return (
    <>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <>
          {isAuthenticated ? (
            getProtectedRouteByUserType()
          ) : (
            <Authetication  />
          )}
        </>
      )}
    </>
  );
}

export default Index;
