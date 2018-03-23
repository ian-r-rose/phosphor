"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2017, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
require("es6-promise/auto"); // polyfill Promise on IE
var widgets_1 = require("@phosphor/widgets");
require("../style/index.css");
var ContentWidget = (function (_super) {
    __extends(ContentWidget, _super);
    function ContentWidget(name) {
        var _this = _super.call(this, { node: ContentWidget.createNode() }) || this;
        _this.setFlag(widgets_1.Widget.Flag.DisallowLayout);
        _this.addClass('content');
        _this.addClass(name.toLowerCase());
        _this.title.label = name;
        _this.title.closable = true;
        _this.title.caption = "Long description for: " + name;
        return _this;
    }
    ContentWidget.createNode = function () {
        var node = document.createElement('div');
        var content = document.createElement('div');
        node.appendChild(content);
        return node;
    };
    return ContentWidget;
}(widgets_1.Widget));
/**
 * Utility function to get a parse the query string.
 */
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return undefined;
}
function createLayoutOne(dock) {
    var red = new ContentWidget('Red');
    var green = new ContentWidget('Green');
    var blue = new ContentWidget('Blue');
    var purple = new ContentWidget('Purple');
    dock.addWidget(red);
    dock.addWidget(green, { mode: 'tab-after', ref: red });
    dock.addWidget(blue, { mode: 'tab-after', ref: green });
    dock.addWidget(purple, { mode: 'tab-after', ref: blue });
}
function createLayoutTwo(dock) {
    var red = new ContentWidget('Red');
    var green = new ContentWidget('Green');
    var blue = new ContentWidget('Blue');
    var purple = new ContentWidget('Purple');
    dock.addWidget(red);
    dock.addWidget(green, { mode: 'tab-after', ref: red });
    dock.addWidget(blue, { mode: 'split-bottom', ref: red });
    dock.addWidget(purple, { mode: 'tab-after', ref: blue });
}
function createLayoutThree(dock) {
    var red = new ContentWidget('Red');
    var green = new ContentWidget('Green');
    var blue = new ContentWidget('Blue');
    var purple = new ContentWidget('Purple');
    dock.addWidget(red);
    dock.addWidget(green, { mode: 'tab-after', ref: red });
    dock.addWidget(purple, { mode: 'split-bottom', ref: red });
    dock.addWidget(blue, { mode: 'split-right', ref: red });
}
function createLayoutFour(dock) {
    var red = new ContentWidget('Red');
    var green = new ContentWidget('Green');
    var blue = new ContentWidget('Blue');
    var purple = new ContentWidget('Purple');
    dock.addWidget(red);
    dock.addWidget(green, { mode: 'split-bottom', ref: red });
    dock.addWidget(purple, { mode: 'split-bottom', ref: green });
    dock.addWidget(blue, { mode: 'split-right', ref: green });
}
function main() {
    var spacing = parseInt(getQueryVariable('spacing') || '5');
    var allowCenterTarget = getQueryVariable('allowCenterTarget') === 'true' || false;
    var allowTabTarget = getQueryVariable('allowTabTarget') === 'true' || false;
    // let overlay = getQueryVariable('overlayStyle');
    // let overlayStyle: 'line' | 'area' = overlay === 'line' ? 'line' : 'area';
    var layout = getQueryVariable('layout') || '1';
    var dock = new widgets_1.DockPanel({
        spacing: spacing,
        allowCenterTarget: allowCenterTarget,
        allowTabTarget: allowTabTarget,
        overlayStyle: 'line' // area or line
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
    widgets_1.BoxPanel.setStretch(dock, 1);
    var main = new widgets_1.BoxPanel({ direction: 'left-to-right', spacing: 0 });
    main.id = 'main';
    main.addWidget(dock);
    window.onresize = function () { main.update(); };
    widgets_1.Widget.attach(main, document.body);
}
window.onload = main;
