export const CategoryMaster = new Mongo.Collection('categoryMaster');
// export const CategoryMaster = new Mongo.Collection('categorymasters');

if(Meteor.isServer){
	Meteor.publish("allCategory",function(){
		return CategoryMaster.find({});
	});
}

Meteor.methods({
	"addCategory":function(categoryName,NoofQuestion,categoryMarks,_id){
		if(!_id){
			CategoryMaster.insert({
				'categoryName': categoryName,
				'NoofQuestion': NoofQuestion,
				'categoryMarks': categoryMarks,
				'levels':[
						{
							[categoryName + '1']: 'Below 7 year'
						},
						{
							[categoryName + '2']: '7-9 year'
						},
						{
							[categoryName + '3']: '9-11 year'
						},
						{
							[categoryName + '4']: '11-14 year'
						}
					],
			});
		}else{
			CategoryMaster.update({"_id":_id},{
				$set:{
					'categoryName': categoryName,
					'NoofQuestion': NoofQuestion,
					'categoryMarks': categoryMarks,
				}
			});
		}
	},

	//remove Category

	'removeCategory':function(_id){
		CategoryMaster.remove({"_id":_id});
	},
	
	'getCategory':function(){
		return CategoryMaster.find({});
	},
	'getCategoryAndSubcategory':function(){
		// console.log("in function");
		return CategoryMaster.find({}).fetch()||{};
	},
	'getSingleCategory':function(category){
		return CategoryMaster.findOne({"categoryName":category},{fields:{"levels":1}});
	}
});