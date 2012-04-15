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
        '<span class=name><%- name %></span> <a href=# class=delete>x</a>',
  events: {
    'click .delete': 'deletePerson'
  },
  render: function() {
    this.$el.html(_.template(this.template, this.model.toJSON()));
    return this;
  },
  deletePerson: function(e) {
    e.preventDefault();
    this.model.destroy();
    this.remove();
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
    this.$el.empty();
    collection.each(this.add, this);
    // Open connection
    collection.parentModel.fetch();
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
    // Change url
    this.model.url = '/poll';
    var collection = model.get('persons');
    collection.parentModel = model;
    new Simpoll.views.Form({
      collection: collection
    }).render();
    new Simpoll.views.Persons({
      collection: collection
    }).render();
  }
});

})(jQuery);
