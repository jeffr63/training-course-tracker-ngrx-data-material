import { ApplicationConfig } from '@angular/core';
import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { TitleStrategy, provideRouter, withComponentInputBinding } from '@angular/router';

import { DefaultDataServiceConfig, EntityDataModule } from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';

import { APP_ROUTES } from './app.routes';
import { CustomTitleStrategyService } from './shared/resolvers/custom-title-strategy.service';
import { environment } from '../environments/environment';
import { entityConfig } from './entity-metadata';

const defaultDataServiceConfig: DefaultDataServiceConfig = {
  root: 'http://localhost:3000',
  timeout: 3000, // request timeout
};

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      StoreModule.forRoot({}),
      EffectsModule.forRoot([]),
      EntityDataModule.forRoot(entityConfig),
      StoreDevtoolsModule.instrument({
        maxAge: 5,
        logOnly: environment.production,
      })
    ),
    { provide: DefaultDataServiceConfig, useValue: defaultDataServiceConfig },
    { provide: TitleStrategy, useClass: CustomTitleStrategyService },
    provideAnimations(),
    provideHttpClient(),
    provideRouter(APP_ROUTES, withComponentInputBinding()),
  ],
};
