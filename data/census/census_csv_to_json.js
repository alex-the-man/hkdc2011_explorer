var lineReader = require('line-reader');
var fs = require("fs");

var censusDb = {};

function isNullOrUndefined(obj) {
	return obj === null || typeof obj === "undefined";
}

function parseLine(line) {
	var parsedLine = line.split(",");
	if (parsedLine.length != 7) {
		console.error("Cannot parse %s", line);
	}
	
	var region = parsedLine[0];
	var district = parsedLine[1];
	var area = parsedLine[2];
	var table = parsedLine[3];
	var row = parsedLine[4];
	var column = parsedLine[5];
	var value = parsedLine[6];
	
	if (isNullOrUndefined(censusDb[area])) {
		censusDb[area] = {
			"region": region,
			"district": district,
			"area": area,
			"tables": []
		};
	}
	if (isNullOrUndefined(censusDb[area].tables[table])) {
		censusDb[area].tables[table] = {}
	}
	if (isNullOrUndefined(censusDb[area].tables[table][row])) {
		censusDb[area].tables[table][row] = {}
	}
	censusDb[area].tables[table][row][column] = value;
}

var firstLine = true;
lineReader.eachLine('input/census.csv', function(line, last) {
	if (firstLine) {
		firstLine = false;
	} else {
		parseLine(line.toString());
		if (last) {
			fs.writeFile("output/census.json", JSON.stringify(censusDb, null, 2));
		}
	}
});

