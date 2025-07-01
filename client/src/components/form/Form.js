import React from "react";
import { useForm } from "react-hook-form";

import { StyledForm } from "./Form.styled";

const Form = ({ onSubmit, ...rest }) => {
  const { handleSubmit } = useForm();

  return <StyledForm onSubmit={handleSubmit(onSubmit)} {...rest} />;
};

export default Form;
