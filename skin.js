// Garden Gnome Software - Skin
// Pano2VR 8.0.1/22530
// Filename: 
// Generated 2026-07-03T00:51:23Z

function pano2vrSkin(player,base) {
	var me=this;
	var skin=this;
	var flag=false;
	var hotspotTemplates={};
	var skinKeyPressedKey = 0;
	var skinKeyPressedText = '';
	this.player=player;
	var pano=player;
	player.setApiVersion(7);
	this.rasterizeHTML = player.getRasterizeHTML();
	this.player.skinObj=this;
	this.divSkin=player.divSkin;
	this.ggUserdata=player.userdata;
	player.addListener('changenode', function() { me.ggUserdata=player.userdata; });
	this.lastSize={ w: -1,h: -1 };
	var basePath="";
	var cssPrefix="";
	me.fontsLoaded=0;
	// auto detect base path
	if (base=='?') {
		var scripts = document.getElementsByTagName('script');
		for(var i=0;i<scripts.length;i++) {
			var src=scripts[i].src;
			if (src.indexOf('skin.js')>=0) {
				var p=src.lastIndexOf('/');
				if (p>=0) {
					basePath=src.substr(0,p+1);
				}
			}
		}
	} else
	if (base) {
		basePath=base;
	}
	this.elementMouseDown={};
	this.elementMouseOver={};
	var i,hs,el,els,elo,ela,geometry,material;
	var prefixes='Webkit,Moz,O,ms,Ms'.split(',');
	for(var i=0;i<prefixes.length;i++) {
		if (typeof document.body.style[prefixes[i] + 'Transform'] !== 'undefined') {
			cssPrefix='-' + prefixes[i].toLowerCase() + '-';
		}
	}
	
	var parameterToTransform=function(p) {
		return p.def + 'translate(' + p.rx + 'px,' + p.ry + 'px) rotate(' + p.a + 'deg) scale(' + p.sx + ',' + p.sy + ')';
	}
	this._=function(text, params) {
		return player._(text, params);
	}
	
	player.setMargins({'left': {'value': 0, 'unit': 'px'}, 'top': {'value': 0, 'unit': 'px'}, 'right': {'value': 0, 'unit': 'px'}, 'bottom': {'value': 0, 'unit': 'px'}});
	
	this.updateSize=function(startElement) {
		var stack=[];
		stack.push(startElement);
		while(stack.length>0) {
			var e=stack.pop();
			if (e.ggUpdatePosition) {
				e.ggUpdatePosition();
			}
			if (e.hasChildNodes()) {
				for(var i=0;i<e.childNodes.length;i++) {
					stack.push(e.childNodes[i]);
				}
			}
		}
		if (player.is3dModel()) {
			let hg = player.get3dHotspotGroup();
			if (hg) {
				let startObject = null;
				if (startElement !== undefined && startElement != me.divSkin) {
					if (startElement.ggId) {
						hg.traverse(function(el) {
							if (el.userData && el.userData.ggId === startElement.ggId) {
								startObject = el;
							}
						});
					}
				} else {
					startObject = hg;
				}
				if (startObject) {
					startObject.traverse(function(el) {
						if (el.userData && el.userData.ggUpdatePosition) {
							el.userData.ggUpdatePosition();
						}
					});
				}
			}
		}
	}
	player.addListener('sizechanged', function () { me.updateSize(me.divSkin);});
	
	this.findElements=function(id,regex) {
		var r=[];
		var stack=[];
		var pat=new RegExp(id,'');
		stack.push(me.divSkin);
		while(stack.length>0) {
			var e=stack.pop();
			if (regex) {
				if (pat.test(e.ggId)) r.push(e);
			} else {
				if (e.ggId==id) r.push(e);
			}
			if (e.hasChildNodes()) {
				for(var i=0;i<e.childNodes.length;i++) {
					stack.push(e.childNodes[i]);
				}
			}
		}
		return r;
	}
	
	this.languageChanged=function() {
		var stack=[];
		stack.push(me.divSkin);
		while(stack.length>0) {
			var e=stack.pop();
			if (e.ggUpdateText) {
				e.ggUpdateText();
			}
			if (e.ggUpdateAria) {
				e.ggUpdateAria();
			}
			if (e.hasChildNodes()) {
				for(var i=0;i<e.childNodes.length;i++) {
					stack.push(e.childNodes[i]);
				}
			}
		}
	}
	player.addListener('languagechanged', this.languageChanged);
	
	this.getClassStyles = function(className) {
		className = '.' + className;
		for (let sheet of document.styleSheets) {
			try {
				for (let rule of sheet.cssRules || sheet.rules) {
					if (rule.selectorText === className) {
						return rule.style;
					}
				}
			} catch (e) {
				console.warn("Cannot access stylesheet: ", e);
			}
		}
		return null;
	};
	this.paintTextDivToCanvas = function(el, stylesString, textureHeightFromEl, autoSize, scrollbar, measureOnly) {
		if (measureOnly === undefined) measureOnly = false;
		const skinStyles = skin.getClassStyles('ggskin');
		const skinTextStyles = skin.getClassStyles('ggskin_text');
		const skinStylesString = skinStyles ? skinStyles.cssText : '';
		const skinTextStylesString = skinTextStyles ? skinTextStyles.cssText : '';
		let elementStylesString = '';
		if (Array.isArray(el.userData.cssClasses)) {
			el.userData.cssClasses.forEach(function(className) {
				const classStyles = skin.getClassStyles(className);
				if (classStyles) {
					elementStylesString += classStyles.cssText;
				}
			});
		}
		const outerDiv = document.createElement('div');
		const textDiv = document.createElement('div');
		textDiv.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
		textDiv.style = skinStylesString + skinTextStylesString + elementStylesString + stylesString;
		textDiv.innerHTML = el.userData.ggText;
		textDiv.style.position = 'absolute';
		textDiv.style.left = '0px';
		textDiv.style.top = '0px';
		outerDiv.appendChild(textDiv);
		document.body.appendChild(outerDiv);
		el.userData.boxWidthCanv = textDiv.clientWidth;
		el.userData.totalHeightCanv = textDiv.clientHeight;
		elStyle = window.getComputedStyle(textDiv);
		const lineHeight = elStyle.lineHeight;
		if (lineHeight !== 'normal') {
			el.userData.lineHeight = parseFloat(lineHeight);
		} else {
			el.userData.lineHeight = parseFloat(elStyle.fontSize) * 1.2;
		}
		if (measureOnly) {
			document.body.removeChild(outerDiv);
			return;
		}
		var canv = el.userData.tmpCanvas;
		var ctx = el.userData.tmpCanvasContext;
		canv.width = textDiv.clientWidth * 2;
		canv.height = textDiv.clientHeight * 2;
		ctx.clearRect(0, 0, canv.width, canv.height);
		if (autoSize) {
			el.userData.boxHeightCanv = el.userData.totalHeightCanv;
		} else {
			el.userData.boxHeightCanv = el.userData.height;
		}
		if (scrollbar && textDiv.clientHeight > el.userData.height) {
			el.userData.textCanvas.width = el.userData.width * 2;
		} else {
			el.userData.textCanvas.width = el.userData.boxWidthCanv * 2;
		}
		el.userData.textCanvas.height = el.userData.boxHeightCanv * 2;
		this.rasterizeHTML.drawHTML(outerDiv.innerHTML, canv, {zoom: 2, baseUrl: player.getBasePath() }).then((renderResult) => {
			el.userData.ggTextureFromCanvas();
		}, (err) => {
			console.error('Error rendering HTML to canvas:', err);
		});
		document.body.removeChild(outerDiv);
	};
	this.rectMaxRadius = function(el) {
		return Math.min(el.userData.width / 2.0 + (el.userData.borderWidth.left + el.userData.borderWidth.right) / 2.0, el.userData.height / 2.0 + (el.userData.borderWidth.top + el.userData.borderWidth.bottom) / 2.0);
	}
	this.rectCalcBorderRadiiInnerShape = function(el) {
		let maxRad = skin.rectMaxRadius(el);
		let bwTopLeft = (el.userData.borderWidth.top + el.userData.borderWidth.left) / 2.0;
		let brTopLeft = Math.max(el.userData.borderRadius.topLeft - bwTopLeft, 0.0);
		brTopLeft = Math.min(brTopLeft, maxRad - bwTopLeft);
		let bwTopRight = (el.userData.borderWidth.top + el.userData.borderWidth.right) / 2.0;
		let brTopRight = Math.max(el.userData.borderRadius.topRight - bwTopRight, 0.0);
		brTopRight = Math.min(brTopRight, maxRad - bwTopRight);
		let bwBottomRight = (el.userData.borderWidth.bottom + el.userData.borderWidth.right) / 2.0;
		let brBottomRight = Math.max(el.userData.borderRadius.bottomRight - bwBottomRight, 0.0);
		brBottomRight = Math.min(brBottomRight, maxRad - bwBottomRight);
		let bwBottomLeft = (el.userData.borderWidth.bottom + el.userData.borderWidth.left) / 2.0;
		let brBottomLeft = Math.max(el.userData.borderRadius.bottomLeft - bwBottomLeft, 0.0);
		brBottomLeft = Math.min(brBottomLeft, maxRad - bwBottomLeft);
		el.userData.borderRadiusInnerShape = {
			topLeft: brTopLeft,
			topRight: brTopRight,
			bottomRight: brBottomRight,
			bottomLeft: brBottomLeft
		};
	}
	this.rectHasRoundedCorners = function(el) {
		return (el.userData.borderRadius.topLeft > 0 || el.userData.borderRadius.topRight > 0 || el.userData.borderRadius.bottomRight > 0 || el.userData.borderRadius.bottomLeft > 0);
	}
	this.disposeGeometryAndMaterial = function(el) {
		if (el.geometry) el.geometry.dispose();
		el.geometry = null;
		if (el.material) el.material.dispose();
	}
	this.removeChildren = function(el, filter) {
		if (filter === undefined) filter ='^.*$';
		const pattern = new RegExp(filter);
		for (let i = el.children.length - 1; i >= 0; i--) {
			let child = el.children[i];
			if (pattern.test(child.name)) {
				if (child.isMesh) {
					skin.disposeGeometryAndMaterial(child);
				}
				el.remove(child);
			}
		}
	};
	this.getDepthFrom = function(root, object) {
		let depth = 0;
		let current = object;
		while (current && current !== root) {
			if (current.userData && current.userData.hasOwnProperty('ggId')) depth++;
			current = current.parent;
		}
		return current === root ? depth : -1;
	};
	this.getElementVrPosition = function(el, x, y) {
		var vrPos = {};
		var renderableEl = el.parent && (el.parent.type == 'Mesh' || el.parent.type == 'Group');
		switch (el.userData.hanchor) {
			case 0:
			vrPos.x = (0) - ((renderableEl ? el.parent.userData.width : 800) / 200.0) + (x / 100.0) + (el.userData.width / 200.0);
			break;
			case 1:
			vrPos.x = (0) + (x / 100.0);
			break;
			case 2:
			vrPos.x = (0) + ((renderableEl ? el.parent.userData.width : 800) / 200.0) - (x / 100.0) - (el.userData.width / 200.0);
			break;
		}
		switch (el.userData.vanchor) {
			case 0:
			vrPos.y = (0) + ((renderableEl ? el.parent.userData.height : 600) / 200.0) - (y / 100.0) - (el.userData.height / 200.0);
			break;
			case 1:
			vrPos.y = (0) - (y / 100.0);
			break;
			case 2:
			vrPos.y = (0) - ((renderableEl ? el.parent.userData.height : 600) / 200.0) + (y / 100.0) + (el.userData.height / 200.0);
			break;
		}
		vrPos.x += el.userData.curScaleOffX;
		vrPos.y += el.userData.curScaleOffY;
		return vrPos;
	}
	this.addSkin=function() {
		var hs='';
		var el,els,elo,ela,elHorScrollFg,elHorScrollBg,elVertScrollFg,elVertScrollBg,elCornerBg;
		this.ggCurrentTime=new Date().getTime();
		el=me._image_1=document.createElement('div');
		els=me._image_1__img=document.createElement('img');
		els.className='ggskin ggskin_image';
		hs=basePath + 'images/image_1.png';
		els.setAttribute('src',hs);
		els.ggNormalSrc=hs;
		hs ='';
		hs += 'position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;-webkit-user-drag:none;pointer-events:none;;';
		els.setAttribute('style', hs);
		els.className='ggskin ggskin_image';
		els['ondragstart']=function() { return false; };
		player.checkLoaded.push(els);
		el.appendChild(els);
		el.ggSubElement = els;
		el.ggId="Image 1";
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_image ";
		el.ggType='image';
		el.userData=el;
		hs ='';
		hs+='height : 72px;';
		hs+='left : 10px;';
		hs+='position : absolute;';
		hs+='top : 10px;';
		hs+='visibility : inherit;';
		hs+='width : 212px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._image_1.ggIsActive=function() {
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._image_1.ggUpdatePosition=function (useTransition) {
		}
		me.divSkin.appendChild(me._image_1);
		el=me._popup_info=document.createElement('div');
		el.ggId="popup_info";
		el.ggDx=0;
		el.ggDy=0;
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=false;
		el.className="ggskin ggskin_rectangle ";
		el.ggType='rectangle';
		el.userData=el;
		hs ='';
		hs+='background : rgba(0,0,0,0.45098);';
		hs+='border : 0px solid #000000;';
		hs+='cursor : default;';
		hs+='height : 100%;';
		hs+='left : calc(50% - ((100% + 0px) / 2) + 0px);';
		hs+='position : absolute;';
		hs+='top : calc(50% - ((100% + 0px) / 2) + 0px);';
		hs+='visibility : hidden;';
		hs+='width : 100%;';
		hs+='pointer-events:auto;';
		hs+='backdrop-filter: blur(8px)';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._popup_info.ggIsActive=function() {
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._popup_info.ggUpdatePosition=function (useTransition) {
		}
		el=me._rec_info_1=document.createElement('div');
		el.ggId="Rec_info 1";
		el.ggDx=0;
		el.ggDy=0;
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=false;
		el.className="ggskin ggskin_rectangle ";
		el.ggType='rectangle';
		el.userData=el;
		hs ='';
		hs+='background : #ffffff;';
		hs+='border : 1px solid #000000;';
		hs+='border-radius : 10px;';
		hs+='cursor : default;';
		hs+='height : 90%;';
		hs+='left : calc(50% - ((350px + 2px) / 2) + 0px);';
		hs+='position : absolute;';
		hs+='top : calc(50% - ((90% + 2px) / 2) + 0px);';
		hs+='visibility : hidden;';
		hs+='width : 350px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._rec_info_1.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._rec_info_1.ggUpdatePosition=function (useTransition) {
		}
		el=me._txt_desc=document.createElement('div');
		els=me._txt_desc__text=document.createElement('div');
		el.className='ggskin ggskin_textdiv';
		el.ggTextDiv=els;
		el.ggId="txt_desc";
		el.ggDx=2;
		el.ggDy=25;
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_text ";
		el.ggType='text';
		el.userData=el;
		hs ='';
		hs+='border : 0px solid #000000;';
		hs+='border-radius : 0px 0px 10px 10px;';
		hs+='color : #000000;';
		hs+='cursor : default;';
		hs+='height : 87.2911%;';
		hs+='left : calc(50% - ((98.1429% + 0px) / 2) + 2px);';
		hs+='position : absolute;';
		hs+='top : calc(50% - ((87.2911% + 0px) / 2) + 25px);';
		hs+='visibility : inherit;';
		hs+='width : 98.1429%;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		hs='';
		hs+='box-sizing: border-box;';
		hs+='width: 100%;';
		hs+='height: 100%;';
		hs+='text-align: left;';
		hs+='white-space: pre-line;';
		hs+='padding: 2px 2px 2px 2px;';
		hs+='overflow: hidden;';
		hs+='overflow-y: auto;';
		els.setAttribute('style',hs);
		me._txt_desc.ggUpdateText=function() {
			var params = [];
			params.push(player._(String(player.hotspot.description)));
			var hs = player._("%1", params);
			if (hs!=this.ggText) {
				this.ggText=hs;
				this.ggTextDiv.innerHTML=hs;
				if (this.ggUpdatePosition) this.ggUpdatePosition();
			}
		}
		me._txt_desc.ggUpdateText();
		player.addListener('activehotspotchanged', function() {
			me._txt_desc.ggUpdateText();
		});
		el.appendChild(els);
		me._txt_desc.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._txt_desc.ggUpdatePosition=function (useTransition) {
		}
		me._rec_info_1.appendChild(me._txt_desc);
		el=me._txt_titulo=document.createElement('div');
		els=me._txt_titulo__text=document.createElement('div');
		el.className='ggskin ggskin_textdiv';
		el.ggTextDiv=els;
		el.ggId="txt_titulo";
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_text ";
		el.ggType='text';
		el.userData=el;
		hs ='';
		hs+='border : 0px solid #000000;';
		hs+='color : #000000;';
		hs+='cursor : default;';
		hs+='height : 34px;';
		hs+='left : 8px;';
		hs+='position : absolute;';
		hs+='top : 30px;';
		hs+='visibility : inherit;';
		hs+='width : 96.4257%;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		hs='';
		hs+='box-sizing: border-box;';
		hs+='width: 100%;';
		hs+='height: 100%;';
		hs+='font-size: 14px;';
		hs+='font-weight: 600;';
		hs+='text-align: left;';
		hs+='white-space: pre;';
		hs+='padding: 0px;';
		hs+='overflow: hidden;';
		els.setAttribute('style',hs);
		me._txt_titulo.ggUpdateText=function() {
			var params = [];
			params.push(player._(String(player.hotspot.title)));
			var hs = player._("%1", params);
			if (hs!=this.ggText) {
				this.ggText=hs;
				this.ggTextDiv.innerHTML=hs;
				if (this.ggUpdatePosition) this.ggUpdatePosition();
			}
		}
		me._txt_titulo.ggUpdateText();
		player.addListener('activehotspotchanged', function() {
			me._txt_titulo.ggUpdateText();
		});
		el.appendChild(els);
		me._txt_titulo.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._txt_titulo.ggUpdatePosition=function (useTransition) {
		}
		me._rec_info_1.appendChild(me._txt_titulo);
		me._popup_info.appendChild(me._rec_info_1);
		el=me._svg_1=document.createElement('div');
		els=me._svg_1__img=document.createElement('img');
		els.className='ggskin ggskin_svg';
		hs='data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iZmVhdGhlciBmZWF0aGVyLXgtY2lyY2xlIiBmaWxsPSJub25lIiBoZWlnaHQ9IjI0IiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjEuNSIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPgogPGxpbmUgeDE9IjE1IiB4Mj0iOSIgeTE9IjkiIHkyPSIxNSIvPgogPGxpbmUgeDE9IjkiIHgyPSIxNSIgeTE9IjkiIHkyPSIxNSIvPgo8L3N2Zz4K';
		me._svg_1__img.setAttribute('src',hs);
		hs ='';
		hs += 'position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;-webkit-user-drag:none;pointer-events:none;;';
		els.setAttribute('style', hs);
		els['ondragstart']=function() { return false; };
		el.appendChild(els);
		el.ggSubElement = els;
		el.ggId="Svg 1";
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_svg ";
		el.ggType='svg';
		el.userData=el;
		hs ='';
		hs+='height : 40px;';
		hs+='position : absolute;';
		hs+='right : 10px;';
		hs+='top : 10px;';
		hs+='visibility : inherit;';
		hs+='width : 40px;';
		hs+='pointer-events:auto;';
		hs+='svg path { fill: #FFFFFF; }';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._svg_1.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._svg_1.onclick=function (e) {
			me._rec_info_1.style.transition='none';
			me._rec_info_1.style.visibility='hidden';
			me._rec_info_1.ggVisible=false;
			me._popup_info.style.transition='none';
			me._popup_info.style.visibility='hidden';
			me._popup_info.ggVisible=false;
		}
		me._svg_1.ggUpdatePosition=function (useTransition) {
		}
		el=me._bgfechar_1=document.createElement('div');
		el.ggId="bg-fechar_1";
		el.ggDx=0;
		el.ggDy=0;
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_rectangle ";
		el.ggType='rectangle';
		el.userData=el;
		hs ='';
		hs+='z-index: -1;';
		hs+='background : #ffffff;';
		hs+='border : 0px solid #000000;';
		hs+='border-radius : 999px;';
		hs+='height : 40px;';
		hs+='left : calc(50% - ((40px + 0px) / 2) + 0px);';
		hs+='position : absolute;';
		hs+='top : calc(50% - ((40px + 0px) / 2) + 0px);';
		hs+='visibility : inherit;';
		hs+='width : 40px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._bgfechar_1.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._bgfechar_1.ggUpdatePosition=function (useTransition) {
		}
		me._svg_1.appendChild(me._bgfechar_1);
		me._popup_info.appendChild(me._svg_1);
		me.divSkin.appendChild(me._popup_info);
		el=me._popup_fundo=document.createElement('div');
		el.ggId="popup_fundo";
		el.ggDx=0;
		el.ggDy=0;
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=false;
		el.className="ggskin ggskin_rectangle ";
		el.ggType='rectangle';
		el.userData=el;
		hs ='';
		hs+='background : rgba(0,0,0,0.717647);';
		hs+='border : 1px solid #000000;';
		hs+='height : 100%;';
		hs+='left : calc(50% - ((100% + 2px) / 2) + 0px);';
		hs+='position : absolute;';
		hs+='top : calc(50% - ((100% + 2px) / 2) + 0px);';
		hs+='visibility : hidden;';
		hs+='width : 100%;';
		hs+='pointer-events:auto;';
		hs+='backdrop-filter: blur(8px)';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._popup_fundo.ggIsActive=function() {
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._popup_fundo.ggUpdatePosition=function (useTransition) {
		}
		el=me._popup_imagem=document.createElement('div');
		els=me._popup_imagem__img=document.createElement('img');
		els.className='ggskin ggskin_external';
		hs ='';
		hs += 'position: absolute;-webkit-user-drag:none;pointer-events:none;;';
		els.setAttribute('style', hs);
		els.onload=function() {me._popup_imagem.ggUpdatePosition();}
		el.appendChild(els);
		el.ggSubElement = els;
		hs ='';
		el.ggAltText="";
		el.ggScrollbars=false;
		el.ggUpdateText = function() {
			me._popup_imagem.ggSubElement.setAttribute('alt', player._(me._popup_imagem.ggAltText));
			me._popup_imagem.ggUpdateImageTranslation();
		}
		el.ggSetImage = function(img) {
			me._popup_imagem.ggText_untranslated = img;
			me._popup_imagem.ggUpdateImageTranslation();
		}
		el.ggUpdateImage = function() {
			me._popup_imagem.ggSubElement.style.width = '0px';
			me._popup_imagem.ggSubElement.style.height = '0px';
			me._popup_imagem.ggSubElement.src='';
			me._popup_imagem.ggSubElement.src=me._popup_imagem.ggText;
		}
		el.ggUpdateImageTranslation = function() {
			if (me._popup_imagem.ggText != player._(me._popup_imagem.ggText_untranslated)) {
				me._popup_imagem.ggText = player._(me._popup_imagem.ggText_untranslated);
				me._popup_imagem.ggUpdateImage()
			}
		}
		el.ggText=el.ggText_untranslated=basePath + "";
		el.ggUpdateImage();
		els['ondragstart']=function() { return false; };
		el.ggUpdateText();
		el.ggId="popup_imagem";
		el.ggDx=0;
		el.ggDy=0;
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_external ";
		el.ggType='external';
		el.userData=el;
		hs ='';
		hs+='background : #ffffff;';
		hs+='border : 1px solid #000000;';
		hs+='height : 90%;';
		hs+='left : calc(50% - ((90% + 2px) / 2) + 0px);';
		hs+='position : absolute;';
		hs+='top : calc(50% - ((90% + 2px) / 2) + 0px);';
		hs+='visibility : inherit;';
		hs+='width : 90%;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._popup_imagem.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._popup_imagem.ggUpdatePosition=function (useTransition) {
			var parentWidth = me._popup_imagem.clientWidth;
			var parentHeight = me._popup_imagem.clientHeight;
			var img = me._popup_imagem__img;
			var aspectRatioDiv = me._popup_imagem.clientWidth / me._popup_imagem.clientHeight;
			var aspectRatioImg = img.naturalWidth / img.naturalHeight;
			if (img.naturalWidth < parentWidth) parentWidth = img.naturalWidth;
			if (img.naturalHeight < parentHeight) parentHeight = img.naturalHeight;
			var currentWidth,currentHeight;
			if (aspectRatioDiv > aspectRatioImg) {
				currentHeight = parentHeight;
				currentWidth = Math.round(parentHeight * aspectRatioImg);
				img.style.width='';
				img.style.height=parentHeight + 'px';
			} else {
				currentWidth = parentWidth;
				currentHeight = Math.round(parentWidth / aspectRatioImg);
				img.style.width=parentWidth + 'px';
				img.style.height='';
			};
			if (!me._popup_imagem.ggScrollbars || currentWidth < me._popup_imagem.clientWidth) {
				img.style.right='';
				img.style.left='50%';
				img.style.marginLeft='-' + currentWidth/2 + 'px';
			} else {
				img.style.right='';
				img.style.left='0px';
				img.style.marginLeft='0px';
				me._popup_imagem.scrollLeft=currentWidth / 2 - me._popup_imagem.clientWidth / 2;
			}
			if (!me._popup_imagem.ggScrollbars || currentHeight < me._popup_imagem.clientHeight) {
				img.style.bottom='';
				img.style.top='50%';
				img.style.marginTop='-' + currentHeight/2 + 'px';
			} else {
				img.style.bottom='';
				img.style.top='0px';
				img.style.marginTop='0px';
				me._popup_imagem.scrollTop=currentHeight / 2 - me._popup_imagem.clientHeight / 2;
			}
		}
		el=me._popup_info_painel=document.createElement('div');
		el.ggId="popup_info_painel";
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=false;
		el.className="ggskin ggskin_rectangle ";
		el.ggType='rectangle';
		el.userData=el;
		hs ='';
		hs+='z-index: 1;';
		hs+='background : rgba(0,0,0,0.843137);';
		hs+='border : 0px solid #000000;';
		hs+='bottom : 87px;';
		hs+='height : 277px;';
		hs+='position : absolute;';
		hs+='right : 20px;';
		hs+='visibility : hidden;';
		hs+='width : 317px;';
		hs+='pointer-events:auto;';
		hs+='backdrop-filter: blur(8px)';
		el.setAttribute('style',hs);
		el.style.transformOrigin='100% 100%';
		me._popup_info_painel.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._popup_info_painel.ggUpdatePosition=function (useTransition) {
		}
		el=me._obra_titulo=document.createElement('div');
		els=me._obra_titulo__text=document.createElement('div');
		el.className='ggskin ggskin_textdiv';
		el.ggTextDiv=els;
		el.ggId="obra_titulo";
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_text ";
		el.ggType='text';
		el.userData=el;
		hs ='';
		hs+='color : rgba(255,255,255,1);';
		hs+='cursor : default;';
		hs+='height : auto;';
		hs+='left : 20px;';
		hs+='position : absolute;';
		hs+='top : 20px;';
		hs+='visibility : inherit;';
		hs+='width : 388px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		hs='';
		hs+='border : 0px solid #000000;';
		hs+='box-sizing: border-box;';
		hs+='width: 100%;';
		hs+='height: auto;';
		hs+='font-size: 14px;';
		hs+='font-weight: 500;';
		hs+='text-align: left;';
		hs+='white-space: pre-line;';
		hs+='padding: 2px;';
		hs+='overflow: hidden;';
		els.setAttribute('style',hs);
		me._obra_titulo.ggUpdateText=function() {
			var params = [];
			params.push(player._(String(player.hotspot.title)));
			var hs = player._("%1", params);
			if (hs!=this.ggText) {
				this.ggText=hs;
				this.ggTextDiv.innerHTML=hs;
				if (this.ggUpdatePosition) this.ggUpdatePosition();
			}
		}
		me._obra_titulo.ggUpdateText();
		player.addListener('activehotspotchanged', function() {
			me._obra_titulo.ggUpdateText();
		});
		el.appendChild(els);
		me._obra_titulo.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._obra_titulo.ggUpdatePosition=function (useTransition) {
		}
		me._popup_info_painel.appendChild(me._obra_titulo);
		el=me._obra_desc=document.createElement('div');
		els=me._obra_desc__text=document.createElement('div');
		el.className='ggskin ggskin_textdiv';
		el.ggTextDiv=els;
		el.ggId="obra_desc";
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_text ";
		el.ggType='text';
		el.userData=el;
		hs ='';
		hs+='border : 0px solid #000000;';
		hs+='color : rgba(255,255,255,1);';
		hs+='cursor : default;';
		hs+='height : 173px;';
		hs+='left : 20px;';
		hs+='position : absolute;';
		hs+='top : 96px;';
		hs+='visibility : inherit;';
		hs+='width : 288px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		hs='';
		hs+='box-sizing: border-box;';
		hs+='width: 100%;';
		hs+='height: 100%;';
		hs+='text-align: left;';
		hs+='white-space: pre-line;';
		hs+='padding: 0px;';
		hs+='overflow: hidden;';
		hs+='overflow-y: auto;';
		els.setAttribute('style',hs);
		me._obra_desc.ggUpdateText=function() {
			var params = [];
			params.push(player._(String(player.hotspot.description)));
			var hs = player._("%1", params);
			if (hs!=this.ggText) {
				this.ggText=hs;
				this.ggTextDiv.innerHTML=hs;
				if (this.ggUpdatePosition) this.ggUpdatePosition();
			}
		}
		me._obra_desc.ggUpdateText();
		player.addListener('activehotspotchanged', function() {
			me._obra_desc.ggUpdateText();
		});
		el.appendChild(els);
		me._obra_desc.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._obra_desc.ggUpdatePosition=function (useTransition) {
		}
		me._popup_info_painel.appendChild(me._obra_desc);
		me._popup_imagem.appendChild(me._popup_info_painel);
		el=me._svg_3=document.createElement('div');
		els=me._svg_3__img=document.createElement('img');
		els.className='ggskin ggskin_svg';
		hs='data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iZmVhdGhlciBmZWF0aGVyLWFsZXJ0LWNpcmNsZSIgZmlsbD0ibm9uZSIgaGVpZ2h0PSIyNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz4KIDxsaW5lIHgxPSIxMiIgeDI9IjEyIiB5MT0iOCIgeTI9IjEyIi8+CiA8bGluZSB4MT0iMTIiIHgyPSIxMi4wMSIgeTE9IjE2IiB5Mj0iMTYiLz'+
			'4KPC9zdmc+Cg==';
		me._svg_3__img.setAttribute('src',hs);
		hs ='';
		hs += 'position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;-webkit-user-drag:none;pointer-events:none;;';
		els.setAttribute('style', hs);
		els['ondragstart']=function() { return false; };
		el.appendChild(els);
		el.ggSubElement = els;
		el.ggId="Svg 3";
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_svg ";
		el.ggType='svg';
		el.userData=el;
		hs ='';
		hs+='bottom : 20px;';
		hs+='height : 58px;';
		hs+='position : absolute;';
		hs+='right : 20px;';
		hs+='visibility : inherit;';
		hs+='width : 54px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._svg_3.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._svg_3.onclick=function (e) {
			me._popup_info_painel.ggVisible = !me._popup_info_painel.ggVisible;
			var flag=me._popup_info_painel.ggVisible;
			me._popup_info_painel.style.transition='none';
			me._popup_info_painel.style.visibility=((flag)&&(Number(me._popup_info_painel.style.opacity)>0||!me._popup_info_painel.style.opacity))?'inherit':'hidden';
		}
		me._svg_3.ggUpdatePosition=function (useTransition) {
		}
		me._popup_imagem.appendChild(me._svg_3);
		me._popup_fundo.appendChild(me._popup_imagem);
		el=me._popup_pdf=document.createElement('div');
		els=me._popup_pdf__text=document.createElement('div');
		el.className='ggskin ggskin_textdiv';
		el.ggTextDiv=els;
		el.ggId="popup_pdf";
		el.ggDx=0;
		el.ggDy=0;
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=false;
		el.className="ggskin ggskin_text ";
		el.ggType='text';
		el.userData=el;
		hs ='';
		hs+='background : #ffffff;';
		hs+='border : 1px solid #000000;';
		hs+='color : #000000;';
		hs+='height : 90%;';
		hs+='left : calc(50% - ((90% + 2px) / 2) + 0px);';
		hs+='position : absolute;';
		hs+='top : calc(50% - ((90% + 2px) / 2) + 0px);';
		hs+='visibility : hidden;';
		hs+='width : 90%;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		hs='';
		hs+='box-sizing: border-box;';
		hs+='width: 100%;';
		hs+='height: 100%;';
		hs+='text-align: center;';
		hs+='white-space: pre;';
		hs+='padding: 0px;';
		hs+='overflow: hidden;';
		els.setAttribute('style',hs);
		me._popup_pdf.ggUpdateText=function() {
			var params = [];
			var hs = player._("text", params);
			if (hs!=this.ggText) {
				this.ggText=hs;
				this.ggTextDiv.innerHTML=hs;
				if (this.ggUpdatePosition) this.ggUpdatePosition();
			}
		}
		me._popup_pdf.ggUpdateText();
		el.appendChild(els);
		me._popup_pdf.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._popup_pdf.ggUpdatePosition=function (useTransition) {
		}
		me._popup_fundo.appendChild(me._popup_pdf);
		el=me._svg_2=document.createElement('div');
		els=me._svg_2__img=document.createElement('img');
		els.className='ggskin ggskin_svg';
		hs='data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iZmVhdGhlciBmZWF0aGVyLXgtY2lyY2xlIiBmaWxsPSJub25lIiBoZWlnaHQ9IjI0IiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjEuNSIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPgogPGxpbmUgeDE9IjE1IiB4Mj0iOSIgeTE9IjkiIHkyPSIxNSIvPgogPGxpbmUgeDE9IjkiIHgyPSIxNSIgeTE9IjkiIHkyPSIxNSIvPgo8L3N2Zz4K';
		me._svg_2__img.setAttribute('src',hs);
		hs ='';
		hs += 'position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;-webkit-user-drag:none;pointer-events:none;;';
		els.setAttribute('style', hs);
		els['ondragstart']=function() { return false; };
		el.appendChild(els);
		el.ggSubElement = els;
		el.ggId="Svg 2";
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_svg ";
		el.ggType='svg';
		el.userData=el;
		hs ='';
		hs+='height : 40px;';
		hs+='position : absolute;';
		hs+='right : 10px;';
		hs+='top : 10px;';
		hs+='visibility : inherit;';
		hs+='width : 40px;';
		hs+='pointer-events:auto;';
		hs+='svg path { fill: #FFFFFF; }';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._svg_2.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._svg_2.onclick=function (e) {
			me._popup_fundo.style.transition='none';
			me._popup_fundo.style.visibility='hidden';
			me._popup_fundo.ggVisible=false;
				me._popup_pdf.ggUpdateText=function() {
					var params = [];
					var hs = player._("", params);
					if (hs!=this.ggText) {
						this.ggText=hs;
						this.ggTextDiv.innerHTML=hs;
						if (this.ggUpdatePosition) this.ggUpdatePosition();
					}
				}
			me._popup_pdf.ggUpdateText();
			me._popup_pdf.ggTextDiv.scrollTop = 0;
			me._popup_pdf.style.transition='none';
			me._popup_pdf.style.visibility='hidden';
			me._popup_pdf.ggVisible=false;
		}
		me._svg_2.ggUpdatePosition=function (useTransition) {
		}
		el=me._bgfechar=document.createElement('div');
		el.ggId="bg-fechar";
		el.ggDx=0;
		el.ggDy=0;
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_rectangle ";
		el.ggType='rectangle';
		el.userData=el;
		hs ='';
		hs+='z-index: -1;';
		hs+='background : #ffffff;';
		hs+='border : 0px solid #000000;';
		hs+='border-radius : 999px;';
		hs+='height : 40px;';
		hs+='left : calc(50% - ((40px + 0px) / 2) + 0px);';
		hs+='position : absolute;';
		hs+='top : calc(50% - ((40px + 0px) / 2) + 0px);';
		hs+='visibility : inherit;';
		hs+='width : 40px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._bgfechar.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._bgfechar.ggUpdatePosition=function (useTransition) {
		}
		me._svg_2.appendChild(me._bgfechar);
		me._popup_fundo.appendChild(me._svg_2);
		me.divSkin.appendChild(me._popup_fundo);
		el=me._titulopano=document.createElement('div');
		els=me._titulopano__text=document.createElement('div');
		el.className='ggskin ggskin_textdiv';
		el.ggTextDiv=els;
		el.ggId="titulo-pano";
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_text ";
		el.ggType='text';
		el.userData=el;
		hs ='';
		hs+='border : 0px solid #000000;';
		hs+='color : rgba(255,255,255,1);';
		hs+='height : 20px;';
		hs+='left : 2px;';
		hs+='position : absolute;';
		hs+='top : 13px;';
		hs+='visibility : inherit;';
		hs+='width : 26px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		hs='';
		hs+='box-sizing: border-box;';
		hs+='width: 100%;';
		hs+='height: auto;';
		hs+='max-height: 100%;';
		hs+='font-size: 14px;';
		hs+='font-weight: inherit;';
		hs+='text-align: center;';
		hs+='position: absolute;';
		hs+='top: 50%;';
		hs+='transform: translate(0, -50%);';
		hs+='white-space: pre;';
		hs+='padding: 0px;';
		hs+='overflow: hidden;';
		els.setAttribute('style',hs);
		me._titulopano.ggUpdateText=function() {
			var params = [];
			params.push(String(player._(me.ggUserdata.title)));
			var hs = player._("%1", params);
			if (hs!=this.ggText) {
				this.ggText=hs;
				this.ggTextDiv.innerHTML=hs;
				if (this.ggUpdatePosition) this.ggUpdatePosition();
			}
		}
		me._titulopano.ggUpdateText();
		player.addListener('changenode', function() {
			me._titulopano.ggUpdateText();
		});
		el.appendChild(els);
		me._titulopano.ggIsActive=function() {
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._titulopano.ggUpdatePosition=function (useTransition) {
		}
		me.divSkin.appendChild(me._titulopano);
	};
	function SkinHotspotClass_ht_click__3d(parentScope,hotspot) {
		var me=this;
		var flag=false;
		var hs='';
		me.parentScope=parentScope;
		me.hotspot=hotspot;
		var nodeId=String(hotspot.url);
		nodeId=(nodeId.charAt(0)=='{')?nodeId.substr(1, nodeId.length - 2):''; // }
		me.ggUserdata=skin.player.getNodeUserdata(nodeId);
		me.ggUserdata.nodeId=nodeId;
		me.ggNodeId=nodeId;
		me.elementMouseDown={};
		me.elementMouseOver={};
		me.findElements=function(id,regex) {
			return skin.findElements(id,regex);
		}
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {
			me._ht_click.visible = (v>0 && me._ht_click.userData.visible);
		}
		el.userData.width = 0;
		el.userData.height = 0;
		el.name = 'ht_click';
		el.userData.x = -5.42;
		el.userData.y = 4.39;
		el.translateZ(0.000);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.000;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'sticky';
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.renderOrder = 0;
		el.userData.renderOrder = 0;
		el.userData.isVisible = function() {
			let vis = me._ht_click.visible
			let parentEl = me._ht_click.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_click.userData.opacity = v;
			v = v * me._ht_click.userData.parentOpacity;
			if (me._ht_click.userData.setOpacityInternal) me._ht_click.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_click.children.length; i++) {
				let child = me._ht_click.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_click.userData.parentOpacity = v;
			v = v * me._ht_click.userData.opacity
			if (me._ht_click.userData.setOpacityInternal) me._ht_click.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_click.children.length; i++) {
				let child = me._ht_click.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_click = el;
		el.userData.ggId="ht_click";
		me._ht_click.userData.ggIsActive=function() {
			return player.getCurrentNode()==this.ggElementNodeId();
		}
		el.userData.ggElementNodeId=function() {
			if (me.hotspot.url!='' && me.hotspot.url.charAt(0)=='{') { // }
				return me.hotspot.url.substr(1, me.hotspot.url.length - 2);
			} else {
				if ((this.parentNode) && (this.parentNode.userData.ggElementNodeId)) {
					return this.parentNode.userData.ggElementNodeId();
				} else {
					return player.getCurrentNode();
				}
			}
		}
		me._ht_click.userData.onclick=function (e) {
			player.triggerEvent('hsproxyclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_click.userData.ondblclick=function (e) {
			player.triggerEvent('hsproxydblclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_click.userData.onmouseenter=function (e) {
			player.setActiveHotspot(me.hotspot);
			me.elementMouseOver['ht_click']=true;
			player.triggerEvent('hsproxyover', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_click.userData.onmouseleave=function (e) {
			me.elementMouseOver['ht_click']=false;
			player.triggerEvent('hsproxyout', {'id': me.hotspot.id, 'url': me.hotspot.url});
			player.setActiveHotspot(null);
		}
		me._ht_click.userData.ggUpdatePosition=function (useTransition) {
		}
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || false) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = '_material';
			el.material = material;
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 100;
		el.userData.height = 20;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = '';
		el.userData.x = 0;
		el.userData.y = 0;
		el.translateZ(0.030);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.030;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'sticky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 1;
		el.userData.renderOrder = 1;
		el.userData.isVisible = function() {
			let vis = me.__.visible
			let parentEl = me.__.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me.__.userData.opacity = v;
			v = v * me.__.userData.parentOpacity;
			if (me.__.userData.setOpacityInternal) me.__.userData.setOpacityInternal(v);
			for (let i = 0; i < me.__.children.length; i++) {
				let child = me.__.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me.__.userData.parentOpacity = v;
			v = v * me.__.userData.opacity
			if (me.__.userData.setOpacityInternal) me.__.userData.setOpacityInternal(v);
			for (let i = 0; i < me.__.children.length; i++) {
				let child = me.__.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me.__ = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 0;
		el.userData.borderRadius.default.topRight = 0;
		el.userData.borderRadius.default.bottomRight = 0;
		el.userData.borderRadius.default.bottomLeft = 0;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me.__;
			skin.disposeGeometryAndMaterial(el);
			skin.removeChildren(el, 'subElement');
			if (typeof(bwTop) != 'undefined') {
				el.userData.borderWidth.top = bwTop;
				el.userData.borderWidth.right = bwRight;
				el.userData.borderWidth.bottom = bwBottom;
				el.userData.borderWidth.left = bwLeft;
				el.userData.borderRadius.topLeft = brTopLeft;
				el.userData.borderRadius.topRight = brTopRight;
				el.userData.borderRadius.bottomRight = brBottomRight;
				el.userData.borderRadius.bottomLeft = brBottomLeft;
			}
			let width = el.userData.width / 100.0;
			let height = el.userData.height / 100.0;
			skin.rectCalcBorderRadiiInnerShape(me.__);
			if (skin.rectHasRoundedCorners(me.__)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me.__.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me.__.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me.__.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me.__.userData.borderRadiusInnerShape.bottomLeft / 100.0;
		roundedRectShape.moveTo((-width / 2.0) + borderRadiusTL, (height / 2.0));
		roundedRectShape.lineTo((width / 2.0) - borderRadiusTR, (height / 2.0));
		if (borderRadiusTR > 0.0) {
		roundedRectShape.arc(0, -borderRadiusTR, borderRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
		}
		roundedRectShape.lineTo((width / 2.0), (-height / 2.0) + borderRadiusBR);
		if (borderRadiusBR > 0.0) {
		roundedRectShape.arc(-borderRadiusBR, 0, borderRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
		}
		roundedRectShape.lineTo((-width / 2.0) + borderRadiusBL, (-height / 2.0));
		if (borderRadiusBL > 0.0) {
		roundedRectShape.arc(0, borderRadiusBL, borderRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
		}
		roundedRectShape.lineTo((-width / 2.0), (height / 2.0) - borderRadiusTL);
		if (borderRadiusTL > 0.0) {
		roundedRectShape.arc(borderRadiusTL, 0, borderRadiusTL, Math.PI, Math.PI / 2.0, true);
		}
		geometry = new THREE.ShapeGeometry(roundedRectShape);
		geometry.name = '_geometry';
		geometry.computeBoundingBox();
		var min = geometry.boundingBox.min;
		var max = geometry.boundingBox.max;
		var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
		var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
		var vertexPositions = geometry.getAttribute('position');
		var vertexUVs = geometry.getAttribute('uv');
		for (var i = 0; i < vertexPositions.count; i++) {
			var v1 = vertexPositions.getX(i);
			var	v2 = vertexPositions.getY(i);
			vertexUVs.setX(i, (v1 + offset.x) / range.x);
			vertexUVs.setY(i, (v2 + offset.y) / range.y);
		}
		geometry.uvsNeedUpdate = true;
			} else {
				geometry = new THREE.PlaneGeometry(el.userData.width / 100.0, el.userData.height / 100.0, 5, 5);
				geometry.name = '_geometry';
			}
			el.geometry = geometry;
		}
		me.__.userData.backgroundColorAlpha = 1;
		me.__.userData.borderColorAlpha = 1;
		me.__.userData.setOpacityInternal = function(v) {
			me.__.material.opacity = v;
			if (me.__.userData.hasScrollbar) {
				me.__.userData.scrollbar.material.opacity = v;
				me.__.userData.scrollbarBg.material.opacity = v;
			}
			if (me.__.userData.ggSubElement) {
				me.__.userData.ggSubElement.material.opacity = v
				me.__.userData.ggSubElement.visible = (v>0 && me.__.userData.visible);
			}
			me.__.visible = (v>0 && me.__.userData.visible);
		}
		me.__.userData.setBackgroundColor = function(v) {
			me.__.material.color = v;
		}
		me.__.userData.setBackgroundColorAlpha = function(v) {
			me.__.userData.backgroundColorAlpha = v;
			me.__.userData.setOpacity(me.__.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 0, 0);
		el.userData.backgroundColor = player.getTHREESkinColor('#ffffff');
		el.userData.textColor = '#000000';
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 200;
		canvas.height = 40;
		el.userData.textCanvas = canvas;
		el.userData.textCanvasContext = canvas.getContext('2d');
		var tmpCanvas = document.createElement('canvas');
		el.userData.tmpCanvas = tmpCanvas;
		el.userData.tmpCanvasContext = tmpCanvas.getContext('2d');
		el.userData.ggTextureFromCanvas = function() {
			var el = me.__;
			var canv = me.__.userData.textCanvas;
			var ctx = me.__.userData.textCanvasContext;
			var tmpCanv = me.__.userData.tmpCanvas;
			ctx.clearRect(0, 0, canv.width, canv.height);
			if (tmpCanv.width > 0 && tmpCanv.height > 0) {
				ctx.drawImage(tmpCanv, 0, ( me.__.userData.scrollPosPercent ? tmpCanv.height * me.__.userData.scrollPosPercent : 0), canv.width, canv.height, 0, 0, canv.width, canv.height);
			}
		width = me.__.userData.boxWidthCanv / 100.0;
		height = me.__.userData.boxHeightCanv / 100.0;
		me.__.userData.width = me.__.userData.boxWidthCanv;
		me.__.userData.height = me.__.userData.boxHeightCanv;
		me.__.userData.createGeometry();
		var newPos = skin.getElementVrPosition(me.__, 0, 0);
		me.__.position.x = newPos.x;
		me.__.position.y = newPos.y;
			var textTexture = new THREE.CanvasTexture(canv);
			textTexture.name = '_texture';
			textTexture.minFilter = THREE.LinearFilter;
			textTexture.colorSpace = THREE.LinearSRGBColorSpace;
			textTexture.wrapS = THREE.ClampToEdgeWrapping;
			textTexture.wrapT = THREE.ClampToEdgeWrapping;
			if (me.__.material.map) {
				me.__.material.map.dispose();
			}
			me.__.material.map = textTexture;
			me.__.material.needsUpdate = true;
			player.repaint();
		}
		el.userData.ggRenderText = function() {
			skin.removeChildren(me.__, 'scrollbar');
			skin.paintTextDivToCanvas(me.__, 'box-sizing: border-box; width: auto; height: auto; font-size: 5px; font-weight: inherit; color: #000000; text-align: center; white-space: pre; padding: 0px; overflow: hidden;' + '; color: ' + me.__.userData.textColor + ' !important;', false, true, false);
			me.__.userData.hasScrollbar = false;
		}
		el.userData.ggUpdateText=function(force) {
			var params = [];
			var hs = player._("Clique acima para assitir.", params);
			if (hs!=this.ggText || force) {
				this.ggText=hs;
				this.ggRenderText();
			}
		}
		el.userData.setBackgroundColor = function(v) {
			me.__.userData.backgroundColor = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me.__.userData.backgroundColorAlpha = v;
		}
		el.userData.setTextColor = function(v) {
			me.__.userData.textColor = '#' + v.getHexString();
		}
		el.userData.setTextColorAlpha = function(v) {
			me.__.userData.textColorAlpha = v;
		}
		el.userData.ggId="";
		me.__.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me.__.userData.ggUpdatePosition=function (useTransition) {
				me.__.userData.ggUpdateText(true);
		}
		me._ht_click.add(me.__);
		me._ht_click.userData.setOpacity(1.00);
		me.elementMouseOver['ht_click']=false;
		me.__.userData.setOpacity(1.00);
			me.__.userData.ggUpdateText(true);
			me.__obj = me._ht_click;
	me.__obj.userData.ggUse3d=true;
	me.__obj.userData.gg3dDistance=500;
			me.__obj.userData.hotspot = hotspot;
			me.__obj.userData.fromSkin = true;
	};
	function SkinHotspotClass_ht_click(parentScope,hotspot) {
		var me=this;
		var flag=false;
		var hs='';
		me.parentScope=parentScope;
		me.hotspot=hotspot;
		var nodeId=String(hotspot.url);
		nodeId=(nodeId.charAt(0)=='{')?nodeId.substr(1, nodeId.length - 2):''; // }
		me.ggNodeId=nodeId;
		me.ggUserdata=skin.player.getNodeUserdata(nodeId);
		me.elementMouseDown={};
		me.elementMouseOver={};
		me.findElements=function(id,regex) {
			return skin.findElements(id,regex);
		}
		el=me._ht_click=document.createElement('div');
		el.ggId="ht_click";
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_hotspot ";
		el.ggType='hotspot';
		el.userData=el;
		hs ='';
		hs+='height : 0px;';
		hs+='left : 418px;';
		hs+='position : absolute;';
		hs+='top : 101px;';
		hs+='visibility : inherit;';
		hs+='width : 0px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._ht_click.ggIsActive=function() {
			return player.getCurrentNode()==this.ggElementNodeId();
		}
		el.ggElementNodeId=function() {
			if (me.hotspot.url!='' && me.hotspot.url.charAt(0)=='{') { // }
				return me.hotspot.url.substr(1, me.hotspot.url.length - 2);
			} else {
				if ((this.parentNode) && (this.parentNode.ggElementNodeId)) {
					return this.parentNode.ggElementNodeId();
				} else {
					return player.getCurrentNode();
				}
			}
		}
		me._ht_click.onclick=function (e) {
			player.triggerEvent('hsproxyclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_click.ondblclick=function (e) {
			player.triggerEvent('hsproxydblclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_click.onmouseenter=function (e) {
			player.setActiveHotspot(me.hotspot);
			me.elementMouseOver['ht_click']=true;
			player.triggerEvent('hsproxyover', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_click.onmouseleave=function (e) {
			me.elementMouseOver['ht_click']=false;
			player.triggerEvent('hsproxyout', {'id': me.hotspot.id, 'url': me.hotspot.url});
			player.setActiveHotspot(null);
		}
		me._ht_click.ggUpdatePosition=function (useTransition) {
		}
		el=me.__=document.createElement('div');
		els=me.____text=document.createElement('div');
		el.className='ggskin ggskin_textdiv';
		el.ggTextDiv=els;
		el.ggId="";
		el.ggDx=0;
		el.ggDy=0;
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'translate(-50%, -50%) ' };
		el.ggVisible=true;
		el.className="ggskin ggskin_text ";
		el.ggType='text';
		el.userData=el;
		hs ='';
		hs+='color : #000000;';
		hs+='height : auto;';
		hs+='left : calc(50% - ((0px + 0px) / 2) + 0px);';
		hs+='position : absolute;';
		hs+='top : calc(50% - ((0px + 0px) / 2) + 0px);';
		hs+='transform : translate(-50%, -50%);;';
		hs+='visibility : inherit;';
		hs+='width : auto;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		hs='';
		hs+='border : 0px solid #000000;';
		hs+='box-sizing: border-box;';
		hs+='width: auto;';
		hs+='height: auto;';
		hs+='font-size: 5px;';
		hs+='font-weight: inherit;';
		hs+='text-align: center;';
		hs+='white-space: pre;';
		hs+='padding: 0px;';
		hs+='overflow: hidden;';
		els.setAttribute('style',hs);
		me.__.ggUpdateText=function() {
			var params = [];
			var hs = player._("Clique acima para assitir.", params);
			if (hs!=this.ggText) {
				this.ggText=hs;
				this.ggTextDiv.innerHTML=hs;
				if (this.ggUpdatePosition) this.ggUpdatePosition();
			}
		}
		me.__.ggUpdateText();
		el.appendChild(els);
		me.__.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me.__.ggUpdatePosition=function (useTransition) {
		}
		me._ht_click.appendChild(me.__);
		me.elementMouseOver['ht_click']=false;
		me.ggUse3d=true;
		me.gg3dDistance=500;
			me.__div = me._ht_click;
	};
	function SkinHotspotClass_ht_obra__3d(parentScope,hotspot) {
		var me=this;
		var flag=false;
		var hs='';
		me.parentScope=parentScope;
		me.hotspot=hotspot;
		var nodeId=String(hotspot.url);
		nodeId=(nodeId.charAt(0)=='{')?nodeId.substr(1, nodeId.length - 2):''; // }
		me.ggUserdata=skin.player.getNodeUserdata(nodeId);
		me.ggUserdata.nodeId=nodeId;
		me.ggNodeId=nodeId;
		me.elementMouseDown={};
		me.elementMouseOver={};
		me.findElements=function(id,regex) {
			return skin.findElements(id,regex);
		}
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {
			me._ht_obra.visible = (v>0 && me._ht_obra.userData.visible);
		}
		el.userData.width = 0;
		el.userData.height = 0;
		el.name = 'ht_obra';
		el.userData.x = 0;
		el.userData.y = 0;
		el.translateZ(0.030);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.030;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 1;
		el.userData.renderOrder = 1;
		el.userData.isVisible = function() {
			let vis = me._ht_obra.visible
			let parentEl = me._ht_obra.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_obra.userData.opacity = v;
			v = v * me._ht_obra.userData.parentOpacity;
			if (me._ht_obra.userData.setOpacityInternal) me._ht_obra.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_obra.children.length; i++) {
				let child = me._ht_obra.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_obra.userData.parentOpacity = v;
			v = v * me._ht_obra.userData.opacity
			if (me._ht_obra.userData.setOpacityInternal) me._ht_obra.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_obra.children.length; i++) {
				let child = me._ht_obra.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_obra = el;
		el.userData.ggId="ht_obra";
		me._ht_obra.userData.ggIsActive=function() {
			return player.getCurrentNode()==this.ggElementNodeId();
		}
		el.userData.ggElementNodeId=function() {
			if (me.hotspot.url!='' && me.hotspot.url.charAt(0)=='{') { // }
				return me.hotspot.url.substr(1, me.hotspot.url.length - 2);
			} else {
				if ((this.parentNode) && (this.parentNode.userData.ggElementNodeId)) {
					return this.parentNode.userData.ggElementNodeId();
				} else {
					return player.getCurrentNode();
				}
			}
		}
		me._ht_obra.userData.onclick=function (e) {
			skin._popup_imagem.ggSetImage(player._(me.hotspot.url));
			skin._popup_fundo.style.transition='none';
			skin._popup_fundo.style.visibility=(Number(skin._popup_fundo.style.opacity)>0||!skin._popup_fundo.style.opacity)?'inherit':'hidden';
			skin._popup_fundo.ggVisible=true;
				skin._obra_titulo.ggUpdateText=function() {
					var params = [];
					params.push(String(player._(me.hotspot.title)));
					var hs = player._("%1", params);
					if (hs!=this.ggText) {
						this.ggText=hs;
						this.ggTextDiv.innerHTML=hs;
						if (this.ggUpdatePosition) this.ggUpdatePosition();
					}
				}
			skin._obra_titulo.ggUpdateText();
			skin._obra_titulo.ggTextDiv.scrollTop = 0;
				skin._obra_desc.ggUpdateText=function() {
					var params = [];
					params.push(String(player._(me.hotspot.description)));
					var hs = player._("%1", params);
					if (hs!=this.ggText) {
						this.ggText=hs;
						this.ggTextDiv.innerHTML=hs;
						if (this.ggUpdatePosition) this.ggUpdatePosition();
					}
				}
			skin._obra_desc.ggUpdateText();
			skin._obra_desc.ggTextDiv.scrollTop = 0;
			player.triggerEvent('hsproxyclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_obra.userData.hasOwnClickAction = true;
		me._ht_obra.userData.ondblclick=function (e) {
			player.triggerEvent('hsproxydblclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_obra.userData.onmouseenter=function (e) {
			player.setActiveHotspot(me.hotspot);
			me.elementMouseOver['ht_obra']=true;
			player.triggerEvent('hsproxyover', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_obra.userData.onmouseleave=function (e) {
			me.elementMouseOver['ht_obra']=false;
			player.triggerEvent('hsproxyout', {'id': me.hotspot.id, 'url': me.hotspot.url});
			player.setActiveHotspot(null);
		}
		me._ht_obra.userData.ggUpdatePosition=function (useTransition) {
		}
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {
			me._lottie_2_1.visible = (v>0 && me._lottie_2_1.userData.visible);
		}
		el.userData.width = 0;
		el.userData.height = 0;
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 68;
		el.userData.height = 68;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'Lottie 2_1';
		el.userData.x = 0;
		el.userData.y = 0;
		el.translateZ(0.030);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.030;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 1;
		el.userData.renderOrder = 1;
		el.userData.setOpacityInternal = function(v) {
			if (me._lottie_2_1.material) me._lottie_2_1.material.opacity = v;
			me._lottie_2_1.visible = (v>0 && me._lottie_2_1.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._lottie_2_1.visible
			let parentEl = me._lottie_2_1.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._lottie_2_1.userData.opacity = v;
			v = v * me._lottie_2_1.userData.parentOpacity;
			if (me._lottie_2_1.userData.setOpacityInternal) me._lottie_2_1.userData.setOpacityInternal(v);
			for (let i = 0; i < me._lottie_2_1.children.length; i++) {
				let child = me._lottie_2_1.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._lottie_2_1.userData.parentOpacity = v;
			v = v * me._lottie_2_1.userData.opacity
			if (me._lottie_2_1.userData.setOpacityInternal) me._lottie_2_1.userData.setOpacityInternal(v);
			for (let i = 0; i < me._lottie_2_1.children.length; i++) {
				let child = me._lottie_2_1.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._lottie_2_1 = el;
		el.userData.ggId="Lottie 2_1";
		me._lottie_2_1.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._lottie_2_1.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_obra.add(me._lottie_2_1);
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( { color: player.getTHREESkinColor('#ffffff'), side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || false) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'tmb_obra_material';
			el.material = material;
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 30;
		el.userData.height = 30;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 15;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 15;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 15;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 15;
		el.name = 'tmb_obra';
		el.userData.x = 0;
		el.userData.y = 0;
		el.translateZ(0.060);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.060;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 2;
		el.userData.renderOrder = 2;
		el.userData.isVisible = function() {
			let vis = me._tmb_obra.visible
			let parentEl = me._tmb_obra.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._tmb_obra.userData.opacity = v;
			v = v * me._tmb_obra.userData.parentOpacity;
			if (me._tmb_obra.userData.setOpacityInternal) me._tmb_obra.userData.setOpacityInternal(v);
			for (let i = 0; i < me._tmb_obra.children.length; i++) {
				let child = me._tmb_obra.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._tmb_obra.userData.parentOpacity = v;
			v = v * me._tmb_obra.userData.opacity
			if (me._tmb_obra.userData.setOpacityInternal) me._tmb_obra.userData.setOpacityInternal(v);
			for (let i = 0; i < me._tmb_obra.children.length; i++) {
				let child = me._tmb_obra.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._tmb_obra = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 1;
		el.userData.borderWidth.default.right = 1;
		el.userData.borderWidth.default.bottom = 1;
		el.userData.borderWidth.default.left = 1;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 999;
		el.userData.borderRadius.default.topRight = 999;
		el.userData.borderRadius.default.bottomRight = 999;
		el.userData.borderRadius.default.bottomLeft = 999;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._tmb_obra;
			skin.disposeGeometryAndMaterial(el);
			skin.removeChildren(el, 'subElement');
			if (typeof(bwTop) != 'undefined') {
				el.userData.borderWidth.top = bwTop;
				el.userData.borderWidth.right = bwRight;
				el.userData.borderWidth.bottom = bwBottom;
				el.userData.borderWidth.left = bwLeft;
				el.userData.borderRadius.topLeft = brTopLeft;
				el.userData.borderRadius.topRight = brTopRight;
				el.userData.borderRadius.bottomRight = brBottomRight;
				el.userData.borderRadius.bottomLeft = brBottomLeft;
			}
			let width = el.userData.width / 100.0;
			let height = el.userData.height / 100.0;
			skin.rectCalcBorderRadiiInnerShape(me._tmb_obra);
			if (skin.rectHasRoundedCorners(me._tmb_obra)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._tmb_obra.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._tmb_obra.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._tmb_obra.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._tmb_obra.userData.borderRadiusInnerShape.bottomLeft / 100.0;
		roundedRectShape.moveTo((-width / 2.0) + borderRadiusTL, (height / 2.0));
		roundedRectShape.lineTo((width / 2.0) - borderRadiusTR, (height / 2.0));
		if (borderRadiusTR > 0.0) {
		roundedRectShape.arc(0, -borderRadiusTR, borderRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
		}
		roundedRectShape.lineTo((width / 2.0), (-height / 2.0) + borderRadiusBR);
		if (borderRadiusBR > 0.0) {
		roundedRectShape.arc(-borderRadiusBR, 0, borderRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
		}
		roundedRectShape.lineTo((-width / 2.0) + borderRadiusBL, (-height / 2.0));
		if (borderRadiusBL > 0.0) {
		roundedRectShape.arc(0, borderRadiusBL, borderRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
		}
		roundedRectShape.lineTo((-width / 2.0), (height / 2.0) - borderRadiusTL);
		if (borderRadiusTL > 0.0) {
		roundedRectShape.arc(borderRadiusTL, 0, borderRadiusTL, Math.PI, Math.PI / 2.0, true);
		}
		geometry = new THREE.ShapeGeometry(roundedRectShape);
		geometry.name = 'tmb_obra_geometry';
		geometry.computeBoundingBox();
		var min = geometry.boundingBox.min;
		var max = geometry.boundingBox.max;
		var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
		var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
		var vertexPositions = geometry.getAttribute('position');
		var vertexUVs = geometry.getAttribute('uv');
		for (var i = 0; i < vertexPositions.count; i++) {
			var v1 = vertexPositions.getX(i);
			var	v2 = vertexPositions.getY(i);
			vertexUVs.setX(i, (v1 + offset.x) / range.x);
			vertexUVs.setY(i, (v2 + offset.y) / range.y);
		}
		geometry.uvsNeedUpdate = true;
			} else {
				geometry = new THREE.PlaneGeometry(el.userData.width / 100.0, el.userData.height / 100.0, 5, 5);
				geometry.name = 'tmb_obra_geometry';
			}
			el.geometry = geometry;
			el.userData.borderRadiusInnerShape = {};
		let bWidthLeft = me._tmb_obra.userData.borderWidth.left / 100.0;
		let bWidthTop = me._tmb_obra.userData.borderWidth.top / 100.0;
		let bWidthRight = me._tmb_obra.userData.borderWidth.right / 100.0;
		let bWidthBottom = me._tmb_obra.userData.borderWidth.bottom / 100.0;
		let maxRad = skin.rectMaxRadius(me._tmb_obra);
		let bRadiusTL = Math.min(me._tmb_obra.userData.borderRadius.topLeft / 100.0, maxRad / 100.0);
		let bRadiusTR = Math.min(me._tmb_obra.userData.borderRadius.topRight / 100.0, maxRad / 100.0);
		let bRadiusBR = Math.min(me._tmb_obra.userData.borderRadius.bottomRight / 100.0, maxRad / 100.0);
		let bRadiusBL = Math.min(me._tmb_obra.userData.borderRadius.bottomLeft / 100.0, maxRad / 100.0);
		borderShape = new THREE.Shape();
		borderShape.moveTo((-width / 2.0) - bWidthLeft + bRadiusTL, (height / 2.0) + bWidthTop);
		borderShape.lineTo((width / 2.0) + bWidthRight - bRadiusTR, (height / 2.0) + bWidthTop);
		if (bRadiusTR > 0) {
			borderShape.arc(0, -bRadiusTR, bRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
		}
		borderShape.lineTo((width / 2.0) + bWidthRight, (-height / 2.0) - bWidthBottom + bRadiusBR);
		if (bRadiusBR > 0) {
			borderShape.arc(-bRadiusBR, 0, bRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
		}
		borderShape.lineTo((-width / 2.0) - bWidthLeft + bRadiusBL, (-height / 2.0) - bWidthBottom);
		if (bRadiusBL > 0) {
			borderShape.arc(0, bRadiusBL, bRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
		}
		borderShape.lineTo((-width / 2.0) - bWidthLeft, (height / 2.0) + bWidthTop - bRadiusTL);
		if (bRadiusTL > 0) {
			borderShape.arc(bRadiusTL, 0, bRadiusTL, Math.PI, Math.PI / 2.0, true);
		}
		innerShape = new THREE.Path();
		if (skin.rectHasRoundedCorners(me._tmb_obra)) {
			let borderRadiusTL = bRadiusTL - ((bWidthTop + bWidthLeft) / 2.0);
			let borderRadiusTR = bRadiusTR - ((bWidthTop + bWidthRight) / 2.0);
			let borderRadiusBR = bRadiusBR - ((bWidthBottom + bWidthRight) / 2.0);
			let borderRadiusBL = bRadiusBL - ((bWidthBottom + bWidthLeft) / 2.0);
		innerShape.moveTo((-width / 2.0) + borderRadiusTL, (height / 2.0));
		innerShape.lineTo((width / 2.0) - borderRadiusTR, (height / 2.0));
		if (borderRadiusTR > 0.0) {
		innerShape.arc(0, -borderRadiusTR, borderRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
		}
		innerShape.lineTo((width / 2.0), (-height / 2.0) + borderRadiusBR);
		if (borderRadiusBR > 0.0) {
		innerShape.arc(-borderRadiusBR, 0, borderRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
		}
		innerShape.lineTo((-width / 2.0) + borderRadiusBL, (-height / 2.0));
		if (borderRadiusBL > 0.0) {
		innerShape.arc(0, borderRadiusBL, borderRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
		}
		innerShape.lineTo((-width / 2.0), (height / 2.0) - borderRadiusTL);
		if (borderRadiusTL > 0.0) {
		innerShape.arc(borderRadiusTL, 0, borderRadiusTL, Math.PI, Math.PI / 2.0, true);
		}
		} else {
			innerShape.moveTo((-width / 2.0), (height / 2.0));
			innerShape.lineTo((width / 2.0), (height / 2.0));
			innerShape.lineTo((width / 2.0), (-height / 2.0));
			innerShape.lineTo((-width / 2.0), (-height / 2.0));
		}
		borderShape.holes.push(innerShape);
		borderGeometry = new THREE.ShapeGeometry(borderShape);
		borderGeometry.name = 'tmb_obra_subElement_borderGeometry';
		borderMaterial = new THREE.MeshBasicMaterial( {color: player.getTHREESkinColor('#000000'), side: THREE.DoubleSide, transparent: (player.get3dModelType() != 2 || false) } );
		borderMaterial.name = 'tmb_obra_subElement_borderMaterial';
		me._tmb_obra.userData.border = new THREE.Mesh( borderGeometry, borderMaterial );
		me._tmb_obra.userData.border.name = 'tmb_obra_subElement_borderMesh';
		me._tmb_obra.add(me._tmb_obra.userData.border);
		}
		me._tmb_obra.userData.backgroundColorAlpha = 1;
		me._tmb_obra.userData.borderColorAlpha = 1;
		me._tmb_obra.userData.setOpacityInternal = function(v) {
			me._tmb_obra.material.opacity = v * me._tmb_obra.userData.backgroundColorAlpha;
			me._tmb_obra.userData.border.material.opacity = v * me._tmb_obra.userData.borderColorAlpha;
			if (me._tmb_obra.userData.ggSubElement) {
				me._tmb_obra.userData.ggSubElement.material.opacity = v
				me._tmb_obra.userData.ggSubElement.visible = (v>0 && me._tmb_obra.userData.visible);
			}
			me._tmb_obra.visible = (v>0 && me._tmb_obra.userData.visible);
		}
		me._tmb_obra.userData.setBackgroundColor = function(v) {
			me._tmb_obra.material.color = v;
		}
		me._tmb_obra.userData.setBackgroundColorAlpha = function(v) {
			me._tmb_obra.userData.backgroundColorAlpha = v;
			me._tmb_obra.userData.setOpacity(me._tmb_obra.userData.opacity);
		}
		me._tmb_obra.userData.setBorderColor = function(v) {
			me._tmb_obra.userData.border.material.color = v;
		}
		me._tmb_obra.userData.setBorderColorAlpha = function(v) {
			me._tmb_obra.userData.borderColorAlpha = v;
			me._tmb_obra.userData.setOpacity(me._tmb_obra.userData.opacity);
		}
		el.userData.createGeometry(1, 1, 1, 1, 999, 999, 999, 999);
		currentWidth = 30;
		currentHeight = 30;
		var img = {};
		let width = currentWidth / 100.0;
		let height = currentHeight / 100.0;
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._tmb_obra.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._tmb_obra.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._tmb_obra.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._tmb_obra.userData.borderRadiusInnerShape.bottomLeft / 100.0;
		roundedRectShape.moveTo((-width / 2.0) + borderRadiusTL, (height / 2.0));
		roundedRectShape.lineTo((width / 2.0) - borderRadiusTR, (height / 2.0));
		if (borderRadiusTR > 0.0) {
		roundedRectShape.arc(0, -borderRadiusTR, borderRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
		}
		roundedRectShape.lineTo((width / 2.0), (-height / 2.0) + borderRadiusBR);
		if (borderRadiusBR > 0.0) {
		roundedRectShape.arc(-borderRadiusBR, 0, borderRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
		}
		roundedRectShape.lineTo((-width / 2.0) + borderRadiusBL, (-height / 2.0));
		if (borderRadiusBL > 0.0) {
		roundedRectShape.arc(0, borderRadiusBL, borderRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
		}
		roundedRectShape.lineTo((-width / 2.0), (height / 2.0) - borderRadiusTL);
		if (borderRadiusTL > 0.0) {
		roundedRectShape.arc(borderRadiusTL, 0, borderRadiusTL, Math.PI, Math.PI / 2.0, true);
		}
		geometry = new THREE.ShapeGeometry(roundedRectShape);
		geometry.name = 'tmb_obra_geometry';
		geometry.computeBoundingBox();
		var min = geometry.boundingBox.min;
		var max = geometry.boundingBox.max;
		var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
		var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
		var vertexPositions = geometry.getAttribute('position');
		var vertexUVs = geometry.getAttribute('uv');
		for (var i = 0; i < vertexPositions.count; i++) {
			var v1 = vertexPositions.getX(i);
			var	v2 = vertexPositions.getY(i);
			vertexUVs.setX(i, (v1 + offset.x) / range.x);
			vertexUVs.setY(i, (v2 + offset.y) / range.y);
		}
		geometry.uvsNeedUpdate = true;
		img.geometry = geometry;
		loader = new THREE.TextureLoader();
		el.userData.ggSetUrl = function(extUrl) {
			loader.load(extUrl,
				function (texture) {
				texture.colorSpace = player.getTextureColorSpace();
				let tmpDepthTest = true;
				if (me._tmb_obra.userData.ggSubElement.material) {
					tmpDepthTest = me._tmb_obra.userData.ggSubElement.material.depthTest;
				}
				var loadedMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true, depthTest: tmpDepthTest, depthWrite: tmpDepthTest });
				loadedMaterial.name = 'tmb_obra_subElementMaterial';
				me._tmb_obra.userData.ggSubElement.material = loadedMaterial;
				me._tmb_obra.userData.ggUpdatePosition();
				me._tmb_obra.userData.ggText = extUrl;
				me._tmb_obra.userData.setOpacity(me._tmb_obra.userData.opacity);
			});
		};
		player.addListener('changenode', function() {
		});
		var extUrl=basePath + ""+player._(me.hotspot.url)+"";
		el.userData.ggSetUrl(extUrl);
		material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, transparent: true } );
		material.name = 'tmb_obra_subElementMaterial';
		el.userData.ggSubElement = new THREE.Mesh( img.geometry, material );
		el.userData.ggSubElement.name = 'tmb_obra_subElement';
		el.userData.ggSubElement.position.z = el.position.z + 0.005;
		el.add(el.userData.ggSubElement);
		el.userData.clientWidth = 30;
		el.userData.clientHeight = 30;
		el.userData.ggId="tmb_obra";
		me._tmb_obra.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._tmb_obra.userData.onmouseenter=function (e) {
			player.setOverrideCursor('pointer');
			me.elementMouseOver['tmb_obra']=true;
		}
		me._tmb_obra.userData.onmouseleave=function (e) {
			player.setOverrideCursor('default');
			me.elementMouseOver['tmb_obra']=false;
		}
		me._tmb_obra.userData.ggUpdatePosition=function (useTransition) {
			var parentWidth = me._tmb_obra.userData.clientWidth;
			var parentHeight = me._tmb_obra.userData.clientHeight;
			var img = me._tmb_obra.userData.ggSubElement;
			if (!img.material || !img.material.map) return;
			var imgWidth = img.material.map.image.naturalWidth;
			var imgHeight = img.material.map.image.naturalHeight;
			var aspectRatioDiv = parentWidth / parentHeight;
			var aspectRatioImg = imgWidth / imgHeight;
			var currentWidth, currentHeight;
			img.geometry.dispose();
			if (aspectRatioDiv > aspectRatioImg) {
				currentHeight = parentHeight;
				currentWidth = parentHeight * aspectRatioImg;
			let width = currentWidth / 100.0;
			let height = currentHeight / 100.0;
			roundedRectShape = new THREE.Shape();
			let borderRadiusTL = me._tmb_obra.userData.borderRadiusInnerShape.topLeft / 100.0;
			let borderRadiusTR = me._tmb_obra.userData.borderRadiusInnerShape.topRight / 100.0;
			let borderRadiusBR = me._tmb_obra.userData.borderRadiusInnerShape.bottomRight / 100.0;
			let borderRadiusBL = me._tmb_obra.userData.borderRadiusInnerShape.bottomLeft / 100.0;
			roundedRectShape.moveTo((-width / 2.0) + borderRadiusTL, (height / 2.0));
			roundedRectShape.lineTo((width / 2.0) - borderRadiusTR, (height / 2.0));
			if (borderRadiusTR > 0.0) {
			roundedRectShape.arc(0, -borderRadiusTR, borderRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
			}
			roundedRectShape.lineTo((width / 2.0), (-height / 2.0) + borderRadiusBR);
			if (borderRadiusBR > 0.0) {
			roundedRectShape.arc(-borderRadiusBR, 0, borderRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
			}
			roundedRectShape.lineTo((-width / 2.0) + borderRadiusBL, (-height / 2.0));
			if (borderRadiusBL > 0.0) {
			roundedRectShape.arc(0, borderRadiusBL, borderRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
			}
			roundedRectShape.lineTo((-width / 2.0), (height / 2.0) - borderRadiusTL);
			if (borderRadiusTL > 0.0) {
			roundedRectShape.arc(borderRadiusTL, 0, borderRadiusTL, Math.PI, Math.PI / 2.0, true);
			}
			geometry = new THREE.ShapeGeometry(roundedRectShape);
			geometry.name = 'tmb_obra_geometry';
			geometry.computeBoundingBox();
			var min = geometry.boundingBox.min;
			var max = geometry.boundingBox.max;
			var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
			var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
			var vertexPositions = geometry.getAttribute('position');
			var vertexUVs = geometry.getAttribute('uv');
			for (var i = 0; i < vertexPositions.count; i++) {
				var v1 = vertexPositions.getX(i);
				var	v2 = vertexPositions.getY(i);
				vertexUVs.setX(i, (v1 + offset.x) / range.x);
				vertexUVs.setY(i, (v2 + offset.y) / range.y);
			}
			geometry.uvsNeedUpdate = true;
			img.geometry = geometry;
			} else {
				currentWidth = parentWidth;
				currentHeight = parentWidth / aspectRatioImg;
			let width = currentWidth / 100.0;
			let height = currentHeight / 100.0;
			roundedRectShape = new THREE.Shape();
			let borderRadiusTL = me._tmb_obra.userData.borderRadiusInnerShape.topLeft / 100.0;
			let borderRadiusTR = me._tmb_obra.userData.borderRadiusInnerShape.topRight / 100.0;
			let borderRadiusBR = me._tmb_obra.userData.borderRadiusInnerShape.bottomRight / 100.0;
			let borderRadiusBL = me._tmb_obra.userData.borderRadiusInnerShape.bottomLeft / 100.0;
			roundedRectShape.moveTo((-width / 2.0) + borderRadiusTL, (height / 2.0));
			roundedRectShape.lineTo((width / 2.0) - borderRadiusTR, (height / 2.0));
			if (borderRadiusTR > 0.0) {
			roundedRectShape.arc(0, -borderRadiusTR, borderRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
			}
			roundedRectShape.lineTo((width / 2.0), (-height / 2.0) + borderRadiusBR);
			if (borderRadiusBR > 0.0) {
			roundedRectShape.arc(-borderRadiusBR, 0, borderRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
			}
			roundedRectShape.lineTo((-width / 2.0) + borderRadiusBL, (-height / 2.0));
			if (borderRadiusBL > 0.0) {
			roundedRectShape.arc(0, borderRadiusBL, borderRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
			}
			roundedRectShape.lineTo((-width / 2.0), (height / 2.0) - borderRadiusTL);
			if (borderRadiusTL > 0.0) {
			roundedRectShape.arc(borderRadiusTL, 0, borderRadiusTL, Math.PI, Math.PI / 2.0, true);
			}
			geometry = new THREE.ShapeGeometry(roundedRectShape);
			geometry.name = 'tmb_obra_geometry';
			geometry.computeBoundingBox();
			var min = geometry.boundingBox.min;
			var max = geometry.boundingBox.max;
			var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
			var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
			var vertexPositions = geometry.getAttribute('position');
			var vertexUVs = geometry.getAttribute('uv');
			for (var i = 0; i < vertexPositions.count; i++) {
				var v1 = vertexPositions.getX(i);
				var	v2 = vertexPositions.getY(i);
				vertexUVs.setX(i, (v1 + offset.x) / range.x);
				vertexUVs.setY(i, (v2 + offset.y) / range.y);
			}
			geometry.uvsNeedUpdate = true;
			img.geometry = geometry;
			};
		}
		me._ht_obra.add(me._tmb_obra);
		me._ht_obra.userData.setOpacity(1.00);
		me.elementMouseOver['ht_obra']=false;
		me._tmb_obra.userData.setOpacity(1.00);
		me.elementMouseOver['tmb_obra']=false;
			me.__obj = me._ht_obra;
	me.__obj.userData.ggUse3d=true;
	me.__obj.userData.gg3dDistance=500;
			me.__obj.userData.hotspot = hotspot;
			me.__obj.userData.fromSkin = true;
	};
	function SkinHotspotClass_ht_obra(parentScope,hotspot) {
		var me=this;
		var flag=false;
		var hs='';
		me.parentScope=parentScope;
		me.hotspot=hotspot;
		var nodeId=String(hotspot.url);
		nodeId=(nodeId.charAt(0)=='{')?nodeId.substr(1, nodeId.length - 2):''; // }
		me.ggNodeId=nodeId;
		me.ggUserdata=skin.player.getNodeUserdata(nodeId);
		me.elementMouseDown={};
		me.elementMouseOver={};
		me.findElements=function(id,regex) {
			return skin.findElements(id,regex);
		}
		el=me._ht_obra=document.createElement('div');
		el.ggId="ht_obra";
		el.ggDx=0;
		el.ggDy=0;
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_hotspot ";
		el.ggType='hotspot';
		el.userData=el;
		hs ='';
		hs+='height : 0px;';
		hs+='left : calc(50% - ((0px + 0px) / 2) + 0px);';
		hs+='position : absolute;';
		hs+='top : calc(50% - ((0px + 0px) / 2) + 0px);';
		hs+='visibility : inherit;';
		hs+='width : 0px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._ht_obra.ggIsActive=function() {
			return player.getCurrentNode()==this.ggElementNodeId();
		}
		el.ggElementNodeId=function() {
			if (me.hotspot.url!='' && me.hotspot.url.charAt(0)=='{') { // }
				return me.hotspot.url.substr(1, me.hotspot.url.length - 2);
			} else {
				if ((this.parentNode) && (this.parentNode.ggElementNodeId)) {
					return this.parentNode.ggElementNodeId();
				} else {
					return player.getCurrentNode();
				}
			}
		}
		me._ht_obra.onclick=function (e) {
			skin._popup_imagem.ggSetImage(player._(me.hotspot.url));
			skin._popup_fundo.style.transition='none';
			skin._popup_fundo.style.visibility=(Number(skin._popup_fundo.style.opacity)>0||!skin._popup_fundo.style.opacity)?'inherit':'hidden';
			skin._popup_fundo.ggVisible=true;
				skin._obra_titulo.ggUpdateText=function() {
					var params = [];
					params.push(String(player._(me.hotspot.title)));
					var hs = player._("%1", params);
					if (hs!=this.ggText) {
						this.ggText=hs;
						this.ggTextDiv.innerHTML=hs;
						if (this.ggUpdatePosition) this.ggUpdatePosition();
					}
				}
			skin._obra_titulo.ggUpdateText();
			skin._obra_titulo.ggTextDiv.scrollTop = 0;
				skin._obra_desc.ggUpdateText=function() {
					var params = [];
					params.push(String(player._(me.hotspot.description)));
					var hs = player._("%1", params);
					if (hs!=this.ggText) {
						this.ggText=hs;
						this.ggTextDiv.innerHTML=hs;
						if (this.ggUpdatePosition) this.ggUpdatePosition();
					}
				}
			skin._obra_desc.ggUpdateText();
			skin._obra_desc.ggTextDiv.scrollTop = 0;
			player.triggerEvent('hsproxyclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_obra.ondblclick=function (e) {
			player.triggerEvent('hsproxydblclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_obra.onmouseenter=function (e) {
			player.setActiveHotspot(me.hotspot);
			me.elementMouseOver['ht_obra']=true;
			player.triggerEvent('hsproxyover', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_obra.onmouseleave=function (e) {
			me.elementMouseOver['ht_obra']=false;
			player.triggerEvent('hsproxyout', {'id': me.hotspot.id, 'url': me.hotspot.url});
			player.setActiveHotspot(null);
		}
		me._ht_obra.ggUpdatePosition=function (useTransition) {
		}
		el=me._lottie_2_1=document.createElement('div');
		el.ggLottie = lottie.loadAnimation({
			container: el,
			path: basePath + 'images/lottie_2_1.json',
			autoplay: true,
			loop: true,
			rendererSettings: {
				preserveAspectRatio: 'xMinYMin meet'
			}
		});
		el.ggId="Lottie 2_1";
		el.ggDx=0;
		el.ggDy=0;
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_lottie ";
		el.ggType='lottie';
		el.userData=el;
		hs ='';
		hs+='background : rgba(0,0,0,0);';
		hs+='height : 68px;';
		hs+='left : calc(50% - ((68px + 0px) / 2) + 0px);';
		hs+='position : absolute;';
		hs+='top : calc(50% - ((68px + 0px) / 2) + 0px);';
		hs+='visibility : inherit;';
		hs+='width : 68px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._lottie_2_1.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._lottie_2_1.ggUpdatePosition=function (useTransition) {
		}
		me._ht_obra.appendChild(me._lottie_2_1);
		el=me._tmb_obra=document.createElement('div');
		els=me._tmb_obra__img=document.createElement('img');
		els.className='ggskin ggskin_external';
		hs ='';
		hs += 'position: absolute;-webkit-user-drag:none;pointer-events:none;;';
		hs+='border-radius: 100px;';
		els.setAttribute('style', hs);
		els.onload=function() {me._tmb_obra.ggUpdatePosition();}
		el.appendChild(els);
		el.ggSubElement = els;
		hs ='';
		el.ggAltText="";
		el.ggScrollbars=false;
		el.ggUpdateText = function() {
			me._tmb_obra.ggSubElement.setAttribute('alt', player._(me._tmb_obra.ggAltText));
			me._tmb_obra.ggUpdateImagePlaceholder();
		}
		el.ggSetImage = function(img) {
			me._tmb_obra.ggText_untranslated = img;
			me._tmb_obra.ggUpdateImageTranslation();
		}
		el.ggUpdateImage = function() {
			me._tmb_obra.ggSubElement.style.width = '0px';
			me._tmb_obra.ggSubElement.style.height = '0px';
			me._tmb_obra.ggSubElement.src='';
			me._tmb_obra.ggSubElement.src=me._tmb_obra.ggText;
		}
		el.ggUpdateImageTranslation = function() {
			if (me._tmb_obra.ggText != player._(me._tmb_obra.ggText_untranslated)) {
				me._tmb_obra.ggText = player._(me._tmb_obra.ggText_untranslated);
				me._tmb_obra.ggUpdateImage()
			}
		}
		player.addListener('changenode', function() {
			me._tmb_obra.ggUpdateImagePlaceholder();
		});
		el.ggUpdateImagePlaceholder = function() {
			if (me._tmb_obra.ggText != ""+player._(me.hotspot.url)+"") {
				me._tmb_obra.ggText=""+player._(me.hotspot.url)+"";
				me._tmb_obra.ggUpdateImage()
			}
		}
		els['ondragstart']=function() { return false; };
		player.checkLoaded.push(els);
		el.ggUpdateText();
		el.ggId="tmb_obra";
		el.ggDx=0;
		el.ggDy=0;
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_external ";
		el.ggType='external';
		el.userData=el;
		hs ='';
		hs+='background : #ffffff;';
		hs+='border : 1px solid #000000;';
		hs+='border-radius : 999px;';
		hs+='cursor : pointer;';
		hs+='height : 30px;';
		hs+='left : calc(50% - ((30px + 2px) / 2) + 0px);';
		hs+='position : absolute;';
		hs+='top : calc(50% - ((30px + 2px) / 2) + 0px);';
		hs+='visibility : inherit;';
		hs+='width : 30px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._tmb_obra.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._tmb_obra.ggUpdatePosition=function (useTransition) {
			var parentWidth = me._tmb_obra.clientWidth;
			var parentHeight = me._tmb_obra.clientHeight;
			var img = me._tmb_obra__img;
			var aspectRatioDiv = me._tmb_obra.clientWidth / me._tmb_obra.clientHeight;
			var aspectRatioImg = img.naturalWidth / img.naturalHeight;
			var currentWidth,currentHeight;
			if (aspectRatioDiv > aspectRatioImg) {
				currentHeight = parentHeight;
				currentWidth = Math.round(parentHeight * aspectRatioImg);
				img.style.width='';
				img.style.height=parentHeight + 'px';
			} else {
				currentWidth = parentWidth;
				currentHeight = Math.round(parentWidth / aspectRatioImg);
				img.style.width=parentWidth + 'px';
				img.style.height='';
			};
			if (!me._tmb_obra.ggScrollbars || currentWidth < me._tmb_obra.clientWidth) {
				img.style.right='';
				img.style.left='50%';
				img.style.marginLeft='-' + currentWidth/2 + 'px';
			} else {
				img.style.right='';
				img.style.left='0px';
				img.style.marginLeft='0px';
				me._tmb_obra.scrollLeft=currentWidth / 2 - me._tmb_obra.clientWidth / 2;
			}
			if (!me._tmb_obra.ggScrollbars || currentHeight < me._tmb_obra.clientHeight) {
				img.style.bottom='';
				img.style.top='50%';
				img.style.marginTop='-' + currentHeight/2 + 'px';
			} else {
				img.style.bottom='';
				img.style.top='0px';
				img.style.marginTop='0px';
				me._tmb_obra.scrollTop=currentHeight / 2 - me._tmb_obra.clientHeight / 2;
			}
		}
		me._ht_obra.appendChild(me._tmb_obra);
		me.elementMouseOver['ht_obra']=false;
		me.ggUse3d=true;
		me.gg3dDistance=500;
			me.__div = me._ht_obra;
	};
	function SkinHotspotClass_ht_pdf__3d(parentScope,hotspot) {
		var me=this;
		var flag=false;
		var hs='';
		me.parentScope=parentScope;
		me.hotspot=hotspot;
		var nodeId=String(hotspot.url);
		nodeId=(nodeId.charAt(0)=='{')?nodeId.substr(1, nodeId.length - 2):''; // }
		me.ggUserdata=skin.player.getNodeUserdata(nodeId);
		me.ggUserdata.nodeId=nodeId;
		me.ggNodeId=nodeId;
		me.elementMouseDown={};
		me.elementMouseOver={};
		me.findElements=function(id,regex) {
			return skin.findElements(id,regex);
		}
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {
			me._ht_pdf.visible = (v>0 && me._ht_pdf.userData.visible);
		}
		el.userData.width = 0;
		el.userData.height = 0;
		el.name = 'ht_pdf';
		el.userData.x = 0;
		el.userData.y = 0;
		el.translateZ(0.060);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.060;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 2;
		el.userData.renderOrder = 2;
		el.userData.isVisible = function() {
			let vis = me._ht_pdf.visible
			let parentEl = me._ht_pdf.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_pdf.userData.opacity = v;
			v = v * me._ht_pdf.userData.parentOpacity;
			if (me._ht_pdf.userData.setOpacityInternal) me._ht_pdf.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_pdf.children.length; i++) {
				let child = me._ht_pdf.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_pdf.userData.parentOpacity = v;
			v = v * me._ht_pdf.userData.opacity
			if (me._ht_pdf.userData.setOpacityInternal) me._ht_pdf.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_pdf.children.length; i++) {
				let child = me._ht_pdf.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_pdf = el;
		el.userData.ggId="ht_pdf";
		me._ht_pdf.userData.ggIsActive=function() {
			return player.getCurrentNode()==this.ggElementNodeId();
		}
		el.userData.ggElementNodeId=function() {
			if (me.hotspot.url!='' && me.hotspot.url.charAt(0)=='{') { // }
				return me.hotspot.url.substr(1, me.hotspot.url.length - 2);
			} else {
				if ((this.parentNode) && (this.parentNode.userData.ggElementNodeId)) {
					return this.parentNode.userData.ggElementNodeId();
				} else {
					return player.getCurrentNode();
				}
			}
		}
		me._ht_pdf.userData.onclick=function (e) {
			skin._popup_imagem.ggSetImage(player._(me.hotspot.url));
			skin._popup_fundo.style.transition='none';
			skin._popup_fundo.style.visibility=(Number(skin._popup_fundo.style.opacity)>0||!skin._popup_fundo.style.opacity)?'inherit':'hidden';
			skin._popup_fundo.ggVisible=true;
			skin._popup_pdf.style.transition='none';
			skin._popup_pdf.style.visibility=(Number(skin._popup_pdf.style.opacity)>0||!skin._popup_pdf.style.opacity)?'inherit':'hidden';
			skin._popup_pdf.ggVisible=true;
				skin._popup_pdf.ggUpdateText=function() {
					var params = [];
					params.push(String(player._(me.hotspot.target)));
					var hs = player._("<iframe src=\"%1#toolbar=0&navpanes=0&scrollbar=0\" width=\"100%\" height=\"100%\" style=\"border:none;\"><\/iframe>\n", params);
					if (hs!=this.ggText) {
						this.ggText=hs;
						this.ggTextDiv.innerHTML=hs;
						if (this.ggUpdatePosition) this.ggUpdatePosition();
					}
				}
			skin._popup_pdf.ggUpdateText();
			skin._popup_pdf.ggTextDiv.scrollTop = 0;
			player.triggerEvent('hsproxyclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_pdf.userData.hasOwnClickAction = true;
		me._ht_pdf.userData.ondblclick=function (e) {
			player.triggerEvent('hsproxydblclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_pdf.userData.onmouseenter=function (e) {
			player.setActiveHotspot(me.hotspot);
			me.elementMouseOver['ht_pdf']=true;
			player.triggerEvent('hsproxyover', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_pdf.userData.onmouseleave=function (e) {
			me.elementMouseOver['ht_pdf']=false;
			player.triggerEvent('hsproxyout', {'id': me.hotspot.id, 'url': me.hotspot.url});
			player.setActiveHotspot(null);
		}
		me._ht_pdf.userData.ggUpdatePosition=function (useTransition) {
		}
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {
			me._lottie_2_10.visible = (v>0 && me._lottie_2_10.userData.visible);
		}
		el.userData.width = 0;
		el.userData.height = 0;
		el.translateX(0);
		el.translateY(-0.01);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 132;
		el.userData.height = 132;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'Lottie 2_1';
		el.userData.x = 0;
		el.userData.y = -0.01;
		el.translateZ(0.030);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.030;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 1;
		el.userData.renderOrder = 1;
		el.userData.setOpacityInternal = function(v) {
			if (me._lottie_2_10.material) me._lottie_2_10.material.opacity = v;
			me._lottie_2_10.visible = (v>0 && me._lottie_2_10.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._lottie_2_10.visible
			let parentEl = me._lottie_2_10.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._lottie_2_10.userData.opacity = v;
			v = v * me._lottie_2_10.userData.parentOpacity;
			if (me._lottie_2_10.userData.setOpacityInternal) me._lottie_2_10.userData.setOpacityInternal(v);
			for (let i = 0; i < me._lottie_2_10.children.length; i++) {
				let child = me._lottie_2_10.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._lottie_2_10.userData.parentOpacity = v;
			v = v * me._lottie_2_10.userData.opacity
			if (me._lottie_2_10.userData.setOpacityInternal) me._lottie_2_10.userData.setOpacityInternal(v);
			for (let i = 0; i < me._lottie_2_10.children.length; i++) {
				let child = me._lottie_2_10.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._lottie_2_10 = el;
		el.userData.ggId="Lottie 2_1";
		me._lottie_2_10.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._lottie_2_10.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_pdf.add(me._lottie_2_10);
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( { color: player.getTHREESkinColor('#ffffff'), side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || false) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'tmb_obra_material';
			el.material = material;
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 60;
		el.userData.height = 60;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 30;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 30;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 30;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 30;
		el.name = 'tmb_obra';
		el.userData.x = 0;
		el.userData.y = 0;
		el.translateZ(0.060);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.060;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 2;
		el.userData.renderOrder = 2;
		el.userData.isVisible = function() {
			let vis = me._tmb_obra0.visible
			let parentEl = me._tmb_obra0.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._tmb_obra0.userData.opacity = v;
			v = v * me._tmb_obra0.userData.parentOpacity;
			if (me._tmb_obra0.userData.setOpacityInternal) me._tmb_obra0.userData.setOpacityInternal(v);
			for (let i = 0; i < me._tmb_obra0.children.length; i++) {
				let child = me._tmb_obra0.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._tmb_obra0.userData.parentOpacity = v;
			v = v * me._tmb_obra0.userData.opacity
			if (me._tmb_obra0.userData.setOpacityInternal) me._tmb_obra0.userData.setOpacityInternal(v);
			for (let i = 0; i < me._tmb_obra0.children.length; i++) {
				let child = me._tmb_obra0.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._tmb_obra0 = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 1;
		el.userData.borderWidth.default.right = 1;
		el.userData.borderWidth.default.bottom = 1;
		el.userData.borderWidth.default.left = 1;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 999;
		el.userData.borderRadius.default.topRight = 999;
		el.userData.borderRadius.default.bottomRight = 999;
		el.userData.borderRadius.default.bottomLeft = 999;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._tmb_obra0;
			skin.disposeGeometryAndMaterial(el);
			skin.removeChildren(el, 'subElement');
			if (typeof(bwTop) != 'undefined') {
				el.userData.borderWidth.top = bwTop;
				el.userData.borderWidth.right = bwRight;
				el.userData.borderWidth.bottom = bwBottom;
				el.userData.borderWidth.left = bwLeft;
				el.userData.borderRadius.topLeft = brTopLeft;
				el.userData.borderRadius.topRight = brTopRight;
				el.userData.borderRadius.bottomRight = brBottomRight;
				el.userData.borderRadius.bottomLeft = brBottomLeft;
			}
			let width = el.userData.width / 100.0;
			let height = el.userData.height / 100.0;
			skin.rectCalcBorderRadiiInnerShape(me._tmb_obra0);
			if (skin.rectHasRoundedCorners(me._tmb_obra0)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._tmb_obra0.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._tmb_obra0.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._tmb_obra0.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._tmb_obra0.userData.borderRadiusInnerShape.bottomLeft / 100.0;
		roundedRectShape.moveTo((-width / 2.0) + borderRadiusTL, (height / 2.0));
		roundedRectShape.lineTo((width / 2.0) - borderRadiusTR, (height / 2.0));
		if (borderRadiusTR > 0.0) {
		roundedRectShape.arc(0, -borderRadiusTR, borderRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
		}
		roundedRectShape.lineTo((width / 2.0), (-height / 2.0) + borderRadiusBR);
		if (borderRadiusBR > 0.0) {
		roundedRectShape.arc(-borderRadiusBR, 0, borderRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
		}
		roundedRectShape.lineTo((-width / 2.0) + borderRadiusBL, (-height / 2.0));
		if (borderRadiusBL > 0.0) {
		roundedRectShape.arc(0, borderRadiusBL, borderRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
		}
		roundedRectShape.lineTo((-width / 2.0), (height / 2.0) - borderRadiusTL);
		if (borderRadiusTL > 0.0) {
		roundedRectShape.arc(borderRadiusTL, 0, borderRadiusTL, Math.PI, Math.PI / 2.0, true);
		}
		geometry = new THREE.ShapeGeometry(roundedRectShape);
		geometry.name = 'tmb_obra_geometry';
		geometry.computeBoundingBox();
		var min = geometry.boundingBox.min;
		var max = geometry.boundingBox.max;
		var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
		var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
		var vertexPositions = geometry.getAttribute('position');
		var vertexUVs = geometry.getAttribute('uv');
		for (var i = 0; i < vertexPositions.count; i++) {
			var v1 = vertexPositions.getX(i);
			var	v2 = vertexPositions.getY(i);
			vertexUVs.setX(i, (v1 + offset.x) / range.x);
			vertexUVs.setY(i, (v2 + offset.y) / range.y);
		}
		geometry.uvsNeedUpdate = true;
			} else {
				geometry = new THREE.PlaneGeometry(el.userData.width / 100.0, el.userData.height / 100.0, 5, 5);
				geometry.name = 'tmb_obra_geometry';
			}
			el.geometry = geometry;
			el.userData.borderRadiusInnerShape = {};
		let bWidthLeft = me._tmb_obra0.userData.borderWidth.left / 100.0;
		let bWidthTop = me._tmb_obra0.userData.borderWidth.top / 100.0;
		let bWidthRight = me._tmb_obra0.userData.borderWidth.right / 100.0;
		let bWidthBottom = me._tmb_obra0.userData.borderWidth.bottom / 100.0;
		let maxRad = skin.rectMaxRadius(me._tmb_obra0);
		let bRadiusTL = Math.min(me._tmb_obra0.userData.borderRadius.topLeft / 100.0, maxRad / 100.0);
		let bRadiusTR = Math.min(me._tmb_obra0.userData.borderRadius.topRight / 100.0, maxRad / 100.0);
		let bRadiusBR = Math.min(me._tmb_obra0.userData.borderRadius.bottomRight / 100.0, maxRad / 100.0);
		let bRadiusBL = Math.min(me._tmb_obra0.userData.borderRadius.bottomLeft / 100.0, maxRad / 100.0);
		borderShape = new THREE.Shape();
		borderShape.moveTo((-width / 2.0) - bWidthLeft + bRadiusTL, (height / 2.0) + bWidthTop);
		borderShape.lineTo((width / 2.0) + bWidthRight - bRadiusTR, (height / 2.0) + bWidthTop);
		if (bRadiusTR > 0) {
			borderShape.arc(0, -bRadiusTR, bRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
		}
		borderShape.lineTo((width / 2.0) + bWidthRight, (-height / 2.0) - bWidthBottom + bRadiusBR);
		if (bRadiusBR > 0) {
			borderShape.arc(-bRadiusBR, 0, bRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
		}
		borderShape.lineTo((-width / 2.0) - bWidthLeft + bRadiusBL, (-height / 2.0) - bWidthBottom);
		if (bRadiusBL > 0) {
			borderShape.arc(0, bRadiusBL, bRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
		}
		borderShape.lineTo((-width / 2.0) - bWidthLeft, (height / 2.0) + bWidthTop - bRadiusTL);
		if (bRadiusTL > 0) {
			borderShape.arc(bRadiusTL, 0, bRadiusTL, Math.PI, Math.PI / 2.0, true);
		}
		innerShape = new THREE.Path();
		if (skin.rectHasRoundedCorners(me._tmb_obra0)) {
			let borderRadiusTL = bRadiusTL - ((bWidthTop + bWidthLeft) / 2.0);
			let borderRadiusTR = bRadiusTR - ((bWidthTop + bWidthRight) / 2.0);
			let borderRadiusBR = bRadiusBR - ((bWidthBottom + bWidthRight) / 2.0);
			let borderRadiusBL = bRadiusBL - ((bWidthBottom + bWidthLeft) / 2.0);
		innerShape.moveTo((-width / 2.0) + borderRadiusTL, (height / 2.0));
		innerShape.lineTo((width / 2.0) - borderRadiusTR, (height / 2.0));
		if (borderRadiusTR > 0.0) {
		innerShape.arc(0, -borderRadiusTR, borderRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
		}
		innerShape.lineTo((width / 2.0), (-height / 2.0) + borderRadiusBR);
		if (borderRadiusBR > 0.0) {
		innerShape.arc(-borderRadiusBR, 0, borderRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
		}
		innerShape.lineTo((-width / 2.0) + borderRadiusBL, (-height / 2.0));
		if (borderRadiusBL > 0.0) {
		innerShape.arc(0, borderRadiusBL, borderRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
		}
		innerShape.lineTo((-width / 2.0), (height / 2.0) - borderRadiusTL);
		if (borderRadiusTL > 0.0) {
		innerShape.arc(borderRadiusTL, 0, borderRadiusTL, Math.PI, Math.PI / 2.0, true);
		}
		} else {
			innerShape.moveTo((-width / 2.0), (height / 2.0));
			innerShape.lineTo((width / 2.0), (height / 2.0));
			innerShape.lineTo((width / 2.0), (-height / 2.0));
			innerShape.lineTo((-width / 2.0), (-height / 2.0));
		}
		borderShape.holes.push(innerShape);
		borderGeometry = new THREE.ShapeGeometry(borderShape);
		borderGeometry.name = 'tmb_obra_subElement_borderGeometry';
		borderMaterial = new THREE.MeshBasicMaterial( {color: player.getTHREESkinColor('#000000'), side: THREE.DoubleSide, transparent: (player.get3dModelType() != 2 || false) } );
		borderMaterial.name = 'tmb_obra_subElement_borderMaterial';
		me._tmb_obra0.userData.border = new THREE.Mesh( borderGeometry, borderMaterial );
		me._tmb_obra0.userData.border.name = 'tmb_obra_subElement_borderMesh';
		me._tmb_obra0.add(me._tmb_obra0.userData.border);
		}
		me._tmb_obra0.userData.backgroundColorAlpha = 1;
		me._tmb_obra0.userData.borderColorAlpha = 1;
		me._tmb_obra0.userData.setOpacityInternal = function(v) {
			me._tmb_obra0.material.opacity = v * me._tmb_obra0.userData.backgroundColorAlpha;
			me._tmb_obra0.userData.border.material.opacity = v * me._tmb_obra0.userData.borderColorAlpha;
			if (me._tmb_obra0.userData.ggSubElement) {
				me._tmb_obra0.userData.ggSubElement.material.opacity = v
				me._tmb_obra0.userData.ggSubElement.visible = (v>0 && me._tmb_obra0.userData.visible);
			}
			me._tmb_obra0.visible = (v>0 && me._tmb_obra0.userData.visible);
		}
		me._tmb_obra0.userData.setBackgroundColor = function(v) {
			me._tmb_obra0.material.color = v;
		}
		me._tmb_obra0.userData.setBackgroundColorAlpha = function(v) {
			me._tmb_obra0.userData.backgroundColorAlpha = v;
			me._tmb_obra0.userData.setOpacity(me._tmb_obra0.userData.opacity);
		}
		me._tmb_obra0.userData.setBorderColor = function(v) {
			me._tmb_obra0.userData.border.material.color = v;
		}
		me._tmb_obra0.userData.setBorderColorAlpha = function(v) {
			me._tmb_obra0.userData.borderColorAlpha = v;
			me._tmb_obra0.userData.setOpacity(me._tmb_obra0.userData.opacity);
		}
		el.userData.createGeometry(1, 1, 1, 1, 999, 999, 999, 999);
		currentWidth = 60;
		currentHeight = 60;
		var img = {};
		let width = currentWidth / 100.0;
		let height = currentHeight / 100.0;
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._tmb_obra0.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._tmb_obra0.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._tmb_obra0.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._tmb_obra0.userData.borderRadiusInnerShape.bottomLeft / 100.0;
		roundedRectShape.moveTo((-width / 2.0) + borderRadiusTL, (height / 2.0));
		roundedRectShape.lineTo((width / 2.0) - borderRadiusTR, (height / 2.0));
		if (borderRadiusTR > 0.0) {
		roundedRectShape.arc(0, -borderRadiusTR, borderRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
		}
		roundedRectShape.lineTo((width / 2.0), (-height / 2.0) + borderRadiusBR);
		if (borderRadiusBR > 0.0) {
		roundedRectShape.arc(-borderRadiusBR, 0, borderRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
		}
		roundedRectShape.lineTo((-width / 2.0) + borderRadiusBL, (-height / 2.0));
		if (borderRadiusBL > 0.0) {
		roundedRectShape.arc(0, borderRadiusBL, borderRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
		}
		roundedRectShape.lineTo((-width / 2.0), (height / 2.0) - borderRadiusTL);
		if (borderRadiusTL > 0.0) {
		roundedRectShape.arc(borderRadiusTL, 0, borderRadiusTL, Math.PI, Math.PI / 2.0, true);
		}
		geometry = new THREE.ShapeGeometry(roundedRectShape);
		geometry.name = 'tmb_obra_geometry';
		geometry.computeBoundingBox();
		var min = geometry.boundingBox.min;
		var max = geometry.boundingBox.max;
		var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
		var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
		var vertexPositions = geometry.getAttribute('position');
		var vertexUVs = geometry.getAttribute('uv');
		for (var i = 0; i < vertexPositions.count; i++) {
			var v1 = vertexPositions.getX(i);
			var	v2 = vertexPositions.getY(i);
			vertexUVs.setX(i, (v1 + offset.x) / range.x);
			vertexUVs.setY(i, (v2 + offset.y) / range.y);
		}
		geometry.uvsNeedUpdate = true;
		img.geometry = geometry;
		loader = new THREE.TextureLoader();
		el.userData.ggSetUrl = function(extUrl) {
			loader.load(extUrl,
				function (texture) {
				texture.colorSpace = player.getTextureColorSpace();
				let tmpDepthTest = true;
				if (me._tmb_obra0.userData.ggSubElement.material) {
					tmpDepthTest = me._tmb_obra0.userData.ggSubElement.material.depthTest;
				}
				var loadedMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true, depthTest: tmpDepthTest, depthWrite: tmpDepthTest });
				loadedMaterial.name = 'tmb_obra_subElementMaterial';
				me._tmb_obra0.userData.ggSubElement.material = loadedMaterial;
				me._tmb_obra0.userData.ggUpdatePosition();
				me._tmb_obra0.userData.ggText = extUrl;
				me._tmb_obra0.userData.setOpacity(me._tmb_obra0.userData.opacity);
			});
		};
		player.addListener('changenode', function() {
		});
		var extUrl=basePath + ""+player._(me.hotspot.url)+"";
		el.userData.ggSetUrl(extUrl);
		material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, transparent: true } );
		material.name = 'tmb_obra_subElementMaterial';
		el.userData.ggSubElement = new THREE.Mesh( img.geometry, material );
		el.userData.ggSubElement.name = 'tmb_obra_subElement';
		el.userData.ggSubElement.position.z = el.position.z + 0.005;
		el.add(el.userData.ggSubElement);
		el.userData.clientWidth = 60;
		el.userData.clientHeight = 60;
		el.userData.ggId="tmb_obra";
		me._tmb_obra0.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._tmb_obra0.userData.onmouseenter=function (e) {
			player.setOverrideCursor('pointer');
			me.elementMouseOver['tmb_obra0']=true;
		}
		me._tmb_obra0.userData.onmouseleave=function (e) {
			player.setOverrideCursor('default');
			me.elementMouseOver['tmb_obra0']=false;
		}
		me._tmb_obra0.userData.ggUpdatePosition=function (useTransition) {
			var parentWidth = me._tmb_obra0.userData.clientWidth;
			var parentHeight = me._tmb_obra0.userData.clientHeight;
			var img = me._tmb_obra0.userData.ggSubElement;
			if (!img.material || !img.material.map) return;
			var imgWidth = img.material.map.image.naturalWidth;
			var imgHeight = img.material.map.image.naturalHeight;
			var aspectRatioDiv = parentWidth / parentHeight;
			var aspectRatioImg = imgWidth / imgHeight;
			var currentWidth, currentHeight;
			img.geometry.dispose();
			if (aspectRatioDiv > aspectRatioImg) {
				currentHeight = parentHeight;
				currentWidth = parentHeight * aspectRatioImg;
			let width = currentWidth / 100.0;
			let height = currentHeight / 100.0;
			roundedRectShape = new THREE.Shape();
			let borderRadiusTL = me._tmb_obra0.userData.borderRadiusInnerShape.topLeft / 100.0;
			let borderRadiusTR = me._tmb_obra0.userData.borderRadiusInnerShape.topRight / 100.0;
			let borderRadiusBR = me._tmb_obra0.userData.borderRadiusInnerShape.bottomRight / 100.0;
			let borderRadiusBL = me._tmb_obra0.userData.borderRadiusInnerShape.bottomLeft / 100.0;
			roundedRectShape.moveTo((-width / 2.0) + borderRadiusTL, (height / 2.0));
			roundedRectShape.lineTo((width / 2.0) - borderRadiusTR, (height / 2.0));
			if (borderRadiusTR > 0.0) {
			roundedRectShape.arc(0, -borderRadiusTR, borderRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
			}
			roundedRectShape.lineTo((width / 2.0), (-height / 2.0) + borderRadiusBR);
			if (borderRadiusBR > 0.0) {
			roundedRectShape.arc(-borderRadiusBR, 0, borderRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
			}
			roundedRectShape.lineTo((-width / 2.0) + borderRadiusBL, (-height / 2.0));
			if (borderRadiusBL > 0.0) {
			roundedRectShape.arc(0, borderRadiusBL, borderRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
			}
			roundedRectShape.lineTo((-width / 2.0), (height / 2.0) - borderRadiusTL);
			if (borderRadiusTL > 0.0) {
			roundedRectShape.arc(borderRadiusTL, 0, borderRadiusTL, Math.PI, Math.PI / 2.0, true);
			}
			geometry = new THREE.ShapeGeometry(roundedRectShape);
			geometry.name = 'tmb_obra_geometry';
			geometry.computeBoundingBox();
			var min = geometry.boundingBox.min;
			var max = geometry.boundingBox.max;
			var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
			var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
			var vertexPositions = geometry.getAttribute('position');
			var vertexUVs = geometry.getAttribute('uv');
			for (var i = 0; i < vertexPositions.count; i++) {
				var v1 = vertexPositions.getX(i);
				var	v2 = vertexPositions.getY(i);
				vertexUVs.setX(i, (v1 + offset.x) / range.x);
				vertexUVs.setY(i, (v2 + offset.y) / range.y);
			}
			geometry.uvsNeedUpdate = true;
			img.geometry = geometry;
			} else {
				currentWidth = parentWidth;
				currentHeight = parentWidth / aspectRatioImg;
			let width = currentWidth / 100.0;
			let height = currentHeight / 100.0;
			roundedRectShape = new THREE.Shape();
			let borderRadiusTL = me._tmb_obra0.userData.borderRadiusInnerShape.topLeft / 100.0;
			let borderRadiusTR = me._tmb_obra0.userData.borderRadiusInnerShape.topRight / 100.0;
			let borderRadiusBR = me._tmb_obra0.userData.borderRadiusInnerShape.bottomRight / 100.0;
			let borderRadiusBL = me._tmb_obra0.userData.borderRadiusInnerShape.bottomLeft / 100.0;
			roundedRectShape.moveTo((-width / 2.0) + borderRadiusTL, (height / 2.0));
			roundedRectShape.lineTo((width / 2.0) - borderRadiusTR, (height / 2.0));
			if (borderRadiusTR > 0.0) {
			roundedRectShape.arc(0, -borderRadiusTR, borderRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
			}
			roundedRectShape.lineTo((width / 2.0), (-height / 2.0) + borderRadiusBR);
			if (borderRadiusBR > 0.0) {
			roundedRectShape.arc(-borderRadiusBR, 0, borderRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
			}
			roundedRectShape.lineTo((-width / 2.0) + borderRadiusBL, (-height / 2.0));
			if (borderRadiusBL > 0.0) {
			roundedRectShape.arc(0, borderRadiusBL, borderRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
			}
			roundedRectShape.lineTo((-width / 2.0), (height / 2.0) - borderRadiusTL);
			if (borderRadiusTL > 0.0) {
			roundedRectShape.arc(borderRadiusTL, 0, borderRadiusTL, Math.PI, Math.PI / 2.0, true);
			}
			geometry = new THREE.ShapeGeometry(roundedRectShape);
			geometry.name = 'tmb_obra_geometry';
			geometry.computeBoundingBox();
			var min = geometry.boundingBox.min;
			var max = geometry.boundingBox.max;
			var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
			var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
			var vertexPositions = geometry.getAttribute('position');
			var vertexUVs = geometry.getAttribute('uv');
			for (var i = 0; i < vertexPositions.count; i++) {
				var v1 = vertexPositions.getX(i);
				var	v2 = vertexPositions.getY(i);
				vertexUVs.setX(i, (v1 + offset.x) / range.x);
				vertexUVs.setY(i, (v2 + offset.y) / range.y);
			}
			geometry.uvsNeedUpdate = true;
			img.geometry = geometry;
			};
		}
		me._ht_pdf.add(me._tmb_obra0);
		me._ht_pdf.userData.setOpacity(1.00);
		me.elementMouseOver['ht_pdf']=false;
		me._tmb_obra0.userData.setOpacity(1.00);
		me.elementMouseOver['tmb_obra0']=false;
			me.__obj = me._ht_pdf;
	me.__obj.userData.ggUse3d=true;
	me.__obj.userData.gg3dDistance=500;
			me.__obj.userData.hotspot = hotspot;
			me.__obj.userData.fromSkin = true;
	};
	function SkinHotspotClass_ht_pdf(parentScope,hotspot) {
		var me=this;
		var flag=false;
		var hs='';
		me.parentScope=parentScope;
		me.hotspot=hotspot;
		var nodeId=String(hotspot.url);
		nodeId=(nodeId.charAt(0)=='{')?nodeId.substr(1, nodeId.length - 2):''; // }
		me.ggNodeId=nodeId;
		me.ggUserdata=skin.player.getNodeUserdata(nodeId);
		me.elementMouseDown={};
		me.elementMouseOver={};
		me.findElements=function(id,regex) {
			return skin.findElements(id,regex);
		}
		el=me._ht_pdf=document.createElement('div');
		el.ggId="ht_pdf";
		el.ggDx=0;
		el.ggDy=0;
		el.ggParameter={ rx:0,ry:0,a:0,sx:0.8,sy:0.8,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_hotspot ";
		el.ggType='hotspot';
		el.userData=el;
		hs ='';
		hs+='height : 0px;';
		hs+='left : calc(50% - ((0px + 0px) / 2) + 0px);';
		hs+='position : absolute;';
		hs+='top : calc(50% - ((0px + 0px) / 2) + 0px);';
		hs+='visibility : inherit;';
		hs+='width : 0px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		el.style.transform=parameterToTransform(el.ggParameter);
		me._ht_pdf.ggIsActive=function() {
			return player.getCurrentNode()==this.ggElementNodeId();
		}
		el.ggElementNodeId=function() {
			if (me.hotspot.url!='' && me.hotspot.url.charAt(0)=='{') { // }
				return me.hotspot.url.substr(1, me.hotspot.url.length - 2);
			} else {
				if ((this.parentNode) && (this.parentNode.ggElementNodeId)) {
					return this.parentNode.ggElementNodeId();
				} else {
					return player.getCurrentNode();
				}
			}
		}
		me._ht_pdf.onclick=function (e) {
			skin._popup_imagem.ggSetImage(player._(me.hotspot.url));
			skin._popup_fundo.style.transition='none';
			skin._popup_fundo.style.visibility=(Number(skin._popup_fundo.style.opacity)>0||!skin._popup_fundo.style.opacity)?'inherit':'hidden';
			skin._popup_fundo.ggVisible=true;
			skin._popup_pdf.style.transition='none';
			skin._popup_pdf.style.visibility=(Number(skin._popup_pdf.style.opacity)>0||!skin._popup_pdf.style.opacity)?'inherit':'hidden';
			skin._popup_pdf.ggVisible=true;
				skin._popup_pdf.ggUpdateText=function() {
					var params = [];
					params.push(String(player._(me.hotspot.target)));
					var hs = player._("<iframe src=\"%1#toolbar=0&navpanes=0&scrollbar=0\" width=\"100%\" height=\"100%\" style=\"border:none;\"><\/iframe>\n", params);
					if (hs!=this.ggText) {
						this.ggText=hs;
						this.ggTextDiv.innerHTML=hs;
						if (this.ggUpdatePosition) this.ggUpdatePosition();
					}
				}
			skin._popup_pdf.ggUpdateText();
			skin._popup_pdf.ggTextDiv.scrollTop = 0;
			player.triggerEvent('hsproxyclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_pdf.ondblclick=function (e) {
			player.triggerEvent('hsproxydblclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_pdf.onmouseenter=function (e) {
			player.setActiveHotspot(me.hotspot);
			me.elementMouseOver['ht_pdf']=true;
			player.triggerEvent('hsproxyover', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_pdf.onmouseleave=function (e) {
			me.elementMouseOver['ht_pdf']=false;
			player.triggerEvent('hsproxyout', {'id': me.hotspot.id, 'url': me.hotspot.url});
			player.setActiveHotspot(null);
		}
		me._ht_pdf.ggUpdatePosition=function (useTransition) {
		}
		el=me._lottie_2_10=document.createElement('div');
		el.ggLottie = lottie.loadAnimation({
			container: el,
			path: basePath + 'images/lottie_2_10.json',
			autoplay: true,
			loop: true,
			rendererSettings: {
				preserveAspectRatio: 'xMinYMin meet'
			}
		});
		el.ggId="Lottie 2_1";
		el.ggDx=0;
		el.ggDy=1;
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_lottie ";
		el.ggType='lottie';
		el.userData=el;
		hs ='';
		hs+='background : rgba(0,0,0,0);';
		hs+='height : 132px;';
		hs+='left : calc(50% - ((132px + 0px) / 2) + 0px);';
		hs+='position : absolute;';
		hs+='top : calc(50% - ((132px + 0px) / 2) + 1px);';
		hs+='visibility : inherit;';
		hs+='width : 132px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._lottie_2_10.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._lottie_2_10.ggUpdatePosition=function (useTransition) {
		}
		me._ht_pdf.appendChild(me._lottie_2_10);
		el=me._tmb_obra0=document.createElement('div');
		els=me._tmb_obra0__img=document.createElement('img');
		els.className='ggskin ggskin_external';
		hs ='';
		hs += 'position: absolute;-webkit-user-drag:none;pointer-events:none;;';
		hs+='border-radius: 100px;';
		els.setAttribute('style', hs);
		els.onload=function() {me._tmb_obra0.ggUpdatePosition();}
		el.appendChild(els);
		el.ggSubElement = els;
		hs ='';
		el.ggAltText="";
		el.ggScrollbars=false;
		el.ggUpdateText = function() {
			me._tmb_obra0.ggSubElement.setAttribute('alt', player._(me._tmb_obra0.ggAltText));
			me._tmb_obra0.ggUpdateImagePlaceholder();
		}
		el.ggSetImage = function(img) {
			me._tmb_obra0.ggText_untranslated = img;
			me._tmb_obra0.ggUpdateImageTranslation();
		}
		el.ggUpdateImage = function() {
			me._tmb_obra0.ggSubElement.style.width = '0px';
			me._tmb_obra0.ggSubElement.style.height = '0px';
			me._tmb_obra0.ggSubElement.src='';
			me._tmb_obra0.ggSubElement.src=me._tmb_obra0.ggText;
		}
		el.ggUpdateImageTranslation = function() {
			if (me._tmb_obra0.ggText != player._(me._tmb_obra0.ggText_untranslated)) {
				me._tmb_obra0.ggText = player._(me._tmb_obra0.ggText_untranslated);
				me._tmb_obra0.ggUpdateImage()
			}
		}
		player.addListener('changenode', function() {
			me._tmb_obra0.ggUpdateImagePlaceholder();
		});
		el.ggUpdateImagePlaceholder = function() {
			if (me._tmb_obra0.ggText != ""+player._(me.hotspot.url)+"") {
				me._tmb_obra0.ggText=""+player._(me.hotspot.url)+"";
				me._tmb_obra0.ggUpdateImage()
			}
		}
		els['ondragstart']=function() { return false; };
		player.checkLoaded.push(els);
		el.ggUpdateText();
		el.ggId="tmb_obra";
		el.ggDx=0;
		el.ggDy=0;
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_external ";
		el.ggType='external';
		el.userData=el;
		hs ='';
		hs+='background : #ffffff;';
		hs+='border : 1px solid #000000;';
		hs+='border-radius : 999px;';
		hs+='cursor : pointer;';
		hs+='height : 60px;';
		hs+='left : calc(50% - ((60px + 2px) / 2) + 0px);';
		hs+='position : absolute;';
		hs+='top : calc(50% - ((60px + 2px) / 2) + 0px);';
		hs+='visibility : inherit;';
		hs+='width : 60px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._tmb_obra0.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._tmb_obra0.ggUpdatePosition=function (useTransition) {
			var parentWidth = me._tmb_obra0.clientWidth;
			var parentHeight = me._tmb_obra0.clientHeight;
			var img = me._tmb_obra0__img;
			var aspectRatioDiv = me._tmb_obra0.clientWidth / me._tmb_obra0.clientHeight;
			var aspectRatioImg = img.naturalWidth / img.naturalHeight;
			var currentWidth,currentHeight;
			if (aspectRatioDiv > aspectRatioImg) {
				currentHeight = parentHeight;
				currentWidth = Math.round(parentHeight * aspectRatioImg);
				img.style.width='';
				img.style.height=parentHeight + 'px';
			} else {
				currentWidth = parentWidth;
				currentHeight = Math.round(parentWidth / aspectRatioImg);
				img.style.width=parentWidth + 'px';
				img.style.height='';
			};
			if (!me._tmb_obra0.ggScrollbars || currentWidth < me._tmb_obra0.clientWidth) {
				img.style.right='';
				img.style.left='50%';
				img.style.marginLeft='-' + currentWidth/2 + 'px';
			} else {
				img.style.right='';
				img.style.left='0px';
				img.style.marginLeft='0px';
				me._tmb_obra0.scrollLeft=currentWidth / 2 - me._tmb_obra0.clientWidth / 2;
			}
			if (!me._tmb_obra0.ggScrollbars || currentHeight < me._tmb_obra0.clientHeight) {
				img.style.bottom='';
				img.style.top='50%';
				img.style.marginTop='-' + currentHeight/2 + 'px';
			} else {
				img.style.bottom='';
				img.style.top='0px';
				img.style.marginTop='0px';
				me._tmb_obra0.scrollTop=currentHeight / 2 - me._tmb_obra0.clientHeight / 2;
			}
		}
		me._ht_pdf.appendChild(me._tmb_obra0);
		me.elementMouseOver['ht_pdf']=false;
		me.ggUse3d=true;
		me.gg3dDistance=500;
			me.__div = me._ht_pdf;
	};
	function SkinHotspotClass_ht_info__3d(parentScope,hotspot) {
		var me=this;
		var flag=false;
		var hs='';
		me.parentScope=parentScope;
		me.hotspot=hotspot;
		var nodeId=String(hotspot.url);
		nodeId=(nodeId.charAt(0)=='{')?nodeId.substr(1, nodeId.length - 2):''; // }
		me.ggUserdata=skin.player.getNodeUserdata(nodeId);
		me.ggUserdata.nodeId=nodeId;
		me.ggNodeId=nodeId;
		me.elementMouseDown={};
		me.elementMouseOver={};
		me.findElements=function(id,regex) {
			return skin.findElements(id,regex);
		}
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {
			me._ht_info.visible = (v>0 && me._ht_info.userData.visible);
		}
		el.userData.width = 0;
		el.userData.height = 0;
		el.name = 'ht_info';
		el.userData.x = -8.32;
		el.userData.y = 3.44;
		el.translateZ(0.060);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.060;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 2;
		el.userData.renderOrder = 2;
		el.userData.isVisible = function() {
			let vis = me._ht_info.visible
			let parentEl = me._ht_info.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_info.userData.opacity = v;
			v = v * me._ht_info.userData.parentOpacity;
			if (me._ht_info.userData.setOpacityInternal) me._ht_info.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info.children.length; i++) {
				let child = me._ht_info.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_info.userData.parentOpacity = v;
			v = v * me._ht_info.userData.opacity
			if (me._ht_info.userData.setOpacityInternal) me._ht_info.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info.children.length; i++) {
				let child = me._ht_info.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_info = el;
		el.userData.ggId="ht_info";
		me._ht_info.userData.ggIsActive=function() {
			return player.getCurrentNode()==this.ggElementNodeId();
		}
		el.userData.ggElementNodeId=function() {
			if (me.hotspot.url!='' && me.hotspot.url.charAt(0)=='{') { // }
				return me.hotspot.url.substr(1, me.hotspot.url.length - 2);
			} else {
				if ((this.parentNode) && (this.parentNode.userData.ggElementNodeId)) {
					return this.parentNode.userData.ggElementNodeId();
				} else {
					return player.getCurrentNode();
				}
			}
		}
		me._ht_info.userData.onclick=function (e) {
			skin._rec_info_1.style.transition='none';
			skin._rec_info_1.style.visibility=(Number(skin._rec_info_1.style.opacity)>0||!skin._rec_info_1.style.opacity)?'inherit':'hidden';
			skin._rec_info_1.ggVisible=true;
			skin._popup_info.style.transition='none';
			skin._popup_info.style.visibility=(Number(skin._popup_info.style.opacity)>0||!skin._popup_info.style.opacity)?'inherit':'hidden';
			skin._popup_info.ggVisible=true;
				skin._txt_titulo.ggUpdateText=function() {
					var params = [];
					params.push(String(player._(me.hotspot.title)));
					var hs = player._("%1", params);
					if (hs!=this.ggText) {
						this.ggText=hs;
						this.ggTextDiv.innerHTML=hs;
						if (this.ggUpdatePosition) this.ggUpdatePosition();
					}
				}
			skin._txt_titulo.ggUpdateText();
			skin._txt_titulo.ggTextDiv.scrollTop = 0;
				skin._txt_desc.ggUpdateText=function() {
					var params = [];
					params.push(String(player._(me.hotspot.description)));
					var hs = player._("%1", params);
					if (hs!=this.ggText) {
						this.ggText=hs;
						this.ggTextDiv.innerHTML=hs;
						if (this.ggUpdatePosition) this.ggUpdatePosition();
					}
				}
			skin._txt_desc.ggUpdateText();
			skin._txt_desc.ggTextDiv.scrollTop = 0;
			player.triggerEvent('hsproxyclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_info.userData.hasOwnClickAction = true;
		me._ht_info.userData.ondblclick=function (e) {
			player.triggerEvent('hsproxydblclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_info.userData.onmouseenter=function (e) {
			player.setActiveHotspot(me.hotspot);
			me.elementMouseOver['ht_info']=true;
			player.triggerEvent('hsproxyover', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_info.userData.onmouseleave=function (e) {
			me.elementMouseOver['ht_info']=false;
			player.triggerEvent('hsproxyout', {'id': me.hotspot.id, 'url': me.hotspot.url});
			player.setActiveHotspot(null);
		}
		me._ht_info.userData.ggUpdatePosition=function (useTransition) {
		}
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {
			me._lottie_2.visible = (v>0 && me._lottie_2.userData.visible);
		}
		el.userData.width = 0;
		el.userData.height = 0;
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 80;
		el.userData.height = 80;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'Lottie 2';
		el.userData.x = 0;
		el.userData.y = 0;
		el.translateZ(0.030);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.030;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 1;
		el.userData.renderOrder = 1;
		el.userData.setOpacityInternal = function(v) {
			if (me._lottie_2.material) me._lottie_2.material.opacity = v;
			me._lottie_2.visible = (v>0 && me._lottie_2.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._lottie_2.visible
			let parentEl = me._lottie_2.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._lottie_2.userData.opacity = v;
			v = v * me._lottie_2.userData.parentOpacity;
			if (me._lottie_2.userData.setOpacityInternal) me._lottie_2.userData.setOpacityInternal(v);
			for (let i = 0; i < me._lottie_2.children.length; i++) {
				let child = me._lottie_2.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._lottie_2.userData.parentOpacity = v;
			v = v * me._lottie_2.userData.opacity
			if (me._lottie_2.userData.setOpacityInternal) me._lottie_2.userData.setOpacityInternal(v);
			for (let i = 0; i < me._lottie_2.children.length; i++) {
				let child = me._lottie_2.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._lottie_2 = el;
		el.userData.ggId="Lottie 2";
		me._lottie_2.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._lottie_2.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_info.add(me._lottie_2);
		me._ht_info.userData.setOpacity(1.00);
		me.elementMouseOver['ht_info']=false;
			me.__obj = me._ht_info;
	me.__obj.userData.ggUse3d=true;
	me.__obj.userData.gg3dDistance=500;
			me.__obj.userData.hotspot = hotspot;
			me.__obj.userData.fromSkin = true;
	};
	function SkinHotspotClass_ht_info(parentScope,hotspot) {
		var me=this;
		var flag=false;
		var hs='';
		me.parentScope=parentScope;
		me.hotspot=hotspot;
		var nodeId=String(hotspot.url);
		nodeId=(nodeId.charAt(0)=='{')?nodeId.substr(1, nodeId.length - 2):''; // }
		me.ggNodeId=nodeId;
		me.ggUserdata=skin.player.getNodeUserdata(nodeId);
		me.elementMouseDown={};
		me.elementMouseOver={};
		me.findElements=function(id,regex) {
			return skin.findElements(id,regex);
		}
		el=me._ht_info=document.createElement('div');
		el.ggId="ht_info";
		el.ggDx=-832;
		el.ggDy=-344;
		el.ggParameter={ rx:0,ry:0,a:0,sx:0.8,sy:0.8,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_hotspot ";
		el.ggType='hotspot';
		el.userData=el;
		hs ='';
		hs+='height : 0px;';
		hs+='left : calc(50% - ((0px + 0px) / 2) - 832px);';
		hs+='position : absolute;';
		hs+='top : calc(50% - ((0px + 0px) / 2) - 344px);';
		hs+='visibility : inherit;';
		hs+='width : 0px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		el.style.transform=parameterToTransform(el.ggParameter);
		me._ht_info.ggIsActive=function() {
			return player.getCurrentNode()==this.ggElementNodeId();
		}
		el.ggElementNodeId=function() {
			if (me.hotspot.url!='' && me.hotspot.url.charAt(0)=='{') { // }
				return me.hotspot.url.substr(1, me.hotspot.url.length - 2);
			} else {
				if ((this.parentNode) && (this.parentNode.ggElementNodeId)) {
					return this.parentNode.ggElementNodeId();
				} else {
					return player.getCurrentNode();
				}
			}
		}
		me._ht_info.onclick=function (e) {
			skin._rec_info_1.style.transition='none';
			skin._rec_info_1.style.visibility=(Number(skin._rec_info_1.style.opacity)>0||!skin._rec_info_1.style.opacity)?'inherit':'hidden';
			skin._rec_info_1.ggVisible=true;
			skin._popup_info.style.transition='none';
			skin._popup_info.style.visibility=(Number(skin._popup_info.style.opacity)>0||!skin._popup_info.style.opacity)?'inherit':'hidden';
			skin._popup_info.ggVisible=true;
				skin._txt_titulo.ggUpdateText=function() {
					var params = [];
					params.push(String(player._(me.hotspot.title)));
					var hs = player._("%1", params);
					if (hs!=this.ggText) {
						this.ggText=hs;
						this.ggTextDiv.innerHTML=hs;
						if (this.ggUpdatePosition) this.ggUpdatePosition();
					}
				}
			skin._txt_titulo.ggUpdateText();
			skin._txt_titulo.ggTextDiv.scrollTop = 0;
				skin._txt_desc.ggUpdateText=function() {
					var params = [];
					params.push(String(player._(me.hotspot.description)));
					var hs = player._("%1", params);
					if (hs!=this.ggText) {
						this.ggText=hs;
						this.ggTextDiv.innerHTML=hs;
						if (this.ggUpdatePosition) this.ggUpdatePosition();
					}
				}
			skin._txt_desc.ggUpdateText();
			skin._txt_desc.ggTextDiv.scrollTop = 0;
			player.triggerEvent('hsproxyclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_info.ondblclick=function (e) {
			player.triggerEvent('hsproxydblclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_info.onmouseenter=function (e) {
			player.setActiveHotspot(me.hotspot);
			me.elementMouseOver['ht_info']=true;
			player.triggerEvent('hsproxyover', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_info.onmouseleave=function (e) {
			me.elementMouseOver['ht_info']=false;
			player.triggerEvent('hsproxyout', {'id': me.hotspot.id, 'url': me.hotspot.url});
			player.setActiveHotspot(null);
		}
		me._ht_info.ggUpdatePosition=function (useTransition) {
		}
		el=me._lottie_2=document.createElement('div');
		el.ggLottie = lottie.loadAnimation({
			container: el,
			path: basePath + 'images/lottie_2.json',
			autoplay: true,
			loop: true,
			rendererSettings: {
				preserveAspectRatio: 'xMinYMin meet'
			}
		});
		el.ggId="Lottie 2";
		el.ggDx=0;
		el.ggDy=0;
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_lottie ";
		el.ggType='lottie';
		el.userData=el;
		hs ='';
		hs+='background : rgba(0,0,0,0);';
		hs+='height : 80px;';
		hs+='left : calc(50% - ((80px + 0px) / 2) + 0px);';
		hs+='position : absolute;';
		hs+='top : calc(50% - ((80px + 0px) / 2) + 0px);';
		hs+='visibility : inherit;';
		hs+='width : 80px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._lottie_2.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._lottie_2.ggUpdatePosition=function (useTransition) {
		}
		me._ht_info.appendChild(me._lottie_2);
		me.elementMouseOver['ht_info']=false;
		me.ggUse3d=true;
		me.gg3dDistance=500;
			me.__div = me._ht_info;
	};
	function SkinHotspotClass_ht_node__3d(parentScope,hotspot) {
		var me=this;
		var flag=false;
		var hs='';
		me.parentScope=parentScope;
		me.hotspot=hotspot;
		var nodeId=String(hotspot.url);
		nodeId=(nodeId.charAt(0)=='{')?nodeId.substr(1, nodeId.length - 2):''; // }
		me.ggUserdata=skin.player.getNodeUserdata(nodeId);
		me.ggUserdata.nodeId=nodeId;
		me.ggNodeId=nodeId;
		me.elementMouseDown={};
		me.elementMouseOver={};
		me.findElements=function(id,regex) {
			return skin.findElements(id,regex);
		}
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {
			me._ht_node.visible = (v>0 && me._ht_node.userData.visible);
		}
		el.userData.width = 0;
		el.userData.height = 0;
		el.name = 'ht_node';
		el.userData.x = -8.75;
		el.userData.y = 2.69;
		el.translateZ(0.030);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.030;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.renderOrder = 1;
		el.userData.renderOrder = 1;
		el.userData.isVisible = function() {
			let vis = me._ht_node.visible
			let parentEl = me._ht_node.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_node.userData.opacity = v;
			v = v * me._ht_node.userData.parentOpacity;
			if (me._ht_node.userData.setOpacityInternal) me._ht_node.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_node.children.length; i++) {
				let child = me._ht_node.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_node.userData.parentOpacity = v;
			v = v * me._ht_node.userData.opacity
			if (me._ht_node.userData.setOpacityInternal) me._ht_node.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_node.children.length; i++) {
				let child = me._ht_node.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_node = el;
		el.userData.ggId="ht_node";
		me._ht_node.userData.ggIsActive=function() {
			return player.getCurrentNode()==this.ggElementNodeId();
		}
		el.userData.ggElementNodeId=function() {
			if (me.hotspot.url!='' && me.hotspot.url.charAt(0)=='{') { // }
				return me.hotspot.url.substr(1, me.hotspot.url.length - 2);
			} else {
				if ((this.parentNode) && (this.parentNode.userData.ggElementNodeId)) {
					return this.parentNode.userData.ggElementNodeId();
				} else {
					return player.getCurrentNode();
				}
			}
		}
		me._ht_node.userData.onclick=function (e) {
			player.openNext(player._(me.hotspot.url),player._(me.hotspot.target));
			player.triggerEvent('hsproxyclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_node.userData.hasOwnClickAction = true;
		me._ht_node.userData.ondblclick=function (e) {
			player.triggerEvent('hsproxydblclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_node.userData.onmouseenter=function (e) {
			player.setOverrideCursor('pointer');
			player.setActiveHotspot(me.hotspot);
			me.elementMouseOver['ht_node']=true;
			player.triggerEvent('hsproxyover', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_node.userData.onmouseleave=function (e) {
			player.setOverrideCursor('default');
			me.elementMouseOver['ht_node']=false;
			player.triggerEvent('hsproxyout', {'id': me.hotspot.id, 'url': me.hotspot.url});
			player.setActiveHotspot(null);
		}
		me._ht_node.userData.ggUpdatePosition=function (useTransition) {
		}
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {
			me._lottie_1.visible = (v>0 && me._lottie_1.userData.visible);
		}
		el.userData.width = 0;
		el.userData.height = 0;
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 100;
		el.userData.height = 100;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'Lottie 1';
		el.userData.x = 0;
		el.userData.y = 0;
		el.translateZ(0.030);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.030;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 1;
		el.userData.renderOrder = 1;
		el.userData.setOpacityInternal = function(v) {
			if (me._lottie_1.material) me._lottie_1.material.opacity = v;
			me._lottie_1.visible = (v>0 && me._lottie_1.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._lottie_1.visible
			let parentEl = me._lottie_1.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._lottie_1.userData.opacity = v;
			v = v * me._lottie_1.userData.parentOpacity;
			if (me._lottie_1.userData.setOpacityInternal) me._lottie_1.userData.setOpacityInternal(v);
			for (let i = 0; i < me._lottie_1.children.length; i++) {
				let child = me._lottie_1.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._lottie_1.userData.parentOpacity = v;
			v = v * me._lottie_1.userData.opacity
			if (me._lottie_1.userData.setOpacityInternal) me._lottie_1.userData.setOpacityInternal(v);
			for (let i = 0; i < me._lottie_1.children.length; i++) {
				let child = me._lottie_1.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._lottie_1 = el;
		el.userData.ggId="Lottie 1";
		me._lottie_1.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._lottie_1.userData.onmouseenter=function (e) {
			player.setOverrideCursor('pointer');
			me.elementMouseOver['lottie_1']=true;
		}
		me._lottie_1.userData.onmouseleave=function (e) {
			player.setOverrideCursor('default');
			me.elementMouseOver['lottie_1']=false;
		}
		me._lottie_1.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_node.add(me._lottie_1);
		me._ht_node.userData.setOpacity(1.00);
		me.elementMouseOver['ht_node']=false;
		me.elementMouseOver['lottie_1']=false;
			me.__obj = me._ht_node;
	me.__obj.userData.ggUse3d=true;
	me.__obj.userData.gg3dDistance=500;
			me.__obj.userData.hotspot = hotspot;
			me.__obj.userData.fromSkin = true;
	};
	function SkinHotspotClass_ht_node(parentScope,hotspot) {
		var me=this;
		var flag=false;
		var hs='';
		me.parentScope=parentScope;
		me.hotspot=hotspot;
		var nodeId=String(hotspot.url);
		nodeId=(nodeId.charAt(0)=='{')?nodeId.substr(1, nodeId.length - 2):''; // }
		me.ggNodeId=nodeId;
		me.ggUserdata=skin.player.getNodeUserdata(nodeId);
		me.elementMouseDown={};
		me.elementMouseOver={};
		me.findElements=function(id,regex) {
			return skin.findElements(id,regex);
		}
		el=me._ht_node=document.createElement('div');
		el.ggId="ht_node";
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_hotspot ";
		el.ggType='hotspot';
		el.userData=el;
		hs ='';
		hs+='cursor : pointer;';
		hs+='height : 0px;';
		hs+='left : 85px;';
		hs+='position : absolute;';
		hs+='top : 271px;';
		hs+='visibility : inherit;';
		hs+='width : 0px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._ht_node.ggIsActive=function() {
			return player.getCurrentNode()==this.ggElementNodeId();
		}
		el.ggElementNodeId=function() {
			if (me.hotspot.url!='' && me.hotspot.url.charAt(0)=='{') { // }
				return me.hotspot.url.substr(1, me.hotspot.url.length - 2);
			} else {
				if ((this.parentNode) && (this.parentNode.ggElementNodeId)) {
					return this.parentNode.ggElementNodeId();
				} else {
					return player.getCurrentNode();
				}
			}
		}
		me._ht_node.onclick=function (e) {
			player.openNext(player._(me.hotspot.url),player._(me.hotspot.target));
			player.triggerEvent('hsproxyclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_node.ondblclick=function (e) {
			player.triggerEvent('hsproxydblclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_node.onmouseenter=function (e) {
			player.setActiveHotspot(me.hotspot);
			me.elementMouseOver['ht_node']=true;
			player.triggerEvent('hsproxyover', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_node.onmouseleave=function (e) {
			me.elementMouseOver['ht_node']=false;
			player.triggerEvent('hsproxyout', {'id': me.hotspot.id, 'url': me.hotspot.url});
			player.setActiveHotspot(null);
		}
		me._ht_node.ggUpdatePosition=function (useTransition) {
		}
		el=me._lottie_1=document.createElement('div');
		el.ggLottie = lottie.loadAnimation({
			container: el,
			path: basePath + 'images/lottie_1.json',
			autoplay: true,
			loop: true,
			rendererSettings: {
				preserveAspectRatio: 'xMinYMin meet'
			}
		});
		el.ggId="Lottie 1";
		el.ggDx=0;
		el.ggDy=0;
		el.ggParameter={ rx:0,ry:0,a:0,sx:1,sy:1,def:'' };
		el.ggVisible=true;
		el.className="ggskin ggskin_lottie ";
		el.ggType='lottie';
		el.userData=el;
		hs ='';
		hs+='background : rgba(0,0,0,0);';
		hs+='height : 100px;';
		hs+='left : calc(50% - ((100px + 0px) / 2) + 0px);';
		hs+='position : absolute;';
		hs+='top : calc(50% - ((100px + 0px) / 2) + 0px);';
		hs+='visibility : inherit;';
		hs+='width : 100px;';
		hs+='pointer-events:auto;';
		el.setAttribute('style',hs);
		el.style.transformOrigin='50% 50%';
		me._lottie_1.ggIsActive=function() {
			if ((this.parentNode) && (this.parentNode.ggIsActive)) {
				return this.parentNode.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._lottie_1.ggUpdatePosition=function (useTransition) {
		}
		me._ht_node.appendChild(me._lottie_1);
		me.elementMouseOver['ht_node']=false;
		me.ggUse3d=true;
		me.gg3dDistance=500;
			me.__div = me._ht_node;
	};
	me.addSkinHotspot=function(hotspot) {
		var hsinst = null;
			if (hotspot.skinid=='ht_node') {
			hotspot.skinid = 'ht_node';
			hsinst = new SkinHotspotClass_ht_node(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_node')) {
				hotspotTemplates['SkinHotspotClass_ht_node'] = [];
			}
			hotspotTemplates['SkinHotspotClass_ht_node'].push(hsinst);
		} else
			if (hotspot.skinid=='ht_info') {
			hotspot.skinid = 'ht_info';
			hsinst = new SkinHotspotClass_ht_info(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_info')) {
				hotspotTemplates['SkinHotspotClass_ht_info'] = [];
			}
			hotspotTemplates['SkinHotspotClass_ht_info'].push(hsinst);
		} else
			if (hotspot.skinid=='ht_pdf') {
			hotspot.skinid = 'ht_pdf';
			hsinst = new SkinHotspotClass_ht_pdf(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_pdf')) {
				hotspotTemplates['SkinHotspotClass_ht_pdf'] = [];
			}
			hotspotTemplates['SkinHotspotClass_ht_pdf'].push(hsinst);
		} else
			if (hotspot.skinid=='ht_obra') {
			hotspot.skinid = 'ht_obra';
			hsinst = new SkinHotspotClass_ht_obra(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_obra')) {
				hotspotTemplates['SkinHotspotClass_ht_obra'] = [];
			}
			hotspotTemplates['SkinHotspotClass_ht_obra'].push(hsinst);
		} else
		{
			hotspot.skinid = 'ht_click';
			hsinst = new SkinHotspotClass_ht_click(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_click')) {
				hotspotTemplates['SkinHotspotClass_ht_click'] = [];
			}
			hotspotTemplates['SkinHotspotClass_ht_click'].push(hsinst);
		}
		return hsinst;
	}
	me.removeSkinHotspots=function() {
		hotspotTemplates = {};
	}
	player.addListener('hotspotsremoved',function() {
			me.removeSkinHotspots();
	});
	me.addSkinHotspot3d=function(hotspot) {
		var hsinst = null;
			if (hotspot.skinid=='ht_node') {
			hotspot.skinid = 'ht_node';
			hsinst = new SkinHotspotClass_ht_node__3d(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_node__3d')) {
				hotspotTemplates['SkinHotspotClass_ht_node__3d'] = [];
			}
			hotspotTemplates['SkinHotspotClass_ht_node__3d'].push(hsinst);
		} else
			if (hotspot.skinid=='ht_info') {
			hotspot.skinid = 'ht_info';
			hsinst = new SkinHotspotClass_ht_info__3d(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_info__3d')) {
				hotspotTemplates['SkinHotspotClass_ht_info__3d'] = [];
			}
			hotspotTemplates['SkinHotspotClass_ht_info__3d'].push(hsinst);
		} else
			if (hotspot.skinid=='ht_pdf') {
			hotspot.skinid = 'ht_pdf';
			hsinst = new SkinHotspotClass_ht_pdf__3d(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_pdf__3d')) {
				hotspotTemplates['SkinHotspotClass_ht_pdf__3d'] = [];
			}
			hotspotTemplates['SkinHotspotClass_ht_pdf__3d'].push(hsinst);
		} else
			if (hotspot.skinid=='ht_obra') {
			hotspot.skinid = 'ht_obra';
			hsinst = new SkinHotspotClass_ht_obra__3d(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_obra__3d')) {
				hotspotTemplates['SkinHotspotClass_ht_obra__3d'] = [];
			}
			hotspotTemplates['SkinHotspotClass_ht_obra__3d'].push(hsinst);
		} else
		{
			hotspot.skinid = 'ht_click';
			hsinst = new SkinHotspotClass_ht_click__3d(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_click__3d')) {
				hotspotTemplates['SkinHotspotClass_ht_click__3d'] = [];
			}
			hotspotTemplates['SkinHotspotClass_ht_click__3d'].push(hsinst);
		}
		return (hsinst ? hsinst.__obj : null);
	}
	me.removeSkinHotspots=function() {
		hotspotTemplates = {};
	}
	player.addListener('hotspotsremoved',function() {
			me.removeSkinHotspots();
	});
	player.addListener('changenode', function() {
		me.ggUserdata=player.userdata;
	});
	me.skinTimerEvent=function() {
		if (player.isInVR()) return;
		me.ggCurrentTime=new Date().getTime();
		for (const id in hotspotTemplates) {
			const tmpl=hotspotTemplates[id];
			tmpl.forEach(function(hotspot) {
				if (hotspot.hotspotTimerEvent) {
					hotspot.hotspotTimerEvent();
				}
			});
		};
	};
	player.addListener('timer', me.skinTimerEvent);
	me.addSkin();
	var style = document.createElement('style');
	style.type = 'text/css';
	style.appendChild(document.createTextNode('.ggskin { font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 14px; line-height: normal; box-sizing: content-box; } .ggmarkdown p,.ggmarkdown h1,.ggmarkdown h2,.ggmarkdown h3,.ggmarkdown h4 { margin-top: 0px } .ggmarkdown { white-space:normal }'));
	document.head.appendChild(style);
	document.addEventListener('keyup', function(e) {
		if (e.key === 'Enter' || e.key === ' ') {
			let activeElement = document.activeElement;
			if (activeElement.classList.contains('ggskin') && activeElement.onclick) activeElement.onclick();
		}
	});
	document.addEventListener('keydown', function(e) {
		if (e.key === 'Enter' || e.key === ' ') {
			let activeElement = document.activeElement;
			if (activeElement.classList.contains('ggskin') && activeElement.onmousedown) activeElement.onmousedown();
		}
	});
	document.addEventListener('keyup', function(e) {
		if (e.key === 'Enter' || e.key === ' ') {
			let activeElement = document.activeElement;
			if (activeElement.classList.contains('ggskin') && activeElement.onmouseup) activeElement.onmouseup();
		}
	});
	me.skinTimerEvent();
	document.fonts.onloadingdone = () => {
		if (me.fontsLoaded < 3) {
			me.updateSize(me.divSkin);
			me.fontsLoaded++;
		}
	}
};