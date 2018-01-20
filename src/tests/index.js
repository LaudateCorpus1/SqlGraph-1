import { assert } from 'chai';
import _ from 'lodash';
import Random from '../lib/random';

function assertLinksValidRefs(random) {
  _.each(random._availableLinks, l => {
    assert.isNumber(l.source);
    assert.isNumber(l.target);
  });
}

describe('AncientSouls/SqlGraph:', () => {
  describe('Random:', () => {
    it('(insert) should only insert', () => {
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

      assertLinksValidRefs(random);
      _.each(random.operations, op => {
        assert.property(op, 'link');
        assert.notOk(op.broken);
      });
    });
    it('(new, old) should only one parent nodess without brokens', () => {
      var random = new Random({
        operations: 10000,
        insert: { chance: 5, target: { old: 0, new: 1 } },
        update: { chance: 100, target: { old: 0, new: 1 } },
        delete: { chance: 100 },
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

      assertLinksValidRefs(random);
      _.each(random.operations, op => {
        assert.property(op, 'link');
        assert.notOk(op.broken);
      });
    });
    it('(new, old ,insertIfBroken false) should only one parent nodes with brokens', () => {
      var random = new Random({
        operations: 10000,
        insert: { chance: 5, target: { old: 0, new: 1 } },
        update: { chance: 100, insertIfBroken: false, target: { old: 0, new: 1 } },
        delete: { chance: 100, insertIfBroken: false, },
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

      assertLinksValidRefs(random);
      _.each(random.operations, op => {
        if (op.broken)
          assert.notProperty(op, 'link');
      });
      assert.isAbove(random._roots.length, 0);
    });
    it('(root) should only one parent nodes trying build one unity tree without brokens', () => {
      var random = new Random({
        operations: 10000,
        insert: { chance: 5, target: { old: 0, new: 1, root: 100000 } },
        update: { chance: 100, target: { old: 0, new: 1, root: 100000 } },
        delete: { chance: 100, },
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

      assertLinksValidRefs(random);
      _.each(random.operations, op => {
        assert.property(op, 'link');
        assert.notOk(op.broken);
      });
      assert.isBelow(random._roots.length, 10); // 0-3 typically
    });
  });
});