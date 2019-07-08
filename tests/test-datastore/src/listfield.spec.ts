/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2019, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import {
  expect
} from 'chai';

import {
  ListField
} from '@phosphor/datastore';

type ListValue = number;

describe('@phosphor/datastore', () => {

  describe('ListField', () => {

    let field: ListField<ListValue>;

    beforeEach(() => {
        field = new ListField<ListValue>({
          description: 'A list field storing numbers'
        });
    });

    describe('constructor()', () => {

      it('should create a list field', () => {
        expect(field).to.be.instanceof(ListField);
      });

    });

    describe('type', () => {

      it('should return the type of the field', () => {
        expect(field.type).to.equal('list');
      });

    });

    describe('createValue()', () => {

      it('should create an initial value for the field', () => {
        let value = field.createValue();
        expect(value).to.eql([]);
      });

    });

    describe('createMetadata()', () => {

      it('should create initial metadata for the field', () => {
        let metadata = field.createMetadata();
        expect(metadata.ids).to.eql([]);
        expect(metadata.cemetery).to.eql({});
      });

    });

    describe('applyUpdate', () => {

      it('should return the result of the update', () => {
        let previous = field.createValue();
        let metadata = field.createMetadata();
        let splice = {
          index: 0,
          remove: 0,
          values: [1, 2, 3]
        };
        let { value, change, patch } = field.applyUpdate({
          previous,
          update: splice,
          metadata,
          version: 1,
          storeId: 1
        });
        expect(value).to.eql([1, 2, 3]);
        expect(change[0]).to.eql({ index: 0, removed: [], inserted: [1, 2, 3]});
        expect(patch.length).to.equal(1);
        expect(patch[0].removedValues.length).to.equal(splice.remove);
        expect(patch[0].insertedValues).to.eql(splice.values);
        expect(patch[0].removedIds.length).to.equal(splice.remove);
        expect(patch[0].insertedIds.length).to.equal(splice.values.length);
      });

      it('should accept multiple splices', () => {
        let previous = field.createValue();
        let metadata = field.createMetadata();
        let splice1 = {
          index: 0,
          remove: 0,
          values: [1, 2, 3]
        };
        let splice2 = {
          index: 1,
          remove: 1,
          values: [4, 5]
        };
        let { value, change, patch } = field.applyUpdate({
          previous,
          update: [splice1, splice2],
          metadata,
          version: 1,
          storeId: 1
        });
        expect(value).to.eql([1, 4, 5, 3]);
        expect(change.length).to.eql(2);
        expect(change[0]).to.eql({ index: 0, removed: [], inserted: [1, 2, 3]});
        expect(change[1]).to.eql({ index: 1, removed: [2], inserted: [4, 5]});
        expect(patch.length).to.equal(2);
        expect(patch[0].removedValues.length).to.equal(splice1.remove);
        expect(patch[0].insertedValues).to.eql(splice1.values);
        expect(patch[0].removedIds.length).to.equal(splice1.remove);
        expect(patch[0].insertedIds.length).to.equal(splice1.values.length);
        expect(patch[1].removedValues.length).to.equal(splice2.remove);
        expect(patch[1].insertedValues).to.eql(splice2.values);
        expect(patch[1].removedIds.length).to.equal(splice2.remove);
        expect(patch[1].insertedIds.length).to.equal(splice2.values.length);
      });

      it('should allow for out-of-order updates', () => {
        let previous = field.createValue();
        let metadata = field.createMetadata();
        let splice1 = {
          index: 0,
          remove: 0,
          values: [4, 5]
        };
        let splice2 = {
          index: 0,
          remove: 0,
          values: [1, 2]
        };
        const firstUpdate = field.applyUpdate({
          previous,
          update: splice1,
          metadata,
          version: 10, // later version
          storeId: 1
        });
        const secondUpdate = field.applyUpdate({
          previous: firstUpdate.value,
          update: splice2,
          metadata,
          version: 5, // earlier 
          storeId: 1
        });        
        expect(firstUpdate.change).to.eql([{ index: 0, removed: [], inserted: [4, 5]}]);
        expect(secondUpdate.change).to.eql([{ index: 0, removed: [], inserted: [1, 2]}]);
        expect(secondUpdate.value).to.eql([1, 2, 4, 5]);
      });


      it('should update the metadata with the patch ordering', () => {
      });

    });

    describe('applyPatch', () => {

      it('should return the result of the patch', () => {
      });

      it('should update the metadata with the patch ordering', () => {
      });

    });

    describe('mergeChange', () => {

      it('should merge two successive changes', () => {
        let change1 = [
          {
            index: 0,
            removed: [],
            inserted: [0, 1]
          }
        ];
        let change2 = [
          {
            index: 1,
            removed: [1],
            inserted: [2, 3]
          }
        ];
        let result = field.mergeChange(change1, change2);
        expect(result).to.eql([...change1, ...change2]);
      });

    });

    describe('mergePatch', () => {

      it('should merge two successive patches', () => {
        let patch1 = [
          {
            removedIds: [],
            removedValues: [],
            insertedIds: ['id-1', 'id-2'],
            insertedValues: [0, 1]
          }
        ];
        let patch2 = [
          {
            removedIds: ['id-1'],
            removedValues: [0],
            insertedIds: ['id-3', 'id-4'],
            insertedValues: [2, 3]
          }
        ];
        let result = field.mergePatch(patch1, patch2);
        expect(result).to.eql([...patch1, ...patch2]);
      });

    });

  });

});
