const feeService = require("../services/fee.service");

exports.createFee = async (req, res, next) => {
  try {
    const fee = await feeService.createFee(req.body);
    res.status(201).json({ success: true, message: "Fee created successfully", data: fee });
  } catch (err) {
    next(err);
  }
};

exports.getAllFees = async (req, res, next) => {
  try {
    const fees = await feeService.getAllFees();
    res.json({ success: true, data: fees });
  } catch (err) {
    next(err);
  }
};

exports.getFeeById = async (req, res, next) => {
  try {
    const fee = await feeService.getFeeById(req.params.id);
    res.json({ success: true, data: fee });
  } catch (err) {
    next(err);
  }
};

exports.updateFee = async (req, res, next) => {
  try {
    const fee = await feeService.updateFee(req.params.id, req.body);
    res.json({ success: true, message: "Fee updated successfully", data: fee });
  } catch (err) {
    next(err);
  }
};

exports.deleteFee = async (req, res, next) => {
  try {
    await feeService.deleteFee(req.params.id);
    res.json({ success: true, message: "Fee deleted successfully" });
  } catch (err) {
    next(err);
  }
};
