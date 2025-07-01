import React from "react";
import {Form,Button} from "../../../components";
import Header from "../../../components/Header/";
import Footer from "../../../components/Footer";
import {
  ContainerFluid,
  StyledAddUserSectionContainer,
  StyledInputWrapper,
  StyledTitle,
  StyledWrapper,
  StyledFormContainer,
  StyledItemWrapper,
} from "../Authentication.styled";
import {
  hasBlankSpace,
  isOnlyAlphabets,
  validateRequiredField,
  checkMaxLength,
  isValidEmail,
  checkMinLength,
  validateConfirmPassword
} from "../../../utils/formValidations";
import { Typography } from "antd";

const OCCUPATION_STUB = [
  {
    value: "STUDENT",
    label: "Student",
  },
  {
    value: "PROFESSOR",
    label: "Professor",
  },
];

const { Text, Link } = Typography;

const SignupView = ({ onSignupSubmit, control, watch, errors, signupData }) => {
  const { loading, data, error } = signupData || {};
  
  const password = watch("password");
  return (
    <div>
      <Header />
      <ContainerFluid>
        <StyledFormContainer>
          <Form onSubmit={onSignupSubmit}>
            <StyledAddUserSectionContainer>
              <StyledTitle>Signup</StyledTitle>
              {error && (
                <Form.FieldError error={data.errorDescription} align="center" />
              )}
              <StyledWrapper>
                <StyledItemWrapper>
                  <StyledInputWrapper>
                    <Form.Label
                      label="First Name *"
                      margin="0 0 10px 0"
                      fill="#828282"
                    />
                    <Form.Input
                      control={control}
                      errors={errors}
                      name="name"
                      type="Input"
                      placeholder="Enter First Name"
                      size="medium"
                      rules={{
                        validate: {
                          required: validateRequiredField("First Name"),
                          hasBlankSpace,
                          isOnlyAlphabets,
                          max: checkMaxLength(50, "First Name"),
                        },
                      }}
                    />
                  </StyledInputWrapper>
                  <StyledInputWrapper>
                    <Form.Label
                      label="Last Name *"
                      margin="0 0 10px 0"
                      fill="#828282"
                    />
                    <Form.Input
                      control={control}
                      errors={errors}
                      name="lastname"
                      type="Input"
                      placeholder="Enter Last Name"
                      size="medium"
                      rules={{
                        validate: {
                          required: validateRequiredField("Last Name"),
                          hasBlankSpace,
                          isOnlyAlphabets,
                          max: checkMaxLength(50, "Last Name"),
                        },
                      }}
                    />
                  </StyledInputWrapper>
                </StyledItemWrapper>
                <StyledItemWrapper>
                  <StyledInputWrapper>
                    <Form.Label
                      label="Select Your User Type *"
                      margin="0 0 10px 0"
                      fill="#828282"
                    />
                    <Form.Select
                      control={control}
                      name="occupation"
                      placeholder="Select occupation"
                      size="medium"
                      options={OCCUPATION_STUB}
                      errors={errors}
                      fullWidth
                      rules={{
                        validate: {
                          required: validateRequiredField("Occupation"),
                        },
                      }}
                    />
                  </StyledInputWrapper>

                  <StyledInputWrapper>
                    <Form.Label
                      label="Email Address *"
                      margin="0 0 10px 0"
                      fill="#828282"
                    />
                    <Form.Input
                      control={control}
                      errors={errors}
                      name="email"
                      type="Input"
                      placeholder="Enter Email Address"
                      size="medium"
                      rules={{
                        validate: {
                          required: validateRequiredField("Email"),
                          isValidEmail,
                          max: checkMaxLength(250, "Email Address"),
                        },
                      }}
                    />
                  </StyledInputWrapper>
                </StyledItemWrapper>
                <StyledItemWrapper>
                  <StyledInputWrapper>
                    <Form.Label
                      label="Password *"
                      margin="0 0 10px 0"
                      fill="#828282"
                    />
                    <Form.Input
                      control={control}
                      errors={errors}
                      name="password"
                      type="password"
                      placeholder="Enter Password"
                      size="medium"
                      rules={{
                        validate: {
                          required: validateRequiredField("Password"),
                          min: checkMinLength(8),
                        },
                      }}
                    />
                  </StyledInputWrapper>

                  <StyledInputWrapper>
                    <Form.Label
                      label="Confirm Password *"
                      margin="0 0 10px 0"
                      fill="#828282"
                    />
                    <Form.Input
                      control={control}
                      errors={errors}
                      name="confirmPassword"
                      type="password"
                      placeholder="Enter Confirm Password"
                      size="medium"
                      rules={{
                        validate: {
                          required: validateRequiredField("Password"),
                          validateConfirmPassword:
                            validateConfirmPassword(password),
                        },
                      }}
                    />
                  </StyledInputWrapper>
                </StyledItemWrapper>
              </StyledWrapper>
              <Button text="Signup" loading={loading} />
              <Text>
                Already have an account? <Link href="./login">Login</Link>
              </Text>
            </StyledAddUserSectionContainer>
          </Form>
        </StyledFormContainer>
      </ContainerFluid>
      <Footer />
    </div>
  );
};

export default SignupView;

