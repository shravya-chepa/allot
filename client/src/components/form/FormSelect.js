import React from "react";
import Select from "../Select";
import { Controller } from "react-hook-form";
import { StyledDiv } from "./Form.styled";
import { getFieldError } from "../../utils/formValidations";
import FormFieldError from "./FormFieldError";

const FormSelect = ({ control, name, border, ...rest }) => {
  const { error, color } = getFieldError({ name, ...rest });
  return (
    <div>
      <Controller
        control={control}
        render={({ field }) => (
          <Select {...field} autoComplete="off" {...rest} />
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

export default FormSelect;
