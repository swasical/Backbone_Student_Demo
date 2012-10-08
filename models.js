var demo = demo || {};
demo.models = (function() {
var Student = Backbone.Model.extend({
	idAttribute: "Id"
});

var StudentList = Backbone.Collection.extend({
	model: Student
});

return {
	Student: Student,
	StudentList: StudentList
};
})();
