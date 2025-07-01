import React from "react";
import SignupView from './SignupView'
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import useAPI from "../../../hooks/useAPI";

const SignupContainer = () => {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm();

  const [signupData, signup] = useAPI("SIGNUP_USER", {
    lazy: true,
  });


  const history = useHistory();
  const handleSignUpClick = ({ res, payload }) => {
    // setSignupData(res);
    // const { email, mobileNumber } = payload;
  
    window.scrollTo(0, 0);
    history.push("/login");
    // if (email) {
    //   message.success(
    //     "You have registered successfully. Verification link has been sent to your registered Email Address. Please verify your Email Address."
    //   );

    //   return;
    // }

    // message.success(
    //   "You have registered successfully. OTP has been sent to your registered Mobile Number. Please verify your Mobile Number."
    // );

    // openModal({
    //   modalType: MODAL_TYPES.OTP_VERIFY,
    //   maxWidth: 600,
    //   data: {
    //     mobileNumber,
    //     userId: res?.data?.userId,
    //   },
    // });
  };

  const handleSignupSubmit = (formData) => {
    delete formData['confirmPassword']
     const payload = formData;

     signup({
       onSuccess: (res) => handleSignUpClick({ res, payload }),
       payload,
     });
    //api call
  };
  return (
    <SignupView
      onSignupSubmit={handleSubmit(handleSignupSubmit)}
      control={control}
      errors={errors}
      watch={watch}
      signupData={signupData}
    />
  );
};

export default SignupContainer;

