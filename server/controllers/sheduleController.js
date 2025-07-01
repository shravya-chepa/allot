const { v4: uuidv4 } = require("uuid");
const { ERRORS } = require("../utilities/errors");
const authorization = require("../utilities/authorization");
const validate = require("../utilities/validate.js");
const isIsoString = require("is-iso-date");
const { AVAILABILITY, ACTIVE } = require("../utilities/constants");
const { isAfter, isBefore, isEqual, add } = require("date-fns");
const ProfessorItem = require("../models/professorItem");
const StudentItem = require("../models/studentItem");

const sendError = (res, error, status = 404) =>
  res.status(status).send({ error });

const { OCCUPATION_STATUS } = require("../utilities/constants");

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

    // IF RECURRING CREATE MEETINGS ON THE SAME DAY FOR 4 WEEKS
    // if (recurring) {
    //     const date_created = new Date().toISOString()
    //     const professorTimeObjects = [{
    //         _id: `PROFESSOR-ITEM-${uuidv4()}`,
    //         parent_id: `PROFESSOR-ITEM-PARENT-${uuidv4()}`,
    //         professor_id: userId,
    //         itemName,
    //         startTime,
    //         endTime,
    //         date_created: date_created,
    //         active: ACTIVE.ACTIVE,
    //         recurring: false
    //     }]

    //     for (const _ of [...Array(4).keys()]) {
    //         const timeObject = professorTimeObjects[professorTimeObjects.length - 1]
    //         const newStartTime = add(new Date(timeObject.startTime), {days: 7})
    //         const newEndTime = add(new Date(timeObject.endTime), {days: 7})
    //         const newId = `PROFESSOR-ITEM-${uuidv4()}`
    //         professorTimeObjects.push({
    //             ...timeObject,
    //             _id: newId,
    //             startTime: newStartTime.toISOString(),
    //             endTime: newEndTime
    //         })
    //     }

    //     professorItems.push(...professorTimeObjects)

    //     return res.send({professorTimeObjects: professorTimeObjects})
    // }

    // const professorTimeObjects = {
    //     _id: `PROFESSOR-ITEM-${uuidv4()}`,
    //     parent_id: `PROFESSOR-ITEM-PARENT-${uuidv4()}`,
    //     professor_id: userId,
    //     itemName,
    //     startTime,
    //     endTime,
    //     date_created: new Date().toISOString(),
    //     active: ACTIVE.ACTIVE,
    //     recurring: recurring
    // }
    // professorItems.push(professorTimeObjects)
    // res.send({professorTimeObjects: professorTimeObjects});

    // --------------
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

    // const itemIdx = professorItems.findIndex(x => x._id === itemId)
    const itemIdx = await ProfessorItem.findOne({
      _id: itemId,
      professor_id: userId,
    });
    if (!itemIdx || itemIdx === -1) {
      return sendError(res, ERRORS.ERROR_ITEM_NOT_FOUND);
    }
    // if (professorItems[itemIdx].professor_id !== userId) {
    //     return sendError(res, ERRORS.ERROR_ITEM_CANNOT_BE_DELETED)
    // }
    if (itemIdx.professor_id.toString() !== userId) {
      return sendError(res, ERRORS.ERROR_ITEM_CANNOT_BE_DELETED);
    }

    // professorItems[itemIdx] = {...professorItems[itemIdx], active: ACTIVE.NOT_ACTIVE}
    await ProfessorItem.updateOne(
      { _id: itemId },
      { active: ACTIVE.NOT_ACTIVE }
    );

    // REMOVE STUDENT ITEMS CREATED ON DELETED PROFESSOR ITEM
    // const studItems = studentItems.filter(x => x.professor_item_id ===  professorItems[itemIdx]._id)
    // studItems.forEach(x => {
    //     const idx = studentItems.findIndex(y => y._id === x._id)
    //     studentItems[idx] = {...studentItems[idx], active: ACTIVE.NOT_ACTIVE}
    // })
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

    // const items = professorItems.filter(x => x.parent_id === itemParentId)
    const items = await ProfessorItem.find({ parent_id: itemParentId });

    if (items.length === 0) {
      return sendError(res, ERRORS.ERROR_ITEM_NOT_FOUND);
    }

    if (items[0].professor_id !== userId) {
      return sendError(res, ERRORS.ERROR_ITEM_CANNOT_BE_DELETED);
    }

    // items.forEach(x => {
    //     const idx = professorItems.findIndex(y => y._id === x._id)
    //     professorItems[idx] = {...professorItems[idx], active: ACTIVE.NOT_ACTIVE}

    //     // REMOVE STUDENT ITEMS CREATED ON DELETED PROFESSOR ITEM
    //     const studItems = studentItems.filter(x => x.professor_item_id ===  professorItems[idx]._id)
    //     studItems.forEach(xx => {
    //         const idxx = studentItems.findIndex(yy => yy._id === xx._id)
    //         studentItems[idxx] = {...studentItems[idxx], active: ACTIVE.NOT_ACTIVE}
    //     })
    // })
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

    // const profItems = professorItems.filter(item => item.professor_id === professorId && item.active === ACTIVE.ACTIVE)
    const profItems = await ProfessorItem.find({
      professor_id: professorId,
      active: ACTIVE.ACTIVE,
    });

    // const studItems = studentItems.filter(item => item.professor_id === professorId && item.active === ACTIVE.ACTIVE)
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

    // const profItem = professorItems.find(x => x._id === professorItemId)
    const profItem = await ProfessorItem.findById(professorItemId);
    if (!profItem) {
      console.log("NO SUCH ITEM");
      return sendError(res, ERRORS.ERROR_INVALID_PROFESSOR_ITEM_ID);
    }

    // const studItems = studentItems.filter(x => x.professor_item_id === professorItemId && x.active === ACTIVE.ACTIVE)
    const studItems = await StudentItem.find({
      professor_item_id: professorItemId,
      active: ACTIVE.ACTIVE,
    });

    // CHECK if date between prof item
    profDateStart = new Date(profItem.startTime);
    profDateEnd = new Date(profItem.endTime);

    // TODO: REWRITE THIS TO MAKE IT MORE READABLE

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
        // const studentTimeObject = {
        //     _id: `STUDENT-ITEM-${uuidv4()}`,
        //     professor_id: profItem.professor_id,
        //     professor_item_id: professorItemId,
        //     student_id: userId,
        //     student_name: verifiedToken.user.name,
        //     student_last_name: verifiedToken.user.lastname,
        //     student_email: verifiedToken.user.email,
        //     startTime: newItemStartTime,
        //     endTime: newItemEndTime,
        //     date_created: new Date().toISOString(),
        //     active: ACTIVE.ACTIVE
        // }
        // studentItems.push(studentTimeObject)

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

    // const itemIdx = studentItems.findIndex(x => x._id === itemId)
    const itemIdx = await StudentItem.findOne({ _id: itemId });

    if (itemIdx === -1) {
      return sendError(res, ERRORS.ERROR_ITEM_NOT_FOUND);
    }

    // if (verifiedToken.user.occupation === OCCUPATION_STATUS.STUDENT && studentItems[itemIdx].student_id !== userId) {
    if (
      verifiedToken.user.occupation === OCCUPATION_STATUS.STUDENT &&
      itemIdx.student_id !== userId
    ) {
      return sendError(res, ERRORS.ERROR_ITEM_CANNOT_BE_DELETED);
    }

    // studentItems[itemIdx] = {...studentItems[itemIdx], active: ACTIVE.NOT_ACTIVE}
    itemIdx.active = false;
    await itemIdx.save();

    res.send({ _id: itemId, status: "Success" });
  } catch (error) {
    console.log(error);
    sendError(res, ERRORS.ERROR_INTERNAL_SERVER_ERROR, 500);
  }
};
