import {
  vnp_PayUrl,
  vnp_TmnCode,
  vnp_HashSecret,
  vnp_Returnurl,
  hashAllFields,
  getIpAddress,
  getRandomNumber,
  hmacSHA512,
} from "./vnpayConfig.js";
import { format } from "date-fns";

export const createOrderService = (req, amount, orderInfo, returnUrl) => {
  const vnp_Version = "2.1.0";
  const vnp_Command = "pay";
  const vnp_TxnRef = getRandomNumber(8);
  const vnp_IpAddr = getIpAddress(req);
  const orderType = "order-type";

  const vnp_Params = {
    vnp_Version,
    vnp_Command,
    vnp_TmnCode,
    vnp_Amount: (amount * 100).toString(),
    vnp_CurrCode: "VND",
    vnp_TxnRef,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: orderType,
    vnp_Locale: "vn",
    vnp_ReturnUrl: `${vnp_Returnurl}`,
    vnp_IpAddr,
    vnp_CreateDate: format(new Date(), "yyyyMMddHHmmss"),
    vnp_ExpireDate: format(new Date(Date.now() + 15 * 60000), "yyyyMMddHHmmss"), // Expires in 15 minutes
  };

  const sortedFields = Object.keys(vnp_Params).sort();
  const queryString = sortedFields
    .map((key) => `${key}=${encodeURIComponent(vnp_Params[key])}`)
    .join("&");
  const secureHash = hmacSHA512(vnp_HashSecret, queryString);

  return `${vnp_PayUrl}?${queryString}&vnp_SecureHash=${secureHash}`;
};

export const orderReturnService = (req) => {
  const fields = Object.fromEntries(
    Object.entries(req.query).map(([key, value]) => [
      key,
      encodeURIComponent(value),
    ])
  );

  const vnp_SecureHash = fields.vnp_SecureHash;
  delete fields.vnp_SecureHash;
  delete fields.vnp_SecureHashType;

  const signValue = hashAllFields(fields);
  if (signValue === vnp_SecureHash) {
    return req.query.vnp_TransactionStatus === "00" ? 1 : 0;
  }
  return -1;
};
