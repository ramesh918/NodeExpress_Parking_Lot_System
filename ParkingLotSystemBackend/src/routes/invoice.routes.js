const express = require("express");
const router = express.Router();

const invoiceController = require("../controllers/invoice.controller");
const authMiddleware = require("../middleware/authentication.middleware");
const { authorizeResource } = require("../middleware/authorization.middleware");
const validate = require("../middleware/validate.middleware");
const {
  createInvoiceSchema,
  updateInvoiceSchema,
  invoiceIdParamSchema,
} = require("../validations/invoice.validation");

// All routes require authentication
router.use(authMiddleware);

// Auto-generate invoice from a completed ticket (any user for their own ticket)
router.post("/generate", invoiceController.generateInvoice);

// Manual invoice creation — only roles with CREATE access on INVOICE
router.post(
  "/",
  authorizeResource("INVOICE", "CREATE"),
  validate(createInvoiceSchema),
  invoiceController.createInvoice
);

// Get my invoices (logged-in user's invoices)
router.get("/my", invoiceController.getMyInvoices);

// Only roles with READ access on INVOICE can list all invoices
router.get(
  "/",
  authorizeResource("INVOICE", "READ"),
  invoiceController.getAllInvoices
);

router.get(
  "/:id",
  validate(invoiceIdParamSchema, "params"),
  invoiceController.getInvoiceById
);

// Any user can update their invoice (e.g., mark as PAID)
router.patch(
  "/:id",
  validate(invoiceIdParamSchema, "params"),
  validate(updateInvoiceSchema),
  invoiceController.updateInvoice
);

// Only roles with DELETE access on INVOICE can delete
router.delete(
  "/:id",
  authorizeResource("INVOICE", "DELETE"),
  validate(invoiceIdParamSchema, "params"),
  invoiceController.deleteInvoice
);

module.exports = router;
