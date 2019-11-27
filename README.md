# CmsFrontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

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

## API
```
    => GET / (hello)
🛰  Mounting /image:
    => GET /image/desc (load_all_description)
    => GET /image/<id> (get_single_object_by_id)
    => GET /image (get_all_objects)
    => POST /image application/json (create_objects)
    => PUT /image application/json (update_objects)
    => POST /image/<desc> image/jpeg (upload_image)
    => GET /image/desc/<desc> (load_image)
🛰  Mounting /apartment:
    => GET /apartment (get_all_objects)
    => GET /apartment/<id> (get_single_object_by_id)
    => POST /apartment application/json (create_objects)
    => PUT /apartment application/json (update_objects)
🛰  Mounting /apartment_desc:
    => GET /apartment_desc (get_all_objects)
    => GET /apartment_desc/<id> (get_single_object_by_id)
    => POST /apartment_desc application/json (create_objects)
    => PUT /apartment_desc application/json (update_objects)
🛰  Mounting /apartment_details:
    => GET /apartment_details (get_all_objects)
    => GET /apartment_details/<id> (get_single_object_by_id)
    => POST /apartment_details application/json (create_objects)
    => PUT /apartment_details application/json (update_objects)
🛰  Mounting /apartment_price:
    => GET /apartment_price (get_all_objects)
    => GET /apartment_price/<id> (get_single_object_by_id)
    => POST /apartment_price application/json (create_objects)
    => PUT /apartment_price application/json (update_objects)
🛰  Mounting /details_to_apartment:
    => GET /details_to_apartment (get_all_objects)
    => GET /details_to_apartment/<id> (get_single_object_by_id)
    => POST /details_to_apartment application/json (create_objects)
    => PUT /details_to_apartment application/json (update_objects)
🛰  Mounting /tile:
    => GET /tile/<id> (get_single_object_by_id)
    => GET /tile (get_all_objects)
    => POST /tile application/json (create_objects)
    => PUT /tile application/json (update_objects)
🛰  Mounting /info_text:
    => GET /info_text/<id> (get_single_object_by_id)
    => GET /info_text (get_all_objects)
    => POST /info_text application/json (create_objects)
    => PUT /info_text application/json (update_objects)
🛰  Mounting /info_text_to_tile:
    => GET /info_text_to_tile/<id> (get_single_object_by_id)
    => GET /info_text_to_tile (get_all_objects)
    => POST /info_text_to_tile application/json (create_objects)
    => PUT /info_text_to_tile application/json (update_objects)
    
```

## TODO

### Input Validation

* Info Text
* Apartment Content
* Apartment Details
* Tiles
* Image Name and Description

### Display Infos

* Modal for Changes

### Login

* Login page
* Authentication mechanism

### Testing

* Testing environment
* Input and Output Testing