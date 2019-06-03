/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2017, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/

import { Datastore, Fields } from '@phosphor/datastore';

import { IMessageHandler, Message, MessageLoop } from '@phosphor/messaging';

class InMemoryPatchStore implements IMessageHandler {
  createDatastore(): Datastore {
    const id = this._id++;
    const ds = Datastore.create({ id , schemas: [schema], broadcastHandler: this});
    this._stores.set(id, ds);
    return ds;
  }

  processMessage(msg: Message): void {
    switch (msg.type) {
      //External messages
      case 'datastore-transaction':
        const transaction = (msg as Datastore.TransactionMessage).transaction;
        for (let [id, ds] of this._stores) {
          if (transaction.storeId !== id) {
            MessageLoop.sendMessage(ds, msg);
          }
        }
        break;
      default:
        break
    }
  }

  private _id = 0;
  private _stores = new Map<number, Datastore>();
}

const schema = {
  id: 'checkboxes',
  fields: {
    value: Fields.Boolean({ value: false })
  }
};

function setValue(ds: Datastore, value: boolean) {
  ds.beginTransaction();
  ds.get(schema).update({
    box: { value: value }
  });
  ds.endTransaction();
}

function createCheckbox(ds: Datastore, value: boolean) {
  const checkbox: HTMLInputElement = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = ds.get(schema).get('box')!.value;
  checkbox.oninput = evt => {
    setValue(ds, checkbox.checked);
  };
  return checkbox;
}


function main(): void {
  const store = new InMemoryPatchStore();

  const ds1 = store.createDatastore();
  const ds2 = store.createDatastore();
  setValue(ds1, true);
  setValue(ds2, false);

  ds1.changed.connect((_, change: any) => {
    console.log(change.change.checkboxes.box.value);
    if (checkbox1.checked !== change.change.checkboxes.box.value.current) {
      checkbox1.checked = change.change.checkboxes.box.value.current;
    }
  });
  ds2.changed.connect((_, change: any) => {
    console.log(change.change.checkboxes.box.value);
    if (checkbox2.checked !== change.change.checkboxes.box.value.current) {
      checkbox2.checked = change.change.checkboxes.box.value.current;
    }
  });

  const checkbox1 = createCheckbox(ds1, true);
  const checkbox2 = createCheckbox(ds2, true);
  document.body.appendChild(checkbox1);
  document.body.appendChild(checkbox2);
}

window.onload = main;
