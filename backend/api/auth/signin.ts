import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { addUserToDB } from "../../util";
import { StatusCodes } from "http-status-codes";
import { ReturnType } from "../../constants";

async function SigninApi(
  req: Request<{}, any, any, ParsedQs, Record<string, any>>,
  res: Response<any, Record<string, any>, number>
) {
  try {
    if (req.body && req.body.name && req.body.password) {
      const queryStatus: { ret: ReturnType; msg: string } = await addUserToDB({
        name: req.body.name,
        password: req.body.password,
      });
      if (
        (queryStatus.ret as ReturnType) === (ReturnType.SUCCESS as ReturnType)
      ) {
        res.statusCode = StatusCodes.OK;
        res.send({ msg: "User Created Successfylly!! Please Login" });
      } else if (
        (queryStatus.ret as ReturnType) ===
        (ReturnType.VALIDATION_ERROR as ReturnType)
      ) {
        res.statusCode = StatusCodes.BAD_REQUEST;
        res.send({ msg: queryStatus.msg });
      } else {
        res.statusCode == StatusCodes.CONFLICT;
        res.send({ msg: "User already exist" });
      }
    } else {
      res.statusCode = StatusCodes.BAD_REQUEST;
      res.send({ msg: "Please send valid UserName/Password" });
    }
  } catch (error) {
    console.log(error);
    res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    res.send({ msg: "Internal server Error" });
  }
}

export default SigninApi;