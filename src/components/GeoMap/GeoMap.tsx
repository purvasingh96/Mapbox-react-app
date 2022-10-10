import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactMapGL, { Layer, NavigationControl, Source } from "react-map-gl";
import { bbox, Geometry, Point } from '@turf/turf';
import { normalizeViewportProps, ViewportProps, WebMercatorViewport } from 'viewport-mercator-project';
import playgroundMap from '../../data/playground.json';
import { responsiveProperty } from "@mui/material/styles/cssUtils";
import { GeoJSONFeature } from "maplibre-gl";

const featureCollectionLayer = {
	id: 'fc',
	type: 'fill',
};


interface MapDataType {
	center: number[],
	zoom: number,
} 

interface MarkersType {
	center: number[],
	name: string
}

interface MasterDataType {
    name: string,
    version: number,
    mapData: MapDataType,
    markers: MarkersType,
    layers: LayerType[]
}

export interface LayerType{
	id: number,
	mapId: number,
	order: number,
	dataSourceId: number, 
	createdAt: string,
	updatedAt: string,
	dataSource: DataSourceType,
	source: SourceType
}

interface DataSourceType {
	id: number,
	name: string,
	source: string,
	sourceAttribution: null,
	organizationId: number,
	createdAt: string,
	updatedAt: string,
}

interface SourceType {
	type: string,
	features: FeaturesType[],
	coordinateSystem: CoordinateSystemType,
	bbox: number[]
}

interface CoordinateSystemType {
	type: string,
	stepSize: number
}

interface FeaturesType {
	type: string,
	properties: PropertiesType,
	geometry: GeometryType
}

interface PropertiesType{
	name:string,
	looping_sound?: string | null,
	short_sound: string,
	intro_sound?: string | null,
	description?: string,
	type: string,
	_layerId: number,
}

interface GeometryType {
    type: string,
	coordinates: number[],
}

export type GeoMapProps = {
    dataURL: string;
}

const getInitialBounds = (fc: SourceType) => {
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

export const GeoMap = (props: GeoMapProps) => {
    const [source, setSource] = useState(null);
    const [hoverInfo, setHoverInfo] = useState(null)

    useEffect(() => {
        fetch(props.dataURL)
        .then((response) => response.json())
        .then((json) => {
            setSource(json.layers[0].source)
        })
      }, []);

       const data = useMemo(() => {
           return source
       }, [source]);

        const bounds = source && getInitialBounds(source);
        const [viewport, setViewport] = React.useState({
            width: 800,
            height: 600,
        });

        const onHover = useCallback((event: { features: any; point: { x: any; y: any; }; }) => {
            const {
              features,
              point: {x, y}
            } = event;
            const hoveredFeature = features && features[0];
        
            // prettier-ignore
            setHoverInfo(hoveredFeature && {feature: hoveredFeature, x, y});
          }, []);
      

    
    return (
        <div>
            {source && 
             <ReactMapGL
                {...viewport}
                onViewportChange={(viewport) => {
                    setViewport(viewport as ViewportProps)
                    }}
                interactiveLayerIds={['fc']}
                mapboxApiAccessToken="pk.eyJ1IjoicHVydmFzaW5naCIsImEiOiJjbDQ4amRrYjQwc3RwM2NsbGttbnlpaTRmIn0.djnJ9PjVpJ7g8aIWHHnPGA"
                >
                    <Source type="geojson" data={source}>
                        <Layer 
                        {...featureCollectionLayer}
                        paint={
                            {
                                "fill-outline-color": "white",
                                "fill-color": "red",
                                "fill-opacity": 0.5
                            }
                        }
                        />
                    </Source>
                    <div style={{position: 'absolute', left:'15px', top:"5%"}}>
                        <NavigationControl showCompass={false}/>
                    </div>
             </ReactMapGL>
            }
       
        </div>
      );
}

