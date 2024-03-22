# DynamicNeedsAnalysis

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Develop in Docker

Build

`docker build --progress=plain -t dynamic-needs-analysis -f Dockerfile.dev .`
Run

`docker run -it --rm --name dynamic-needs-analysis-container -p 4200:4200 -v ${PWD}/src:/app/src dynamic-needs-analysis`

Note: Changes to package.json or package-lock.json require a rebuild of the image.

### Docker Compose - Development

To get up an running faster, you can use docker-compose to build and run the container.

Build and Run

`docker-compose up --build`

Run

`docker-compose up`

Stop and Remove container `docker-compose down`

### Docker Compose - Production

The production version cannot be live edited because it does not map to an external volume.

The app is built wih `ng build` and Nginx is used to serve the app on port 80.

Build and Run

`docker-compose -f docker-compose.prod.yml up --build`
Stop and Remove

`docker-compose -f docker-compose.prod.yml down`
