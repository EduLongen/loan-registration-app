import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';  // Use the new provideHttpClient
import { ClientRegistrationComponent } from './app/components/client-registration/client-registration.component';
import { LoanRegistrationComponent } from './app/components/loan-registration/loan-registration.component';

const routes: Routes = [
  { path: 'client-registration', component: ClientRegistrationComponent },
  { path: 'loan-registration', component: LoanRegistrationComponent },
  { path: '', redirectTo: 'client-registration', pathMatch: 'full' },
  { path: '**', redirectTo: 'client-registration' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()  // Use provideHttpClient instead of HttpClientModule
  ]
});
