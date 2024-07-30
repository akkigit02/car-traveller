import axios from "axios";
import React, { useEffect, useState } from "react";
import { getTokenFromLocal, setTokenToLocal } from "../services/Authentication.service";
import { useSelector } from "react-redux";
import Authentication from './Authetication'
import { BrowserRouter, Routes } from "react-router-dom";
import Protected from "./Protected";
import store from "../store";

function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const userInfo = useSelector((state) => state.userInfo)
  const getSession = async () => {
    try {
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
        setTokenToLocal(data.session.jwtToken)
        store.dispatch({ type: 'SET_INTO_STORE', payload: { userInfo: data.session } })
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
          <BrowserRouter>
            {userInfo ? <Protected /> : <Authentication />}
          </BrowserRouter>
      }
    </>
  );
}

export default Index;
