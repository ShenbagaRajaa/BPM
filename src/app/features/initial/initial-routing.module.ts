import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidenavComponent } from './sidenav/sidenav.component';
import { UnauthorizedComponent } from '../../shared/unauthorized/unauthorized.component';
import { TaskActionComponent } from '../../shared/task-action/task-action.component';
import { ViewUserComponent } from '../user-management/view-user/view-user.component';
import { permissionGuard } from '../../core/guard/permission.guard';

const routes: Routes = [
  {
    path: '',
    component: SidenavComponent,
    children: [
      { path: '', redirectTo: 'plans', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },

      { path: 'unauthorized', component: UnauthorizedComponent },
      { path: 'taskAction', component: TaskActionComponent },
      {
        path: 'plans',
        loadChildren: () =>
          import('../home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'buildBRPlan',
        loadChildren: () =>
          import('../build-br-plan/build-br-plan.module').then(
            (m) => m.BuildBRPlanModule
          ),
      },
      {
        path: 'buildBRPlan/add-plan/:planId',
        loadChildren: () =>
          import('../build-br-plan/build-br-plan.module').then(
            (m) => m.BuildBRPlanModule
          ),
      },
      {
        path: 'testBRPlan',
        loadChildren: () =>
          import('../test-br-plan/test-br-plan.module').then(
            (m) => m.TestBRPlanModule
          ),
        canActivate: [permissionGuard],
        data: {
          requiredPermissions: ['12'],
        },
      },
      {
        path: 'executeBRPlan',
        loadChildren: () =>
          import('../execute-br-plan/execute-br-plan.module').then(
            (m) => m.ExecuteBRPlanModule
          ),
        canActivate: [permissionGuard],
        data: {
          requiredPermissions: ['16'],
        },
      },
      {
        path: 'userManagement',
        loadChildren: () =>
          import('../user-management/user-management.module').then(
            (m) => m.UserManagementModule
          ),
        canActivate: [permissionGuard],
        data: {
          requiredPermissions: ['18'],
        },
      },
      {
        path: 'defaultConfigurations',
        loadChildren: () =>
          import(
            '../default-configurations/default-configurations.module'
          ).then((m) => m.DefaultConfigurationsModule),
        canActivate: [permissionGuard],
        data: {
          requiredPermissions: ['50'],
        },
      },
      {
        path: 'siteManagement',
        loadChildren: () =>
          import('../site-management/site-management.module').then(
            (m) => m.SiteManagementModule
          ),
        canActivate: [permissionGuard],
        data: {
          requiredPermissions: ['37'],
        },
      },
      {
        path: 'systemTypeManagement',
        loadChildren: () =>
          import(
            '../system-type-management/system-type-management.module'
          ).then((m) => m.SystemTypeManagementModule),
        canActivate: [permissionGuard],
        data: {
          requiredPermissions: ['62'],
        },
      },
      {
        path: 'drTeamManagement',
        loadChildren: () =>
          import('../drteam-management/drteam-management.module').then(
            (m) => m.DrteamManagementModule
          ),
        canActivate: [permissionGuard],
        data: {
          requiredPermissions: ['57'],
        },
      },
      {
        path: 'departmentManagement',
        loadChildren: () =>
          import('../department-management/department-management.module').then(
            (m) => m.DepartmentManagementModule
          ),
        canActivate: [permissionGuard],
        data: {
          requiredPermissions: ['38'],
        },
      },
      {
        path: 'systemManagement',
        loadChildren: () =>
          import('../system-management/system-management.module').then(
            (m) => m.SystemManagementModule
          ),
        canActivate: [permissionGuard],
        data: {
          requiredPermissions: ['39'],
        },
      },
      {
        path: 'planLevelManagement',
        loadChildren: () =>
          import('../plan-level-management/plan-level-management.module').then(
            (m) => m.PlanLevelManagementModule
          ),
        canActivate: [permissionGuard],
        data: {
          requiredPermissions: ['40'],
        },
      },
      {
        path: 'planTypeManagement',
        loadChildren: () =>
          import('../plan-type-management/plan-type-management.module').then(
            (m) => m.PlanTypeManagementModule
          ),
        canActivate: [permissionGuard],
        data: {
          requiredPermissions: ['41'],
        },
      },
      {
        path: 'roleManagement',
        loadChildren: () =>
          import('../role-management/role-management.module').then(
            (m) => m.RoleManagementModule
          ),
        canActivate: [permissionGuard],
        data: {
          requiredPermissions: ['44'],
        },
      },
      {
        path: 'skillManagement',
        loadChildren: () =>
          import('../skill-management/skill-management.module').then(
            (m) => m.SkillManagementModule
          ),
        canActivate: [permissionGuard],
        data: {
          requiredPermissions: ['53'],
        },
      },
      {
        path: 'viewUser/:email',
        component: ViewUserComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InitialRoutingModule {}
