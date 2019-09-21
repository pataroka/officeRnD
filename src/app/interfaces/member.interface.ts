import { MemberStatus } from '@enums/member-status.enum';

export interface MemberInterface {
  name: string;
  email: string;
  image: string;
  createdAt: string;
  team: string;
  teamName: string;
  startDate: string;
  office: string;
  officeName: string;
  calculatedStatus: MemberStatus[];
}
