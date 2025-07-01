import React, { useEffect, useState } from "react";
import ProfessorView from "./ProfessorView";
import { useForm } from "react-hook-form";
import useAPI from "../../../hooks/useAPI";
import { helper } from "./helper";
import { message } from "antd";

const StudentContainer = ({ data }) => {

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    watch,
    reset,
  } = useForm();

const [messageApi, contextHolder] = message.useMessage();

  const user_id = localStorage.getItem("userId");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [timeSlotError, setTimeSlotError] = useState("");

  const [ProfessorSchedule, getProfessorSchedule] = useAPI(
    "GET_PROFESSOR_SCHEDULE",
    {
      lazy: true,
    }
  );

  const [ProfessorData, ProfessorScheduleItem] = useAPI("POST_PROFESSOR_SCHEDULE_ITEM", {
    lazy: true,
  });

  useEffect(() => {
    getProfessorSchedule({ user_id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ProfessorData]);


  const professorItems = ProfessorSchedule?.data?.professorItems;
  const studentItems = ProfessorSchedule?.data?.studentItems;

  const showDate = watch("date");

  const handleSlotSelection = (slot) => {
    setSelectedTimeSlot(slot);
    setTimeSlotError("");
  };


    const handleScheduleSuccess = (slot) => {
      //add alert
      // refresh();
    messageApi.open({
      type: "success",
      content: "Time slot released successfully",
    });
      reset();
    };

    const handleScheduleSubmit = ( formData ) => {
   
      if (formData && selectedTimeSlot) {
        const newIsoDateTime = `${
          formData?.date?.toISOString().split("T")[0]
        }T${selectedTimeSlot}:00.000Z`;

        const payload = {
          item_name: "timebook",
          recurring: false,
          start_time: newIsoDateTime,
        };

        ProfessorScheduleItem({
          onSuccess: (res) => handleScheduleSuccess({ res, payload }),
          user_id,
          payload,
        });
      }
  };

  return (
    <ProfessorView
      contextHolder={contextHolder}
      onScheduleSubmit={handleSubmit(handleScheduleSubmit)}
      control={control}
      errors={errors}
      register={register}
      selectedTimeSlot={selectedTimeSlot}
      setSelectedTimeSlot={setSelectedTimeSlot}
      timeSlotError={timeSlotError}
      handleSlotSelection={handleSlotSelection}
      watch={watch}
      data={data}
      studentItems={studentItems}
      showDate={showDate}
      professorItems={professorItems}
    />
  );
};

export default StudentContainer;
