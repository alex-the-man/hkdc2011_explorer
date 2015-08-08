require("file?name=[name].[ext]!./index.html");

require("style!css!./main.css");

var React = require("react");
var DCCAMap = require("jsx!./DCCAMap.jsx");
var DCCAInfo = require("jsx!./DCCAInfo.jsx");

Main = React.createClass({
	getInitialState: function() {
		return {
			districtCode: null
		};
	},
	
	onDccaChange: function (districtCode) {
		this.setState({districtCode: districtCode});
	},

	render: function() {
		return (
			<div style={{height: "100%", overflow: "hidden"}}>
				<DCCAMap onDccaChange={this.onDccaChange}/>
				<DCCAInfo districtCode={this.state.districtCode}/>
			</div>
		);
	}
});

React.render(<Main/>, document.body);
