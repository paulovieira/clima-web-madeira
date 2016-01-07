(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["map/templates/main-control.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div id=\"menu-container\">\n    <span class=\"glyphicon glyphicon-menu-hamburger\"></span>\n</div>\n\n\n<div style=\"padding: 0px 0px; \" id=\"control-main-region\">\n</div>\n\n\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};
})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["map/templates/map.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"row\" style=\"height: 100%; margin: 0; padding: 0;\">\n    <div id=\"map\" class=\"col-sm-12\" style=\"height: 100%; margin: 0; padding: 0;\">\n    </div>\n\n    <div id=\"map2\" class=\"col-sm-0\" style=\"height: 100%; margin: 0; padding: 0;\">\n    </div>\n</div>\n\n\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};
})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["map/templates/my-maps.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "\n\n        <form enctype=\"multipart/form-data\">\n\n";
output += "\n            <div class=\"form-group\">\n                <label for=\"new_file\" style=\"margin-top: 20px;\">Choose file</label>\n                <input id=\"new_file\" name=\"new_file\" type=\"file\" multiple=false class=\"filex\" ";
output += runtime.suppressValue((runtime.contextOrFrameLookup(context, frame, "activeMapIsCirac") == false?"disabled":""), env.opts.autoescape);
output += ">\n            </div>\n        </form>\n\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};
})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["map/templates/point-row.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<td>\n\t";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "description"), env.opts.autoescape);
output += "\n</td>\n\n<td>\n\t";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "value"), env.opts.autoescape);
output += "\n</td>\n\n<td>";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "lat"), env.opts.autoescape);
output += "</td>\n\n<td>";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "lon"), env.opts.autoescape);
output += "</td>\n\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};
})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["map/templates/points-table.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "\n<canvas id=\"myChart\" width=\"350\" height=\"350\" style=\"margin-top: 20px; margin-bottom: 25px;\"></canvas>\n\n<div class=\"row\">\n    <div class=\"col-sm-4 col-sm-offset-4\">\n        <form action=\"/api/vulnerabilities/report\" method=\"post\" id=\"vuln-form\">\n            <input type=\"hidden\" name=\"vuln\" id=\"vuln\" value=\"xxx\">\n            <button type=\"submit\" class=\"btn btn-primary btn-block\">Download file</button>\n        </form>\n    </div>\n    <div class=\"col-sm-4\" style=\"padding-right: 20px;\">\n        <button class=\"btn btn-primary btn-block\" id=\"new-upload\">Reset map</button>\n    </div>\n</div>\n\n \n<div class=\"xtable-responsive\">\n    <table class=\"table table-striped table-condensed table-dashboard\">\n\n        <thead>\n            <tr>\n                <th style=\"width: 45%\">Description</th>\n                <th style=\"width: 30%\">Vulnerability</th>\n                <th style=\"width: 12%\">Lat</th>\n                <th style=\"width: 12%\">Lon</th>\n            </tr>\n        </thead>\n\n        <tbody>\n        </tbody>\n\n    </table>\n</div>\n\n\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};
})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["map/templates/tab-menu.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<ul class=\"nav nav-tabs\">\n    <li role=\"presentation\" id=\"tile-switcher\" class=";
output += runtime.suppressValue((runtime.contextOrFrameLookup(context, frame, "activeTabId") == "tile-switcher"?"active":""), env.opts.autoescape);
output += "><a href=\"#\">Base layers</a></li>\n    <li role=\"presentation\" id=\"my-maps\" class=";
output += runtime.suppressValue((runtime.contextOrFrameLookup(context, frame, "activeTabId") == "my-maps"?"active":""), env.opts.autoescape);
output += "><a href=\"#\">My maps</a></li>\n</ul>\n<div style=\"xoverflow: scroll;\" id=\"tab-content-region\"></div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};
})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["map/templates/test.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "hello world";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};
})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["map/templates/tile-switcher.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<form class=\"form-horizontal\">\n\n    <div class=\"tile-group-title\">Base maps</div>\n    <div class=\"radio\">\n        <label>\n            <input type=\"radio\" name=\"base-tiles\"  value=\"MapQuestOpen.OSM\"> Mapquest Open\n        </label>\n    </div>\n    <div class=\"radio\">\n        <label>\n            <input type=\"radio\" name=\"base-tiles\"  value=\"HERE.normalDayGrey\"> HERE Maps\n        </label>\n    </div>\n    <div class=\"radio\">\n        <label>\n            <input type=\"radio\" name=\"base-tiles\" value=\"HERE.satelliteDay\"> HERE Satellite\n        </label>\n    </div>\n\n";
output += "\n    <hr>\n\n\n    <div class=\"tile-group-title\">Published maps</div>\n\n    <div class=\"checkbox\">\n        <label>\n            <input type=\"checkbox\" value=\"new-map-3\"> new-map-3\n        </label>\n    </div>\n    <div class=\"checkbox\">\n        <label>\n            <input type=\"checkbox\" value=\"new-map-4\"> new-map-4\n        </label>\n    </div>\n\n";
output += "\n\n</form>\n<hr>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};
})();
})();
