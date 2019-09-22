import { Component, OnDestroy } from '@angular/core';
import { Observable } from '@node_modules/rxjs';
import { of } from '@node_modules/rxjs';
import { forkJoin } from '@node_modules/rxjs';
import { Subject } from '@node_modules/rxjs';
import { MemberInterface } from '@interfaces/member.interface';
import { OfficeInterface } from '@interfaces/office.interface';
import { TeamInterface } from '@interfaces/team.interface';
import { MEMBER_COL_DEF } from '@column-definitions/member-table';
import { DataService } from '@services/data.service';
import { tap } from '@node_modules/rxjs/internal/operators';
import { takeUntil } from '@node_modules/rxjs/internal/operators';
import { take } from '@node_modules/rxjs/internal/operators';
import { MemberStatus } from '@enums/member-status.enum';

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: [ './grid.component.scss' ]
})
export class GridComponent implements OnDestroy {
    private gridApi;

    private endSubscriptions$: Subject<boolean> = new Subject();

    public members: MemberInterface[] = [];
    public leadMembers: number;
    public dropInMembers: number;
    public activeMembers: number;
    public formerMembers: number;

    public offices: OfficeInterface[] = [];

    public teams: TeamInterface[] = [];

    public colDef: any[] = MEMBER_COL_DEF;

    public memberStatus: typeof MemberStatus = MemberStatus;

    public activeStatusFilter: MemberStatus = null;

    public locationFilter: string = null;
    public teamFilter: string = null;
    public quickFilter: string = null;
    public filtersActive = false;

    public constructor(private data: DataService) {
    }

    public ngOnDestroy(): void {
        this.endSubscriptions$.next(true);
        this.endSubscriptions$.complete();
    }

    public setStatusFilter(status: MemberStatus = null): void {
        const oldFilterModel: any = this.gridApi.getFilterModel();
        this.gridApi.setFilterModel({
            ...oldFilterModel,
            calculatedStatus: { type: 'contains', filter: status }
        });

        this.activeStatusFilter = status;
    }

    public setLocationFilter(location: string = null): void {
        this.locationFilter = location;
        this.triggerFilters();
    }

    public setTeamFilter(team: string = null): void {
        this.teamFilter = team;
        this.triggerFilters();
    }

    public setQuickFilter(searchValue: string) {
        this.quickFilter = searchValue;
        this.triggerFilters();
    }

    public toggleFilters(): void {
        this.filtersActive = !this.filtersActive;
        this.triggerFilters();
    }

    private triggerFilters() {
        const oldFilterModel: any = this.gridApi.getFilterModel();

        if (this.filtersActive) {
            this.gridApi.setFilterModel({
                ...oldFilterModel,
                teamName: { type: 'contains', filter: this.teamFilter },
                officeName: { type: 'contains', filter: this.locationFilter }
            });
            this.gridApi.setQuickFilter(this.quickFilter);
        } else {
            this.gridApi.setFilterModel({
                ...oldFilterModel,
                teamName: { type: 'contains', filter: null },
                officeName: { type: 'contains', filter: null }
            });
            this.gridApi.setQuickFilter(null);
        }
    }

    private getMembers(): void {
        const offices$: Observable<OfficeInterface[]> = this.offices.length ? of(this.offices) : this.getOffices();
        const teams$: Observable<TeamInterface[]> = this.teams.length ? of(this.teams) : this.getTeams();

        forkJoin([ this.data.getMembers(), offices$, teams$ ])
            .pipe(
                take(1),
                takeUntil(this.endSubscriptions$)
            )
            .subscribe(([ members, offices, teams ]: [ MemberInterface[], OfficeInterface[], TeamInterface[] ]) => {
                this.leadMembers = 0;
                this.dropInMembers = 0;
                this.activeMembers = 0;
                this.formerMembers = 0;

                members.forEach((member: MemberInterface) => {
                    member.officeName = (offices.find((office: OfficeInterface) => office._id === member.office) || {} as any).name;
                    member.teamName = (teams.find((team: TeamInterface) => team._id === member.team) || {} as any).name;

                    this.markByStatus(member.calculatedStatus);
                });

                this.members = members;
            });
    }

    private markByStatus(status: MemberStatus): void {
        switch (status) {
            case MemberStatus.LEAD:
                this.leadMembers++;
                break;

            case MemberStatus.DROP_IN:
                this.dropInMembers++;
                break;

            case MemberStatus.ACTIVE:
                this.activeMembers++;
                break;

            case MemberStatus.FORMER:
                this.formerMembers++;
                break;
        }
    }

    private getOffices(): Observable<OfficeInterface[]> {
        return this.data.getOffices().pipe(tap((response: OfficeInterface[]) => this.offices = response));
    }

    private getTeams(): Observable<TeamInterface[]> {
        return this.data.getTeams().pipe(tap((response: TeamInterface[]) => this.teams = response));
    }

    private onGridReady(params: any): void {
        this.gridApi = params.api;

        this.getMembers();
    }

}
