var _ = require("underscore");
var React = require("react");

var DcMembers = require("json!./data/dc_members.json");

module.exports = React.createClass({
	render: function() {
		var infoDivStyle = {
			right: "1%",
			top: "45%"
		};
		var districtCode = this.props.districtCode;
		if (!districtCode || !DcMembers[districtCode] || !DcMembers[districtCode]["T"]) {
			infoDivStyle.display = "none";
			return (<div style={infoDivStyle} className="panel"/>);
		} else {
			var dcMember = DcMembers[districtCode]["T"];

			return (
				<div style={infoDivStyle} className="panel">
					<div>{dcMember.name}</div>
					<div>{dcMember.occupation}</div>
					<div>{dcMember.politicalAffiliation}</div>
					<div>{dcMember.phone}</div>
					<div>{dcMember.email}</div>
				</div>
			);
		}
	}
});
