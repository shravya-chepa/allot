const { v4: uuidv4 } = require("uuid");
const { ERRORS } = require("../utilities/errors");
const authorization = require("../utilities/authorization");
const validate = require("../utilities/validate.js");
const isIsoString = require("is-iso-date");
const { AVAILABILITY, ACTIVE } = require("../utilities/constants");
const { isAfter, isBefore, isEqual, add } = require("date-fns");
const ProfessorItem = require("../models/professorItem");
const StudentItem = require("../models/studentItem");

const sendEmail = require("../utilities/sendEmail");

const sendError = (res, error, status = 404) =>
  res.status(status).send({ error });

const { OCCUPATION_STATUS } = require("../utilities/constants");
const User = require("../models/userItem.js");

const professorItems = [];
const studentItems = [];

exports.addProfessorItem = async (req, res) => {
  const userId = req.params.userId;
  const itemName = req.body.item_name;
  const recurring = req.body.recurring;
  let startTime = req.body.start_time;
  startTime = new Date(startTime);
  // set end time is 1 hour after the start time
  let endTime = new Date(startTime);
  endTime.setHours(endTime.getHours() + 1);
  endTime = endTime.toISOString();
  startTime = startTime.toISOString();

  try {
    const token = req.get("Authorization");

    let verifiedToken;
    if (!token) return sendError(res, ERRORS.ERROR_TOKEN_MISSING, 401);
    try {
      verifiedToken = authorization.verifyJWT(token);
      if (verifiedToken.user._id !== userId)
        return sendError(res, ERRORS.ERROR_INVALID_TOKEN);
      if (verifiedToken.user.occupation !== OCCUPATION_STATUS.PROFESSOR)
        return sendError(res, ERRORS.ERROR_INVALID_TOKEN);
    } catch (error) {
      return sendError(res, ERRORS.ERROR_INVALID_TOKEN);
    }

    if (!itemName) {
      return sendError(res, ERRORS.ERROR_MISSING_ITEM_NAME);
    }

    if (recurring === undefined || typeof recurring !== "boolean") {
      return sendError(res, ERRORS.ERROR_MISSING_FIELD_RECURRING);
    }

    if (!startTime || !isIsoString(startTime)) {
      return sendError(res, ERRORS.ERROR_INVALID_START_TIME);
    }

    if (!endTime || !isIsoString(endTime)) {
      return sendError(res, ERRORS.ERROR_INVALID_START_TIME);
    }

    const newStartTime = new Date(startTime);
    const newEndTime = new Date(endTime);

    if (
      isAfter(newStartTime, newEndTime) ||
      isEqual(newEndTime, newStartTime)
    ) {
      return sendError(res, ERRORS.ERROR_INVALID_START_TIME);
    }

    const professorItem = new ProfessorItem({
      _id: `PROFESSOR-ITEM-${uuidv4()}`,
      parent_id: `PROFESSOR-ITEM-PARENT-${uuidv4()}`,
      professor_id: userId,
      itemName,
      startTime,
      endTime,
      date_created: new Date().toISOString(),
      active: ACTIVE.ACTIVE,
      recurring,
    });

    if (recurring) {
      const professorTimeObjects = [];
      for (let i = 0; i < 4; i++) {
        const newStartTime = add(new Date(startTime), { days: 7 * i });
        const newEndTime = add(new Date(endTime), { days: 7 * i });
        const obj = {
          _id: `PROFESSOR-ITEM-${uuidv4()}`,
          parent_id: `PROFESSOR-ITEM-PARENT-${uuidv4()}`,
          professor_id: userId,
          itemName,
          startTime: newStartTime,
          endTime: newEndTime,
          date_created: new Date().toISOString(),
          active: ACTIVE.ACTIVE,
          recurring: false,
        };
        const recurringItem = new ProfessorItem(obj);
        professorTimeObjects.push(recurringItem);
      }

      await ProfessorItem.insertMany(professorTimeObjects);
      return res.send({ professorTimeObjects });
    }

    const savedProfessorItem = await professorItem.save();
    res.send({ professorTimeObjects: savedProfessorItem });
  } catch (error) {
    console.log(error);
    sendError(res, ERRORS.ERROR_INTERNAL_SERVER_ERROR, 500);
  }
};

exports.removeProfessorItem = async (req, res) => {
  const userId = req.params.userId;
  const itemId = req.body.itemId;

  try {
    const token = req.get("Authorization");
    let verifiedToken;
    if (!token) return sendError(res, ERRORS.ERROR_TOKEN_MISSING, 401);
    try {
      verifiedToken = authorization.verifyJWT(token);
      if (verifiedToken.user._id !== userId)
        return sendError(res, ERRORS.ERROR_INVALID_TOKEN);
      if (verifiedToken.user.occupation !== OCCUPATION_STATUS.PROFESSOR)
        return sendError(res, ERRORS.ERROR_INVALID_TOKEN);
    } catch (error) {
      return sendError(res, ERRORS.ERROR_INVALID_TOKEN);
    }

    if (!itemId) {
      return sendError(res, ERRORS.ERROR_MISSING_FIELD_ITEM_ID);
    }

    const itemIdx = await ProfessorItem.findOne({
      _id: itemId,
      professor_id: userId,
    });
    if (!itemIdx || itemIdx === -1) {
      return sendError(res, ERRORS.ERROR_ITEM_NOT_FOUND);
    }

    if (itemIdx.professor_id.toString() !== userId) {
      return sendError(res, ERRORS.ERROR_ITEM_CANNOT_BE_DELETED);
    }

    await ProfessorItem.updateOne(
      { _id: itemId },
      { active: ACTIVE.NOT_ACTIVE }
    );

    await StudentItem.updateMany(
      { professor_item_id: itemIdx },
      { active: ACTIVE.NOT_ACTIVE }
    );

    res.send({ _id: itemId, status: "Success" });
  } catch (error) {
    console.log(error);
    sendError(res, ERRORS.ERROR_INTERNAL_SERVER_ERROR, 500);
  }
};

exports.removeProfessorRecurringItem = async (req, res) => {
  const userId = req.params.userId;
  const itemParentId = req.body.itemParentId;

  try {
    const token = req.get("Authorization");
    let verifiedToken;
    if (!token) return sendError(res, ERRORS.ERROR_TOKEN_MISSING, 401);
    try {
      verifiedToken = authorization.verifyJWT(token);
      if (verifiedToken.user._id !== userId)
        return sendError(res, ERRORS.ERROR_INVALID_TOKEN);
      if (verifiedToken.user.occupation !== OCCUPATION_STATUS.PROFESSOR)
        return sendError(res, ERRORS.ERROR_INVALID_TOKEN);
    } catch (error) {
      return sendError(res, ERRORS.ERROR_INVALID_TOKEN);
    }

    if (!itemParentId) {
      return sendError(res, ERRORS.ERROR_MISSING_FIELD_ITEM_PARENT_ID);
    }

    const items = await ProfessorItem.find({ parent_id: itemParentId });

    if (items.length === 0) {
      return sendError(res, ERRORS.ERROR_ITEM_NOT_FOUND);
    }

    if (items[0].professor_id !== userId) {
      return sendError(res, ERRORS.ERROR_ITEM_CANNOT_BE_DELETED);
    }

    for (const item of items) {
      await ProfessorItem.updateOne({ _id: item._id }, { active: false });

      // Remove associated student items
      await StudentItem.updateMany(
        { professor_item_id: item._id },
        { active: false }
      );
    }

    res.send({ parent_id: itemParentId, status: "Success" });
  } catch (error) {
    console.log(error);
    sendError(res, ERRORS.ERROR_INTERNAL_SERVER_ERROR, 500);
  }
};

exports.getProfAndStudItems = async (req, res) => {
  const professorId = req.params.professorId;

  try {
    const token = req.get("Authorization");

    if (!token) return sendError(res, ERRORS.ERROR_TOKEN_MISSING, 401);

    try {
      authorization.verifyJWT(token);
    } catch (error) {
      return sendError(res, ERRORS.ERROR_INVALID_TOKEN);
    }

    const profItems = await ProfessorItem.find({
      professor_id: professorId,
      active: ACTIVE.ACTIVE,
    });

    const studItems = await StudentItem.find({
      professor_id: professorId,
      active: ACTIVE.ACTIVE,
    });

    res.send({ professorItems: profItems, studentItems: studItems });
  } catch (error) {
    console.log(error);
    sendError(res, ERRORS.ERROR_INTERNAL_SERVER_ERROR, 500);
  }
};

exports.addStudentItem = async (req, res) => {
  const userId = req.params.userId;

  try {
    const token = req.get("Authorization");
    let verifiedToken;
    if (!token) return sendError(res, ERRORS.ERROR_TOKEN_MISSING, 401);
    try {
      verifiedToken = authorization.verifyJWT(token);
      if (verifiedToken.user._id !== userId)
        return sendError(res, ERRORS.ERROR_INVALID_TOKEN);
      if (verifiedToken.user.occupation !== OCCUPATION_STATUS.STUDENT)
        return sendError(res, ERRORS.ERROR_INVALID_TOKEN);
    } catch (error) {
      return sendError(res, ERRORS.ERROR_INVALID_TOKEN);
    }

    const professorItemId = req.body.professorItemId;

    if (!professorItemId) {
      return sendError(res, ERRORS.ERROR_INVALID_PROFESSOR_ITEM_ID);
    }

    // TODO: IF WE WANT TO LIMIT THE AMOUNT OF TIME FOR STUDENTS MEETING PROFESSORS ADD VALIDATION HERE
    let startTime = req.body.startTime;
    if (!startTime || !isIsoString(startTime)) {
      return sendError(res, ERRORS.ERROR_INVALID_START_TIME);
    }

    startTime = new Date(startTime);
    // set end time is 1 hour after the start time
    let endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1);
    endTime = endTime.toISOString();
    startTime = startTime.toISOString();
    if (!endTime || !isIsoString(endTime)) {
      return sendError(res, ERRORS.ERROR_INVALID_START_TIME);
    }

    const description = req.body.description;
    if (!description) {
      return sendError(res, ERRORS.ERROR_INVALID_FIELD_DESCRIPTION);
    }

    newItemStartTime = new Date(startTime);
    newItemEndTime = new Date(endTime);

    if (
      isAfter(newItemStartTime, newItemEndTime) ||
      isEqual(newItemEndTime, newItemStartTime)
    ) {
      return sendError(res, ERRORS.ERROR_INVALID_START_TIME);
    }

    const profItem = await ProfessorItem.findById(professorItemId);
    if (!profItem) {
      console.log("NO SUCH ITEM");
      return sendError(res, ERRORS.ERROR_INVALID_PROFESSOR_ITEM_ID);
    }

    const studItems = await StudentItem.find({
      professor_item_id: professorItemId,
      active: ACTIVE.ACTIVE,
    });

    // CHECK if date between prof item
    profDateStart = new Date(profItem.startTime);
    profDateEnd = new Date(profItem.endTime);

    // FIRST CHECK IF THE NEW TIME IS BETWEEN THE PROFESSORS AVAILABLE TIME
    if (
      (isAfter(newItemStartTime, profDateStart) ||
        isEqual(newItemStartTime, profDateStart)) &&
      (isBefore(newItemEndTime, profDateEnd) ||
        isEqual(newItemEndTime, profDateEnd))
    ) {
      // NOW CHECK IF THE NEW TIME FRAME IS NOT OVERLAPPING WITH THE OTHER STUDENTS TIME FRAMES
      if (
        studItems.every((studItem) => {
          studItemStartTime = new Date(studItem.startTime);
          studItemEndTime = new Date(studItem.endTime);
          return (
            isAfter(newItemStartTime, studItemEndTime) ||
            isEqual(newItemStartTime, studItemEndTime) ||
            isBefore(newItemEndTime, studItemStartTime) ||
            isEqual(newItemEndTime, studItemStartTime)
          );
        })
      ) {
        const studentTimeObject = new StudentItem({
          _id: `STUDENT-ITEM-${uuidv4()}`,
          professor_id: profItem.professor_id,
          professor_item_id: professorItemId,
          student_id: userId,
          student_name: verifiedToken.user.name,
          student_last_name: verifiedToken.user.lastname,
          student_email: verifiedToken.user.email,
          startTime: newItemStartTime,
          endTime: newItemEndTime,
          description: description,
          date_created: new Date().toISOString(),
          active: ACTIVE.ACTIVE,
        });

        const savedStudentItem = await studentTimeObject.save();

        // format times
        const formattedStartTime = newItemStartTime.toLocaleString();
        const formattedEndTime = newItemEndTime.toLocaleString();

        // send email to professor
        const professor = await User.findOne({
          _id: profItem.professor_id,
        });

        if (professor) {
          await sendEmail({
            to: professor.email,
            subject: "New Appointment Booked",
            text: `Hi ${professor.name}, \n\n A student (${verifiedToken.user.name} ${verifiedToken.user.lastname}) has booked an appointment with you from ${formattedStartTime} to ${formattedEndTime}`,
            html: `<p>Hi ${professor.name}</p><p>Student <strong>${verifiedToken.user.name} ${verifiedToken.user.lastname}</strong> has booked an appointment with you from <strong>${formattedStartTime}</strong> to <strong>${formattedEndTime}</strong>.</p>`,
          });
        }

        // send email to student
        await sendEmail({
          to: verifiedToken.user.email,
          subject: "Appointment Confirmed",
          text: `Hi ${verifiedToken.user.name},\n\nYour appointment has been booked from ${formattedStartTime} to ${formattedEndTime} with ${professor.name} ${professor.lastname}.`,
          html: `<p>Hi <strong>${verifiedToken.user.name}</strong>,</p>
             <p>Your appointment with ${professor.name} ${professor.lastname} has been confirmed from <strong>${formattedStartTime}</strong> to <strong>${formattedEndTime}</strong>.</p>`,
        });

        res.send(studentTimeObject);
      } else {
        return sendError(res, ERRORS.ERROR_INVALID_TIME_FRAME);
      }
    } else {
      // IF WE ARE NOT IN BOUNDS RETURN ERROR
      return sendError(res, ERRORS.ERROR_INVALID_TIME_FRAME);
    }
  } catch (error) {
    console.log(error);
    sendError(res, ERRORS.ERROR_INTERNAL_SERVER_ERROR, 500);
  }
};

exports.getStudentItems = async (req, res) => {
  const userId = req.params.userId;

  try {
    const token = req.get("Authorization");
    let verifiedToken;
    if (!token) return sendError(res, ERRORS.ERROR_TOKEN_MISSING, 401);
    try {
      verifiedToken = authorization.verifyJWT(token);
      if (verifiedToken.user._id !== userId)
        return sendError(res, ERRORS.ERROR_INVALID_TOKEN);
    } catch (error) {
      return sendError(res, ERRORS.ERROR_INVALID_TOKEN);
    }

    // const itemIdx = studentItems.findIndex(x => x._id === itemId)
    const items = await StudentItem.find({
      student_id: userId,
      active: ACTIVE.ACTIVE,
    });

    res.send({ studentItems: items });
  } catch (error) {
    console.log(error);
    sendError(res, ERRORS.ERROR_INTERNAL_SERVER_ERROR, 500);
  }
};

exports.removeStudentItem = async (req, res) => {
  const userId = req.params.userId;
  const itemId = req.body.itemId;

  try {
    const token = req.get("Authorization");
    let verifiedToken;
    if (!token) return sendError(res, ERRORS.ERROR_TOKEN_MISSING, 401);
    try {
      verifiedToken = authorization.verifyJWT(token);
      if (verifiedToken.user._id !== userId)
        return sendError(res, ERRORS.ERROR_INVALID_TOKEN);
    } catch (error) {
      return sendError(res, ERRORS.ERROR_INVALID_TOKEN);
    }

    if (!itemId) {
      return sendError(res, ERRORS.ERROR_MISSING_FIELD_ITEM_ID);
    }

    const itemIdx = await StudentItem.findOne({ _id: itemId });

    if (itemIdx === -1) {
      return sendError(res, ERRORS.ERROR_ITEM_NOT_FOUND);
    }

    if (
      verifiedToken.user.occupation === OCCUPATION_STATUS.STUDENT &&
      itemIdx.student_id !== userId
    ) {
      return sendError(res, ERRORS.ERROR_ITEM_CANNOT_BE_DELETED);
    }

    itemIdx.active = false;
    await itemIdx.save();

    res.send({ _id: itemId, status: "Success" });
  } catch (error) {
    console.log(error);
    sendError(res, ERRORS.ERROR_INTERNAL_SERVER_ERROR, 500);
  }
};
