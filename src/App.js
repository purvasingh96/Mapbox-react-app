import React, { useRef, useEffect } from "react";
import ReactMapGL, { NavigationControl, Source, Layer, Marker, Popup } from "react-map-gl";
import playgroundMap from './data/playground.json'
import { bbox } from '@turf/turf';
import { WebMercatorViewport } from 'viewport-mercator-project';
import { useCallback, useState } from 'react';
import {
  scaleOrdinal, scaleQuantize
} from 'd3-scale'
import { extent } from 'd3-array';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const navControlStyle = {
	left: 6,
	bottom: 40,
};

const featureCollectionLayer = {
	id: 'fc',
	type: 'fill',
};


const getInitialBounds = (fc) => {
	const tuple = bbox(fc);
	const viewport = new WebMercatorViewport({
		width: 800,
		height: 600,
	}).fitBounds(
		[
			[tuple[0], tuple[1]],
			[tuple[2], tuple[3]],
		],
		{ padding: 12 }
	);
	const { longitude, latitude, zoom } = viewport;
	return { longitude, latitude, zoom };
};

const colors = (specifier) => {
  var n = specifier.length / 6 | 0, colors = new Array(n), i = 0;
  while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
  return colors;

}

export default function App() {
  const bounds = getInitialBounds(playgroundMap.layers[0].source)
  const [viewport, setViewport] = useState({
    width: 800,
		height: 600,
		hash: true,
  });


  const isChoropleth = (name) => {
		const choroplethRegExp = new RegExp('COVID');
		return choroplethRegExp.test(name);
	};

  const splitDimensions = () => {
		  const toLabel = (text) => {
			let spaced = text.replace(/([A-Z])/g, ' $1');
			let capped = spaced.charAt(0).toUpperCase() + spaced.slice(1);
			let shrunk = capped.replace(' Per One ', '/');
			return shrunk.replace(/(Today)\s(\w+)/, '$2 $1');
		};

		const legendItems = [
			'_layerId',
			'name',
			'density',
			'population',
			'state',
			'updated',
		];
		const dimensions = new Map();
		let index = 0;
    const schemeCategory10 = colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");
		const scale = scaleOrdinal(schemeCategory10);
		Object.keys(playgroundMap.layers[0].source.features[0].properties).forEach((d) => {
			if (!legendItems.includes(d)) {
				const label = toLabel(d);
				const color = scale(index.toString());
				const breaks = [];
				dimensions.set(d, { label: label, color: color});
				index++;
			}
		});
		return dimensions;
	};

  const mapRef = useRef();

  const [hoverInfo, setHoverInfo] = useState(null);

	const onHover = useCallback((event) => {
		const {
			features,
			srcEvent: { offsetX, offsetY },
		} = event;
		const hoveredFeature = features && features[0];

		setHoverInfo(
			hoveredFeature
				? {
						feature: hoveredFeature,
						x: offsetX,
						y: offsetY,
				  }
				: null
		);
	}, []);

  const dimensions = splitDimensions();

  const [dimension, setDimension] = useState({
    value: dimensions.keys().next().value,
    label: dimensions.values().next().value.label,
    color: dimensions.values().next().value.color,
  });

  const quantizeOpacity = (dimension) => {
		let domain = [];
		let fillOpacity;
		playgroundMap.layers[0].source.features.forEach((f) => {
			domain.push(f.properties[dimension.value]);
		});
		if (extent(domain)[0] === extent(domain)[1]) {
			fillOpacity = 0.2;
		} else {
			const opacity = scaleQuantize()
				.domain(extent(domain))
				.range([0.2, 0.35, 0.5, 0.65, 0.8]);
			fillOpacity = [
				'step',
				['get', dimension.value],
				0.1,
				opacity.invertExtent(0.2)[0],
				0.2,
				opacity.invertExtent(0.35)[0],
				0.35,
				opacity.invertExtent(0.5)[0],
				0.5,
				opacity.invertExtent(0.65)[0],
				0.65,
				opacity.invertExtent(0.8)[0],
				0.8,
			];
		}
		return fillOpacity;
	};

  useEffect(() => {
	  if(mapRef && mapRef.current) {
		  const map = mapRef.current.getMap()
		  map.on("load", () => {
			  map.setLayoutProperty(map.Layer, 'visibility', 'none')
		  }, [mapRef])
	  }
  })
  

  return (
    <div>
      <h1 style={{marginBottom: '1rem'}}>Playground Map</h1>
      <ReactMapGL
        mapLib={maplibregl}
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        onViewportChange={(viewport) => {
          // useEffect(() => {setViewport(viewport)}, []);
          setViewport(viewport)
        }}
        interactiveLayerIds={['fc']}
        onHover={onHover}
      >
        <NavigationControl style={navControlStyle} showCompass={false} />
        <Source type="geojson" data={playgroundMap.layers[0].source}>
          <Layer 
            {...featureCollectionLayer} 
            paint={
              {
                'fill-outline-color':'white',
                "fill-color": dimension.color,
                "fill-opacity": quantizeOpacity(dimension)
              }
            }
          />
        </Source>    
      </ReactMapGL>
    </div>
  );
}

