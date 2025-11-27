import { Action, ActionReducerMap } from '@ngrx/store';
import { appState } from './app.state';
import { snackbarReducer } from '../snackbar-state/snackbar.reducer';
import { PlanReducer } from '../plan-state/plan.reducer';
import { SequenceReducer } from '../sequence-state/sequence.reducer';
import { TaskReducer } from '../task-state/task.reducer';
import { UserReducer } from '../user-state/user.reducer';
import { AuthReducer } from '../auth-state/auth.reducer';
import { CountryReducer } from '../country-state/country.reducer';
import { SiteReducer } from '../site-state/site.reducer';
import { DepartmentReducer } from '../department-state/department.reducer';
import { SystemReducer } from '../system-state/system.reducer';
import { PlanLevelReducer } from '../plan-level-state/plan-level.reducer';
import { PlanTypeReducer } from '../plan-type-state/plan-type.reducer';
import { RoleReducer } from '../role-state/role.reducer';
import { PermissionReducer } from '../permission-state/permission.reducer';
import { SkillsReducer } from '../skills-state/skills.reducer';
import { configurationReducer } from '../configuration-settings-state/configuration-settings.reducer';
import { SystemTypeReducer } from '../system-type-state/system-type.reducer';
import { DRTeamReducer } from '../drTeam-state/drTeam.reducer';

// Define the global reducers map
export const reducers: ActionReducerMap<appState, Action> = {
  snackbar: snackbarReducer,
  plan: PlanReducer,
  sequence: SequenceReducer,
  task: TaskReducer,
  user: UserReducer,
  auth: AuthReducer,
  country: CountryReducer,
  site: SiteReducer,
  department: DepartmentReducer,
  system: SystemReducer,
  planLevel: PlanLevelReducer,
  planType: PlanTypeReducer,
  role: RoleReducer,
  permission: PermissionReducer,
  skills: SkillsReducer,
  configuration: configurationReducer,
  systemType: SystemTypeReducer,
  drTeam: DRTeamReducer,
};
