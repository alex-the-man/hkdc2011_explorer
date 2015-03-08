var _ = require("underscore");
var tinycolor = require("tinycolor2");
var topojson = require("topojson");
var React = require("react");

var AutoHidePanel = require("jsx!./AutoHidePanel.jsx");
var CheckboxList = require("jsx!./CheckboxList.jsx");

function getLocalizedString(stringsMap) {
	return stringsMap.T;
}

// Generated 18 distinct colors from http://tools.medialab.sciences-po.fr/iwanthue/
var dcAreaColors = ["#544171", "#87D84A", "#CE572B", "#71D0C9", "#CC53D3", "#C59C76", "#5A8237", "#466158", "#D4B743", "#7199C7", "#C14088", "#7A6DCE", "#62471F", "#91D593", "#BF4C57", "#CC8BB9", "#C4BEBE", "#512834"];

function computeDataStyle(dcCode) {
	// Map DC Code to a number in 0..18 to pick a distinct color. I & O are not used in the DC code to avoid confusion. Offset them.
	var dcColorId = dcCode.charCodeAt(0) - "A".charCodeAt(0);
	if (dcCode >= "I") dcColorId--;
	if (dcCode >= "O") dcColorId--;
	return {
		strokeWeight: 1.25,
		fillColor: dcAreaColors[dcColorId],
		strokeWeight: 1.25,
		fillOpacity: 0.5,
	};
}

module.exports = React.createClass({
	getDefaultProps: function() {
		var districtNameMap = require("json!./data/districts_name.json");
		var dccaNameMap = require("json!./data/dcca_name.json");
		
		var districtCodeList = _.sortBy(_.keys(districtNameMap), function(dcCode) { return dcCode; });
		var districtLabelMap = _.mapObject(districtNameMap, function(districtName, dcCode) { return getLocalizedString(districtName) + " (" + dcCode + ")" });
		
		return {
			districtNameMap: districtNameMap,
			dccaNameMap: dccaNameMap,
			districtCodeList: districtCodeList,
			districtLabelMap: districtLabelMap,
		};
	},
	getInitialState: function() {
		return {
			initialized: false,
			tooltipText: "",
			tooltipPosition: [0, 0],
			visibleDistrictIds: _.clone(this.props.districtCodeList),
		};
	},
	componentDidMount: function() {
		if (!this.state.initialized) {
			var mapOptions = {
				center: { lat: 22.3300, lng: 114.1880},
				zoom: 11,
			};
			this.map = new google.maps.Map(this.refs.mapCanvas.getDOMNode(), mapOptions);
			this.loadDCCAOverlay();
			this.updateDCCAOverlay(this.state.visibleDistrictIds);
			this.setState({initialized: true});
		}
	},
	render: function() {
		var toolTipStyle = {
			visibility: this.state.tooltipText == "" ? "hidden" : "visible",
			left: this.state.tooltipPosition[0],
			top: this.state.tooltipPosition[1],
		};
		return (
			<div style={{height: "100%"}}>
				<div ref="mapCanvas" style={{height: "100%"}}></div>
				<AutoHidePanel>
					<CheckboxList itemIds={this.props.districtCodeList} itemTextMap={this.props.districtLabelMap} checkedItemIds={this.state.visibleDistrictIds} onChange={this.onDCAreaFilterChanged}/>
				</AutoHidePanel>
				<div ref="tooltip" className="toolTip" style={toolTipStyle}>{this.state.tooltipText}</div>
			</div>
		);
	},
	loadDCCAOverlay: function() {
		var dccaTopoJson = require("json!./data/2011dcca.topojson");
		this.dccaLayerByDistrct = _.object(this.props.districtCodeList, _.map(this.props.districtCodeList, function(dcCode) {
			var dcGeoJson = topojson.feature(dccaTopoJson, dccaTopoJson.objects[dcCode]);
			var dccaLayer = new google.maps.Data();
			dccaLayer.setStyle(computeDataStyle(dcCode));
			dccaLayer.addListener("mouseover", this.onMapDataFeatureMouseOver.bind(this, dccaLayer));
			dccaLayer.addListener("mouseout", this.onMapDataFeatureMouseOut.bind(this, dccaLayer));
			dccaLayer.addGeoJson(dcGeoJson);
			dccaLayer.setMap(null);
			return dccaLayer;
		}, this), this);
	},
	onMapDataFeatureMouseOver: function(data, event) {
		var districtCaCode = event.feature.getId();
		var districtName = getLocalizedString(this.props.dccaNameMap[districtCaCode]) + " (" + districtCaCode + ")";
		var orgFillColor = data.getStyle().fillColor;
		data.overrideStyle(event.feature, {fillColor: tinycolor(orgFillColor).brighten(15)});
		this.setState({
			tooltipText: districtName,
			tooltipPosition: [event.kb.clientX + 15, event.kb.clientY + 15],
		});
	},
	onMapDataFeatureMouseOut: function(data, event) {
		data.revertStyle(event.feature);
		this.setState({tooltipText: ""});
	},
	onDCAreaFilterChanged: function(checkedDistricts) {
		this.setState({visibleDistrictIds: checkedDistricts});
		this.updateDCCAOverlay(checkedDistricts);
	},
	updateDCCAOverlay: function(visibleDistrictIds) {
		_.each(this.dccaLayerByDistrct, function(dccaLayer, dcCode) {
			var map = _.contains(visibleDistrictIds, dcCode) ? this.map : null;
			if (dccaLayer.getMap() !== map) {
				dccaLayer.setMap(map);
			}
		}, this);
	},
});
