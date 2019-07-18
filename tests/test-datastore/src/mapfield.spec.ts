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
  MapField
} from '@phosphor/datastore';

import {
  createDuplexId
} from '@phosphor/datastore/lib/utilities';

type MapValue = string;

describe('@phosphor/datastore', () => {

  describe('MapField', () => {

    let field: MapField<MapValue>;

    beforeEach(() => {
        field = new MapField<MapValue>({
          description: 'A map field storing strings'
        });
    });

    describe('constructor()', () => {

      it('should create a map field', () => {
        expect(field).to.be.instanceof(MapField);
      });

    });

    describe('type', () => {

      it('should return the type of the field', () => {
        expect(field.type).to.equal('map');
      });

    });

    describe('createValue()', () => {

      it('should create an initial value for the field', () => {
        let value = field.createValue();
        expect(value).to.eql({});
      });

    });

    describe('createMetadata()', () => {

      it('should create initial metadata for the field', () => {
        let metadata = field.createMetadata();
        expect(metadata).to.eql({ ids: {}, values: {} });
      });

    });

    describe('applyUpdate', () => {

      it ('should apply an update to a value', () => {
        let previous = {'zero': 'zeroth'};
        let metadata = field.createMetadata();
        let update = {
          'one': 'first',
          'two': 'second'
        };
        let { value, patch } = field.applyUpdate({
          previous,
          metadata,
          update,
          version: 1,
          storeId: 1
        });
        expect(value).to.eql({ 'zero': 'zeroth', 'one': 'first', 'two': 'second' });
        expect(patch.values).to.eql(update);
      });

      it ('should indicate changed values in the change object', () => {
        let previous = {'zero': 'zeroth', 'one': 'first' };
        let metadata = field.createMetadata();
        let update = {
          'one': null, // remove this field.
          'two': 'second' // add this field.
        };
        let { value, change } = field.applyUpdate({
          previous,
          metadata,
          update,
          version: 1,
          storeId: 1
        });
        expect(value).to.eql({ 'zero': 'zeroth', 'two': 'second' });
        expect(change.previous).to.eql({ 'one': 'first', 'two': null });
        expect(change.current).to.eql({ 'one': null, 'two': 'second' });
      });

      it ('should allow for out-of-order patches', () => {
        let previous = {'zero': 'zeroth', 'one': 'first' };
        let metadata = field.createMetadata();
        let update1 = {
          'one': null, // remove this field.
          'two': 'a-new-two' // add this field.
        };
        let update2 = {
          'zero': 'a-new-none', // set this field.
          'one': 'a-new-one', // set this field.
          'two': 'second' // add this field.
        };
        field.applyUpdate({
          previous,
          metadata,
          update: update1,
          version: 10, // a later version.
          storeId: 1
        });
        let { value, change } = field.applyUpdate({
          previous,
          metadata,
          update: update2,
          version: 1,
          storeId: 1
        });
        expect(value).to.eql({ 'zero': 'a-new-none', 'two': 'a-new-two' });
        expect(change.previous).to.eql({
          'zero': 'zeroth',
          'one': 'first',
          'two': null
        });
        expect(change.current).to.eql({
          'zero': 'a-new-none',
          'one': null,
          'two': 'a-new-two' });
      });

    });

    describe('applyPatch', () => {

      it ('should apply a patch to a value', () => {
        let previous = {'zero': 'zeroth'};
        let metadata = field.createMetadata();
        let update = {
          'one': 'first',
          'two': 'second'
        };
        let id = createDuplexId(1, 1);
        let { value } = field.applyPatch({
          previous,
          patch: { id, values: update },
          metadata
        });
        expect(value).to.eql({ 'zero': 'zeroth', 'one': 'first', 'two': 'second' });
      });

      it ('should indicate changed values in the change object', () => {
        let previous = {'zero': 'zeroth', 'one': 'first' };
        let metadata = field.createMetadata();
        let update = {
          'one': null, // remove this field.
          'two': 'second' // add this field.
        };
        let id = createDuplexId(1, 1);
        let { value, change } = field.applyPatch({
          previous,
          patch: { id, values: update },
          metadata
        });
        expect(value).to.eql({ 'zero': 'zeroth', 'two': 'second' });
        expect(change.previous).to.eql({ 'one': 'first', 'two': null });
        expect(change.current).to.eql({ 'one': null, 'two': 'second' });
      });

      it ('should allow for out-of-order patches', () => {
        let previous = {'zero': 'zeroth', 'one': 'first' };
        let metadata = field.createMetadata();
        let update1 = {
          'one': null, // remove this field.
          'two': 'a-new-two' // add this field.
        };
        let update2 = {
          'zero': 'a-new-none', // set this field.
          'one': 'a-new-one', // set this field.
          'two': 'second' // add this field.
        };
        let id1 = createDuplexId(10 /* later version */, 2);
        let id2 = createDuplexId(1 /* earlier version */, 1);
        field.applyPatch({
          previous,
          patch: { id: id1, values: update1 },
          metadata
        });
        let { value, change } = field.applyPatch({
          previous,
          patch: { id: id2, values: update2 },
          metadata
        });
        expect(value).to.eql({ 'zero': 'a-new-none', 'two': 'a-new-two' });
        expect(change.previous).to.eql({
          'zero': 'zeroth',
          'one': 'first',
          'two': null
        });
        expect(change.current).to.eql({
          'zero': 'a-new-none',
          'one': null,
          'two': 'a-new-two' });
      });

    });

    describe('mergeChange', () => {

      it('should merge two successive changes', () => {
        let change1 = {
          previous: {},
          current: { first: 'first-change' }
        };
        let change2 = {
          previous: {},
          current: { second: 'second-change' }
        };
        let result = field.mergeChange(change1, change2);
        expect(result.previous).to.eql({});
        expect(result.current).to.eql({
          first: 'first-change',
          second: 'second-change'
        });

      });

      it('should prefer the first change for the previous merged field', () => {
        let change1 = {
          previous: { value: 'value' },
          current: { value: 'value-changed' }
        };
        let change2 = {
          previous: { value: 'other'},
          current: { value: 'other-changed' }
        };
        let result = field.mergeChange(change1, change2);
        expect(result.previous).to.eql({ value: 'value' });
      });

      it('should prefer the second change for the current merged field', () => {
        let change1 = {
          previous: { value: 'value' },
          current: { value: 'value-changed' }
        };
        let change2 = {
          previous: { value: 'other'},
          current: { value: 'other-changed' }
        };
        let result = field.mergeChange(change1, change2);
        expect(result.current).to.eql({ value: 'other-changed' });
      });

    });

    describe('mergePatch', () => {

      it('should merge two patches into a single patch object', () => {
        let patch1 = {
          id: 'one',
          values: { first: 'first' }
        };
        let patch2 = {
          id: 'two',
          values: { second: 'second' }
        };
        let result = field.mergePatch(patch1, patch2);
        expect(result).to.eql({
          id: 'two',
          values: { first: 'first', second: 'second' }
        });
      });

      it('should prefer the second patch over the first', () => {
        let patch1 = {
          id: 'one',
          values: { first: 'first', second: 'second' }
        };
        let patch2 = {
          id: 'two',
          values: { first: 'other', second: 'next-other' }
        };
        let result = field.mergePatch(patch1, patch2);
        expect(result).to.eql(patch2);
      });

    });

  });

});