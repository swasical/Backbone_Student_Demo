var demo = demo || {};
demo.views = demo.views || {};

demo.views.mainView = Backbone.View.extend({
	initialize: function() {	
		// immediate update
		var immediateView = new demo.views.AllImmediateView({ 
			el: '#immediate',
			model: { Id:1, LastName: "Jensen", FirstName: "Nate", Enrolled: true }
		});
		immediateView.render();	
		
		// commit update
		var commitView = new demo.views.AllImmediateView({ 
			el: '#commit',
			model: { Id:1, LastName: "Jensen", FirstName: "Nate", Enrolled: true },
			undoSave: true
		});
		commitView.render();	
		
		// enrollment control
		var studentNames;
		studentNames = this.getStudents(20);	
		var studentsView = new demo.views.StudentListView({
			el: '#enrollDiv',
		    students: studentNames
		});	    
		studentsView.render();
	},
	
	getStudents: function(numStudents) {
		var last_names = (function(){
			return ['Jensen', 'Jones', 'Jagger', 'Kaufman', 'Brown', 'Black', 'White', 'Roden', 'Miller', 'Staten', 'Norris', 'Romney']
		})();
		var first_names = (function(){
			return ['Greg', 'Kyle', 'Rick', 'Mitt', 'Barack', 'Emma', 'Kisha', 'Bob', 'Daniel', 'Sam', 'Jesse', 'Chuck']
		})();
		var i = 1;
		var students = [];
		var randomnumber = function() { return Math.floor(Math.random()*12) };
		for (; i <= numStudents; i++) {
			students.push({ 
				Id: i, 
				LastName: last_names[randomnumber()], 
				FirstName: first_names[randomnumber()], 
				Enrolled: randomnumber() > 5
			}); 
		}
		
		return students;
	}	
});

// = 
// [
	 // { Id:1, LastName: "Jensen", FirstName: "Nate", Enrolled: true },
	 // { Id:2, LastName: "Kaufman", FirstName: "Eric", Enrolled: true },
	 // { Id:3, LastName: "Jones", FirstName: "Mike", Enrolled: false }
// ];
