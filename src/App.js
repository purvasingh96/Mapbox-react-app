import React, { useRef, useEffect } from "react";
import { GeoMap } from "./components/GeoMap/GeoMap";
import playgroundMap from './data/playground.json'

export default function App() {
  
  return (
	  <div>
		<GeoMap dataURL={"https://raw.githubusercontent.com/purvasingh96/Mapbox-react-app/main/src/data/playground.json"}/>
		<GeoMap dataURL={"https://raw.githubusercontent.com/purvasingh96/Mapbox-react-app/main/src/data/COVID.json"}/>
	</div>
  );
}

