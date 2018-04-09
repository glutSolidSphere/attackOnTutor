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
		'icon' : '/images/avatars/mathemagician_icon.gif',
		'idleAnim' : '/images/avatars/mathemagician_idle.gif',
		'attackAnim' : '/images/avatars/avatar-04.png',
		'height' : '1',
		'width' : '1',
		'runes' : {
			'0' : [
				{
					'width' : 20,
					'height' : 20,
					'name' : 'The Bell Tolls',
					'image' : '',
					'description' : 'Not-so-subtly influencing the bell curve.',
					'damage' : 13,
					'effect' : {
						'image' : '/images/border-image.png',
						'width' : 10,
						'height' : 10,
						'duration' : 3000
					},
					'symbols' : [
						{
							'positionTop' : 0,
							'positionLeft' : 30,
							'height' : 3,
							'width' : 3,
							'completed' : false
						},
						{
							'positionTop' : 0,
							'positionLeft' : 60,
							'height' : 3,
							'width' : 3,
							'completed' : false
						},
						{
							'positionTop' : 0,
							'positionLeft' : 100,
							'height' : 3,
							'width' : 3,
							'completed' : false
						}
					]
				},
				{
					'width' : 25,
					'height' : 25,
					'name' : 'Abacurse',
					'image' : '',
					'description' : 'The best way to solve problem sums.',
					'damage' : 13,
					'effect' : {
						'image' : '/images/border-image.png',
						'width' : 10,
						'height' : 15,
						'duration' : 2000
					},
					'symbols' : [
						{
							'positionTop' : 0,
							'positionLeft' : 30,
							'height' : 3,
							'width' : 3,
							'completed' : false
						},
						{
							'positionTop' : 10,
							'positionLeft' : 60,
							'height' : 3,
							'width' : 3,
							'completed' : false
						},
						{
							'positionTop' : 60,
							'positionLeft' : 100,
							'height' : 3,
							'width' : 3,
							'completed' : false
						}
					]
				}
			],
			'1' : [
				{
					'width' : 30,
					'height' : 30,
					'name' : 'Hexadecimation',
					'image' : '',
					'description' : 'Destruction to the 16th base.',
					'damage' : 8,
					'effect' : {
						'image' : '/images/border-image.png',
						'width' : 30,
						'height' : 10,
						'duration' : 1000
					},
					'symbols' : [
						{
							'positionTop' : 0,
							'positionLeft' : 0,
							'height' : 3,
							'width' : 3,
							'completed' : false
						},
						{
							'positionTop' : 30,
							'positionLeft' : 70,
							'height' : 3,
							'width' : 3,
							'completed' : false
						},
						{
							'positionTop' : 50,
							'positionLeft' : 30,
							'height' : 3,
							'width' : 3,
							'completed' : false
						}
					]
				},
				{
					'width' : 13,
					'height' : 13,
					'name' : 'Ride The Tangent',
					'image' : '',
					'description' : 'Popularised by the band Mathtallica.',
					'damage' : 5,
					'effect' : {
						'image' : '/images/border-image.png',
						'width' : 20,
						'height' : 20,
						'duration' : 1500
					},
					'symbols' : [
						{
							'positionTop' : 60,
							'positionLeft' : 30,
							'height' : 3,
							'width' : 3,
							'completed' : false
						},
						{
							'positionTop' : 30,
							'positionLeft' : 0,
							'height' : 3,
							'width' : 3,
							'completed' : false
						},
						{
							'positionTop' : 20,
							'positionLeft' : 10,
							'height' : 3,
							'width' : 3,
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
		'icon' : '/images/avatars/avatar-02.png',
		'idleAnim' : '/images/avatars/hecatutores_idle.gif',
		'attackAnim' : '/images/avatars/avatar-03.png',
		'height' : '2',
		'width' : '1',
		'runes' : {
			'0' : [
				{
					'width' : 30,
					'height' : 30,
					'name' : 'Palm Reading',
					'damage' : '3',
					'description' : 'Many fates lie in the palms of your hands.',
					'image' : '',
					'effect' : {
						'image' : '/images/border-image.png',
						'width' : 30,
						'height' : 30,
						'duration' : 1500
					},
					'symbols' : [
						{
							'positionTop' : 0,
							'positionLeft' : 30,
							'height' : 3,
							'width' : 3,
							'completed' : false
						},
						{
							'positionTop' : 0,
							'positionLeft' : 60,
							'height' : 3,
							'width' : 3,
							'completed' : false
						},
						{
							'positionTop' : 0,
							'positionLeft' : 100,
							'height' : 3,
							'width' : 3,
							'completed' : false
						}
					]
				},
				{
					'width' : 20,
					'height' : 20,
					'name' : 'Backhanded Compliment',
					'damage' : '3',
					'description' : 'Contractually obliged to help those that don\'t appreciate it.',
					'image' : '',
					'effect' : {
						'image' : '/images/border-image.png',
						'width' : 10,
						'height' : 10,
						'duration' : 1000
					},
					'symbols' : [
						{
							'positionTop' : 0,
							'positionLeft' : 30,
							'height' : 3,
							'width' : 3,
							'completed' : false
						},
						{
							'positionTop' : 10,
							'positionLeft' : 60,
							'height' : 3,
							'width' : 3,
							'completed' : false
						},
						{
							'positionTop' : 60,
							'positionLeft' : 100,
							'height' : 3,
							'width' : 3,
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
					'image' : '',
					'effect' : {
						'image' : '/images/border-image.png',
						'width' : 10,
						'height' : 10,
						'duration' : 1000
					},
					'symbols' : [
						{
							'positionTop' : 0,
							'positionLeft' : 30,
							'height' : 3,
							'width' : 3,
							'completed' : false
						},
						{
							'positionTop' : 30,
							'positionLeft' : 40,
							'height' : 3,
							'width' : 3,
							'completed' : false
						},
						{
							'positionTop' : 20,
							'positionLeft' : 10,
							'height' : 3,
							'width' : 3,
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
		'exp' : '1',
		'name' : 'Mathemagician Prime',
		'description' : 'She eventually unlocked the secret lives of Prime numbers...',
		'icon' : '/images/avatars/mathemagician_icon.gif',
		'idleAnim' : '/images/avatars/mathemagician_prime_idle.gif',
		'attackAnim' : '/images/avatars/avatar-04.png',
		'height' : '1',
		'width' : '1',
		'runes' : {
			'0' : [
				{
					'width' : 20,
					'height' : 20,
					'name' : 'Prime-a Donna',
					'image' : '',
					'description' : '',
					'damage' : 13,
					'effect' : {
						'image' : '/images/border-image.png',
						'width' : 10,
						'height' : 10,
						'duration' : 3000
					},
					'symbols' : [
						{
							'positionTop' : 0,
							'positionLeft' : 30,
							'height' : 3,
							'width' : 3,
							'completed' : false
						},
						{
							'positionTop' : 0,
							'positionLeft' : 60,
							'height' : 3,
							'width' : 3,
							'completed' : false
						},
						{
							'positionTop' : 0,
							'positionLeft' : 100,
							'height' : 3,
							'width' : 3,
							'completed' : false
						}
					]
				},
				{
					'width' : 25,
					'height' : 25,
					'name' : 'Abacurse',
					'image' : '',
					'description' : 'The best way to solve problem sums.',
					'damage' : 13,
					'effect' : {
						'image' : '/images/border-image.png',
						'width' : 10,
						'height' : 15,
						'duration' : 2000
					},
					'symbols' : [
						{
							'positionTop' : 0,
							'positionLeft' : 30,
							'height' : 3,
							'width' : 3,
							'completed' : false
						},
						{
							'positionTop' : 10,
							'positionLeft' : 60,
							'height' : 3,
							'width' : 3,
							'completed' : false
						},
						{
							'positionTop' : 60,
							'positionLeft' : 100,
							'height' : 3,
							'width' : 3,
							'completed' : false
						}
					]
				}
			],
			'1' : [
				{
					'width' : 30,
					'height' : 30,
					'name' : 'Hexadecimation',
					'image' : '',
					'description' : 'Destruction to the 16th base.',
					'damage' : 8,
					'effect' : {
						'image' : '/images/border-image.png',
						'width' : 30,
						'height' : 10,
						'duration' : 1000
					},
					'symbols' : [
						{
							'positionTop' : 0,
							'positionLeft' : 0,
							'height' : 3,
							'width' : 3,
							'completed' : false
						},
						{
							'positionTop' : 30,
							'positionLeft' : 70,
							'height' : 3,
							'width' : 3,
							'completed' : false
						},
						{
							'positionTop' : 50,
							'positionLeft' : 30,
							'height' : 3,
							'width' : 3,
							'completed' : false
						}
					]
				},
				{
					'width' : 13,
					'height' : 13,
					'name' : 'Ride The Tangent',
					'image' : '',
					'description' : 'Popularised by the band Mathtallica.',
					'damage' : 5,
					'effect' : {
						'image' : '/images/border-image.png',
						'width' : 20,
						'height' : 20,
						'duration' : 1500
					},
					'symbols' : [
						{
							'positionTop' : 60,
							'positionLeft' : 30,
							'height' : 3,
							'width' : 3,
							'completed' : false
						},
						{
							'positionTop' : 30,
							'positionLeft' : 0,
							'height' : 3,
							'width' : 3,
							'completed' : false
						},
						{
							'positionTop' : 20,
							'positionLeft' : 10,
							'height' : 3,
							'width' : 3,
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