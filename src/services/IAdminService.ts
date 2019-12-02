import { User } from "../models/User";

export interface IAdminService {
  acceptCourierApplication(userId: string): Promise<void>;
  rejectCourierApplication(userId: string): Promise<void>;
  getCourierApplicants(): Promise<User[]>;
}
