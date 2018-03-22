/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2017, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import 'es6-promise/auto';  // polyfill Promise on IE

import {
  Message
} from '@phosphor/messaging';

import {
  BoxPanel, DockPanel, Widget
} from '@phosphor/widgets';

import '../style/index.css';


class ContentWidget extends Widget {

  static createNode(): HTMLElement {
    let node = document.createElement('div');
    let content = document.createElement('div');
    node.appendChild(content);
    return node;
  }

  constructor(name: string) {
    super({ node: ContentWidget.createNode() });
    this.setFlag(Widget.Flag.DisallowLayout);
    this.addClass('content');
    this.addClass(name.toLowerCase());
    this.title.label = name;
    this.title.closable = true;
    this.title.caption = `Long description for: ${name}`;
  }

  get inputNode(): HTMLInputElement {
    return this.node.getElementsByTagName('input')[0] as HTMLInputElement;
  }

  protected onActivateRequest(msg: Message): void {
    if (this.isAttached) {
      this.inputNode.focus();
    }
  }
}

/**
 * Utility function to get a parse the query string.
 */
function getQueryVariable(variable: string): string | undefined {
  const query = window.location.search.substring(1);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) == variable) {
        return decodeURIComponent(pair[1]);
      }
  }
  return undefined;
}

function createLayoutOne(dock: DockPanel): void {
  let red = new ContentWidget('Red');
  let green = new ContentWidget('Green');
  let blue = new ContentWidget('Blue');
  let purple = new ContentWidget('Purple');

  dock.addWidget(red);
  dock.addWidget(green, { mode: 'tab-after', ref: red });
  dock.addWidget(blue, { mode: 'tab-after', ref: green });
  dock.addWidget(purple, { mode: 'tab-after', ref: blue });
}

function createLayoutTwo(dock: DockPanel): void {
  let red = new ContentWidget('Red');
  let green = new ContentWidget('Green');
  let blue = new ContentWidget('Blue');
  let purple = new ContentWidget('Purple');

  dock.addWidget(red);
  dock.addWidget(green, { mode: 'tab-after', ref: red });
  dock.addWidget(blue, { mode: 'split-bottom', ref: red});
  dock.addWidget(purple, { mode: 'tab-after', ref: blue });
}

function createLayoutThree(dock: DockPanel): void {
  let red = new ContentWidget('Red');
  let green = new ContentWidget('Green');
  let blue = new ContentWidget('Blue');
  let purple = new ContentWidget('Purple');

  dock.addWidget(red);
  dock.addWidget(green, { mode: 'tab-after', ref: red });
  dock.addWidget(purple, { mode: 'split-bottom', ref: red });
  dock.addWidget(blue, { mode: 'split-right', ref: red});
}

function createLayoutFour(dock: DockPanel): void {
  let red = new ContentWidget('Red');
  let green = new ContentWidget('Green');
  let blue = new ContentWidget('Blue');
  let purple = new ContentWidget('Purple');

  dock.addWidget(red);
  dock.addWidget(green, { mode: 'split-bottom', ref: red });
  dock.addWidget(purple, { mode: 'split-bottom', ref: green });
  dock.addWidget(blue, { mode: 'split-right', ref: green});
}

function main(): void {

  let spacing = parseInt(getQueryVariable('spacing') || '5');
  let allowCenterTarget = getQueryVariable('allowCenterTarget') === 'true' || false;
  let allowTabTarget = getQueryVariable('allowTabTarget') === 'true' || false;
  let overlay = getQueryVariable('overlayStyle');
  let overlayStyle: 'line' | 'area' = overlay === 'line' ? 'line' : 'area';
  let layout = getQueryVariable('layout') || '1';

  let dock = new DockPanel({
    spacing,
    allowCenterTarget,  // Whether to include the center drop zone
    allowTabTarget,     // Whether to include the tab bar drop zone
    overlayStyle     // area or line
  });

  switch (layout) {
    case '1':
      createLayoutOne(dock);
      break;
    case '2':
      createLayoutTwo(dock);
      break;
    case '3':
      createLayoutThree(dock);
      break;
    case '4':
      createLayoutFour(dock);
      break;
    default:
      createLayoutOne(dock);
      break;
  }

  BoxPanel.setStretch(dock, 1);
  let main = new BoxPanel({ direction: 'left-to-right', spacing: 0 });
  main.id = 'main';
  main.addWidget(dock);

  window.onresize = () => { main.update(); };

  Widget.attach(main, document.body);
}


window.onload = main;
