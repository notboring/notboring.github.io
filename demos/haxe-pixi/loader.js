// Generated by Haxe 3.4.7
(function ($hx_exports) { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	this.r = new RegExp(r,opt.split("u").join(""));
};
EReg.prototype = {
	match: function(s) {
		if(this.r.global) {
			this.r.lastIndex = 0;
		}
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) {
			return this.r.m[n];
		} else {
			throw new js__$Boot_HaxeError("EReg::matched");
		}
	}
};
var Perf = $hx_exports["Perf"] = function(pos,offset) {
	if(offset == null) {
		offset = 0;
	}
	if(pos == null) {
		pos = "TR";
	}
	this._perfObj = window.performance;
	if(Reflect.field(this._perfObj,"memory") != null) {
		this._memoryObj = Reflect.field(this._perfObj,"memory");
	}
	this._memCheck = this._perfObj != null && this._memoryObj != null && this._memoryObj.totalJSHeapSize > 0;
	this._pos = pos;
	this._offset = offset;
	this.currentFps = 60;
	this.currentMs = 0;
	this.currentMem = "0";
	this.lowFps = 60;
	this.avgFps = 60;
	this._measureCount = 0;
	this._totalFps = 0;
	this._time = 0;
	this._ticks = 0;
	this._fpsMin = 60;
	this._fpsMax = 60;
	this._startTime = this._perfObj != null && ($_=this._perfObj,$bind($_,$_.now)) != null ? this._perfObj.now() : new Date().getTime();
	this._prevTime = -Perf.MEASUREMENT_INTERVAL;
	this._createFpsDom();
	this._createMsDom();
	if(this._memCheck) {
		this._createMemoryDom();
	}
	if(($_=window,$bind($_,$_.requestAnimationFrame)) != null) {
		this.RAF = ($_=window,$bind($_,$_.requestAnimationFrame));
	} else if(window.mozRequestAnimationFrame != null) {
		this.RAF = window.mozRequestAnimationFrame;
	} else if(window.webkitRequestAnimationFrame != null) {
		this.RAF = window.webkitRequestAnimationFrame;
	} else if(window.msRequestAnimationFrame != null) {
		this.RAF = window.msRequestAnimationFrame;
	}
	if(($_=window,$bind($_,$_.cancelAnimationFrame)) != null) {
		this.CAF = ($_=window,$bind($_,$_.cancelAnimationFrame));
	} else if(window.mozCancelAnimationFrame != null) {
		this.CAF = window.mozCancelAnimationFrame;
	} else if(window.webkitCancelAnimationFrame != null) {
		this.CAF = window.webkitCancelAnimationFrame;
	} else if(window.msCancelAnimationFrame != null) {
		this.CAF = window.msCancelAnimationFrame;
	}
	if(this.RAF != null) {
		this._raf = this.RAF.apply(window,[$bind(this,this._tick)]);
	}
};
Perf.prototype = {
	_tick: function(val) {
		var time = this._perfObj != null && ($_=this._perfObj,$bind($_,$_.now)) != null ? this._perfObj.now() : new Date().getTime();
		this._ticks++;
		if(this._raf != null && time > this._prevTime + Perf.MEASUREMENT_INTERVAL) {
			this.currentMs = Math.round(time - this._startTime);
			this.ms.innerHTML = "MS: " + this.currentMs;
			this.currentFps = Math.round(this._ticks * 1000 / (time - this._prevTime));
			if(this.currentFps > 0 && val > Perf.DELAY_TIME) {
				this._measureCount++;
				this._totalFps += this.currentFps;
				this.lowFps = this._fpsMin = Math.min(this._fpsMin,this.currentFps);
				this._fpsMax = Math.max(this._fpsMax,this.currentFps);
				this.avgFps = Math.round(this._totalFps / this._measureCount);
			}
			this.fps.innerHTML = "FPS: " + this.currentFps + " (" + this._fpsMin + "-" + this._fpsMax + ")";
			if(this.currentFps >= 30) {
				this.fps.style.backgroundColor = Perf.FPS_BG_CLR;
			} else if(this.currentFps >= 15) {
				this.fps.style.backgroundColor = Perf.FPS_WARN_BG_CLR;
			} else {
				this.fps.style.backgroundColor = Perf.FPS_PROB_BG_CLR;
			}
			this._prevTime = time;
			this._ticks = 0;
			if(this._memCheck) {
				this.currentMem = this._getFormattedSize(this._memoryObj.usedJSHeapSize,2);
				this.memory.innerHTML = "MEM: " + this.currentMem;
			}
		}
		this._startTime = time;
		if(this._raf != null) {
			this._raf = this.RAF.apply(window,[$bind(this,this._tick)]);
		}
	}
	,_createDiv: function(id,top) {
		if(top == null) {
			top = 0;
		}
		var div = window.document.createElement("div");
		div.id = id;
		div.className = id;
		div.style.position = "absolute";
		var _g = this._pos;
		switch(_g) {
		case "BL":
			div.style.left = this._offset + "px";
			div.style.bottom = (this._memCheck ? 48 : 32) - top + "px";
			break;
		case "BR":
			div.style.right = this._offset + "px";
			div.style.bottom = (this._memCheck ? 48 : 32) - top + "px";
			break;
		case "TL":
			div.style.left = this._offset + "px";
			div.style.top = top + "px";
			break;
		case "TR":
			div.style.right = this._offset + "px";
			div.style.top = top + "px";
			break;
		}
		div.style.width = "80px";
		div.style.height = "12px";
		div.style.lineHeight = "12px";
		div.style.padding = "2px";
		div.style.fontFamily = Perf.FONT_FAMILY;
		div.style.fontSize = "9px";
		div.style.fontWeight = "bold";
		div.style.textAlign = "center";
		window.document.body.appendChild(div);
		return div;
	}
	,_createFpsDom: function() {
		this.fps = this._createDiv("fps");
		this.fps.style.backgroundColor = Perf.FPS_BG_CLR;
		this.fps.style.zIndex = "995";
		this.fps.style.color = Perf.FPS_TXT_CLR;
		this.fps.innerHTML = "FPS: 0";
	}
	,_createMsDom: function() {
		this.ms = this._createDiv("ms",16);
		this.ms.style.backgroundColor = Perf.MS_BG_CLR;
		this.ms.style.zIndex = "996";
		this.ms.style.color = Perf.MS_TXT_CLR;
		this.ms.innerHTML = "MS: 0";
	}
	,_createMemoryDom: function() {
		this.memory = this._createDiv("memory",32);
		this.memory.style.backgroundColor = Perf.MEM_BG_CLR;
		this.memory.style.color = Perf.MEM_TXT_CLR;
		this.memory.style.zIndex = "997";
		this.memory.innerHTML = "MEM: 0";
	}
	,_getFormattedSize: function(bytes,frac) {
		if(frac == null) {
			frac = 0;
		}
		var sizes = ["Bytes","KB","MB","GB","TB"];
		if(bytes == 0) {
			return "0";
		}
		var precision = Math.pow(10,frac);
		var i = Math.floor(Math.log(bytes) / Math.log(1024));
		return Math.round(bytes * precision / Math.pow(1024,i)) / precision + " " + sizes[i];
	}
	,addInfo: function(val) {
		this.info = this._createDiv("info",this._memCheck ? 48 : 32);
		this.info.style.backgroundColor = Perf.INFO_BG_CLR;
		this.info.style.color = Perf.INFO_TXT_CLR;
		this.info.style.zIndex = "998";
		this.info.innerHTML = val;
	}
};
var Reflect = function() { };
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) {
		Error.captureStackTrace(this,js__$Boot_HaxeError);
	}
};
js__$Boot_HaxeError.wrap = function(val) {
	if((val instanceof Error)) {
		return val;
	} else {
		return new js__$Boot_HaxeError(val);
	}
};
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
});
var pixi_plugins_app_Application = function() {
	this._animationFrameId = null;
	this.pixelRatio = 1;
	this.autoResize = true;
	this.transparent = false;
	this.antialias = false;
	this.forceFXAA = false;
	this.roundPixels = false;
	this.legacy = false;
	this.clearBeforeRender = true;
	this.preserveDrawingBuffer = false;
	this.backgroundColor = 16777215;
	this.width = window.innerWidth;
	this.height = window.innerHeight;
	this.position = "static";
};
pixi_plugins_app_Application.prototype = {
	start: function(rendererType,parentDom,canvasElement) {
		if(rendererType == null) {
			rendererType = "auto";
		}
		if(canvasElement == null) {
			this.canvas = window.document.createElement("canvas");
			this.canvas.style.width = this.width + "px";
			this.canvas.style.height = this.height + "px";
			this.canvas.style.position = this.position;
		} else {
			this.canvas = canvasElement;
		}
		if(this.autoResize) {
			window.onresize = $bind(this,this._onWindowResize);
		}
		var renderingOptions = { };
		renderingOptions.width = this.width | 0;
		renderingOptions.height = this.height | 0;
		renderingOptions.view = this.canvas;
		renderingOptions.backgroundColor = this.backgroundColor;
		renderingOptions.resolution = this.pixelRatio;
		renderingOptions.antialias = this.antialias;
		renderingOptions.forceFXAA = this.forceFXAA;
		renderingOptions.autoResize = this.autoResize;
		renderingOptions.transparent = this.transparent;
		renderingOptions.clearBeforeRender = this.clearBeforeRender;
		renderingOptions.preserveDrawingBuffer = this.preserveDrawingBuffer;
		renderingOptions.roundPixels = this.roundPixels;
		renderingOptions.legacy = this.legacy;
		if(rendererType == null) {
			this.app = new PIXI.Application(renderingOptions);
		} else if(rendererType == "canvas") {
			renderingOptions.forceCanvas = true;
			this.app = new PIXI.Application(renderingOptions);
		} else {
			this.app = new PIXI.Application(renderingOptions);
		}
		this.stage = this.app.stage;
		this.renderer = this.app.renderer;
		if(parentDom == null) {
			window.document.body.appendChild(this.app.view);
		} else {
			parentDom.appendChild(this.app.view);
		}
		this.app.ticker.add($bind(this,this._onRequestAnimationFrame));
		this.addStats();
	}
	,_onWindowResize: function(event) {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.app.renderer.resize(this.width,this.height);
		this.canvas.style.width = this.width + "px";
		this.canvas.style.height = this.height + "px";
		if(this.onResize != null) {
			this.onResize();
		}
	}
	,_onRequestAnimationFrame: function() {
		if(this.onUpdate != null) {
			this.onUpdate(this.app.ticker.deltaTime);
		}
	}
	,addStats: function() {
		if(window.Perf != null) {
			var rendererType = this.app.renderer.type;
			var renderer;
			switch(rendererType) {
			case 1:
				renderer = "WEBGL";
				break;
			case 2:
				renderer = "CANVAS";
				break;
			default:
				renderer = "UNKNOWN";
			}
			new Perf().addInfo(renderer + " - " + this.pixelRatio);
		}
	}
};
var loader_Main = function() {
	pixi_plugins_app_Application.call(this);
	pixi_plugins_app_Application.prototype.start.call(this);
	var urlStr = window.location.href.split("?");
	var style = { };
	style.fill = 13158;
	style.fontSize = 24;
	style.fontFamily = "Courier";
	this._label = new PIXI.Text("",style);
	this._label.position.set(0,0);
	this.stage.addChild(this._label);
	this._startTime = new Date().getTime();
	this._loadTime = 0;
	if(urlStr.length > 1 && (urlStr[1] == "base64" || urlStr[1] == "64" || urlStr[1] == "b64")) {
		this._loadBase64Assets();
	} else if(urlStr.length > 1 && (urlStr[1] == "bin" || urlStr[1] == "binary")) {
		this._loadBinaryssets();
	} else {
		this._loadIndividialAssets();
	}
};
loader_Main.main = function() {
	new loader_Main();
};
loader_Main.__super__ = pixi_plugins_app_Application;
loader_Main.prototype = $extend(pixi_plugins_app_Application.prototype,{
	_loadBinaryssets: function() {
		var _gthis = this;
		var progress = 0;
		var xobj = new XMLHttpRequest();
		xobj.open("GET","assets/binaryassets.txt",true);
		xobj.onprogress = function(e) {
			if(e.lengthComputable) {
				progress = e.loaded / e.total;
			} else {
				progress = 0;
			}
			if(progress > 1) {
				progress = 1;
			}
			_gthis._label.text = "Loaded: " + Math.round(progress * 100) + "%";
		};
		xobj.onload = function() {
			_gthis._label.text = "Loaded: " + "100%";
			var tmp = new Date().getTime();
			_gthis._loadTime = tmp - _gthis._startTime;
			_gthis._label.text += "\nLoad Time: " + _gthis._loadTime / 1000 + " secs";
		};
		xobj.send(null);
	}
	,_loadBase64Assets: function() {
		var _gthis = this;
		var progress = 0;
		var totalSize = 0;
		var m = new EReg("\"meta\":.[0-9]*,[0-9]*.","i");
		var xobj = new XMLHttpRequest();
		xobj.open("GET","assets/base64assets.json",true);
		xobj.onprogress = function(e) {
			var meta = m.match(xobj.responseText);
			if(meta && totalSize == 0) {
				var metaInfo = JSON.parse("{" + m.matched(0) + "}");
				totalSize = metaInfo.meta[1];
			}
			if(e.lengthComputable) {
				progress = e.loaded / e.total;
			} else {
				progress = e.loaded / totalSize;
			}
			if(progress > 1) {
				progress = 1;
			}
			_gthis._label.text = "Loaded: " + Math.round(progress * 100) + "%";
		};
		xobj.onload = function() {
			_gthis._b64response = JSON.parse(xobj.responseText);
			var tmp = new Date().getTime();
			_gthis._loadTime = tmp - _gthis._startTime;
			_gthis._label.text += "\nLoad Time: " + _gthis._loadTime / 1000 + " secs";
			var _container = new PIXI.Container();
			_gthis.stage.addChild(_container);
			var _g = 0;
			while(_g < 10) {
				var i = _g++;
				var img = new Image();
				img.src = Reflect.field(_gthis._b64response,i + 1 + ".png");
				var base = new PIXI.BaseTexture(img);
				var texture = new PIXI.Texture(base);
				PIXI.utils.BaseTextureCache[i + 1 + ".png"] = base;
				PIXI.utils.TextureCache[i + 1 + ".png"] = texture;
				_gthis._img = new PIXI.Sprite(texture);
				_gthis._img.name = "img" + (i + 1);
				if(i < 6) {
					_gthis._img.position.set(128 * i,0);
				} else {
					_gthis._img.position.set(128 * (i - 5),128);
				}
				_container.addChild(_gthis._img);
			}
			_container.position.set((window.innerWidth - _container.width) / 2,(window.innerHeight - _container.height) / 2);
		};
		xobj.send(null);
	}
	,_loadIndividialAssets: function() {
		this._baseURL = "assets/loader/";
		this._loader = new PIXI.Loader();
		this._loader.baseUrl = this._baseURL;
		var _g = 0;
		while(_g < 50) {
			var i = _g++;
			this._loader.add("img" + (i + 1),i + 1 + ".png");
		}
		this._loader.on("progress",$bind(this,this._onLoadProgress));
		this._loader.load($bind(this,this._onLoaded));
	}
	,_onLoadProgress: function() {
		this._label.text = "Loaded: " + Math.round(this._loader.progress) + "%";
	}
	,_onLoaded: function() {
		this._loadTime = new Date().getTime() - this._startTime;
		this._label.text += "\nLoad Time: " + this._loadTime / 1000 + " secs";
		var _container = new PIXI.Container();
		this.stage.addChild(_container);
		var _g = 0;
		while(_g < 10) {
			var i = _g++;
			this._img = new PIXI.Sprite(PIXI.Texture.from(this._baseURL + (i + 1) + ".png"));
			this._img.name = "img" + (i + 1);
			if(i < 6) {
				this._img.position.set(128 * i,0);
			} else {
				this._img.position.set(128 * (i - 5),128);
			}
			_container.addChild(this._img);
		}
		_container.position.set((window.innerWidth - _container.width) / 2,(window.innerHeight - _container.height) / 2);
	}
});
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
Perf.MEASUREMENT_INTERVAL = 1000;
Perf.FONT_FAMILY = "Helvetica,Arial";
Perf.FPS_BG_CLR = "#00FF00";
Perf.FPS_WARN_BG_CLR = "#FF8000";
Perf.FPS_PROB_BG_CLR = "#FF0000";
Perf.MS_BG_CLR = "#FFFF00";
Perf.MEM_BG_CLR = "#086A87";
Perf.INFO_BG_CLR = "#00FFFF";
Perf.FPS_TXT_CLR = "#000000";
Perf.MS_TXT_CLR = "#000000";
Perf.MEM_TXT_CLR = "#FFFFFF";
Perf.INFO_TXT_CLR = "#000000";
Perf.DELAY_TIME = 4000;
loader_Main.main();
})(typeof exports != "undefined" ? exports : typeof window != "undefined" ? window : typeof self != "undefined" ? self : this);

//# sourceMappingURL=loader.js.map