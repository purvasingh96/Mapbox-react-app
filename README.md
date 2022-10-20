# Mapbox-react-app
This repository contains my experiments with the [mapbox api](https://docs.mapbox.com/mapbox-gl-js/api/).

## Steps to run this repository
1. Clone the repo.
2. Create a `.env.local` file in the **root** directory of the project.
3. Use the following [steps](https://docs.mapbox.com/help/tutorials/get-started-tokens-api/) to generate your personal mapbox access token.
4. Inside your `.env.local` file add the following line:
```
REACT_APP_MAPBOX_TOKEN = <your apbox access token>
```
5. Make sure that mapbox access token variable name has `REACT_APP_` as prefix or else the access token variable won't get picked up.

## Error Handling
1. To run this project, you would want to first check your geojson data. You can use the following link to do so: https://geojsonlint.com/
2. While using polygons/multi-polygons in your geojson data, if you get an error while validating your geojson data stating: "Polygons and multipolygons should follow right-hand rule", please follow this link to download the right python library to fix your error: https://pypi.org/project/geojson-rewind/

