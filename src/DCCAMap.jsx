var topojson = require("topojson");
var React = require("react");

// Generated 18 distinct colors from http://tools.medialab.sciences-po.fr/iwanthue/
var dcAreaColors = ["#544171", "#87D84A", "#CE572B", "#71D0C9", "#CC53D3", "#C59C76", "#5A8237", "#466158", "#D4B743", "#7199C7", "#C14088", "#7A6DCE", "#62471F", "#91D593", "#BF4C57", "#CC8BB9", "#C4BEBE", "#512834"];
module.exports = React.createClass({
	getInitialState: function() {
		return {
			initialized: false,
			tooltipText: "",
			tooltipPosition: [0, 0],
		};
	},
	componentDidMount: function() {
		if (!this.state.initialized) {
			var mapOptions = {
				center: { lat: 22.3300, lng: 114.1880},
				zoom: 11,
			};
			this.map = new google.maps.Map(this.refs.mapCanvas.getDOMNode(), mapOptions);
			this.addDCCAOverlay();
			this.setState({initialized: true});
		}
	},
	render: function() {
		var toolTipStyle = {
			position: "absolute",
			display: this.state.tooltipText == "" ? "none" : "block",
			zIndex: 99,
			backgroundColor: "#FFF",
			padding: "2px",
			borderWidth: "1px",
			borderStyle: "solid",
			pointerEvents: "none",
			left: this.state.tooltipPosition[0],
			top: this.state.tooltipPosition[1],
		};
		return (
			<div style={{height: "100%"}}>
				<div ref="mapCanvas" style={{height: "100%"}}></div>
				<div ref="tooltip" style={toolTipStyle}>{this.state.tooltipText}</div>
			</div>
		);
	},
	addDCCAOverlay: function() {
		var dccaTopoJson = require("json!./assets/2011dcca.topojson");
		var dccaGeoJson = topojson.feature(dccaTopoJson, dccaTopoJson.objects["2011DCCA_Land"]);
		var map = this.map;
		map.data.addGeoJson(dccaGeoJson);
		map.data.setStyle(this.featureStyleByDC);
		map.data.addListener("mouseover", this.onMapDataFeatureMouseOver);
		map.data.addListener("mouseout", this.onMapDataFeatureMouseOut);
	},
	featureStyleByDC: function(feature) {
		var dcCode = feature.getProperty("CACODE").charCodeAt(0);
		// Map DC Code to a number in 0..18 to pick a distinct color. I & O are not used in the DC code to avoid confusion. Offset them.
		var dcColorId = dcCode - "A".charCodeAt(0);
		if (dcCode >= "I".charCodeAt(0)) dcColorId--;
		if (dcCode >= "O".charCodeAt(0)) dcColorId--;
		return {
			fillColor: dcAreaColors[dcColorId],
			strokeWeight: 1,
		};
	},
	onMapDataFeatureMouseOver: function(event) {
		var districtName = event.feature.getProperty("CNAME") + " " + event.feature.getProperty("ENAME") + " (" + event.feature.getProperty("CACODE") + ")";
		this.map.data.overrideStyle(event.feature, {fillColor: "yellow"});
		this.setState({
			tooltipText: districtName,
			tooltipPosition: [event.kb.clientX + 15, event.kb.clientY + 15],
		});
	},
	onMapDataFeatureMouseOut: function(event) {
		this.map.data.revertStyle(event.feature);
		this.setState({tooltipText: ""});
	},
});
