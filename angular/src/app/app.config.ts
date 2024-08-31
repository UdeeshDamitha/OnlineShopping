import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';

export const appConfig :ApplicationConfig = {
    providers:[importProvidersFrom(HttpClientModule), AppRoutingModule, provideHttpClient()]
}