require("file?name=[name].[ext]!./index.html");

var React = require("react");

var DCCAMap = require("jsx!./DCCAMap.jsx");

React.render(<DCCAMap/>, document.body);
