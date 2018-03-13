'use strict';

var tutorial = require('./tutorial');
var userTutorial = require('./userTutorial');
var avatar = require('./avatar');
var userAvatar = require ('./userAvatar');

var dataTable = {
	'b0123456' : {
		'id' : 'b0123456',
		'name' : 'HAPPY STUDENT',
		'email' : 'happy@student.com',
		'gender' : 'male',
		'token' : 'fake-token-1',
		'avatarId' : 'avatar-01',
		'accountName' : 'happy',
		'password' : '5f4dcc3b5aa765d61d8327deb882cf99'
	},
	'c0123456' : {
		'id' : 'c0123456',
		'name' : 'SAD STUDENT',
		'email' : 'sad@student.com',
		'gender' : 'female',
		'token' : 'fake-token-2',
		'avatarId' : 'avatar-01',
		'accountName' : 'sad',
		'password' : '5f4dcc3b5aa765d61d8327deb882cf99'
	},
	'd0123456' : {
		'id' : 'd0123456',
		'name' : 'SMART STUDENT',
		'email' : 'smart@student.com',
		'gender' : 'male',
		'token' : 'fake-token-3',
		'avatarId' : 'avatar-01',
		'accountName' : 'smart',
		'password' : '5f4dcc3b5aa765d61d8327deb882cf99'
	},
	'e0123456' : {
		'id' : 'e0123456',
		'name' : 'BRIGHT STUDENT',
		'email' : 'bright@student.com',
		'gender' : 'female',
		'token' : 'fake-token-4',
		'avatarId' : 'avatar-01',
		'accountName' : 'bright',
		'password' : '5f4dcc3b5aa765d61d8327deb882cf99'
	},
	'f0123456' : {
		'id' : 'f0123456',
		'name' : 'FUN STUDENT',
		'email' : 'fun@student.com',
		'gender' : 'male',
		'token' : 'fake-token-5',
		'avatarId' : 'avatar-01',
		'accountName' : 'fun',
		'password' : '5f4dcc3b5aa765d61d8327deb882cf99'
	}
};

var association = {
	'Tutorial' : {
		'table' : tutorial,
		'through' : userTutorial,
		'linkElementSource' : 'userId',
		'linkElementThrough' : 'tutorialId',
		'linkElementTable' : 'id'
	},
	'Avatar' : {
		'table' : avatar,
		'through' : userAvatar,
		'linkElementSource' : 'UserId',
		'linkElementThrough' : 'AvatarId',
		'linkElementTable' : 'id'
	},
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
module.exports = function(sequelize, DataTypes) {

	var User = sequelize.define('User', {
		id: {
			type: DataTypes.STRING,
			unique: true,
			primaryKey: true,
			validate: {
				notEmpty: true,
				isUnique: function(value, next) {
					User.find({
						where: {
							id: value
						}
					}).then(function (user) {
						if (user) {
							return next ('User already exists!');
						}
						return next ();
					}).catch(function (err) {
						return next (err);
					});
				}
			}
		},
		name: { type: DataTypes.STRING },
		email: { type: DataTypes.STRING },
		gender: { type: DataTypes.ENUM('Male', 'Female') },
		token: { type: DataTypes.STRING(511) },
		avatarId: { type: DataTypes.STRING }
	}, {
		classMethods: {
			associate: function(models) {
        		User.belongsToMany(models.Tutorial, {
        			through: 'userTutorial'
        		});
        		User.belongsToMany(models.Avatar, {
        			through: 'userAvatar'
        		});
    		}
    	}		
	}, {
		instanceMethods: {
			toJSON: function () {
				var values = this.get();
				delete values.token;
				return values;
			}
		}
    });

	User.test2 = findOne;
	User.test = findAndCountAll;
	User.name = "User";
	return User;
};
*/

module.exports.findAll = findAndCountAll;
module.exports.find = findOne;
module.exports.findOne = findOne;
module.exports.findAndCountAll = findAndCountAll;
module.exports.name = "User";