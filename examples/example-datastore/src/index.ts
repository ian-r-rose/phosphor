/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2017, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import {
  Datastore, Fields
} from '@phosphor/datastore';


function main(): void {

  const schema = {
    id: 'checkboxes',
    fields: {
      'value': Fields.Boolean({ value: false })
    }
  };
  const ds = Datastore.create({ id: 1, schemas: [schema] });

  ds.beginTransaction();
  ds.get(schema).update({
    'box': { 'value': true }
  });
  ds.endTransaction();

  ds.changed.connect((_, change: any) => {
    console.log(change.change.checkboxes.box.value);
  });


  const checkbox: HTMLInputElement = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = ds.get(schema).get('box')!.value;
  checkbox.oninput = evt => {
    ds.beginTransaction();
    ds.get(schema).update({
      'box': { 'value': checkbox.checked }
    });
    ds.endTransaction();
  };

  document.body.appendChild(checkbox);

  
}

window.onload = main;
