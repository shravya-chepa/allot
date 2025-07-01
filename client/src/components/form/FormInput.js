import React from "react";
import Input from "../Input";
import { Controller } from "react-hook-form";
import {StyledDiv} from './Form.styled'
import { getFieldError } from "../../utils/formValidations";
import FormFieldError from "./FormFieldError";

const FormInput = ({ control, name, border, ...rest }) => {
  const { error, color } = getFieldError({ name, ...rest });

  return (
    <div>
      <Controller
        control={control}
        render={({ field }) => (
          <Input {...field} autoComplete="off" {...rest} />
        )}
        name={name}
        color={color}
        style={{ border: border ? "none" : null }}
        {...rest}
      />
      {error ? <FormFieldError error={error} /> : <StyledDiv></StyledDiv>}
    </div>
  );
};

export default FormInput;
