const HttpStatusCode = require("./HttpStatusCode.js");

const APIResponse = (response, httpstatuscode, resultstatus, data, message) => {
  const responseData = {
    result: resultstatus,
    data: data,
    message: message,
  };

  if (httpstatuscode == HttpStatusCode.INTERNAL_SERVER) {
    response.sendStatus(HttpStatusCode.INTERNAL_SERVER);
  } else {
    response.status(httpstatuscode).json(responseData);
  }
};

module.exports = { APIResponse };
