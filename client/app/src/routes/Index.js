import axios from "axios";
import React, { useEffect, useState } from "react";
import { clearLocalStorage, getTokenFromLocal, setTokenToLocal } from "../services/Authentication.service";
import { useSelector } from "react-redux";
import UnProtected from './UnProtected'
import { BrowserRouter, Navigate, Routes, useNavigate } from "react-router-dom";
import Protected from "./Protected";
import store from "../store";

function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const userInfo = useSelector((state) => state.userInfo)
  const getSession = async () => {
    try {
      setIsLoading(true)
      const token = getTokenFromLocal();
      if (!token) {
        return
      }
      else {
        const { data } = await axios({
          url: "/api/auth/session",
          method: "GET",
          params: {
            token,
          },
        });
        const pathName = window.location.pathname
        if (data.session?.modules.userType !== 'CLIENT' && (pathName.includes('car-list') || pathName === 'booking')) {
          clearLocalStorage()
        } else {
          setTokenToLocal(data.session.jwtToken)
          store.dispatch({ type: 'SET_INTO_STORE', payload: { userInfo: data.session } })
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getSession();
  }, []);

  return (
    <>
      {
        isLoading ? <div>Loading.....</div> :
          <BrowserRouter basename="/car-booking">
            {userInfo ? <Protected /> : <UnProtected />}
          </BrowserRouter>
      }
    </>
  );
}

export default Index;
