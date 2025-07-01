// import { REACT_APP_API_ENDPOINT } from "../utils/config.js";



const authHeader = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return { Authorization: token };
  }

  return null;
};


export const schema = {
  // FETCH_HOME_DATA: ({ isSuccess }) => {
  //   let url = isSuccess
  //     ? `${window.location.origin}/stubs/homeAPI.json`
  //     : `${window.location.origin}/stubs/homeAPIs.json`;
  //   return {
  //     props: "home",
  //     url,
  //     method: "GET",
  //   };
  // },

  SIGNUP_USER: () => {
    const url = `http://localhost:3001/api/public/register`;

    return {
      props: "signup",
      url,
      method: "POST",
    };
  },

  LOGIN_USER: () => {
    const url = `http://localhost:3001/api/public/login`;

    return {
      props: "login",
      url,
      method: "POST",
    };
  },

  GET_USER_DETAILS: (payload) => {
    const url = `http://localhost:3001/api/${payload.user_id}`;

    return {
      props: "userDetails",
      url,
      method: "GET",
      headers: authHeader(),
    };
  },

  GET_PROFESSOR_LIST: () => {
    const url = `http://localhost:3001/api/professors`;

    return {
      props: "professorList",
      url,
      method: "GET",
      headers: authHeader(),
    };
  },

  GET_PROFESSOR_SCHEDULE: (payload) => {
     const url = `http://localhost:3001/api/schedule/${payload.user_id}`;

    return {
      props: "scheduledList",
      url,
      method: "GET",
      headers: authHeader(),
    };
  },

  GET_STUDENT_SCHEDULE_LIST: (payload) => {
    const url = `http://localhost:3001/api/student/schedule/${payload.user_id}`;

    return {
      props: "studentScheduledList",
      url,
      method: "GET",
      headers: authHeader(),
    };
  },

  POST_PROFESSOR_SCHEDULE_ITEM: (payload) => {

    const url = `http://localhost:3001/api/professor/schedule/${payload.user_id}`;
    return {
      props: "ProfessorScheduleItem",
      url,
      method: "POST",
      headers: authHeader(),
    };
  },

  POST_STUDENT_SCHEDULE_ITEM: (payload) => {
    const url = `http://localhost:3001/api/student/schedule/${payload.user_id}`;
    return {
      props: "addStudentScheduleItem",
      url,
      method: "POST",
      headers: authHeader(),
    };
  },
  
};
