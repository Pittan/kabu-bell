<p align="center">
  <a href="https://kabu-bell.pittankopta.net/">
    <img src="https://user-images.githubusercontent.com/6269639/80273758-01f0b480-8710-11ea-8e99-0e445792dca0.png" width="400" alt="カブベル(kabu-bell) カブ価をスマホでかんたん管理">  
  </a><br>
  Manage your ACNH's Turnips market with your smartphone
</p>

<p align="center">
  <img src="https://github.com/Pittan/perfume-database/workflows/Node.js%20CI/badge.svg?branch=master" alt="Build Status on CircleCI" />
  <a href="https://app.netlify.com/sites/happy-lamport-d1e383/deploys">
    <img src="https://api.netlify.com/api/v1/badges/03ba2bec-1a3f-40b0-b6f8-058d975ce938/deploy-status" alt="Deploy Status on Netlify" />
  </a>
</p>



# How to use
<p align="center">
  <img src="https://user-images.githubusercontent.com/6269639/80273967-e8e90300-8711-11ea-842d-0dd77633e954.png" alt="QR code" /><br>
  Access with your smartphone!
</p>

# Developing
This project was generated with <a target="_blank" href="https://github.com/angular/angular-cli">Angular CLI</a> version 9.1.0.

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.   
The app will automatically reload if you change any of the source files.

## Development server with service worker
If you want to check the behavior of Service worker, `ng serve` command cannot provide you a great environment.  
Please build the project file first using `ng run kabu-bell:app-shell`,  
and create a dev server with `npx node-static ./dist/kabu-bell/browser --spa --port=9000`.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
