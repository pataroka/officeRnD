import { MemberCellRendererComponent } from '@components/member-cell-renderer/member-cell-renderer.component';
import * as moment from 'moment';
import { LocationCellRendererComponent } from '@components/location-cell-renderer/location-cell-renderer.component';

export const MEMBER_COL_DEF: any[] = [
    {
        headerName: 'MEMBER',
        field: 'name',
        sortable: true,
        unSortIcon: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        cellRendererFramework: MemberCellRendererComponent,
    },
    {
        headerName: 'TEAM',
        field: 'teamName',
        sortable: true,
        unSortIcon: true
    },
    {
        headerName: 'STATUS/LABEL',
        field: 'calculatedStatus'
    },
    {
        headerName: 'CREATED AT',
        field: 'createdAt',
        sortable: true,
        unSortIcon: true,
        valueFormatter : (params) => {
            return moment(params.value).format('DD MMM YYYY') || null;
        },
        getQuickFilterText: (params) => {
            return moment(params.value).format('DD MMM YYYY') || null;
        }
    },
    {
        headerName: 'LOCATION',
        field: 'officeName',
        cellRendererFramework: LocationCellRendererComponent,
    },
];
