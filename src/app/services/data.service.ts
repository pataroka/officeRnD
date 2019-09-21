import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MemberInterface } from '@interfaces/member.interface';
import { Observable } from '@node_modules/rxjs';
import { environment } from '@environment/environment';
import { TeamInterface } from '@interfaces/team.interface';
import { OfficeInterface } from '@interfaces/office.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly MEMBERS_URL: string = `${environment.apiUrl}/members`;

  private readonly TEAMS_URL: string = `${environment.apiUrl}/teams`;

  private readonly OFFICES_URL: string = `${environment.apiUrl}/offices`;

  public constructor(private http: HttpClient) { }

  public getMembers(): Observable<MemberInterface[]> {
    return this.http.get<MemberInterface[]>(this.MEMBERS_URL);
  }

  public getTeams(): Observable<TeamInterface[]> {
    return this.http.get<TeamInterface[]>(this.TEAMS_URL);
  }

  public getOffices(): Observable<OfficeInterface[]> {
    return this.http.get<OfficeInterface[]>(this.OFFICES_URL);
  }

}
