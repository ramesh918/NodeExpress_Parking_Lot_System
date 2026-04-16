const invoiceService = require("../services/invoice.service");

exports.generateInvoice = async (req, res, next) => {
  try {
    const invoice = await invoiceService.generateInvoice({
      ticketId: req.body.ticketId,
      userId: req.user.id,
    });
    res.status(201).json({ success: true, message: "Invoice generated successfully", data: invoice });
  } catch (err) {
    next(err);
  }
};

exports.createInvoice = async (req, res, next) => {
  try {
    const invoice = await invoiceService.createInvoice(req.body);
    res.status(201).json({ success: true, message: "Invoice created successfully", data: invoice });
  } catch (err) {
    next(err);
  }
};

exports.getAllInvoices = async (req, res, next) => {
  try {
    const invoices = await invoiceService.getAllInvoices();
    res.json({ success: true, data: invoices });
  } catch (err) {
    next(err);
  }
};

exports.getMyInvoices = async (req, res, next) => {
  try {
    const invoices = await invoiceService.getInvoicesByUser(req.user.id);
    res.json({ success: true, data: invoices });
  } catch (err) {
    next(err);
  }
};

exports.getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);
    res.json({ success: true, data: invoice });
  } catch (err) {
    next(err);
  }
};

exports.updateInvoice = async (req, res, next) => {
  try {
    const invoice = await invoiceService.updateInvoice(req.params.id, req.body);
    res.json({ success: true, message: "Invoice updated successfully", data: invoice });
  } catch (err) {
    next(err);
  }
};

exports.payInvoice = async (req, res, next) => {
  try {
    const invoice = await invoiceService.updateInvoice(req.params.id, { status: "PAID" });
    res.json({ success: true, message: "Payment successful. Invoice marked as PAID.", data: invoice });
  } catch (err) {
    next(err);
  }
};

exports.deleteInvoice = async (req, res, next) => {
  try {
    await invoiceService.deleteInvoice(req.params.id);
    res.json({ success: true, message: "Invoice deleted successfully" });
  } catch (err) {
    next(err);
  }
};
