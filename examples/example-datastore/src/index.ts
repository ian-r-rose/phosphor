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
    const ds = Datastore.create({ id , schemas: [slideschema, checkschema], broadcastHandler: this});
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

const checkschema = {
  id: 'checkboxes',
  fields: {
    value: Fields.Boolean({ value: false })
  }
};

const slideschema = {
  id: 'sliders',
  fields: {
    value: Fields.Number({ value: 0 })
  }
};

function setCheckValue(ds: Datastore, value: boolean) {
  ds.beginTransaction();
  ds.get(checkschema).update({
    box: { value: value }
  });
  ds.endTransaction();
}

function createCheckbox(ds: Datastore, value: boolean) {
  const checkbox: HTMLInputElement = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = ds.get(checkschema).get('box')!.value;
  checkbox.oninput = evt => {
    setCheckValue(ds, checkbox.checked);
  };
  return checkbox;
}

function setSlideValue(ds: Datastore, value: number) {
  ds.beginTransaction();
  ds.get(slideschema).update({
    slide: { value: value }
  });
  ds.endTransaction();
}

function createSlider(ds: Datastore, value: number) {
  const slider: HTMLInputElement = document.createElement('input');
  slider.type = 'range';
  slider.min = '0';
  slider.max = '10';
  slider.step = '1';
  slider.value = `${ds.get(slideschema).get('slide')!.value}`;
  slider.oninput = evt => {
    setSlideValue(ds, parseInt(slider.value, 10));
  };
  return slider;
}

function main(): void {
  const store = new InMemoryPatchStore();

  const ds1 = store.createDatastore();
  const ds2 = store.createDatastore();
  setCheckValue(ds1, true);
  setCheckValue(ds2, false);
  setSlideValue(ds1, 10);
  setSlideValue(ds2, 0);

  ds1.changed.connect((_, c: any) => {
    const change = c.change;
    if (change.checkboxes) {
      if (checkbox1.checked !== change.checkboxes.box.value.current) {
        checkbox1.checked = change.checkboxes.box.value.current;
      }
    }
    if (change.sliders) {
      if (slide1.value !== change.sliders.slide.value.current) {
        slide1.value = change.sliders.slide.value.current;
      }
    }
  });

  ds2.changed.connect((_, c: any) => {
    const change = c.change;
    if (change.checkboxes) {
      if (checkbox2.checked !== change.checkboxes.box.value.current) {
        checkbox2.checked = change.checkboxes.box.value.current;
      }
    }
    if (change.sliders) {
      if (slide2.value !== change.sliders.slide.value.current) {
        slide2.value = change.sliders.slide.value.current;
      }
    }
  });

  const checkbox1 = createCheckbox(ds1, true);
  const checkbox2 = createCheckbox(ds2, true);
  document.body.appendChild(checkbox1);
  document.body.appendChild(checkbox2);
  const slide1 = createSlider(ds1, 0);
  const slide2 = createSlider(ds2, 10);
  document.body.appendChild(slide1);
  document.body.appendChild(slide2);
}

window.onload = main;
