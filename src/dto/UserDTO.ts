import * as yup from "yup";

export interface UserDTO {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  biography?: string;
}

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const createUserInputValidator = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  phoneNumber: yup.string().matches(phoneRegExp, "Phone number is not valid"),
  biography: yup.string().max(300),
});

export type CreateUserInput = yup.InferType<typeof createUserInputValidator>;
