import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Import Swiper elements bundle with all modules installed
import { register } from 'swiper/element/bundle';

// Register Swiper custom elements
register();

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
