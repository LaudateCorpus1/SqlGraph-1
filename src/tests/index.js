import { assert } from 'chai';
import _ from 'lodash';
import Random from '../lib/random';

describe('AncientSouls/SqlGraph:', () => {
  describe('Random:', () => {
    it('should only insert', () => {
      var random = new Random({
        operations: 1000,
        insert: { chance: 1 },
        update: { chance: 0 },
        delete: { chance: 0 },
      });
      var counters = {
        insert: 0,
        update: 0,
        delete: 0,
      };
      _.forEach(random.operations, op => counters[op.action]++);
      
      assert.equal(counters.insert, 1000);
      assert.equal(counters.update, 0);
      assert.equal(counters.delete, 0);
    });
    it('should only one parent nodes', () => {
      var random = new Random({
        operations: 1000,
        insert: { chance: 5, target: { old: 0, new: 1 } },
        update: { chance: 1, target: { old: 0, new: 1 } },
        delete: { chance: 1 },
      });
      
      var multiParents = {};
      var parents = {};
      for (var l in random._availableLinks) {
        let link = random._availableLinks[l];
        parents[link.target] = parents[link.target]?parents[link.target]+1:1;
        if (parents[link.target]>1) {
          multiParents[link.target] = parents[link.target];
        }
      }

      assert.deepEqual(multiParents, {});
    });
  });
});