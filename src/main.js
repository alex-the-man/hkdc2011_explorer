require('script!../deps/zepto.min.js');

var topojson = require('topojson');
var React = require('react');

function moveTooltip(x, y) {
	var tooltipDiv = $('#tooltip');
	tooltipDiv.offset({left: x + 15, top: y + 15});
}

function updateTooltip(text, x, y) {
	var tooltipDiv = $('#tooltip');
	tooltipDiv.text(text);
	if (text == '') {
		tooltipDiv.hide();
	} else {
		tooltipDiv.show();
	}
	moveTooltip(x, y);
}

function loadDCCABoundary(map) {
	var dccaTopoJson = require('json!./assets/2011dcca.topojson');
	var dccaGeoJson = topojson.feature(dccaTopoJson, dccaTopoJson.objects['2011dcca']);
	map.data.addGeoJson(dccaGeoJson);
	map.data.setStyle({
			strokeWeight: 1.5
	});
	map.data.addListener('mouseover', function(event) {
		var districtName = event.feature.getProperty('CNAME') + ' ' + event.feature.getProperty('ENAME');
		updateTooltip(districtName, event.kb.clientX, event.kb.clientY);
		map.data.overrideStyle(event.feature, {fillColor: 'blue'});
	});
	map.data.addListener('mouseout', function(event) {
		updateTooltip('');
		map.data.overrideStyle(event.feature, {fillColor: null});
	});
}

function initialize() {
	var mapOptions = {
		center: { lat: 22.3300, lng: 114.1880},
		zoom: 11
	};
	var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	loadDCCABoundary(map);
}

google.maps.event.addDomListener(window, 'load', initialize);
