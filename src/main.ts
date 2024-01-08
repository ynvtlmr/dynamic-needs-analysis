import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// check if the service worker is enabled and then register it.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('ngsw-worker.js', { scope: '/' });
}

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
