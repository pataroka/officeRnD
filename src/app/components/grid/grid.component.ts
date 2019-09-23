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
import { NgbModal } from '@node_modules/@ng-bootstrap/ng-bootstrap';
import { MemberFormComponent } from '@components/member-form/member-form.component';
import { DeleteConfirmationComponent } from '@components/delete-confirmation/delete-confirmation.component';

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

    public filterResults = 0;

    public constructor(
        private data: DataService,
        private modalService: NgbModal
    ) {
    }

    public addMember(): void {
        const modalRef = this.modalService.open(MemberFormComponent, { centered: true });
        modalRef.componentInstance.teams = this.teams;
        modalRef.componentInstance.offices = this.offices;
        modalRef.result
                .then((formValue: MemberInterface) => {
                    this.data.createMember(formValue).pipe(
                        take(1),
                        takeUntil(this.endSubscriptions$)
                    ).subscribe(
                        (response: MemberInterface[]) => {
                            const member: MemberInterface = response[0];
                            this.assignOfficeName(member);
                            this.assignTeamName(member);
                            this.allocateStatus(member.calculatedStatus);
                            this.members.push(member);
                            this.gridApi.updateRowData({ add: [ member ] });
                        },
                        error => console.log(error)
                    );
                })
                .catch((error) => console.log(error));
    }

    public deleteMembers(): void {
        const modalRef = this.modalService.open(DeleteConfirmationComponent, { centered: true });
        modalRef.result
                .then((result: boolean) => {
                    if (result) {
                        const selectedData: any[] = this.gridApi.getSelectedRows();

                        selectedData.forEach(row => {
                            this.data.deleteMember(row._id)
                                .pipe(
                                    take(1),
                                    takeUntil(this.endSubscriptions$)
                                )
                                .subscribe(
                                    () => {
                                        const delIdx = this.members.findIndex(member => member._id === row._id);
                                        if (delIdx !== -1) {
                                            this.allocateStatus(row.calculatedStatus, false);
                                            this.members.splice(delIdx, 1);
                                            this.gridApi.updateRowData({ remove: [ row ] });
                                        }
                                    },
                                    error => console.log(error));
                        });
                    }
                })
                .catch((error) => console.log(error));
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

    public onGridReady(params: any): void {
        this.gridApi = params.api;

        this.getServerData();
    }

    public onDisplayedRowsChange(): void {
         this.filterResults = this.gridApi ? this.gridApi.getDisplayedRowCount() : this.members.length;
    }

    private getServerData(): void {

        forkJoin([ this.getMembers(), this.getOffices(), this.getTeams() ])
            .pipe(
                take(1),
                takeUntil(this.endSubscriptions$)
            )
            .subscribe(([ members, offices, teams ]: [ MemberInterface[], OfficeInterface[], TeamInterface[] ]) => {
                this.offices = offices;
                this.teams = teams;
                this.leadMembers = 0;
                this.dropInMembers = 0;
                this.activeMembers = 0;
                this.formerMembers = 0;

                members.forEach((member: MemberInterface) => {
                    this.assignOfficeName(member);
                    this.assignTeamName(member);

                    this.allocateStatus(member.calculatedStatus);
                });

                this.members = members;
            });


    }

    private assignOfficeName(member: MemberInterface): void {
        member.officeName = (this.offices.find((office: OfficeInterface) => office._id === member.office) || {} as any).name;
    }

    private assignTeamName(member: MemberInterface): void {
        member.teamName = (this.teams.find((team: TeamInterface) => team._id === member.team) || {} as any).name;
    }

    private allocateStatus(status: MemberStatus, add: boolean = true): void {
        switch (status) {
            case MemberStatus.LEAD:
                add ? this.leadMembers++ : this.leadMembers--;
                break;

            case MemberStatus.DROP_IN:
                add ? this.dropInMembers++ : this.dropInMembers--;
                break;

            case MemberStatus.ACTIVE:
                add ? this.activeMembers++ : this.activeMembers--;
                break;

            case MemberStatus.FORMER:
                add ? this.formerMembers++ : this.formerMembers--;
                break;
        }
    }

    private getMembers(): Observable<MemberInterface[]> {
        return this.data.getMembers()
                   .pipe(
                       take(1),
                       takeUntil(this.endSubscriptions$)
                   );
    }

    private getOffices(): Observable<OfficeInterface[]> {
        return this.data.getOffices()
                   .pipe(
                       take(1),
                       takeUntil(this.endSubscriptions$)
                   );
    }

    private getTeams(): Observable<TeamInterface[]> {
        return this.data.getTeams()
                   .pipe(
                       take(1),
                       takeUntil(this.endSubscriptions$)
                   );
    }
}
