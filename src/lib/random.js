import _ from 'lodash';
var chance = require('chance').Chance();

class Random {
  defaultSettings() {
    return {
      operations: 1000,
      insert: {
        chance: 1,
        source: {
          new: 1,
          old: 1,
          root: 0,
        },
        target: {
          new: 1,
          old: 1,
          root: 0,
        },
      },
      update: {
        chance: 1,
        insertIfBroken: true,
        source: {
          ignore: 1,
          new: 1,
          old: 1,
          root: 0,
        },
        target: {
          ignore: 1,
          new: 1,
          old: 1,
          root: 0,
        },
      },
      delete: {
        chance: 1,
        insertIfBroken: true,
      },
    };
  }
  inherit(old) {
    function Object() {}
    Object.prototype = old;
    return new Object();
  }
  _weights(from) {
    var names = [];
    var weights = [];
    _.each(from, (value, key) => {
      if (value > 0) {
        if (key == 'root' && !this._roots.length) return;
        names.push(key);
        weights.push(value);
      }
    });
    return [names, weights];
  }
  referenceWeights(settings, action, reference) {
    return chance.weighted(...this._weights(settings[action][reference]));
  }
  actionsWeights(settings) {
    return chance.weighted(...this._weights({
      insert: settings.insert.chance,
      update: settings.update.chance,
      delete: settings.delete.chance,
    }));
  }
  insert(op) {
    op.link = {};
    op.link.id = ++this._linksIdCounter;
    op.sourceLogic = this.referenceWeights(this._settings, op.action, 'source');
    op.targetLogic = this.referenceWeights(this._settings, op.action, 'target');
    op.link.source = this.reference(op.sourceLogic, 'source');
    op.link.target = this.reference(op.targetLogic, 'target');
    op.links[op.link.id] = op.link;
    op.link.operation = this.operations.length;
    this.operations.push(op);
    op.link.index = this._availableLinks.length;
    this._availableLinks.push(op.link);
  }
  update(op) {
    if (this._availableLinks.length) {
      op.link = this.inherit(this._availableLinks[_.random(0, this._availableLinks.length-1)]);
      op.sourceLogic = this.referenceWeights(this._settings, op.action, 'source');
      op.targetLogic = this.referenceWeights(this._settings, op.action, 'target');
      if (op.sourceLogic != 'ignore') op.link.source = this.reference(op.sourceLogic, 'source');
      if (op.targetLogic != 'ignore') op.link.target = this.reference(op.targetLogic, 'target');
      op.links[op.link.id] = op.link;
      op.link.operation = this.operations.length;
      this.operations.push(op);
    } else {
      this.brokenUpdates += 1;
      if (this._settings.update.insertIfBroken) {
        op.action = 'insert';
        this[op.action](op);
      } else {
        op.broken = true;
        this.operations.push(op);
      }
    }
  }
  delete(op) {
    if (this._availableLinks.length) {
      op.link = this.inherit(this._availableLinks[_.random(0, this._availableLinks.length-1)]);
      op.link.deleted = true;
      op.links[op.link.id] = op.link;
      op.link.operation = this.operations.length;
      this.operations.push(op);
      this._deletedLinks.push(op.link);
      this._availableLinks.splice(op.link.index, 1);
    } else {
      this.brokenDeletes += 1;
      if (this._settings.delete.insertIfBroken) {
        op.action = 'insert';
        this[op.action](op);
      } else {
        op.broken = true;
        this.operations.push(op);
      }
    }
  }
  action(action) {
    var op = {};
    op.action = action || this.actionsWeights(this._settings);
    this._links = op.links = this.inherit(this._links);

    this[op.action](op);
  }
  reference(logic, key) {
    if (logic == 'new') {
      var ref = ++this._nodesIdCounter;
      this._roots.push(ref);
      return ref;
    } else if (logic == 'old') {
      if (!this._nodesIdCounter) return this.reference('new', key);
      else {
        var ref = _.random(1, this._nodesIdCounter);
        _.remove(this._roots, r => r==ref);
        return ref;
      }
    } else if (logic == 'root') {
      var i = _.random(0,this._roots.length-1);
      var ref = this._roots[i];
      if (key == 'target') {
        this._roots.splice(i,1);
      }
      return ref;
    }
  }
  constructor(settings) {
    this._settings = _.merge({}, this.defaultSettings(), settings);
    this.operations = []; // all operations

    this._links = {}; // last inherited operation.links object, contains links by id
    this._availableLinks = []; // only available to update and delete, existed links
    this._deletedLinks = [];
    this._linksIdCounter = 0;
    this._nodesIdCounter = 0;

    this._roots = [];
    
    this.brokenUpdates = 0;
    this.brokenDeletes = 0;
  
    for (var o = 0; o < this._settings.operations; o++) {
      this.action();
    }
  }
}

export default Random;