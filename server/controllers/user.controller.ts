import { Response } from "express";
import {
  BASE_PATH_COMPLETE,
  PROFILE_PICS_DIR_NAME,
  STATIC_PATH,
} from "../config";
import path from "path";
import EmailVerification from "../models/emailVerification.model.";
import ForgotPassword from "../models/forgotPassword.model";
import RefreshToken from "../models/refreshTokens.model";
import User from "../models/user.model";
import Space from "../models/space.model";
import mongoose from "mongoose";
import { SPACE_MEMBER_ROLES } from "../types/constants";

// DELETE /users
export const deleteCurrentUser = async (req: any, res: Response) => {
  try {
    const user = req.user;
    const { password } = req.body;

    if (user.emailVerified === false) {
      return res.status(403).send({
        success: false,
        data: {},
        message: "Verify your email first.",
        statusCode: 403,
      });
    }

    if (user.isOAuth === false) {
      if (!password) {
        return res.status(400).send({
          success: false,
          data: {},
          message: "Password is required",
          statusCode: 400,
        });
      }

      const userExists = await User.findOne({ _id: user._id }).select(
        "password"
      );

      if (!(await userExists.comparePassword(password))) {
        return res.status(400).send({
          success: false,
          data: {},
          message: "Invalid password",
          statusCode: 400,
        });
      }
    }

    await EmailVerification.deleteOne({ userId: user._id });
    await ForgotPassword.deleteOne({ userId: user._id });
    await RefreshToken.deleteOne({ userId: user._id });

    // remove all things related to this user -> PENDING

    await User.deleteOne({ _id: user._id });

    res.send({
      success: true,
      data: {},
      message: "Your account has been deleted successfully!",
      statusCode: 200,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      data: {},
      message: "Oops, something went wrong!",
      statusCode: 500,
    });
  }
};

// GET /users/getCurrentUser
export const getCurrentUser = async (req: any, res: Response) => {
  try {
    const user = req.user;

    res.send({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        isOAuth: user.isOAuth,
        email: user.email,
        emailVerified: user.emailVerified,
        profile: user.profile.includes("http")
          ? user.profile
          : BASE_PATH_COMPLETE +
            path.join(STATIC_PATH, PROFILE_PICS_DIR_NAME, user.profile),
      },
      message: "",
      statusCode: 200,
    });
  } catch {
    res.status(500).send({
      success: false,
      data: {},
      message: "Oops, something went wrong!",
      statusCode: 500,
    });
  }
};

// GET /users/search?q=query search users
export const searchUser = async (req: any, res: Response) => {
  try {
    const { q, spaceId } = req.query;

    if (!q) {
      return res.status(400).send({
        success: false,
        data: {},
        message: "Query string is required",
        statusCode: 400,
      });
    }

    // find other users except current searching user
    let otherUsers = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } },
          ],
        },
        {
          _id: { $ne: req.user._id },
          emailVerified: true,
        },
      ],
    })
      .lean()
      .select("_id username profile");

    // if valid spaceId
    if (spaceId && mongoose.isValidObjectId(spaceId)) {
      const space = await Space.findOne({
        _id: spaceId,
        members: {
          $elemMatch: {
            memberId: req.user._id,
            role: SPACE_MEMBER_ROLES.ADMIN,
          },
        },
      })
        .select("_id members")
        .lean();

      if (space && space.members.length > 0) {
        otherUsers = otherUsers.map((u: any) => {
          if (
            space.members
              .map((m: any) => m.memberId.toString())
              .includes(u._id.toString())
          ) {
            return {
              ...u,
              isMember: true,
            };
          }

          return {
            ...u,
            isMember: false,
          };
        });
      }
    }

    res.send({
      success: true,
      data: otherUsers.map((user) => {
        return {
          ...user,
          profile: user.profile.includes("http")
            ? user.profile
            : BASE_PATH_COMPLETE +
              path.join(STATIC_PATH, PROFILE_PICS_DIR_NAME, user.profile),
        };
      }),
      message: "",
      statusCode: 200,
    });
  } catch {
    res.status(500).send({
      success: false,
      data: {},
      message: "Oops, something went wrong!",
      statusCode: 500,
    });
  }
};
