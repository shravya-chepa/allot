/*jslint es6 */

import React, { useEffect } from "react";
import DashboardView from "./DashboardView";
import useAPI from "../../hooks/useAPI";

const DashboardContainer = () => {
    const user_id = localStorage.getItem("userId");
    const [userData, getUserProfile] = useAPI("GET_USER_DETAILS", {
      lazy: true,
    });
  
  useEffect(() => {
    getUserProfile({user_id });
  },[])

  return <DashboardView user={userData} />;
};

export default DashboardContainer;
