module.exports = (req, res, next) => {
  res.success = (data,message) => {
    res.status(200).json({ status: "success",message, data });
  };
  res.fail = (data) => {
    res.status(400).json({ status: "fail", data });
  };

  res.serverError = (error) => {
    if (error.isJoi) {
      let data = error.details.map((d) => d.message);
      data = data.join(", ");
      console.error(`Error: [${req.method}-${req.url}] ${data}`);
    } else {
      console.log(`ERROR: [${req.method}-${req.url}] ${error}`);
    }
  };
  next();
};
