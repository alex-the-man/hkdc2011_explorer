var topojson = require("topojson");
var React = require("react");

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
			this.loadDCCABoundary();
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
	loadDCCABoundary: function(map) {
		var dccaTopoJson = require("json!./assets/2011dcca.topojson");
		var dccaGeoJson = topojson.feature(dccaTopoJson, dccaTopoJson.objects["2011dcca"]);
		var map = this.map;
		map.data.addGeoJson(dccaGeoJson);
		map.data.setStyle({
				strokeWeight: 1.5
		});
		map.data.addListener("mouseover", this.onMapDataFeatureMouseOver);
		map.data.addListener("mouseout", this.onMapDataFeatureMouseOut);
	},
	onMapDataFeatureMouseOver: function(event) {
		var districtName = event.feature.getProperty("CNAME") + " " + event.feature.getProperty("ENAME");
		this.map.data.overrideStyle(event.feature, {fillColor: "blue"});
		this.setState({
			tooltipText: districtName,
			tooltipPosition: [event.kb.clientX + 15, event.kb.clientY + 15],
		});
	},
	onMapDataFeatureMouseOut: function(event) {
		this.map.data.overrideStyle(event.feature, {fillColor: null});
		this.setState({tooltipText: ""});
	},
});
