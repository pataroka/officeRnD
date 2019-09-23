import { MemberStatus } from '@enums/member-status.enum';

export interface MemberInterface {
  _id: string;
  name: string;
  email: string;
  image: string;
  createdAt: string;
  team: string;
  teamName: string;
  startDate: any;
  office: string;
  officeName: string;
  calculatedStatus: MemberStatus;
  phone?: string;
}
