import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouterStore } from '@ngrx/router-store';
import { reducers } from './core/store/app-state/app.reducer';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { PlanEffects } from './core/store/plan-state/plan.effect';
import { SequenceEffects } from './core/store/sequence-state/sequence.effect';
import { TasksEffects } from './core/store/task-state/task.effect';
import { UserEffects } from './core/store/user-state/user.effect';
import { AuthEffects } from './core/store/auth-state/auth.effect';
import { authInterceptor } from './core/interceptor/auth.interceptor';
import { CountryEffects } from './core/store/country-state/country.effect';
import { SiteEffects } from './core/store/site-state/site.effect';
import { SystemsEffects } from './core/store/system-state/system.effect';
import { DepartmentsEffects } from './core/store/department-state/department.effect';
import { PlanTypesEffects } from './core/store/plan-type-state/plan-type.effect';
import { PlanLevelsEffects } from './core/store/plan-level-state/plan-level.effect';
import { RoleEffects } from './core/store/role-state/role.effect';
import { PermissionsEffects } from './core/store/permission-state/permission.effect';
import { SkillsEffects } from './core/store/skills-state/skills.effect';
import { ConfigurationEffects } from './core/store/configuration-settings-state/configuration-settings.effect';
import { SystemTypeEffects } from './core/store/system-type-state/system-type.effect';
import { drTeamEffects } from './core/store/drTeam-state/drTeam.effect';
import { loaderInterceptor } from './core/interceptor/loader.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideEffects(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideStore(reducers),
    provideEffects(
      SequenceEffects,
      PlanEffects,
      TasksEffects,
      UserEffects,
      AuthEffects,
      CountryEffects,
      SiteEffects,
      SystemsEffects,
      DepartmentsEffects,
      PlanTypesEffects,
      PlanLevelsEffects,
      RoleEffects,
      PermissionsEffects,
      SkillsEffects,
      ConfigurationEffects,
      SystemTypeEffects,
      drTeamEffects
    ),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideRouterStore(),
    provideHttpClient(withInterceptors([authInterceptor, loaderInterceptor])),
    provideHttpClient(withFetch()),
  ],
};
