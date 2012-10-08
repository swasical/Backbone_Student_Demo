var demo = demo || {};
demo.views = demo.views || {};
(function() {
	// Immediate
	var immediateEditTemplate = Handlebars.compile($('#studentEdit-template').html());
	var immediateViewTemplate = Handlebars.compile($('#studentView-template').html());
	demo.views.AllImmediateView = Backbone.View.extend({
		initialize: function() {
			this.el = this.options.el;
			this.model = new demo.models.Student();			
			this.model.set(this.options.model);
			// this.model.fetch
						
			var self = this;
			this.readView = new demo.views.ReadOnlyView({ 
				model: this.model, 
				editFn: function() {
					self.editView.$el.fadeIn(200);
				}
			});
			
			if (this.options.undoSave) {
				this.model.set({ UndoSave: true});
				this.editView = new demo.views.CommitEditView({ model: this.model });
			} else {
				this.editView = new demo.views.ImmediateEditView({ model: this.model });
			}			
		},
		
		render: function() {
		    $(this.el).empty();
			$(this.el).append(this.readView.render());
			$(this.el).append(this.editView.render());
		}
	});

	demo.views.ReadOnlyView = Backbone.View.extend({
		tagName: 'fieldset',
		className: 'left-col',
		events: {
			'click .editImmediate': 'edit'
		},
		
		initialize: function() {
			this.model.bind('change:LastName', this.render, this);
			this.model.bind('change:FirstName', this.render, this);			
			this.editFn = this.options.editFn;
		},
		
		render: function() {
			$(this.el).html(immediateViewTemplate(this.model.toJSON()));
			return this.el;
		},
		
		edit: function() {
			if (this.editFn) {
				this.editFn();
			}
		}
	});

	demo.views.StudentEditView = Backbone.View.extend({
		tagName: 'fieldset',
		className: 'hidden',
		render: function() {
			$(this.el).html(immediateEditTemplate(this.model.toJSON()));
			return this.el;
		},
		
		close: function() {
			this.$el.fadeOut(100);
		}
	});
	
	demo.views.ImmediateEditView = demo.views.StudentEditView.extend({
		events: {
			'click .closeImmediate': 'close',
			'keyup input[type="text"]': 'updateName'
		},	
		updateName: function(event) {
			var target = $(event.target);
			var propToSave = (target.attr('id').match(/LastName$/)) ? "LastName" : "FirstName";
			this.model.set(propToSave, target.val());
		}
	});
	
	demo.views.CommitEditView = demo.views.ImmediateEditView.extend({
		events: {
			'click .closeImmediate': 'close',
			'click .save': 'save',
			'click .undo': 'undo',
		},
		initialize: function() {
			this.undoModel = this.model.clone();
		},
		save: function(event) {
			this.model.set({ 
				LastName: this.$('input[name=LastName]').val(),
				FirstName: this.$('input[name=FirstName]').val() 
			});
			this.undoModel = this.model.clone();
		},
		undo: function(event) {
			this.model.set(this.undoModel.toJSON());
			this.render();
		}
	});	
})();