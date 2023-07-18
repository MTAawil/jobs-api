const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userID });
  res
    .status(StatusCodes.OK)
    .json({ NumberOfJobs: jobs.length, user: req.user.name, jobs });
};
const getJob = async (req, res) => {
  const {
    user: { userID },
    params: { id },
  } = req;
  const job = await Job.findOne({ _id: id, createdBy: userID });
  if (!job) throw new NotFoundError("invalid Job ID ");
  res.status(StatusCodes.OK).json({ job });
};
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userID;
  const { company, position } = req.body;
  if (company === "" || position === "")
    throw new BadRequestError("please fill all fields");
  const job = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({ job });
};
const deleteJob = async (req, res) => {
  const {
    user: { userID },
    params: { id },
  } = req;
  const job = await Job.findOneAndRemove({ _id: id, createdBy: userID });
  if (!job) throw new NotFoundError("invalid Job ID ");

  res.status(StatusCodes.OK).json(`job with id ${userID} is deleted`);
};
const updateJob = async (req, res) => {
  const {
    user: { userID },
    params: { id },
    body: { company, position },
  } = req;
  if (company === "" || position === "")
    throw new BadRequestError("please fill all fields");
  console.log(company);
  const job = await Job.findOneAndUpdate(
    { _id: id, createdBy: userID },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!job) throw new NotFoundError("invalid Job ID ");

  res.status(StatusCodes.OK).json({ job });
};

module.exports = { updateJob, deleteJob, createJob, getJob, getAllJobs };
