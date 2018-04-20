"use strict";

var user = require('./user');
var userAvatar = require ('./userAvatar');

var dataTable = {
	'avatar-01' : {
		'id' : 'avatar-01',
		'type' : 'student',
		'exp' : '1',
		'name' : 'Mathemagician',
		'description' : 'She fell on an abacus rack and said "I\'ll take it all!"',
		'icon' : '/images/avatars/mathemagician/icon.gif',
		'idleAnim' : '/images/avatars/mathemagician/idle.gif',
		'attackAnim' : '/images/avatars/mathemagician/attack.gif',
		'height' : '1',
		'width' : '1',
		'runes' : {
			'0' : [
				{
					'width' : 20,
					'height' : 20,
					'name' : 'The Bell Tolls',
					'image' : '/images/runes/the_bell_tolls_rune.gif',
					'description' : 'Not-so-subtly influencing the bell curve.',
					'damage' : 13,
					'effect' : {
						'image' : '/images/effects/the_bell_tolls_effect.gif',
						'width' : 10,
						'height' : 10,
						'duration' : 3000
					},
					'symbols' : [
						{
							'positionTop' : 14,
							'positionLeft' : 45,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 46,
							'positionLeft' : 37,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 74,
							'positionLeft' : 17,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 36,
							'positionLeft' : 63,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 66,
							'positionLeft' : 85,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 81,
							'positionLeft' : 53,
							'height' : 10,
							'width' : 10,
							'completed' : false
						}
					]
				},
				{
					'width' : 20,
					'height' : 20,
					'name' : 'Abacurse',
					'image' : '/images/runes/abacurse_rune.gif',
					'description' : 'The best way to solve problem sums.',
					'damage' : 8,
					'effect' : {
						'image' : '/images/effects/abacurse_effect.gif',
						'width' : 10,
						'height' : 10,
						'duration' : 2000
					},
					'symbols' : [
						{
							'positionTop' : 31,
							'positionLeft' : 46,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 66,
							'positionLeft' : 15,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 74,
							'positionLeft' : 53,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 37,
							'positionLeft' : 84,
							'height' : 10,
							'width' : 10,
							'completed' : false
						}
					]
				}
			],
			'1' : [
				{
					'width' : 20,
					'height' : 20,
					'name' : 'Hexadecimation',
					'image' : '/images/runes/hexadecimation_rune.gif',
					'description' : 'Destruction to the 16th base.',
					'damage' : 9,
					'effect' : {
						'image' : '/images/effects/hexadecimation_effect.gif',
						'width' : 10,
						'height' : 10,
						'duration' : 1000
					},
					'symbols' : [
						{
							'positionTop' : 19,
							'positionLeft' : 36,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 79,
							'positionLeft' : 33,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 20,
							'positionLeft' : 66,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 80,
							'positionLeft' : 61,
							'height' : 10,
							'width' : 10,
							'completed' : false
						}
					]
				},
				{
					'width' : 20,
					'height' : 20,
					'name' : 'Ride The Tangent',
					'image' : '/images/runes/ride_the_tangent_rune.gif',
					'description' : 'Popularised by the band Mathtallica.',
					'damage' : 5,
					'effect' : {
						'image' : '/images/effects/ride_the_tangent_effect.gif',
						'width' : 10,
						'height' : 10,
						'duration' : 1500
					},
					'symbols' : [
						{
							'positionTop' : 18,
							'positionLeft' : 81,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 49,
							'positionLeft' : 55,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 81,
							'positionLeft' : 23,
							'height' : 10,
							'width' : 10,
							'completed' : false
						}
					]
				}
			]
		}
	},
	'avatar-02' : {
		'id' : 'avatar-02',
		'type' : 'tutor',
		'exp' : '1',
		'name' : 'Hecatutores',
		'description' : 'A hundred hands of unfathomable strength, with fifty heads to boot. Because teaching is hard.',
		'icon' : '/images/avatars/hecatutores/icon.gif',
		'idleAnim' : '/images/avatars/hecatutores/idle.gif',
		'attackAnim' : '/images/avatars/hecatutores/attack.gif',
		'height' : '2',
		'width' : '1',
		'runes' : {
			'0' : [
				{
					'width' : 15,
					'height' : 15,
					'name' : 'Palm Reading',
					'damage' : '3',
					'description' : 'Many fates lie in the palms of your hands.',
					'image' : '/images/runes/palm_reading_rune.gif',
					'effect' : {
						'image' : '/images/effects/palm_reading_effect.gif',
						'width' : 15,
						'height' : 15,
						'duration' : 2500
					},
					'symbols' : [
						{
							'positionTop' : 39,
							'positionLeft' : 19,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 20,
							'positionLeft' : 50,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 47,
							'positionLeft' : 83,
							'height' : 10,
							'width' : 10,
							'completed' : false
						}
					]
				},
				{
					'width' : 15,
					'height' : 15,
					'name' : 'Backhanded Compliment',
					'damage' : '3',
					'description' : 'Contractually obliged to help those that don\'t appreciate it.',
					'image' : '/images/runes/backhanded_compliment_rune.gif',
					'effect' : {
						'image' : '/images/effects/backhanded_compliment_effect.gif',
						'width' : 15,
						'height' : 15,
						'duration' : 2500
					},
					'symbols' : [
						{
							'positionTop' : 27,
							'positionLeft' : 30,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 49,
							'positionLeft' : 56,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 84,
							'positionLeft' : 61,
							'height' : 10,
							'width' : 10,
							'completed' : false
						}
					]
				},
				{
					'width' : 15,
					'height' : 15,
					'name' : 'Heavyhanded Approach',
					'damage' : '3',
					'description' : 'The oven may be hot but it takes heat for the bread to rise.',
					'image' : '/images/runes/heavy_handed_approach_rune.gif',
					'effect' : {
						'image' : '/images/effects/heavy_handed_approach_effect.gif',
						'width' : 15,
						'height' : 15,
						'duration' : 2500
					},
					'symbols' : [
						{
							'positionTop' : 20,
							'positionLeft' : 78,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 55,
							'positionLeft' : 68,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 80,
							'positionLeft' : 31,
							'height' : 10,
							'width' : 10,
							'completed' : false
						}
					]
				}
			]
		}
	},
	'avatar-03' : {
		'id' : 'avatar-03',
		'type' : 'student',
		'exp' : '6',
		'name' : 'Mathemagician Prime',
		'description' : 'She eventually unlocked the secret lives of Prime numbers...',
		'icon' : '/images/avatars/mathemagician_prime/icon.gif',
		'idleAnim' : '/images/avatars/mathemagician_prime/idle.gif',
		'attackAnim' : '/images/avatars/mathemagician_prime/attack.gif',
		'height' : '1',
		'width' : '1',
		'runes' : {
			'0' : [
				{
					'width' : 20,
					'height' : 20,
					'name' : 'Prime-a Donna',
					'image' : '/images/runes/primeadonna_rune.gif',
					'description' : 'Prime numbers are all the rage now.',
					'damage' : 15,
					'effect' : {
						'image' : '/images/effects/primeadonna_effect.gif',
						'width' : 10,
						'height' : 10,
						'duration' : 3000
					},
					'symbols' : [
						{
							'positionTop' : 23,
							'positionLeft' : 45,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 68,
							'positionLeft' : 20,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 58,
							'positionLeft' : 57,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 85,
							'positionLeft' : 43,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 35,
							'positionLeft' : 72,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 74,
							'positionLeft' : 85,
							'height' : 10,
							'width' : 10,
							'completed' : false
						}
					]
				},
				{
					'width' : 25,
					'height' : 25,
					'name' : 'Linear Algeblast',
					'image' : '/images/runes/linear_algeblast_rune.gif',
					'description' : 'Simultaneous equations are quaking.',
					'damage' : 13,
					'effect' : {
						'image' : '/images/effects/linear_algeblast_effect.gif',
						'width' : 10,
						'height' : 10,
						'duration' : 2000
					},
					'symbols' : [
						{
							'positionTop' : 22,
							'positionLeft' : 18,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 40,
							'positionLeft' : 76,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 64,
							'positionLeft' : 25,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 80,
							'positionLeft' : 86,
							'height' : 10,
							'width' : 10,
							'completed' : false
						}
					]
				}
			],
			'1' : [
				{
					'width' : 30,
					'height' : 30,
					'name' : 'High-order Destructives',
					'image' : '/images/runes/highorder_destructives_rune.gif',
					'description' : 'Many layers of destructive potential, one after another.',
					'damage' : 10,
					'effect' : {
						'image' : '/images/effects/highorder_destructives_effect.gif',
						'width' : 10,
						'height' : 10,
						'duration' : 1000
					},
					'symbols' : [
						{
							'positionTop' : 25,
							'positionLeft' : 36,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 67,
							'positionLeft' : 37,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 82,
							'positionLeft' : 79,
							'height' : 10,
							'width' : 10,
							'completed' : false
						}
					]
				},
				{
					'width' : 13,
					'height' : 13,
					'name' : 'Multivar Calculazer',
					'image' : '/images/runes/multivar_calculazers_rune.gif',
					'description' : 'What\'s better than a lazer? Multivariable lazers.',
					'damage' : 7,
					'effect' : {
						'image' : '/images/effects/multivar_calculazers_effect.gif',
						'width' : 10,
						'height' : 10,
						'duration' : 1500
					},
					'symbols' : [
						{
							'positionTop' : 18,
							'positionLeft' : 19,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 20,
							'positionLeft' : 72,
							'height' : 10,
							'width' : 10,
							'completed' : false
						},
						{
							'positionTop' : 72,
							'positionLeft' : 83,
							'height' : 10,
							'width' : 10,
							'completed' : false
						}
					]
				}
			]
		}
	},
};

var association = {
	'User' : {
		'table' : user,
		'through' : userAvatar,
		'linkElementSource' : 'AvatarId',
		'linkElementThrough' : 'UserId',
		'linkElementTable' : 'id'
	}
};

var findAndCountAll = function ( params ) {
	
	var returnObj = {
		'count' : 0,
		'rows': [] //Data is stored under the key 'dataValues'.
	};
	
	var include = [];
	var attributes = [];
	var where = {};
	
	if ( params.hasOwnProperty ( 'include' ) )
	{
		include = params.include;
	}
	if ( params.hasOwnProperty ( 'attributes' ) )
	{
		attributes = params.attributes;
	}
	if ( params.hasOwnProperty ( 'where' ) )
	{
		where = params.where;
	}
	
	//Parse the where params first.
	var parsedDataTable = {};
	Object.keys(dataTable).forEach ( function (id) {
		var whereKeys = Object.keys(where);
		var match = true;
		for ( var i = 0; i < whereKeys.length; i++ )
		{
			if ( whereKeys[i] == "id" )
			{
				if ( where[whereKeys[i]] != id )
				{
					match = false;
					break;
				}
			}
			else
			{
				if ( where[whereKeys[i]] != dataTable[id][whereKeys[i]] )
				{
					match = false;
					break;
				}
			}
		}
		if ( match )
			parsedDataTable[id] = dataTable[id];
	});
	
	//Parse the includes.
	if ( include.length > 0 )
	{
		var includeParams = {};
		for ( var includeIndex = 0; includeIndex < include.length; includeIndex++ )
		{
			include[includeIndex].model = include[includeIndex].model.name;
			if ( association.hasOwnProperty ( include[includeIndex].model ) )
			{
				if ( !include[includeIndex].hasOwnProperty ( 'attributes' ) )
				{
					include[includeIndex].attributes = [];
				}
				
				if ( !include[includeIndex].hasOwnProperty ( 'where' ) )
				{
					include[includeIndex].where = {};
				}
				includeParams[include[includeIndex].model] = association[include[includeIndex].model].table.findAndCountAll ({
					'where' : include[includeIndex].where,
					'attributes' : include[includeIndex].attributes
				});
			}
		}
		
		Object.keys(parsedDataTable).forEach ( function (id) {
			var returnObjData = null;
			//Go through the includes with where parameters to filter this table's data by those attributes.
			Object.keys(includeParams).forEach ( function (tableName) {
				if ( association.hasOwnProperty ( tableName ) )
				{
					for ( var i = 0; i < includeParams[tableName].rows.length; i++ )
					{
						var throughTableWhere = {};
						throughTableWhere[association[tableName].linkElementThrough] = includeParams[tableName].rows[i].dataValues[association[tableName].linkElementTable];
						var throughTableData = association[tableName].through.findAndCountAll ({
							'where' : throughTableWhere
						});
						
						for ( var j = 0; j < throughTableData.rows.length; j++ )
						{
							//Add entries with matching linkElements to returnObj.
							if ( id == throughTableData.rows[j].dataValues[association[tableName].linkElementSource] )
							{
								if ( returnObjData === null )
								{
									returnObjData = Object.assign({}, parsedDataTable[throughTableData.rows[j].dataValues[association[tableName].linkElementSource]]);
									returnObjData.dataValues = parsedDataTable[throughTableData.rows[j].dataValues[association[tableName].linkElementSource]];
								}
								if ( !returnObjData.hasOwnProperty ( tableName ) )
								{
									returnObjData[tableName] = {
										'rows' : []
									}
								}
								includeParams[tableName].rows[i][association[tableName].through.name] = throughTableData.rows[j];
								returnObjData[tableName].rows.push ( Object.assign({}, includeParams[tableName].rows[i]) );
							}
						}
					}
				}
			});
			if ( returnObjData !== null )
			{
				returnObj.count++;
				returnObj.rows.push (returnObjData);
			}
		});
	}
	else
	{
		Object.keys(parsedDataTable).forEach ( function (id) {
			var returnObjData = Object.assign({}, parsedDataTable[id]);
			returnObjData.dataValues = parsedDataTable[id];
			returnObj.count++;
			returnObj.rows.push (returnObjData);
		});
	}
	
	return returnObj;
};

var findOne = function ( params ) {
	
	var returnObj = {
		'dataValues': {}
	};
	
	var include = [];
	var attributes = [];
	var where = {};
	
	if ( params.hasOwnProperty ( 'include' ) )
	{
		include = params.include;
	}
	if ( params.hasOwnProperty ( 'attributes' ) )
	{
		attributes = params.attributes;
	}
	if ( params.hasOwnProperty ( 'where' ) )
	{
		where = params.where;
	}
	
	//Parse the where params first.
	var parsedDataTable = {};
	Object.keys(dataTable).forEach ( function (id) {
		var whereKeys = Object.keys(where);
		var match = true;
		for ( var i = 0; i < whereKeys.length; i++ )
		{
			if ( whereKeys[i] == "id" )
			{
				if ( where[whereKeys[i]] != id )
				{
					match = false;
					break;
				}
			}
			else
			{
				if ( where[whereKeys[i]] != dataTable[id][whereKeys[i]] )
				{
					match = false;
					break;
				}
			}
		}
		if ( match )
			parsedDataTable[id] = dataTable[id];
	});
	
	//Parse the includes.
	if ( include.length > 0 )
	{
		var includeParams = {};
		for ( var includeIndex = 0; includeIndex < include.length; includeIndex++ )
		{
			include[includeIndex].model = include[includeIndex].model.name;
			if ( association.hasOwnProperty ( include[includeIndex].model ) )
			{
				if ( !include[includeIndex].hasOwnProperty ( 'attributes' ) )
				{
					include[includeIndex].attributes = [];
				}
				
				if ( !include[includeIndex].hasOwnProperty ( 'where' ) )
				{
					include[includeIndex].where = {};
				}
				includeParams[include[includeIndex].model] = association[include[includeIndex].model].table.findAndCountAll ({
					'where' : include[includeIndex].where,
					'attributes' : include[includeIndex].attributes
				});
			}
		}
		
		var ids = Object.keys(parsedDataTable);
		for ( var idIndex = 0; idIndex < ids.length; idIndex++ )
		{
			var returnObjData = null;
			//Go through the includes with where parameters to filter this table's data by those attributes.
			var tableNames = Object.keys(includeParams);
			for ( var tableNameIndex = 0; tableNameIndex < tableNames.length; tableNameIndex++ )
			{
				if ( association.hasOwnProperty ( tableNames[tableNameIndex] ) )
				{
					for ( var i = 0; i < includeParams[tableNames[tableNameIndex]].rows.length; i++ )
					{
						var throughTableWhere = {};
						throughTableWhere[association[tableNames[tableNameIndex]].linkElementThrough] = includeParams[tableNames[tableNameIndex]].rows[i].dataValues[association[tableNames[tableNameIndex]].linkElementTable];
						var throughTableData = association[tableNames[tableNameIndex]].through.findAndCountAll ({
							'where' : throughTableWhere
						});
						
						for ( var j = 0; j < throughTableData.rows.length; j++ )
						{
							//Add entries with matching linkElements to returnObj.
							if ( id == throughTableData.rows[j].dataValues[association[tableNames[tableNameIndex]].linkElementSource] )
							{
								if ( returnObjData == null )
								{
									returnObjData = Object.assign({}, parsedDataTable[throughTableData.rows[j].dataValues[association[tableNames[tableNameIndex]].linkElementSource]]);
									returnObjData.dataValues = parsedDataTable[throughTableData.rows[j].dataValues[association[tableNames[tableNameIndex]].linkElementSource]];
								}
								if ( !returnObjData.hasOwnProperty ( tableNames[tableNameIndex] ) )
								{
									returnObjData[tableNames[tableNameIndex]] = {
										'rows' : []
									}
								}
								includeParams[tableNames[tableNameIndex]].rows[i][association[tableNames[tableNameIndex]].through.name] = throughTableData.rows[j];
								returnObjData[tableNames[tableNameIndex]].rows.push ( Object.assign({}, includeParams[tableNames[tableNameIndex]].rows[i]) );
							}
						}
					}
				}
			}
			if ( returnObjData !== null )
			{
				returnObj = returnObjData;
				return new Promise ( function (resolve, reject) {
					returnObj.update = update;
					returnObj.increment = increment;
					resolve (returnObj);
				});
			}
		}
	}
	else
	{
		var ids = Object.keys(parsedDataTable);
		for ( var idIndex = 0; idIndex < ids.length; idIndex++ )
		{
			returnObj = Object.assign({}, parsedDataTable[ids[idIndex]]);
			returnObj.dataValues = parsedDataTable[ids[idIndex]];
			return new Promise ( function (resolve, reject) {
				returnObj.update = update;
				returnObj.increment = increment;
				resolve (returnObj);
			});
		}
	}
	
	return new Promise ( function (resolve, reject) {
		resolve (null);
	});
};

var increment = function ( dataKeys, params ) {
	if ( dataTable.hasOwnProperty ( this.id ) )
	{
		for ( var idIndex = 0; idIndex < dataKeys.length; idIndex++ )
		{
			if ( dataTable[this.id].hasOwnProperty ( dataKeys[idIndex] ) )
			{
				if ( params.hasOwnProperty ( "by" ) )
				{
					dataTable[this.id][dataKeys[idIndex]] += params.by;
				}
			}
		}
	}
};

var update = function ( params ) {
	var ids = Object.keys(params);
	if ( dataTable.hasOwnProperty ( this.id ) )
	{
		for ( var idIndex = 0; idIndex < ids.length; idIndex++ )
		{
			if ( dataTable[this.id].hasOwnProperty ( ids[idIndex] ) )
			{
				dataTable[this.id][ids[idIndex]] = params[ids[idIndex]];
			}
		}
	}
};

/*
module.exports = function (sequelize, DataTypes) {

	var Avatar = sequelize.define('Avatar', {
		id: {
			type: DataTypes.STRING,
			unique: true,
			primaryKey: true
		},
		name: { type: DataTypes.STRING },
		price: { type: DataTypes.INTEGER },
		url: { type: DataTypes.STRING }
	}, {
		classMethods: {
			associate: function (models) {
				Avatar.belongsToMany(models.User, {
					through: 'userAvatar'
				});
			}
		}
	});

	return Avatar;

}
*/
module.exports.findAll = findAndCountAll;
module.exports.find = findOne;
module.exports.findAndCountAll = findAndCountAll;
module.exports.findOne = findOne;
module.exports.name = "Avatar";