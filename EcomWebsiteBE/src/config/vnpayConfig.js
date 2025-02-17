import crypto from "crypto";

export const vnp_PayUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
export const vnp_Returnurl = "http://localhost:3000/checkoutvnpay";
export const vnp_TmnCode = "FYJL2QHA";
export const vnp_HashSecret = "JOWHMKFHFDUHLQQAVQDIJVDNNTDPJSBE";
export const vnp_apiUrl =
  "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";

export const hashAllFields = (fields) => {
  const sortedFields = Object.keys(fields).sort();
  const queryStr = sortedFields.map((key) => `${key}=${fields[key]}`).join("&");

  return hmacSHA512(vnp_HashSecret, queryStr);
};

export const hmacSHA512 = (key, data) => {
  return crypto
    .createHmac("sha512", Buffer.from(key, "utf-8"))
    .update(data, "utf-8")
    .digest("hex");
};

export const getIpAddress = (req) => {
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  return ipAddress;
};

export const getRandomNumber = (len) => {
  const chars = "0123456789";
  let result = "";
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
