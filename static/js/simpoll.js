var Simpoll = { views: {}, models: {}, collections: {} };

(function($, undefined) {

Simpoll.models.Person = Backbone.Model.extend();

Simpoll.collections.Persons = Backbone.Collection.extend({
  model: Simpoll.models.Person,
  url: '/persons'
});

Simpoll.models.PersonModel = Backbone.Model.extend({
  url: '/persons',
  parse: function(response) {
    response.persons = new Simpoll.collections.Persons(response.persons);
    return response;
  }
});

Simpoll.views.Person = Backbone.View.extend({
  tagName: 'li',
  className: 'person',
  template: 
        '<span class=name><%- name %></span>',
  render: function() {
    this.$el.html(_.template(this.template, this.model.toJSON()));
    return this;
  }
});

Simpoll.views.Persons = Backbone.View.extend({
  el: '#persons',
  initialize: function() {
    this.collection.on('reset', this.render, this);
    this.collection.on('add', this.add, this);
  },
  add: function(model) {
    var view = new Simpoll.views.Person({
      model: model
    });
    this.$el.append(view.render().el);
  },
  render: function(collection) {
    var collection = collection || this.collection;
    collection.each(this.add, this);
    return this;
  }
});

Simpoll.views.Form = Backbone.View.extend({
  el: 'form',
  events: {
    'submit': 'createPerson'
  },
  createPerson: function(e) {
    e.preventDefault();
    var person = this.$('input[type=text]').val();
    if (!_.isBlank(person)) {
      this.collection.create({
        name: person
      });
      this.$('input[type=text]').val('');
    }
  }
});

Simpoll.views.App = Backbone.View.extend({
  el: '#app',
  initialize: function() {
    this.model = new Simpoll.models.PersonModel();
    this.model.on('change', this.renderModel, this);
    this.model.fetch();
  },
  renderModel: function(model) {
    new Simpoll.views.Form({
      collection: model.get('persons')
    });
    new Simpoll.views.Persons({
      collection: model.get('persons')
    }).render();
  }
});

})(jQuery);
