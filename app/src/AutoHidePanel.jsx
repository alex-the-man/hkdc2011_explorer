var _ = require("underscore");
var React = require("react");

module.exports = React.createClass({
	getInitialState: function() {
		return {
			hidden: true,
		};
	},
	render: function() {
		var className = this.state.hidden ? "panel autoHideHidden" : "panel autoHideShown";
		var style = {
			left: "0px",
			top: "50%"
		};
		return (
			<div style={style} className={className} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
				{this.props.children}
			</div>
		);
	},
	onMouseEnter: function(event) {
		this.setState({ hidden: false });
	},
	onMouseLeave: function(event) {
		this.setState({ hidden: true });
	},
});
