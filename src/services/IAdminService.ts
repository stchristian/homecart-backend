import { User } from "../models/User";

export interface IAdminService {
  acceptCourierApplication(userId: string): Promise<User>;
  rejectCourierApplication(userId: string): Promise<User>;
  getCourierApplicants(): Promise<User[]>;
}
