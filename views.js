var demo = demo || {};
demo.views = demo.views || {};
demo.views = (function() {
// Enrollment
var countTemplate = Handlebars.compile($('#count-template').html());
var StudentListView = Backbone.View.extend({
	initialize: function() {
		this.collection = new demo.models.StudentList();
		this.collection.reset(this.options.students);
	},
	
	render: function() {
		this.enrolledCount = 0, 
		this.unenrolledCount = 0;
		_.each(this.collection.models, function(model) {
			this.renderStudentFromModel(model);
			if (model.attributes.Enrolled) {
				this.enrolledCount++;
			} else {
				this.unenrolledCount++;
			}
			//$(this.el).append(studentView.render());
		}, this);
		
		this.updateCounts();
	},
	
	updateCounts: function() {
		this.$('#enrolledCount').html(countTemplate({ Count: this.enrolledCount, Enrolled: true }));
		this.$('#unenrolledCount').html(countTemplate({ Count: this.unenrolledCount, Enrolled: false }));
	},
	
	renderStudentFromModel: function(model) {
		var studentView = new demo.views.StudentView({ model: model });
		this.renderStudent(studentView);
	},
	
	renderStudent: function(studentView) {
		if (studentView.model.attributes.Enrolled) {
			this.$('#enrolledList').append(studentView.render());
		} else {
			this.$('#unenrolledList').append(studentView.render());
		}
	},
	
	events: {
		'click .add': 'enroll',
		'click .delete': 'unenroll'
	},
	
	enroll: function(event) {
		if (this.changeEnroll(event, true)) {
			this.unenrolledCount--;
			this.enrolledCount++;
			this.updateCounts();			
		}
	},
	
	unenroll: function(event) {
		if (this.changeEnroll(event, false)) {
			this.unenrolledCount++;
			this.enrolledCount--;
			this.updateCounts();			
		}
	},
	
	changeEnroll: function(event, isEnrolled) {
		var modelId = $(event.target).data('id');	
		var model = this.collection.get(modelId); 
		model.set('Enrolled', isEnrolled);		
		this.renderStudentFromModel(model); // redraw in the appropriate column
		return true;
		// console.log(model.attributes.LastName + ' is ' + (isEnrolled ? 'enrolled!' : 'unenrolled.'));
	}
});

var personTemplate = Handlebars.compile($('#person-template').html());
var StudentView = Backbone.View.extend({
	tagName: 'li',
	initialize: function() {
		this.model.bind('change:Enrolled', this.remove, this);
	},
	remove: function() {
		$(this.el).remove();
		this.unbind();
	},
	render: function() {
		$(this.el).html(personTemplate(this.model.toJSON()));
		return this.el;
	}
});

return {
	StudentListView: StudentListView,
	StudentView: StudentView
};
})();
