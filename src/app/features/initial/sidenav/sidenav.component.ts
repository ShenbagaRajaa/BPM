import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { RouterLinkActive } from '@angular/router';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { Store } from '@ngrx/store';
import { getPermissionIds } from '../../../core/store/auth-state/auth.selector';
import { selectAllPlans } from '../../../core/store/plan-state/plan.selector';
import { Sequence } from '../../../core/models/Sequence.model';
import { plan } from '../../../core/models/plan.model';
import { MatMenuModule } from '@angular/material/menu';
import { getAllUser } from '../../../core/store/user-state/user.action';
import { AdminSubmenuDialogComponent } from '../../../shared/admin-submenu-dialog/admin-submenu-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AdminSubmenuMobileDialogComponent } from '../../../shared/admin-submenu-mobile-dialog/admin-submenu-mobile-dialog.component';
import { getAllPlan } from '../../../core/store/plan-state/plan.action';
import { getPlanTypes } from '../../../core/store/plan-type-state/plan-type.action';
import { getPlanLevels } from '../../../core/store/plan-level-state/plan-level.action';
import { getDepartments } from '../../../core/store/department-state/department.action';
import { getSites } from '../../../core/store/site-state/site.action';
import { getSystems } from '../../../core/store/system-state/system.action';
import {
  loginSuccess,
  reloadLoginSuccess,
} from '../../../core/store/auth-state/auth.action';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    MatButtonModule,
    NgClass,
    RouterLinkActive,
    MatSidenavModule,
    RouterOutlet,
    RouterLink,
    MatIconModule,
    ToolbarComponent,
    NgIf,
    CommonModule,
    MatMenuModule,
  ],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent {
  planIdentifiers: string[] = [];

  showPlanIdentifiers: boolean = false;
  showSequeceNumber: boolean = false;
  showFiller = false;
  showAdminSubMenu: boolean = false;
  showSequences: Set<number> = new Set();

  @ViewChild('drawer') drawer!: MatDrawer;
  planId: number[] = [];
  sequences: Sequence[] = [];

  toggleDrawerAction(event: boolean) {
    this.showFiller = event;
    this.drawer.toggle();
  }

  isMobile: boolean = false;
  showHeader: boolean = true;
  role: string | number = '';
  isExecutiveDirector: boolean = false;
  isTeamMember: boolean = false;
  isAdministrator: boolean = false;
  isbrManagerOrAdministrator: boolean = false;
  hasPermissionToUserManagement: boolean = false;
  hasPermissionToExecuteBRPlan: boolean = false;
  hasPermissionToBuildBRPlan: boolean = false;
  hasPermissionToTestBRPlan: boolean = false;
  hasPermissionToDepartmentManagement: boolean = false;
  hasPermissionToSystemManagement: boolean = false;
  hasPermissionToSiteManagement: boolean = false;
  hasPermissionToPlanLevelManagement: boolean = false;
  hasPermissionToPlanTypeManagement: boolean = false;
  hasPermissionToRoleManagement: boolean = false;
  UserNavigation: string = '';
  hasPermissionToDRSkillManagement: boolean = false;
  hasPermissionToDefaultSettings: boolean = false;
  hasPermissionToSystemTypeManagement: boolean = false;
  hasPermissionToDRTeamManagement: boolean = false;
  hasPermissionToDashboard: boolean = false;

  constructor(
    private router: Router,
    private store: Store,
    private dialog: MatDialog,
    private action$: Actions
  ) {}

  ngOnInit(): void {
    this.action$
      .pipe(ofType(reloadLoginSuccess, loginSuccess))
      .subscribe(() => {
        this.fetchData();
      });
      this.fetchData();
  }

  fetchData() {
    this.store.dispatch(getAllPlan());
    this.store.dispatch(getPlanLevels());
    this.store.dispatch(getPlanTypes());
    this.store.dispatch(getAllUser());
    this.store.dispatch(getSites());
    this.store.dispatch(getDepartments());
    this.store.dispatch(getSystems());

    this.store.select(getPermissionIds).subscribe((permissionIds) => {
      this.hasPermissionToUserManagement = permissionIds.includes('20');
      this.hasPermissionToExecuteBRPlan = permissionIds.includes('16');
      this.hasPermissionToBuildBRPlan = permissionIds.includes('1');
      this.hasPermissionToTestBRPlan = permissionIds.includes('12');
      this.hasPermissionToDepartmentManagement = permissionIds.includes('38');
      this.hasPermissionToSiteManagement = permissionIds.includes('37');
      this.hasPermissionToSystemManagement = permissionIds.includes('39');
      this.hasPermissionToPlanLevelManagement = permissionIds.includes('40');
      this.hasPermissionToPlanTypeManagement = permissionIds.includes('41');
      this.hasPermissionToRoleManagement = permissionIds.includes('44');
      this.hasPermissionToDRSkillManagement = permissionIds.includes('53');
      this.hasPermissionToDefaultSettings = permissionIds.includes('50');
      this.hasPermissionToSystemTypeManagement = permissionIds.includes('62');
      this.hasPermissionToDRTeamManagement = permissionIds.includes('57');
      this.hasPermissionToDashboard = permissionIds.includes('70');
      this.UserNavigation =
        permissionIds.includes('49') || permissionIds.includes('48')
          ? '/home/userManagement'
          : '/home/userManagement/userCreation';
    });

    this.store.select(selectAllPlans).subscribe((plans) => {
      this.planIdentifiers = plans.map((planData) => planData.planIdentifier);

      this.planId = plans.map((planData) => (planData as plan).id);
    });
  }
  // Method to check if the current route is active
  isActive(route: any): boolean {
    return this.router.url.includes(route);
  }
  // Toggle the admin submenu visibility
  toggleAdminSubMenu() {
    this.showAdminSubMenu = !this.showAdminSubMenu;
  }
  // Toggle the display of plan identifiers in the sidebar
  togglePlanIdentifiers() {
    this.showPlanIdentifiers = !this.showPlanIdentifiers;
  }
  // Method to navigate to a plan's edit page
  editPlan(planId: number) {
    this.router.navigate(['home/buildBRPlan/add-plan'], {
      queryParams: { planId: planId },
    });
  }
  selectedPlanId: number | null = null;
  // Method to filter sequences based on selected plan ID
  get filteredSequences() {
    if (this.selectedPlanId !== null) {
      return this.sequences.filter(
        (sequence) => sequence.brPlanId === this.selectedPlanId
      );
    }
    return [];
  }
  // Handle plan selection for navigation
  onPlanClick(planId: number) {
    this.selectedPlanId = planId;

    this.router.navigate(['home/buildBRPlan/add-plan'], {
      queryParams: { planId: planId },
    });
  }

  handleAdminClick(event: MouseEvent): void {
    // First, let's improve device detection
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const isTablet = window.matchMedia(
      '(min-width: 768px) and (max-width: 1023px) and (orientation: portrait)'
    ).matches;
    const isMobileLandscape = window.matchMedia(
      '(min-width: 768px) and (max-width: 1023px) and (orientation: landscape)'
    ).matches;

    if (isMobile || isMobileLandscape) {
      this.dialog.open(AdminSubmenuMobileDialogComponent, {
        maxWidth: '94vw',
        position: {
          bottom: '0',
        },
        panelClass: 'admin-submenu-dialog-container',
        hasBackdrop: true,
        backdropClass: 'admin-submenu-backdrop',
      });
    } else if (isTablet) {
      const targetElement = event.currentTarget as HTMLElement;
      const rect = targetElement.getBoundingClientRect();

      // Adjust positioning for iPad Mini
      this.dialog.open(AdminSubmenuDialogComponent, {
        position: {
          left: `${rect.right}px`,
          top: `${rect.top}px`,
        },
        panelClass: ['admin-submenu-dialog-container', 'ipad-mini-dialog'],
        hasBackdrop: true,
        backdropClass: 'admin-submenu-backdrop',
        width: '300px', // Fixed width for consistency
      });

      // Apply necessary styles after dialog opens
      setTimeout(() => {
        const dialogContainer = document.querySelector(
          '.admin-submenu-dialog-container'
        );
        const backdrop = document.querySelector('.admin-submenu-backdrop');

        if (dialogContainer) {
          const container = dialogContainer as HTMLElement;
          container.style.zIndex = '1001';
          container.style.position = 'fixed';
          container.style.backgroundColor = '#1a1a1a';
          container.style.borderRadius = '8px';
          container.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }

        if (backdrop) {
          const backdropElement = backdrop as HTMLElement;
          backdropElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
          backdropElement.style.zIndex = '1000';
        }
      }, 0);
    } else {
      this.toggleAdminSubMenu();
    }
  }

  // Method to check if a route is active using Angular's router
  isActiveLink(path: string): boolean {
    return this.router.isActive(path, false);
  }
}
