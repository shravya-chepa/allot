import React from "react";
import { useHistory } from "react-router-dom";
import LoginView from "./LoginView";
import { useForm } from "react-hook-form";
import useAPI from "../../../hooks/useAPI";

const LoginContainer = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const [loginData, login] = useAPI("LOGIN_USER", {
    lazy: true,
  });

  const history = useHistory();

  const handleLoginClick = ({ res }) => {
    localStorage.setItem("token", res.jwt);
    localStorage.setItem("userId", res.userId);
   history.push("/dashboard");
  };

  const handleLoginSubmit = (formData) => {
    const payload = formData;

    login({
      onSuccess: (res) => handleLoginClick({res}),
      payload,
    });
  };

  return (
    <LoginView
      onLoginSubmit={handleSubmit(handleLoginSubmit)}
      errors={errors}
      control={control}
      loginData={loginData}
    />
  );
};

export default LoginContainer;
