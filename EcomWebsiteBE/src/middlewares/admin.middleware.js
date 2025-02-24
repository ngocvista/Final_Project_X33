import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";

const checkAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user || user.role !== "ADMIN") {
      return res
        .status(403)
        .send(new ApiResponse(403, null, "Access denied. Admins only."));
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).send(new ApiResponse(500, null, "Internal server error"));
  }
};

export { checkAdmin };
