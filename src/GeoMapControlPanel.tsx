import * as React from 'react';
import PropTypes from 'prop-types';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

type GeoMapControlPanelProps = {
    name: String,
    dimensions: Map<string, string>,
    onChange: Function
}

function GeoMapControlPanel(props: GeoMapControlPanelProps) {
	const menuItems: any = [];
	
    props.dimensions.forEach((value: any, key: any) => {
        menuItems.push(<MenuItem value={key}>{value.label}</MenuItem>);
    })
	return (
		<div className="geo-map-control-panel">
			<p className="title">{props.name}</p>
			<FormControl fullWidth>
				<InputLabel id="choose-stats-label">Choose a Statistic</InputLabel>
				<Select
					labelId="choose-stats-label"
					label="Choose a Statistic"
					id="choose-stats"
					defaultValue={props.dimensions.keys().next().value}
					onChange={(e) => {
						props.onChange({ value: e.target.value });
					}}
					variant="outlined"
				>
					{menuItems}
				</Select>
			</FormControl>
		</div>
        
	);
}

export default GeoMapControlPanel;
