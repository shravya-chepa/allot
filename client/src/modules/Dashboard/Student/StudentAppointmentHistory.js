import React, { useEffect } from "react";
import {
  AppointmentContent,
  StyledDescription,
  StyledItemWrapper,
  StyledWrapper,
  StyledHeading,
} from "./Student.styled";
import useAPI from "../../../hooks/useAPI";

const StudentAppointmentHistory = ({ studentData, ProfessorListData }) => {
  const user_id = localStorage.getItem("userId");

  const [scheduledListData, studentScheduledList] = useAPI(
    "GET_STUDENT_SCHEDULE_LIST",
    {
      lazy: true,
    }
  );

  useEffect(() => {
    studentScheduledList({ user_id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentData]);

  const appointmentData = scheduledListData?.data?.studentItems;
 
  return (
    <StyledWrapper>
      <StyledHeading>Upcoming Appointments</StyledHeading>
      {appointmentData?.map((appointment) => {

        const professor = ProfessorListData?.data?.professors?.find(
          (professor) => professor._id === appointment?.professor_id
        );

        const [datePart, timePart] = appointment.startTime.split("T");

        // Extract date components
        const [year, month, day] = datePart.split("-");

        // Extract time components
        // eslint-disable-next-line
        const [time, studentItems] = timePart.split("Z")[0].split(":");

        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const monthName = monthNames[parseInt(month, 10) - 1];

        return (
          <AppointmentContent key={appointment.id}>
            <StyledItemWrapper>
              Date:{" "}
              <StyledDescription>
                {day} {monthName} {year}
              </StyledDescription>
            </StyledItemWrapper>
            <StyledItemWrapper>
              Time: <StyledDescription>{time}:00</StyledDescription>
            </StyledItemWrapper>
            <StyledItemWrapper>
              Professor:{" "}
              <StyledDescription>
                {professor?.name} {professor?.lastname}
              </StyledDescription>
            </StyledItemWrapper>
            <StyledItemWrapper>
              Description:{" "}
              <StyledDescription>{appointment.description}</StyledDescription>
            </StyledItemWrapper>
          </AppointmentContent>
        );
      })}
    </StyledWrapper>
  );
};

export default StudentAppointmentHistory;