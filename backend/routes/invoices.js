const express = require("express");
const router = express.Router();
const {
  getAllInvoices,
  getInvoiceById,
  getInvoicesByCustomer,
  createInvoice
} = require("../controllers/invoiceController");

router.get("/customer/:customerId", getInvoicesByCustomer);
router.get("/:invoiceId",           getInvoiceById);
router.get("/",                     getAllInvoices);
router.post("/",                    createInvoice);

module.exports = router;