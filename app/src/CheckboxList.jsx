var _ = require("underscore");
var React = require("react");

module.exports = React.createClass({
	getInitialState: function() {
		return {
		};
	},
	render: function() {
		return (
			<div>
				{
					this.props.itemIds.map(function(itemId) {
						var checked = _.contains(this.props.checkedItemIds, itemId);
						return (
							<label key={itemId} className="checkboxAsButton">
								<input type="checkbox" value={itemId} onChange={this.onItemCheckboxChange} checked={checked}/>
								<span>{this.props.itemTextMap[itemId]}</span>
							</label>
						);
					}, this)
				}
				<label className="checkboxAsButton">
						<input type="checkbox" checked={this.props.checkedItemIds.length == this.props.itemIds.length} onChange={this.onSelectAllCheckboxChange}/>
						<span>All</span>
				</label>
			</div>
		);
	},
	onItemCheckboxChange: function(event) {
		if (event.target.checked) {
			if (!_.contains(this.props.checkedItemIds, event.target.value)) {
				this.props.checkedItemIds.push(event.target.value);
				this.fireOnChange(this.props.checkedItemIds);
			}
		} else {
			if (_.contains(this.props.checkedItemIds, event.target.value)) {
				this.fireOnChange(_.without(this.props.checkedItemIds, event.target.value));
			}
		}
	},
	onSelectSingleItem: function(itemId) {
		this.fireOnChange([itemId]);
	},
	onSelectAllCheckboxChange: function(event) {
		if (event.target.checked) {
			this.fireOnChange(this.props.itemIds);
		} else {
			this.fireOnChange([]);
		}
	},
	fireOnChange: function(checkedItemIds) {
		if (this.props.onChange) {
			this.props.onChange(checkedItemIds);
		}
	},
});
