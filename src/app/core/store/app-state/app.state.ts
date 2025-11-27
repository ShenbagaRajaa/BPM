import { AuthState } from '../auth-state/auth.state';
import { ConfigurationState } from '../configuration-settings-state/configuration-settings.state';
import { CountryState } from '../country-state/country.state';
import { DepartmentState } from '../department-state/department.state';
import { drTeamState } from '../drTeam-state/drTeam.state';
import { PermissionState } from '../permission-state/permission.state';
import { PlanLevelState } from '../plan-level-state/plan-level.state';
import { PlanState } from '../plan-state/plan.state';
import { PlanTypeState } from '../plan-type-state/plan-type.state';
import { RoleState } from '../role-state/role.state';
import { SequenceState } from '../sequence-state/sequence.state';
import { SiteState } from '../site-state/site.state';
import { SkillsState } from '../skills-state/skills.state';
import { SnackbarState } from '../snackbar-state/snackbar.state';
import { SystemState } from '../system-state/system.state';
import { SystemTypeState } from '../system-type-state/system-type.state';
import { TaskState } from '../task-state/task.state';
import { UserState } from '../user-state/user.state';

// Global app state interface combining different feature states
export interface appState {
  snackbar: SnackbarState;
  plan: PlanState;
  sequence: SequenceState;
  task: TaskState;
  user: UserState;
  auth: AuthState;
  country: CountryState;
  site: SiteState;
  department: DepartmentState;
  system: SystemState;
  planLevel: PlanLevelState;
  planType: PlanTypeState;
  role: RoleState;
  permission: PermissionState;
  skills: SkillsState;
  configuration: ConfigurationState;
  systemType: SystemTypeState;
  drTeam: drTeamState;
}
