import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { DataService } from '@services/data.service';
import { MemberInterface } from '@interfaces/member.interface';
import { BehaviorSubject } from '@node_modules/rxjs';
import { OfficeInterface } from '@interfaces/office.interface';
import { TeamInterface } from '@interfaces/team.interface';
import { Observable } from '@node_modules/rxjs';
import { of } from '@node_modules/rxjs';
import { tap } from '@node_modules/rxjs/internal/operators';
import { forkJoin } from '@node_modules/rxjs';
import { MEMBER_COL_DEF } from '@column-definitions/member-table';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {
    public title = 'officeRnD';

    public members$: BehaviorSubject<MemberInterface[]> = new BehaviorSubject<MemberInterface[]>([]);

    public offices: OfficeInterface[] = [];

    public teams: TeamInterface[] = [];

    public colDef: any[] = MEMBER_COL_DEF;

    public constructor(private data: DataService) {
    }

    public ngOnInit(): void {
        this.getMembers();
    }

    private getMembers(): void {
        const offices$: Observable<OfficeInterface[]> = this.offices.length ? of(this.offices) : this.getOffices();
        const teams$: Observable<TeamInterface[]> = this.teams.length ? of(this.teams) : this.getTeams();

        forkJoin([ this.data.getMembers(), offices$, teams$ ])
            .subscribe(([ members, offices, teams ]: [ MemberInterface[], OfficeInterface[], TeamInterface[] ]) => {
                members.forEach((member: MemberInterface) => {
                   member.officeName = (offices.find((office: OfficeInterface) => office._id === member.office) || {} as any).name;
                   member.teamName = (teams.find((team: TeamInterface) => team._id === member.team) || {} as any).name;
                });

                this.members$.next((members));
        });
    }

    private getOffices(): Observable<OfficeInterface[]> {
        return this.data.getOffices().pipe(tap((response: OfficeInterface[]) => this.offices = response));
    }

    private getTeams(): Observable<TeamInterface[]> {
        return this.data.getTeams().pipe(tap((response: TeamInterface[]) => this.teams = response));
    }
}
