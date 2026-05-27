import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { validateRequest } from "../middlewares/validate.js";
import { profileRoleParamsSchema, profileUpdateSchema } from "../validators/apiSchemas.js";
import { getProfile, getProfileActivity, updateProfile } from "../controllers/profileController.js";

const router = express.Router();

router.get("/:role", validateRequest({ params: profileRoleParamsSchema }), asyncHandler(getProfile));
router.get("/:role/activity", validateRequest({ params: profileRoleParamsSchema }), asyncHandler(getProfileActivity));
router.patch("/:role", validateRequest({ params: profileRoleParamsSchema, body: profileUpdateSchema }), asyncHandler(updateProfile));

export default router;
