import React, { useEffect, useState } from "react";
import StudentView from "./StudentView";
import { useForm } from "react-hook-form";
import useAPI from "../../../hooks/useAPI";
import { message } from "antd";

const StudentContainer = ({ data }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const user_id = localStorage.getItem("userId");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState({});
  const [timeSlotError, setTimeSlotError] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  
  const [studentData, addStudentScheduleItem] = useAPI("POST_STUDENT_SCHEDULE_ITEM", {
    lazy: true,
  });

  const [ProfessorListData, getProfessorList] = useAPI("GET_PROFESSOR_LIST", {
    lazy: true,
  });

  const ProfessorList = ProfessorListData?.data?.professors?.map(
    (professor) => ({
      value: professor?._id,
      label: `${professor?.name} ${professor?.lastname}`,
    })
  );

  useEffect(() => {
    getProfessorList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [ProfessorSchedule, getProfessorSchedule] = useAPI(
    "GET_PROFESSOR_SCHEDULE",
    {
      lazy: true,
    }
  );

  const watchProfessorId = watch("ProfessorName");
 
  useEffect(() => {
    watchProfessorId && getProfessorSchedule({ user_id: watchProfessorId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchProfessorId, studentData]);

  const professorItems = ProfessorSchedule?.data?.professorItems;
  const studentItems = ProfessorSchedule?.data?.studentItems;

  const watchDate = watch("date");

  const handleSlotSelection = (slot) => {
    setSelectedTimeSlot(slot);
    setTimeSlotError("");
  };

  const handleScheduleSuccess = () => {
     messageApi.open({
       type: "success",
       content: "Time slot released successfully",
     });
    reset();
  };

  const handleScheduleSubmit = (formData) => {
    if (formData && selectedTimeSlot) {
      const newIsoDateTime = `${formData?.date?.toISOString().split("T")[0]
        }T${selectedTimeSlot.startTime}:00.000Z`;
      
      const payload = {
        startTime: newIsoDateTime,
        professorItemId: selectedTimeSlot?.itemId,
        description: formData?.description,
      };

      addStudentScheduleItem({
        onSuccess: handleScheduleSuccess,
        user_id,
        payload,
      });
    };
  }
    return (
      <StudentView
        contextHolder={contextHolder}
        onScheduleSubmit={handleSubmit(handleScheduleSubmit)}
        control={control}
        errors={errors}
        selectedTimeSlot={selectedTimeSlot}
        timeSlotError={timeSlotError}
        handleSlotSelection={handleSlotSelection}
        ProfessorList={ProfessorList}
        watchDate={watchDate}
        professorItems={professorItems}
        watchProfessorId={watchProfessorId}
        studentItems={studentItems}
        studentData={studentData}
        ProfessorListData={ProfessorListData}
      />
    );
  };


export default StudentContainer;
