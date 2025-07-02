const { v4: uuid } = require("uuid");
const bcrypt = require("bcryptjs");
const saltRounds = 12;

const { ERRORS } = require("../utilities/errors");
const { OCCUPATION_STATUS } = require("../utilities/constants");
const validate = require("../utilities/validate");
const authorization = require("../utilities/authorization");

const UserItem = require("../models/userItem")

// TODO: TEMPORARY
const users = [];

const sendError = (res, error, status = 404) =>
  res.status(status).send({ error });

exports.register = async (req, res) => {
  try {
    const name = req.body.name;
    const lastname = req.body.lastname;
    const password = req.body.password;
    const email = req.body.email;
    const occupation = req.body.occupation;

    if (!email || !lastname || !password || !name || !occupation)
      return sendError(res, ERRORS.ERROR_FIELDS_MISSING);

    if (!email || !validate.emailRegex(email))
      return sendError(res, ERRORS.ERROR_INVALID_EMAIL);

    // TODO: CHECK IF EMAIL ALREADY EXISTS IN DB
    // const found = users.find((x) => x.email === email);
    const found = await UserItem.findOne({ email }); // shag

    if (found) {
      return sendError(res, ERRORS.ERROR_EMAIL_ALREADY_IN_USE);
    }

    if (!name || !validate.nameRegex(name))
      return sendError(res, ERRORS.ERROR_INVALID_NAME);

    if (!lastname || !validate.nameRegex(name))
      return sendError(res, ERRORS.ERROR_INVALID_LASTNAME);

    if (!password || !validate.fullPasswordValidation(password))
      return sendError(res, ERRORS.ERROR_INVALID_PASSWORD);

    if (
      !occupation ||
      !Object.values(OCCUPATION_STATUS).find((x) => x === occupation)
    ) {
      return sendError(res, ERRORS.ERROR_OCCUPATION_INVALID);
    }

    const new_user = {
      _id: `USER-${uuid()}`,
      name,
      lastname,
      password: bcrypt.hashSync(password, saltRounds),
      email,
      occupation,
      registered_at: new Date().toISOString(),
    };
;
    const user = new UserItem(new_user);
    await user.save();

    res.send({ ...new_user, password: undefined }); // password not send for security reasons
  } catch (error) {
    sendError(res, ERRORS.ERROR_INTERNAL_SERVER_ERROR, 500);
  }
};

exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || typeof email !== "string")
    return sendError(res, ERRORS.ERROR_FIELDS_EMAIL_MALFORMED_OR_MISSING);

  if (!password || typeof password !== "string")
    return sendError(res, ERRORS.ERROR_FIELDS_PASSWORD_MALFORMED_OR_MISSING);

  try {
    // TODO: FIND USER IN DATABASE
    // const user = users.find(x => x.email === email)
    const user = await UserItem.findOne({ email });

    if (!user) {
      console.log("user not found");
      return sendError(res, ERRORS.ERROR_INVALID_EMAIL_OR_PASSWORD);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log("password was not correct");
      return sendError(res, ERRORS.ERROR_INVALID_EMAIL_OR_PASSWORD);
    }

    const jwt = authorization.generateJWT(user);
    res.send({ jwt, userId: user._id });
  } catch (error) {
    sendError(res, ERRORS.ERROR_INTERNAL_SERVER_ERROR, 500);
  }
};

exports.getProfile = async (req, res) => {
  const token = req.get("Authorization");
  const userId = req.params.userId;

  if (!token) return sendError(res, ERRORS.ERROR_TOKEN_MISSING, 401);

  let verifiedToken;
  try {
    verifiedToken = authorization.verifyJWT(token);
    if (verifiedToken.user._id !== userId)
      return sendError(res, ERRORS.ERROR_INVALID_TOKEN);
  } catch (error) {
    return sendError(res, ERRORS.ERROR_INVALID_TOKEN);
  }

  try {
    // const user = users.find(user => user._id === userId)
    const user = await UserItem.findOne({ _id: userId }).lean();

    if (!user) return sendError(res, ERRORS.ERROR_NO_SUCH_USER_FOUND, 404);

    res.send({ ...user, password: undefined });
  } catch (error) {
    return sendError(res, ERRORS.ERROR_INTERNAL_SERVER_ERROR, 500);
  }
};

exports.getProfessors = async (req, res) => {
  const token = req.get("Authorization");

  if (!token) return sendError(res, ERRORS.ERROR_TOKEN_MISSING, 401);
  try {
    authorization.verifyJWT(token);
  } catch (error) {
    return sendError(res, ERRORS.ERROR_INVALID_TOKEN);
  }

  try {
    // const professors = users.filter(user => user.occupation === OCCUPATION_STATUS.PROFESSOR).map(user =>
    //     ({name: user.name, lastname: user.lastname, email: user.email, _id: user._id})
    // )
    const professors = await UserItem.find(
      { occupation: OCCUPATION_STATUS.PROFESSOR },
      { name: 1, lastname: 1, email: 1, _id: 1 }
    );

    res.send({ professors });
  } catch (error) {
    return sendError(res, ERRORS.ERROR_INTERNAL_SERVER_ERROR, 500);
  }
};
