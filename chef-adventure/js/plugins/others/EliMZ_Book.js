//============================================================================
// EliMZ_Book.js
//============================================================================

/*:
@target MZ
@orderAfter DotMoveSystem
@orderAfter DotMoveSystem_FunctionEx

@plugindesc ♦5.4.16♦ Essential plugin for all Eli plugins.
@author Hakuen Studio
@url https://hakuenstudio.itch.io/eli-book-rpg-maker-mv-mz/rate?source=game

@help
★★★★★ Rate the plugin! Please, is very important to me ^^
● Terms of Use
https://www.hakuenstudio.com/terms-of-use-5-0-0

============================================================================
Features
============================================================================

● Core Plugin for Eli Plugins.
● Provide methods and code that add a better performance on all Eli 
plugins.
● Optionally set Pixel Perfect to your game.
● Optionally remove scroll bars for games with low resolution.
● Add playtest settings to automatically open Dev Tools.
● Set dev tools and game window positions.
● Quickly debug your game with the Dev Tools Focus option.
● [MZ] Optionally Disable Effekseer.
● [MZ] A quick restart of your playtest using F5.

============================================================================
How to use
============================================================================

Put above all other Eli plugins.

https://docs.google.com/document/d/1ckAG8ESh6U47Eje2QZ6oajv-cRcsdUJUmRS7PvOseBc/edit?usp=sharing

============================================================================

@param engine
@text Engine Settings
@type struct<engineSt>
@desc Main settings about the engine.
@default {"pixelPerfect":"false","styleOverflow":"false","--- MZ ONLY ---":"","disableEffekseer":"false"}

@param playtest
@text Playtest Settings
@type struct<developerSt>
@desc Play test settings.
@default {"openDevTools":"false","nwWindowPos":"0, 0","--- MZ ONLY ---":"","gameFocus":"true","quickRestart":"true"}

*/

/* ----------------------------- ENGINE SETTINGS ---------------------------- */
{
/*~struct~engineSt:

@param pixelPerfect
@text Pixel Perfect
@type boolean
@desc Set to true to enable Pixel Perfect feature to your game.
@default false

@param styleOverflow
@text Window Scroll Bars
@type boolean
@desc Remove the scroll bars of the game window that can appear when resolution is low.
@default true

@param disableEffekseer
@text Disable Effekseer
@type boolean
@desc Set it to true, wil completely wipe out any effekseer reference from your code.
@default false

@param --- BUG FIXES ---

@param fixBitmapStartLoad
@text Fix Bitmap Start Load
@type boolean
@desc MZ 1.5.0 - If true, it will fix the issue of not showing sprites on screen after hit F5.
@default true

*/

}

/* -------------------------------- PLAY TEST ------------------------------- */
{
/*~struct~developerSt:

@param openDevTools
@text Open Dev Tools
@type boolean
@desc If true, it will open the Dev Tools automatically.
@default false

@param nwWindowPos
@text Game Window Position
@type text
@desc Change the game window position when open Dev Tools. Separate X, Y with a comma. Set -1 to not change.
@default -1

@param gameFocus
@text Dev Tools Focus
@type boolean
@desc If true, the game will keep playing even with the Dev Tools opened.
@default false

@param quickRestart
@text Quick F5
@type boolean
@desc If true, when press F5 the game will reload faster.
@default false

@param startFps
@text Start FPS
@type boolean
@desc If true, the game will start with FPS counter opened.
@default false

*/
}

"use strict"

/**
 * The Eli Namespace that will hold all Eli Plugins.
 * @namespace Eli
 */
var Eli = Eli || {}
/**
 * The Imported object to be used by other plugins to verify the existance of this plugin.
 * @type {object}
 */
var Imported = Imported || {}
/**
 * Adds Eli Book into the Imported object. So other plugins can use to check if the plugin is present on the project.
 * @type {boolean}
 */
Imported.Eli_Book = true

/* ---------------------------------- BUMB ---------------------------------- */
class Bump {
    constructor(t=PIXI){if(void 0===t)throw new Error("Please assign a rendering engine in the constructor before using bump.js");this.renderer="pixi"}addCollisionProperties(t){"pixi"===this.renderer&&(void 0===t.gx&&Object.defineProperty(t,"gx",{get:()=>t.getGlobalPosition().x,enumerable:!0,configurable:!0}),void 0===t.gy&&Object.defineProperty(t,"gy",{get:()=>t.getGlobalPosition().y,enumerable:!0,configurable:!0}),void 0===t.centerX&&Object.defineProperty(t,"centerX",{get:()=>t.x+t.width/2,enumerable:!0,configurable:!0}),void 0===t.centerY&&Object.defineProperty(t,"centerY",{get:()=>t.y+t.height/2,enumerable:!0,configurable:!0}),void 0===t.halfWidth&&Object.defineProperty(t,"halfWidth",{get:()=>t.width/2,enumerable:!0,configurable:!0}),void 0===t.halfHeight&&Object.defineProperty(t,"halfHeight",{get:()=>t.height/2,enumerable:!0,configurable:!0}),void 0===t.xAnchorOffset&&Object.defineProperty(t,"xAnchorOffset",{get:()=>void 0!==t.anchor?t.width*t.anchor.x:0,enumerable:!0,configurable:!0}),void 0===t.yAnchorOffset&&Object.defineProperty(t,"yAnchorOffset",{get:()=>void 0!==t.anchor?t.height*t.anchor.y:0,enumerable:!0,configurable:!0}),t.circular&&void 0===t.radius&&Object.defineProperty(t,"radius",{get:()=>t.width/2,enumerable:!0,configurable:!0})),t._bumpPropertiesAdded=!0}hitTestPoint(t,e){let i,r,h,s,o,f;if(e._bumpPropertiesAdded||this.addCollisionProperties(e),"rectangle"===(i=e.radius?"circle":"rectangle")&&(r=e.x-e.xAnchorOffset,h=e.x+e.width-e.xAnchorOffset,s=e.y-e.yAnchorOffset,o=e.y+e.height-e.yAnchorOffset,f=t.x>r&&t.x<h&&t.y>s&&t.y<o),"circle"===i){let i=t.x-e.x-e.width/2+e.xAnchorOffset,r=t.y-e.y-e.height/2+e.yAnchorOffset;f=Math.sqrt(i*i+r*r)<e.radius}return f}hitTestCircle(t,e,i=!1){let r,h,s,o,f;return t._bumpPropertiesAdded||this.addCollisionProperties(t),e._bumpPropertiesAdded||this.addCollisionProperties(e),i?(r=e.gx+e.width/2-e.xAnchorOffset-(t.gx+t.width/2-t.xAnchorOffset),h=e.gy+e.width/2-e.yAnchorOffset-(t.gy+t.width/2-t.yAnchorOffset)):(r=e.x+e.width/2-e.xAnchorOffset-(t.x+t.width/2-t.xAnchorOffset),h=e.y+e.width/2-e.yAnchorOffset-(t.y+t.width/2-t.yAnchorOffset)),f=(s=Math.sqrt(r*r+h*h))<(o=t.radius+e.radius)}circleCollision(t,e,i=!1,r=!1){t._bumpPropertiesAdded||this.addCollisionProperties(t),e._bumpPropertiesAdded||this.addCollisionProperties(e);let h,s,o,f,n,d,a,l={},c=!1;if(r?(f=e.gx+e.width/2-e.xAnchorOffset-(t.gx+t.width/2-t.xAnchorOffset),n=e.gy+e.width/2-e.yAnchorOffset-(t.gy+t.width/2-t.yAnchorOffset)):(f=e.x+e.width/2-e.xAnchorOffset-(t.x+t.width/2-t.xAnchorOffset),n=e.y+e.width/2-e.yAnchorOffset-(t.y+t.width/2-t.yAnchorOffset)),(h=Math.sqrt(f*f+n*n))<(s=t.radius+e.radius)){c=!0,o=s-h,o+=.3,d=f/h,a=n/h,t.x-=o*d,t.y-=o*a,i&&(l.x=n,l.y=-f,this.bounceOffSurface(t,l))}return c}movingCircleCollision(t,e,i=!1){t._bumpPropertiesAdded||this.addCollisionProperties(t),e._bumpPropertiesAdded||this.addCollisionProperties(e);let r,h,s,o,f={},n={},d={},a={},l={},c=!1;if(t.mass=t.mass||1,e.mass=e.mass||1,i?(f.vx=e.gx+e.radius-e.xAnchorOffset-(t.gx+t.radius-t.xAnchorOffset),f.vy=e.gy+e.radius-e.yAnchorOffset-(t.gy+t.radius-t.yAnchorOffset)):(f.vx=e.x+e.radius-e.xAnchorOffset-(t.x+t.radius-t.xAnchorOffset),f.vy=e.y+e.radius-e.yAnchorOffset-(t.y+t.radius-t.yAnchorOffset)),f.magnitude=Math.sqrt(f.vx*f.vx+f.vy*f.vy),r=t.radius+e.radius,f.magnitude<r){c=!0,h=r-f.magnitude,h+=.3,f.dx=f.vx/f.magnitude,f.dy=f.vy/f.magnitude,f.vxHalf=Math.abs(f.dx*h/2),f.vyHalf=Math.abs(f.dy*h/2),s=t.x>e.x?1:-1,o=t.y>e.y?1:-1,t.x=t.x+f.vxHalf*s,t.y=t.y+f.vyHalf*o,e.x=e.x+f.vxHalf*-s,e.y=e.y+f.vyHalf*-o,f.lx=f.vy,f.ly=-f.vx;let i=t.vx*f.dx+t.vy*f.dy;n.x=i*f.dx,n.y=i*f.dy;let x=t.vx*(f.lx/f.magnitude)+t.vy*(f.ly/f.magnitude);d.x=x*(f.lx/f.magnitude),d.y=x*(f.ly/f.magnitude);let y=e.vx*f.dx+e.vy*f.dy;a.x=y*f.dx,a.y=y*f.dy;let g=e.vx*(f.lx/f.magnitude)+e.vy*(f.ly/f.magnitude);l.x=g*(f.lx/f.magnitude),l.y=g*(f.ly/f.magnitude),t.bounce={},t.bounce.x=d.x+a.x,t.bounce.y=d.y+a.y,e.bounce={},e.bounce.x=n.x+l.x,e.bounce.y=n.y+l.y,t.vx=t.bounce.x/t.mass,t.vy=t.bounce.y/t.mass,e.vx=e.bounce.x/e.mass,e.vy=e.bounce.y/e.mass}return c}multipleCircleCollision(t,e=!1){for(let r=0;r<t.length;r++){var i=t[r];for(let h=r+1;h<t.length;h++){let r=t[h];this.movingCircleCollision(i,r,e)}}}rectangleCollision(t,e,i=!1,r=!0){let h,s,o,f,n,d,a;return t._bumpPropertiesAdded||this.addCollisionProperties(t),e._bumpPropertiesAdded||this.addCollisionProperties(e),r?(d=t.gx+Math.abs(t.halfWidth)-t.xAnchorOffset-(e.gx+Math.abs(e.halfWidth)-e.xAnchorOffset),a=t.gy+Math.abs(t.halfHeight)-t.yAnchorOffset-(e.gy+Math.abs(e.halfHeight)-e.yAnchorOffset)):(d=t.x+Math.abs(t.halfWidth)-t.xAnchorOffset-(e.x+Math.abs(e.halfWidth)-e.xAnchorOffset),a=t.y+Math.abs(t.halfHeight)-t.yAnchorOffset-(e.y+Math.abs(e.halfHeight)-e.yAnchorOffset)),s=Math.abs(t.halfWidth)+Math.abs(e.halfWidth),o=Math.abs(t.halfHeight)+Math.abs(e.halfHeight),Math.abs(d)<s&&Math.abs(a)<o&&((f=s-Math.abs(d))>=(n=o-Math.abs(a))?(a>0?(h="top",t.y=t.y+n):(h="bottom",t.y=t.y-n),i&&(t.vy*=-1)):(d>0?(h="left",t.x=t.x+f):(h="right",t.x=t.x-f),i&&(t.vx*=-1))),h}hitTestRectangle(t,e,i=!1){let r,h,s,o,f;return t._bumpPropertiesAdded||this.addCollisionProperties(t),e._bumpPropertiesAdded||this.addCollisionProperties(e),r=!1,i?(o=t.gx+Math.abs(t.halfWidth)-t.xAnchorOffset-(e.gx+Math.abs(e.halfWidth)-e.xAnchorOffset),f=t.gy+Math.abs(t.halfHeight)-t.yAnchorOffset-(e.gy+Math.abs(e.halfHeight)-e.yAnchorOffset)):(o=t.x+Math.abs(t.halfWidth)-t.xAnchorOffset-(e.x+Math.abs(e.halfWidth)-e.xAnchorOffset),f=t.y+Math.abs(t.halfHeight)-t.yAnchorOffset-(e.y+Math.abs(e.halfHeight)-e.yAnchorOffset)),h=Math.abs(t.halfWidth)+Math.abs(e.halfWidth),s=Math.abs(t.halfHeight)+Math.abs(e.halfHeight),r=Math.abs(o)<h&&Math.abs(f)<s}hitTestCircleRectangle(t,e,i=!1){let r,h,s,o,f,n;if(e._bumpPropertiesAdded||this.addCollisionProperties(e),t._bumpPropertiesAdded||this.addCollisionProperties(t),i?(s=t.gx,o=t.gy,f=e.gx,n=e.gy):(s=t.x,o=t.y,f=e.x,n=e.y),"topMiddle"===(r=o-t.yAnchorOffset<n-Math.abs(e.halfHeight)-e.yAnchorOffset?s-t.xAnchorOffset<f-1-Math.abs(e.halfWidth)-e.xAnchorOffset?"topLeft":s-t.xAnchorOffset>f+1+Math.abs(e.halfWidth)-e.xAnchorOffset?"topRight":"topMiddle":o-t.yAnchorOffset>n+Math.abs(e.halfHeight)-e.yAnchorOffset?s-t.xAnchorOffset<f-1-Math.abs(e.halfWidth)-e.xAnchorOffset?"bottomLeft":s-t.xAnchorOffset>f+1+Math.abs(e.halfWidth)-e.xAnchorOffset?"bottomRight":"bottomMiddle":s-t.xAnchorOffset<f-Math.abs(e.halfWidth)-e.xAnchorOffset?"leftMiddle":"rightMiddle")||"bottomMiddle"===r||"leftMiddle"===r||"rightMiddle"===r)h=this.hitTestRectangle(t,e,i);else{let s={};switch(r){case"topLeft":s.x=f-e.xAnchorOffset,s.y=n-e.yAnchorOffset;break;case"topRight":s.x=f+e.width-e.xAnchorOffset,s.y=n-e.yAnchorOffset;break;case"bottomLeft":s.x=f-e.xAnchorOffset,s.y=n+e.height-e.yAnchorOffset;break;case"bottomRight":s.x=f+e.width-e.xAnchorOffset,s.y=n+e.height-e.yAnchorOffset}h=this.hitTestCirclePoint(t,s,i)}return h?r:h}hitTestCirclePoint(t,e,i=!1){return t._bumpPropertiesAdded||this.addCollisionProperties(t),e.diameter=1,e.width=e.diameter,e.radius=.5,e.centerX=e.x,e.centerY=e.y,e.gx=e.x,e.gy=e.y,e.xAnchorOffset=0,e.yAnchorOffset=0,e._bumpPropertiesAdded=!0,this.hitTestCircle(t,e,i)}circleRectangleCollision(t,e,i=!1,r=!1){let h,s,o,f,n,d;if(e._bumpPropertiesAdded||this.addCollisionProperties(e),t._bumpPropertiesAdded||this.addCollisionProperties(t),r?(o=t.gx,f=t.gy,n=e.gx,d=e.gy):(o=t.x,f=t.y,n=e.x,d=e.y),"topMiddle"===(h=f-t.yAnchorOffset<d-Math.abs(e.halfHeight)-e.yAnchorOffset?o-t.xAnchorOffset<n-1-Math.abs(e.halfWidth)-e.xAnchorOffset?"topLeft":o-t.xAnchorOffset>n+1+Math.abs(e.halfWidth)-e.xAnchorOffset?"topRight":"topMiddle":f-t.yAnchorOffset>d+Math.abs(e.halfHeight)-e.yAnchorOffset?o-t.xAnchorOffset<n-1-Math.abs(e.halfWidth)-e.xAnchorOffset?"bottomLeft":o-t.xAnchorOffset>n+1+Math.abs(e.halfWidth)-e.xAnchorOffset?"bottomRight":"bottomMiddle":o-t.xAnchorOffset<n-Math.abs(e.halfWidth)-e.xAnchorOffset?"leftMiddle":"rightMiddle")||"bottomMiddle"===h||"leftMiddle"===h||"rightMiddle"===h)s=this.rectangleCollision(t,e,i,r);else{let o={};switch(h){case"topLeft":o.x=n-e.xAnchorOffset,o.y=d-e.yAnchorOffset;break;case"topRight":o.x=n+e.width-e.xAnchorOffset,o.y=d-e.yAnchorOffset;break;case"bottomLeft":o.x=n-e.xAnchorOffset,o.y=d+e.height-e.yAnchorOffset;break;case"bottomRight":o.x=n+e.width-e.xAnchorOffset,o.y=d+e.height-e.yAnchorOffset}s=this.circlePointCollision(t,o,i,r)}return s?h:s}circlePointCollision(t,e,i=!1,r=!1){return t._bumpPropertiesAdded||this.addCollisionProperties(t),e.diameter=1,e.width=e.diameter,e.radius=.5,e.centerX=e.x,e.centerY=e.y,e.gx=e.x,e.gy=e.y,e.xAnchorOffset=0,e.yAnchorOffset=0,e._bumpPropertiesAdded=!0,this.circleCollision(t,e,i,r)}bounceOffSurface(t,e){t._bumpPropertiesAdded||this.addCollisionProperties(t);let i,r,h={},s={},o={},f=t.mass||1;e.lx=e.y,e.ly=-e.x,e.magnitude=Math.sqrt(e.x*e.x+e.y*e.y),e.dx=e.x/e.magnitude,e.dy=e.y/e.magnitude,i=t.vx*e.dx+t.vy*e.dy,h.vx=i*e.dx,h.vy=i*e.dy,r=t.vx*(e.lx/e.magnitude)+t.vy*(e.ly/e.magnitude),s.vx=r*(e.lx/e.magnitude),s.vy=r*(e.ly/e.magnitude),s.vx*=-1,s.vy*=-1,o.x=h.vx+s.vx,o.y=h.vy+s.vy,t.vx=o.x/f,t.vy=o.y/f}contain(t,e,i=!1,r){t._bumpPropertiesAdded||this.addCollisionProperties(t),void 0===e.xAnchorOffset&&(e.xAnchorOffset=0),void 0===e.yAnchorOffset&&(e.yAnchorOffset=0),void 0===t.parent.gx&&(t.parent.gx=0),void 0===t.parent.gy&&(t.parent.gy=0);let h=new Set;return t.x-t.xAnchorOffset<e.x-t.parent.gx-e.xAnchorOffset&&(i&&(t.vx*=-1),t.mass&&(t.vx/=t.mass),t.x=e.x-t.parent.gx-e.xAnchorOffset+t.xAnchorOffset,h.add("left")),t.y-t.yAnchorOffset<e.y-t.parent.gy-e.yAnchorOffset&&(i&&(t.vy*=-1),t.mass&&(t.vy/=t.mass),t.y=e.y-t.parent.gy-e.yAnchorOffset+t.yAnchorOffset,h.add("top")),t.x-t.xAnchorOffset+t.width>e.width-e.xAnchorOffset&&(i&&(t.vx*=-1),t.mass&&(t.vx/=t.mass),t.x=e.width-t.width-e.xAnchorOffset+t.xAnchorOffset,h.add("right")),t.y-t.yAnchorOffset+t.height>e.height-e.yAnchorOffset&&(i&&(t.vy*=-1),t.mass&&(t.vy/=t.mass),t.y=e.height-t.height-e.yAnchorOffset+t.yAnchorOffset,h.add("bottom")),0===h.size&&(h=void 0),h&&r&&r(h),h}outsideBounds(t,e,i){let r=e.x,h=e.y,s=e.width,o=e.height,f=new Set;return t.x<r-t.width&&f.add("left"),t.y<h-t.height&&f.add("top"),t.x>s+t.width&&f.add("right"),t.y>o+t.height&&f.add("bottom"),0===f.size&&(f=void 0),f&&i&&i(f),f}_getCenter(t,e,i){return void 0!==t.anchor?0!==t.anchor[i]?0:e/2:e}hit(t,e,i=!1,r=!1,h,s){let o,f=this.hitTestPoint.bind(this),n=this.hitTestRectangle.bind(this),d=this.hitTestCircle.bind(this),a=this.movingCircleCollision.bind(this),l=this.circleCollision.bind(this),c=this.hitTestCircleRectangle.bind(this),x=this.rectangleCollision.bind(this),y=this.circleRectangleCollision.bind(this),g=void 0!==t.parent,A=void 0!==e.parent;return g&&e instanceof Array||A&&t instanceof Array?function(){if(t instanceof Array){let[t,e]=[e,t]}for(let i=e.length-1;i>=0;i--){let r=e[i];(o=b(t,r))&&s&&s(o,r)}}():(o=b(t,e))&&s&&s(o),o;function b(t,e){let s=void 0!==t.parent,o=void 0!==e.parent;if(s&&o)return t.diameter&&e.diameter?function(t,e){return i?t.vx+t.vy!==0&&e.vx+e.vy!==0?a(t,e,h):l(t,e,r,h):d(t,e)}(t,e):t.diameter&&!e.diameter?function(t,e){return i?y(t,e,r,h):c(t,e,h)}(t,e):function(t,e){return i?x(t,e,r,h):n(t,e,h)}(t,e);if(o&&void 0!==t.x&&void 0!==t.y)return f(t,e);throw new Error(`I'm sorry, ${t} and ${e} cannot be use together in a collision test.'`)}}

}

/* --------------------------- SPRITE ANIMATION MV -------------------------- */
/**
 * Let MV Animations be played on the sprite, instead of creatting a individual animation sprite to play the animation.
 */
class Sprite_InnerAnimationMV extends Sprite_AnimationMV{

    updateFlash(){
        if(this._flashDuration > 0){
    
            if(this._targets.filter){
                super.updateFlash()
            }else{
                this.updateFlashForSingleTarget()
            }
        }
    }

    onEnd(){
        if(this.hasAnyFlashDuration()){
            this.visible = false
        }else if(this._targets.filter){
            super.onEnd()
        }else{
            this.onEndSingleTarget()
        }
    }

    isPlaying(){
        return super.isPlaying() || this.hasAnyFlashDuration()
    }

    updatePosition(){
        /* This was suppose to go on the updateMain function. But there is no way to set
        it there, without overwriting it. So I put this here, that happens right before
        the this._duration property is lowered.
        */
        this._duration = Math.max(0, this._duration)
        super.updatePosition()
    }

    updateFlashForSingleTarget(){
        const d = this._flashDuration--
        this._flashColor[3] *= (d - 1) / d
        this._targets.setBlendColor(this._flashColor)
    }
    
    hasAnyFlashDuration(){
        return this._flashDuration > 0 || this._screenFlashDuration > 0
    }
    
    onEndSingleTarget(){
        this._flashDuration = 0
        this._screenFlashDuration = 0
        this._hidingDuration = 0
        this._targets.setBlendColor([0, 0, 0, 0])
        this._targets.show() 
    }
}

/* ========================================================================== */
/*                                   PLUGIN                                   */
/* ========================================================================== */
Eli.Easings = {

    linear(t){ return t },
/* ------------------------------- DEFAULT MZ ------------------------------- */
    slowStart(t){ return this.easeInQuad(t) },
    slowEnd(t){ return this.easeOutQuad(t) },
    slowStartEnd(t){ return this.easeInOutQuad(t) },
/* ---------------------------------- QUAD ---------------------------------- */
    easeInQuad(t){ return t**2 },
    easeOutQuad(t){ return t * (2 - t) },
    easeInOutQuad(t){ if((t *= 2) < 1){ return 0.5 * this.easeInQuad(t) } return -0.5 * (--t * (t - 2) - 1) },
    easeOutInQuad(t){ if(t < 0.5){ return this.easeOutQuad(t * 2) / 2 } return this.easeInQuad((t - 0.5) * 2) / 2 + 0.5 },
/* ---------------------------------- CUBIC --------------------------------- */
    easeInCubic(t){ return t**3 },
    easeOutCubic(t){ return --t * t * t + 1 },
    easeInOutCubic(t){ if((t *= 2) < 1){ return 0.5 * this.easeInCubic(t) } return 0.5 * ((t -= 2) * t * t + 2) },
    easeOutInCubic(t){ if(t < 0.5){ return this.easeOutCubic(t * 2) / 2 } return this.easeInCubic((t - 0.5) * 2) / 2 + 0.5 },
/* ---------------------------------- QUART --------------------------------- */
    easeInQuart(t){ return t**4 },
    easeOutQuart(t){ return 1 - --t * t**3 },
    easeInOutQuart(t){ if((t *= 2) < 1){ return 0.5 * this.easeInQuart(t) } return -0.5 * ( (t -= 2) * t**3 - 2) },
    easeOutInQuart(t){ if(t < 0.5){ return this.easeOutQuart(t * 2) / 2 } return this.easeInQuart((t - 0.5) * 2) / 2 + 0.5 },
/* ---------------------------------- QUINT --------------------------------- */
    easeInQuint(t){ return t**5 },
    easeOutQuint(t){ return --t * t**4 + 1 },
    easeInOutQuint(t){ if((t *= 2) < 1){ return 0.5 * this.easeInQuint(t) } return 0.5 * ( (t -= 2) * t**4 + 2) },
    easeOutInQuint(t){ if(t < 0.5){ return this.easeOutQuint(t * 2) / 2 } return this.easeInQuint((t - 0.5) * 2) / 2 + 0.5 },
/* ---------------------------------- SINE ---------------------------------- */
    easeInSine(t){ const pi = Math.PI; return Math.cos(t * pi / 2 - pi) + 1.0 },
    easeOutSine(t){ return Math.sin((t * Math.PI) / 2) },
    easeInOutSine(t){ return 0.5 * (1 - Math.cos(Math.PI * t)) },
    easeOutInSine(t){ if(t < 0.5){ return this.easeOutSine(t * 2) / 2 } return this.easeInSine((t - 0.5) * 2) / 2 + 0.5 },
/* ---------------------------------- EXPO ---------------------------------- */
    easeInExpo(t){ return t === 0 ? 0 : Math.pow(1024, t - 1) },
    easeOutExpo(t){ return t === 1 ? 1 : 1 - Math.pow(2, -10 * t) },
    easeInOutExpo(t){ if (t === 0){ return 0 } if (t === 1){ return 1 } if ((t *= 2) < 1) { return 0.5 * Math.pow(1024, t - 1) } return 0.5 * (-Math.pow(2, -10 * (t - 1)) + 2) },
    easeOutInExpo(t){ if(t < 0.5){ return this.easeOutExpo(t * 2) / 2 } return this.easeInExpo((t - 0.5) * 2) / 2 + 0.5 },
/* ---------------------------------- CIRC ---------------------------------- */
    easeInCirc(t){ return 1 - Math.sqrt(1 - t * t) },
    easeOutCirc(t){ return Math.sqrt(1 - --t * t) },
    easeInOutCirc(t){ if ((t *= 2) < 1){ return -0.5 * (Math.sqrt(1 - t * t) - 1) } return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1) },
    easeOutInCirc(t){ if(t < 0.5){ return this.easeOutCirc(t * 2) / 2 } return this.easeInCirc((t - 0.5) * 2) / 2 + 0.5 },
/* ---------------------------------- BACK ---------------------------------- */
    easeInBack(t){ const s = 1.70158; return t * t * ((s + 1) * t - s) },
    easeOutBack(t){ const s = 1.70158; return --t * t * ((s + 1) * t + s) + 1 },
    easeInOutBack(t){ const s = 1.70158 * 1.525; if((t *= 2) < 1){ return 0.5 * (t * t * ((s + 1) * t - s)) }else{ return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2) } },
    easeOutInBack(t){ if(t < 0.5){ return this.easeOutBack(t * 2) / 2 } return this.easeInBack((t - 0.5) * 2) / 2 + 0.5 },
/* --------------------------------- BOUNCE --------------------------------- */
    easeInBounce(t){ return 1 - this.easeOutBounce(1 - t) },
    easeOutBounce(t){ if (t < 1 / 2.75) { return 7.5625 * t * t } else if (t < 2 / 2.75) { return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75 } else if (t < 2.5 / 2.75) { return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375 } else { return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375 } },
    easeInOutBounce(t){ if(t < 0.5){ return this.easeInBounce(t * 2) * 0.5 } return this.easeOutBounce(t * 2 - 1) * 0.5 + 0.5 },
    easeOutInBounce(t){ if(t < 0.5){ return this.easeOutBounce(t * 2) / 2 } return this.easeInBounce((t - 0.5) * 2) / 2 + 0.5 },
/* --------------------------------- ELASTIC -------------------------------- */
    easeInElastic(t){ if (t === 0){ return 0 } if (t === 1){ return 1 } return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI) },
    easeOutElastic(t){ if (t === 0){ return 0 } if (t === 1){ return 1 } return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1 },
    easeInOutElastic(t){ if (t === 0){ return 0 } if (t === 1){ return 1 } t *= 2; if (t < 1){ return -0.5 * Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI) } return 0.5 * Math.pow(2, -10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI) + 1 },
    easeOutInElastic(t){ if(t < 0.5){ return this.easeOutElastic(t * 2) / 2 } return this.easeInElastic((t - 0.5) * 2) / 2 + 0.5 },
/* --------------------------------- EXECUTE -------------------------------- */
    execute(type, t){ 
        return this[type](t) 
    },
}

Eli.AnimeGroup = class {

    constructor(animations, data){
        this.paused = true
        this.direction = "normal"
        // this.direction = {
        //     type: "normal",
        //     current: "normal",
        // }
        this.progress = 0
        this.childProgress = []
        this.finished = false
        this.onStart = new Function()
        this.onUpdate = new Function()
        this.onComplete = new Function()
        this.childrens = []
        this.initialize(animations, data)
    }

    initialize(animations, data){
        this.paused = data.paused ?? true
        this.direction = data.direction ?? "normal"
        this.onStart = data.onStart || new Function()
        this.onUpdate = data.onUpdate || new Function()
        this.onComplete = data.onComplete || new Function()
        this.childrens = animations
        this.setGroupToAnimations()
    }

    setGroupToAnimations(){
        for(let i = 0; i < this.childrens.length; i++){
            const child = this.childrens[i]
            child.group = this
            child.groupIndex = i
        }
    }

    updateProgress(){
        this.progress = this.childProgress.reduce((previous, next) => previous + next, 0) / this.childrens.length
    }

    setAnimations(animations){
        this.childrens = animations
        this.setGroupToAnimations()
    }

    play(direction){
        this.direction = direction || this.direction
        
        this.onStart(this)

        for(const animation of this.childrens){
            animation.play(direction)
        }

        this.paused = false
        this.finished = false
    }

    restart(direction){
        this.direction = direction || this.direction

        this.onStart(this)

        for(const animation of this.childrens){
            animation.restart(direction)
        }

        this.finished = false
        this.paused = false
    }

    pause(){
        this.paused = true
    }

    resume(){
        this.paused = false
    }

    isPaused(){
        return this.paused
    }

    isRunning(){
        return this.childrens.some(anim => anim.isRunning())
    }

    update(){
        if(this.isPaused()) return

        for(const animation of this.childrens){
            animation.update()
        }
        
        if(this.childrens.every(item => item.isFinished()) && !this.finished){
            this.finished = true
            this.onComplete(this)
            
        }else if(!this.finished){
            this.onUpdate(this)
            this.updateProgress()
        }
    }

    isFinished(){
        return this.finished
    }

}
    
Eli.Anime = class {

    constructor(animeData){
        this.data = {
            target: null,
            direction: {current: 0, type: ""},
            loop: {current: 0, target: 0},
            value: {start: 0, current: 0, target: 0},
            propName: "",
            autoPlay: true,
            startDelay: {current: 0, target: 0},
            endDelay: {current: 0, target: 0},
            duration: {current: 0, target: 0},
            onStart: () => {},
            onUpdate: () => {},
            onComplete: () => {},
            progress: 0,
            easing: "",
        }
        this.group = null
        this.groupIndex = -1
        this.paused = false
        this.running = true
        this.initialize(animeData)
    }

    initialize(animeData){
        this.data = animeData
        this.prepareToStart()
    }

    prepareToStart(){
        const dirType = this.data.direction.type
        
        if(dirType === "alternate"){
            this.setAlternateDirection()
           
            if(this.data.loop.target === 0){
                this.data.loop.target = 1
            }
        }

        this.refreshCurrentValue()
        if(this.data.autoPlay){
            this.setPropValue(this.getStartValue())
        }
        
        this.data.duration.current = -1
    }

    setAlternateDirection(){
        const dir = this.data.direction.current === "normal" ? "reverse" : "normal"
        this.data.direction.current = dir
    }

    refreshCurrentValue(){
        this.data.value.current = this.getStartValue()
    }

    getStartValue(){
        const value = {
            "normal": this.data.value.start,
            "reverse": this.data.value.target,
        }[this.data.direction.current]

        return value
    }

    getTargetValue(){
        const value = {
            "normal": this.data.value.target,
            "reverse": this.data.value.start,
        }[this.data.direction.current]

        return value
    }

    setPropValue(value){
        this.data.target[this.data.propName] = value
    }

    update(){
        if(this.isPaused() || !this.data.autoPlay) return

        if(this.canDelayStart()){
            this.updateStartDelay()

        }else if(this.canStart()){
            this.onAnimeStart()

        }else if(this.canRun()){
            this.updateValue()
            
        }else if(this.canEnd()){
            this.onAnimeComplete()

        }else if(this.canDelayEnd()){
            this.updateEndDelay()

        }else if(this.needLoop()){
            this.updateLoop()

        }else{
            this.running = false
        }
    }

    canDelayStart(){
        return this.data.startDelay.current < this.data.startDelay.target
    }

    updateStartDelay(){
        this.data.startDelay.current++
        this.running = true
    }

    canStart(){
        return this.data.duration.current === -1
    }

    onAnimeStart(){
        this.data.onStart(this)
        this.data.duration.current = 0
    }

    canRun(){
        return this.data.duration.current < this.data.duration.target
    }

    updateValue(){
        if(this.isPropOnTarget()){
            this.data.duration.current = this.data.duration.target
            this.updateProgress(1)

        }else{
            this.data.duration.current++

            const elapsedTime = this.calculateTime()
            const value = this.processValue(this.getStartValue(), elapsedTime, this.getTargetValue())
            this.setPropValue(value)
            this.updateProgress(elapsedTime)
        }
        
        if(this.group){
            this.group.finished = false
        }

        this.onAnimeUpdate()
    }

    isPropOnTarget(){
        return this.getPropValue() === this.getTargetValue()
    }

    getPropValue(){
        return this.data.target[this.data.propName]
    }

    updateProgress(elapsedTime){
        this.data.progress = Math.floor(elapsedTime * 100)

        if(this.group){
            this.group.childProgress[this.groupIndex] = this.data.progress
            //this.group.updateProgress()
        }
    }

    calculateTime(){
        const elapsedTime = this.data.duration.current / this.data.duration.target
        return Eli.Easings.execute(this.data.easing, elapsedTime)
    }

    processValue(startValue, elapsedTime, endValue){
        return startValue + elapsedTime * (endValue - startValue)
    }

    onAnimeUpdate(){
        this.data.onUpdate(this)
    }

    canEnd(){
        return this.data.duration.current === this.data.duration.target
    }

    onAnimeComplete(){
        this.data.onComplete(this)
        this.data.duration.current++
    }

    canDelayEnd(){
        return this.data.endDelay.current < this.data.endDelay.target
    }

    resetTargetEndDelay(){
        this.data.endDelay.target = 0
    }

    updateEndDelay(){
        this.data.endDelay.current++
    }

    needLoop(){
        return this.data.loop.current < this.data.loop.target
    }

    updateLoop(){
        this.data.loop.current++
        this.restart()
    }

    play(direction){
        this.restart(direction)

        this.resume()
        this.data.autoPlay = true
    }

    restart(direction){
        this.resetData()

        if(direction){
            this.data.direction.current = direction

        }else if(this.data.direction.type === "alternate"){
            this.setAlternateDirection()
        }

        this.refreshCurrentValue()
        
        this.setPropValue(this.getStartValue())
        this.updateProgress(0)
    }

    resetData(){
        this.data.startDelay.current = 0
        this.data.endDelay.current = 0
        this.data.duration.current = -1
    }

    pause(){
        this.paused = true
    }

    resume(){
        this.paused = false
    }

    isFinished(){
        return this.running === false
    }

    isRunning(){
        return this.running && !this.isPaused()
    }

    isPaused(){
        return this.paused
    }
}

Eli.AnimeManager = {

    createDefaultData(){
        return {
            duration: 1,
            startDelay: 1,
            endDelay: 1,
            easing: "linear",
            direction: "normal",
            loop: 0,
            autoPlay: true,
            needSave: false,
        }
    },

    createAnimations(target, props, defaultData){
        const animations = []

        for(const name in props){
            const animeData = this.createAnimationData(target, name, props[name], defaultData)
            animations.push(new Eli.Anime(animeData))
        }

        return animations
    },

    createAnimationData(target, propName, propData, defData){
        const callBacks = this.initCallbacks(propData)
        const animeData = {
            target: target,
            propName: propName,
            value: this.initValue(propData, target[propName]),
            duration: this.initDuration(propData, defData),
            startDelay: this.initStartDelay(propData, defData),
            endDelay: this.initEndDelay(propData, defData),
            loop: this.initLoop(propData, defData),
            direction: this.initDirection(propData, defData),
            easing: propData.easing === undefined ? (defData.easing || "linear") : propData.easing,
            autoPlay: propData.autoPlay === undefined ? defData.autoPlay : propData.autoPlay,
            progress: 0,
            onStart: callBacks.onStart,
            onUpdate: callBacks.onUpdate,
            onComplete: callBacks.onComplete,
        }

        return animeData
    },

    initValue(propData, propValue){
        const value = {start: 0, target: 0}

        if(propData.value.constructor.name === "Array"){
            value.start = propData.value[0]
            value.target = propData.value[1]

        }else{
            value.start = propValue
            value.target = propData.value
        }

        return {
            start: value.start, 
            current: value.start, 
            target: value.target
        }
    },

    initDuration(propData, defData){
        return {
            current: -1, 
            target: (propData.duration === undefined ? defData.duration : propData.duration) || 1
        }
    },

    initStartDelay(propData, defData){
        return {
            current: 0, 
            target: (propData.startDelay === undefined ? defData.startDelay : propData.startDelay) || 1
        }
    },

    initEndDelay(propData, defData){
        return {
            current: 0, 
            target: (propData.endDelay === undefined ? defData.endDelay : propData.endDelay) || 1
        }
    },

    initLoop(propData, defData){
        const loop = propData.loop === undefined ? (defData.loop || 0) : propData.loop
        return {
            current: 0, 
            target: loop === true ? Infinity : loop
        }
    },

    initDirection(propData, defData){
        const dirType = propData.direction === undefined ? (defData.direction || "normal") : propData.direction
        return {
            type: dirType,
            current: dirType === "alternate" ? "normal" : dirType
        }
    },

    initCallbacks(propData){
        return {
            onStart: propData.onStart || new Function(),
            onUpdate: propData.onUpdate || new Function(),
            onComplete: propData.onComplete || new Function(),
        }
    },

}

Eli.AnimeTiny = class {

    constructor(targetObj, propName, targetValue, duration, easing, direction = "normal", loop = 0){
        this.initialize(targetObj, propName, targetValue, duration, easing, direction, loop)
    }

    initialize(targetObj, propName, targetValue, duration, easing, direction, loop){
        this.targetObj = targetObj
        this.propName = propName
        this.easing = easing
        this.targetDuration = duration
        this.targetDirection = direction
        this.targetValue = targetValue
        this.initialValue = this.targetObj[propName]
        this.loop = loop
        this.direction = "normal"
        this.duration = 0
        this.running = true
    }

    getStartValue(){
        return {
            "normal": this.initialValue,
            "reverse": this.targetValue,
        }[this.direction]
    }

    getTargetValue(){
        return {
            "normal": this.targetValue,
            "reverse": this.initialValue,
        }[this.direction]
    }

    setPropValue(value){
        this.targetObj[this.propName] = value
    }

    update(){
        if(this.duration < this.targetDuration){
            this.updateValue()
        }else if(this.loop !== 0){
            this.reverse()
        }else{
            this.running = false
        }
    }

    isRunning(){
        return this.running
    }

    refreshDirection(){
        if(this.targetDirection === "alternate"){
            this.direction = this.direction === "normal" ? "reverse" : "normal"
        }
    }

    reverse(){
        this.refreshDirection()
        this.duration = 0
        this.loop--
        this.running = true
    }

    updateValue(){
        this.duration++
        const elapsedTime = this.calculateTime()
        const value = this.processValue(this.getStartValue(), elapsedTime, this.getTargetValue())
        this.setPropValue(value)
        this.running = true
    }

    calculateTime(){
        const elapsedTime = this.duration / this.targetDuration
        return Eli.Easings.execute(this.easing, elapsedTime)
    }

    processValue(startValue, elapsedTime, endValue){
        return startValue + elapsedTime * (endValue - startValue)
    }

}

Eli.String = {

    regRemoveEscapeCodes_1: /\x1b(?:[^\]]+)\[(?:[^\]]+)]/gmi,
    regRemoveEscapeCodes_2: /\\(?:[^\]]+)\[(?:[^\]]+)]/gmi,
    regRemoveEscapeCodes_3: /<(?:[^\>]+)>/gmi,

    removeSpaces(str){
        return str.replaceAll(" ", "")
    },

    /**
     * 
     * @param {string} str 
     * @param {string} replaceThis 
     * @param {string} withThat 
     * @param {string} flags 
     * @returns {string} The replaced string
     * @deprecated This was suppose to be used on MV only.
     */
    replaceAll(str, replaceThis, withThat, flags = "g"){
        return str.replaceAll(replaceThis, withThat)
    },
}

Eli.Array = {

    shuffle(array){
        const shuffleArray = []
            
        while(array.length > 0){
            const randomIndex = Math.floor(Math.random() * array.length)
            const randomElement = array.splice(randomIndex, 1)

            shuffleArray.push(randomElement[0])
        }
        
        return shuffleArray
    },

    createProgressiveNumbers(min, max){
        return Array.from({length: max+1 - min}, (_, i) => i + min)
    },

    insertElement(array, index, element){
        array.splice(index, 0, element)
    },

    removeElement(array, index, deleteCount){
        array.splice(index, deleteCount)
    },

    replaceElement(array, oldElement, newElement){
        const index = array.indexOf(oldElement)
        array.splice(index, 1, newElement)
    },

    removeAndInsertElement(array, index, element){
        array.splice(index, 1, element)
    },

    remove(array, element){
        const index = array.indexOf(element)

        if(index > -1){
            array.splice(index, 1)
        }
    },

    isEqual(array1, array2){
        return array1.toString().toLowerCase() === array2.toString().toLowerCase()
    },

}

Eli.Number = {

    isBetween(number, min, max){
        return number > min && number < max
    },

    isBetweenOrEqual(number, min, max){
        return number >= min && number <= max
    },
}

// Date Eli. Nice to meet me. ;)
Eli.Date = {

    milliSecondsToFrames(ms){
        return Math.floor( ms / 1000 * 60)
    },

    secondsToFrames(seconds){
        return Math.floor(seconds * 60)
    },

    minutesToFrames(minutes){
        return Math.floor(minutes * Math.pow(60, 2) )
    },

    hoursToFrames(hours){
        return Math.floor( hours * Math.pow(60, 3) )
    },

    // will be removed when all plugins have changed to "miLLiseconds"...
    framesToMiliSeconds(frames){
        return Math.floor( frames * 1000 / 60)
    },

    framesToMilliSeconds(frames){
        return Math.floor( frames * 1000 / 60)
    },

    framesToSeconds(frames){
        return Math.floor(frames / 60)
    },

    framesToMinutes(frames){
        return Math.floor( frames / Math.pow(60, 2))
    },

    framesToHours(frames){
        return Math.floor( frames / Math.pow(60, 3) )
    },
}

Eli.Utils = {

    regExtractMeta: /<([^<>:]+)(:?)([^>]*)>/g,
    regVariable1: /\x1b\x1b/g,
    regVariable2: /\x1bV\[(\d+)\]/gi,
    windowMargin: 4,
    bump: new Bump(PIXI),
    spriteCharacters: {},

    getFolderAndFileName(string){
        const lastIndex = string.lastIndexOf("/") + 1
        const filename = string.substr(lastIndex)
        const folder = string.substring(0, lastIndex)

        return [folder, filename]
    },

    getIdByName(searchName, data){
        return searchName
    },

    calculatePosition(position, width, height, baseWidth, baseHeight){
        const {alignX, alignY, offsetX, offsetY} = position

        const x = {
            left: offsetX,
            center: (baseWidth-width) / 2 + offsetX,
            right: (baseWidth-width) + offsetX
        }[alignX]

        const y = {
            top: offsetY,
            center: (baseHeight-height) / 2 + offsetY,
            bottom: (baseHeight-height) + offsetY
        }[alignY]

        return {x, y}
    },

    calculateScreenPosition(align, offset, size, coordinate = "x", isOnWindowLayer = false){
        let screenSize = {
            x: Graphics.width,
            y: Graphics.height,
        }[coordinate]

        if(isOnWindowLayer){
            screenSize = {
                x: Graphics.boxWidth,
                y: Graphics.boxHeight,
            }[coordinate]
        }
        const mainSize = screenSize - size

        switch(align){
            case "center":  
                return (mainSize / 2) + offset
            case "right":
            case "bottom":  
                return (mainSize + offset)
            case "left":
            case "top":
                return 0 + offset
        }

        return offset
    },

    centerPos(itemWidth, itemHeight, baseWidth, baseHeight){
        return {
            x:  this.centerXPos(itemWidth, baseWidth),
            y:  this.centerYPos(itemHeight, baseHeight),
        }
    },
    
    centerXPos(itemWidth, baseWidth = Graphics.width){
        return Math.abs(itemWidth - baseWidth) / 2
    },

    centerYPos(itemHeight, baseHeight = Graphics.height){
        return Math.abs(itemHeight - baseHeight) / 2
    },

    isMVAnimation(animation) {
        return !!animation.frames
    },

    isDataActor(data) {
        return data.hasOwnProperty("nickname")
    },

    isDataClass(data) {
        return data.hasOwnProperty("learnings")
    },

    isDataSkills(data) {
        return data.hasOwnProperty("stypeId")
    },

    isDataItem(data) {
        return data.hasOwnProperty("itypeId")
    },

    isDataWeapon(data) {
        return data.hasOwnProperty("wtypeId")
    },
    
    isDataArmor(data) {
        return data.hasOwnProperty("atypeId")
    },
    
    isDataEnemy(data) {
        return data.hasOwnProperty("dropItems")
    },

    isDataTroops(data) {
        return data.hasOwnProperty("members")
    },
    
    isDataStates(data) {
        return data.hasOwnProperty("stepsToRemove")
    },

    isDataTileset(data){
        data.hasOwnProperty("stepsToRemove")
    },
    
    isDataMapInfo(data) {
        return data.hasOwnProperty("expanded")
    },
    
    isDataSystem(data) {
        return data.hasOwnProperty("locale")
    },

    isEvent(character){
        return character.constructor.name === "Game_Event"
    },
    
    isPlayer(character){
        return character.constructor.name === "Game_Player"
    },
    
    isFollower(character){
        return character.constructor.name === "Game_Follower"
    },

    isVehicle(character){
        return character.constructor.name === "Game_Vehicle"
    },

    scene(){
        return SceneManager._scene
    },

    isScene(scene){
        return this.scene().constructor.name === scene.prototype.constructor.name
    },

    convertEscapeVariablesOnly(text){
        text = text.replace(/\\/g, '\x1b')
        text = text.replace(this.regVariable1, '\\')
        text = text.replace(this.regVariable2, function() {
            return $gameVariables.value(Number(arguments[1]))
        }.bind(this))

        return text
    },

    convertEscapeCharacters(text, subWin){
        const rect = new Rectangle(0,0,0,0)
        const tempWin = new Window_Base(rect)

        if(subWin){
            tempWin.contents.fontSize = subWin.contents.fontSize
        }

        text = tempWin.convertEscapeCharacters(text)

        return text
    },

    needEval(param) {
        if(isNaN(param)){

            try{
                return eval(param)
            }catch(err){
                return param
            }

        }else{
            return param
        }
    },

    processEscapeVarOrFormula(arg){
        if(typeof arg !== 'string') return arg
        
        const rawArg = arguments[0]
        arg = this.convertEscapeVariablesOnly(rawArg)
        if(rawArg === arg){
            return this.needEval(arg)
        }else{
            return arg
        }
    },

    getDataMap(mapId) {
        const xhr = new XMLHttpRequest()
        const fileName = "Map%1.json".format(mapId.padZero(3))
        const url = "data/" + fileName

        xhr.open("GET", url, false)
        xhr.send()

        return JSON.parse(xhr.responseText)
    },

    getTextWidth(rawText, allLines, winClass = Window_Base){
        const tempWin = new winClass(new Rectangle(0, 0, 500, 500))

        return tempWin.getTextWidth(rawText, allLines)
    },

    getSpriteCharacter(id){
        const character = this.getMapCharacter(id)
        return character.getMapSprite()
    },

    getMapCharacter(id){
        if(id == 0){
            return Eli.PluginManager.currentInterpreter.character(0)

        }else if(id > 0){
            const eventId = Number(id)
            return $gameMap.event(eventId)

        } else if(id == -1){
            return $gamePlayer

        }else if(id < -1){
            return $gamePlayer.followers()._data[Math.abs(Number(id) + 2)]

        }else{
            const newId = Eli.String.removeSpaces(String(id)).toLowerCase()

            if(newId === "camera"){
                return Eli.CameraManager.getGameCamera()
            }else{
                return $gameMap.vehicles().find(item => Eli.String.removeSpaces(item._type).toLowerCase() === newId)
            }
        }
    },

    getFaceSize(){
        return {
            width: ImageManager.faceWidth,
            height: ImageManager.faceHeight
        }
    },

}

Eli.KeyCodes = {

    keyboard: {
        backspace:8, tab:9, enter:13, shift:16, ctrl:17, alt:18, pausebreak:19, capslock:20, 
        esc:27, space:32, pageup:33, pagedown:34, end:35, home:36, 
        leftarrow:37, uparrow:38, rightarrow:39, downarrow:40, insert:45, delete:46, 
        0:48, 1:49, 2:50, 3:51, 4:52, 5:53, 6:54, 7:55, 8:56, 9:57, 
        a:65, b:66, c:67, d:68, e:69, f:70, g:71, h:72, i:73, j:74, k:75, l:76, m:77, n:78, 
        o:79, p:80, q:81, r:82, s:83, t:84, u:85, v:86, w:87, x:88, y:89, z:90, 
        leftwindowkey:91, rightwindowkey:92, selectkey:93, 
        numpad0:96, numpad1:97, numpad2:98, numpad3:99, numpad4:100, numpad5:101, 
        numpad6:102, numpad7:103, numpad8:104, numpad9:105, 
        multiply:106, add:107, subtract:109, decimalpoint:110, divide:111, 
        f1:112, f2:113, f3:114, f4:115, f5:116, f6:117, f7:118, f8:119, f9:120, f10:121, f11:122, f12:123,
        numlock:144, scrolllock:145, semicolon:186, equalsign:187, comma:188, dash:189, period:190,
        forwardslash:191, graveaccent:192, openbracket:219, backslash:220, closebracket:221, singlequote:222
    },

    gamepad: {
        a: 0, b: 1, x: 2, y: 3, lb: 4, rb: 5, lt: 6, rt: 7, select: 8,
        start: 9, l3: 10, r3: 11, up: 12, down: 13, left: 14, right: 15
    },

    mouse: {
        left: 0,
        middle: 1,
        right: 2,
        back: 3,
        forward: 5,
    },

    defaultKeyboard: [
        9, 13, 16, 17, 18, 27, 32, 33, 34, 37, 38, 39, 
        40, 45, 81, 87, 88, 90, 96, 98, 100, 102, 104, 120
    ],

    defaultGamepad: [0, 1, 2, 3, 4, 5, 12, 13, 14, 15],

    isDefaultKeyboard(keyCode){
        return this.defaultKeyboard.includes(keyCode)
    },

    isDefaultGamepad(keyCode){
        return this.defaultGamepad.includes(keyCode)
    },
}

Eli.PluginManager = {

    currentEventId: 0,
    currentInterpreter: null,
    regVariable: /\\V\[(\d+)\]/gi,
    regSelfVariable: /\\SV\[([^a-zA-Z]+)\]/gi,

    getPluginName(){
        const srcScript = document.currentScript.src
        const start = srcScript.lastIndexOf("/") + 1
        const end = srcScript.lastIndexOf(".js")
        const pluginName = srcScript.substring(start, end)

        return pluginName
    },

    getPluginVersion(){
        const pluginName = this.getPluginName()
        const desc = $plugins.find(plugin => plugin.name === pluginName).description
        const start = desc.indexOf("♦") + 1
        const end = desc.lastIndexOf("♦")
        const version = desc.substring(start, end)
        const lastPoint = version.lastIndexOf(".")

        return version.substring(0, lastPoint) + version.slice(lastPoint+1)
    },

    registerCommands(plugin, commands){
        const pluginName = this.getPluginName()

        for(const command of commands){
            const callBack = command
            PluginManager.registerCommand(pluginName, command, plugin[callBack].bind(plugin))
        }
    },

    createIdList(idString){
        const ids = Eli.String.removeSpaces(this.parseVariables(idString)).split(",")
        const list = []

        for(const id of ids){
            if(id.includes("--")){
                const [min, max] = id.split("--").map(item => Number(item))
                const rangeOfIds = Eli.Array.createProgressiveNumbers(min, max)

                list.push(...rangeOfIds)

            }else if(isNaN(id)){
                list.push(id)

            }else{
                list.push(Number(id))
            }
        }

        return list
    },

    parseVariables(str){
        return Eli.Utils.convertEscapeVariablesOnly(str)
    },

    convertParameters(parameters){ // Thanks to LTN games!
        const parseParameters = function(string)  {
            try {
                return JSON.parse(string, (key, value) => {
                    try {
                        return parseParameters(value)
                    } catch (e) {
                        return value
                    }
                })
            } catch (e) {
                return string
                }
        }

        return parseParameters(JSON.stringify(parameters))
    },

    createParameters(){
        const pluginName = this.getPluginName()
        const rawParameters = PluginManager.parameters(pluginName)
        const param = this.convertParameters(rawParameters)

        return param
    },

    /**
     * 
     * @param {string} str 
     * @returns {Array<string|number>}
     * @deprecated Must be replaced with createId list
     */
    createRangeOfNumbers(str){
        const ids = Eli.String.removeSpaces(this.parseVariables(str)).split(",")
        const rangeIds = []

        for(let i = 0; i < ids.length; i++){
            const id = ids[i]

            if(id.includes("--")){
                const [min, max] = id.split("--").map(item => Number(item))
                const rangeOfIds = Eli.Array.createProgressiveNumbers(min, max)
                rangeIds.push(...rangeOfIds)

            }else if(isNaN(id)){
                rangeIds.push(id)

            }else{
                rangeIds.push(Number(id))
            }
        }

        return rangeIds
    },
}

Eli.ColorManager = {

    names: [
        "ALICEBLUE", "ANTIQUEWHITE", "AQUA", "AQUAMARINE", "AZURE", "BEIGE", "BISQUE", "BLACK", "BLANCHEDALMOND", "BLUE", "BLUEVIOLET", "BROWN", 
        "BURLYWOOD", "CADETBLUE", "CHARTREUSE", "CHOCOLATE", "CORAL", "CORNFLOWERBLUE", "CORNSILK", "CRIMSON", "CYAN", "DARKBLUE", "DARKCYAN", 
        "DARKGOLDENROD", "DARKGRAY", "DARKGREY", "DARKGREEN", "DARKKHAKI", "DARKMAGENTA", "DARKOLIVEGREEN", "DARKORANGE", "DARKORCHID", "DARKRED", 
        "DARKSALMON", "DARKSEAGREEN", "DARKSLATEBLUE", "DARKSLATEGRAY", "DARKSLATEGREY", "DARKTURQUOISE", "DARKVIOLET", "DEEPPINK", "DEEPSKYBLUE", 
        "DIMGRAY", "DIMGREY", "DODGERBLUE", "FIREBRICK", "FLORALWHITE", "FORESTGREEN", "FUCHSIA", "GAINSBORO", "GHOSTWHITE", "GOLD", "GOLDENROD", 
        "GRAY", "GREY", "GREEN", "GREENYELLOW", "HONEYDEW", "HOTPINK", "INDIANRED", "INDIGO", "IVORY", "KHAKI", "LAVENDER", "LAVENDERBLUSH", 
        "LAWNGREEN", "LEMONCHIFFON", "LIGHTBLUE", "LIGHTCORAL", "LIGHTCYAN", "LIGHTGOLDENRODYELLOW", "LIGHTGRAY", "LIGHTGREY", "LIGHTGREEN", 
        "LIGHTPINK", "LIGHTSALMON", "LIGHTSEAGREEN", "LIGHTSKYBLUE", "LIGHTSLATEGRAY", "LIGHTSLATEGREY", "LIGHTSTEELBLUE", "LIGHTYELLOW", 
        "LIME", "LIMEGREEN", "LINEN", "MAGENTA", "MAROON", "MEDIUMAQUAMARINE", "MEDIUMBLUE", "MEDIUMORCHID", "MEDIUMPURPLE", "MEDIUMSEAGREEN", 
        "MEDIUMSLATEBLUE", "MEDIUMSPRINGGREEN", "MEDIUMTURQUOISE", "MEDIUMVIOLETRED", "MIDNIGHTBLUE", "MINTCREAM", "MISTYROSE", "MOCCASIN", 
        "NAVAJOWHITE", "NAVY", "OLDLACE", "OLIVE", "OLIVEDRAB", "ORANGE", "ORANGERED", "ORCHID", "PALEGOLDENROD", "PALEGREEN", "PALETURQUOISE", 
        "PALEVIOLETRED", "PAPAYAWHIP", "PEACHPUFF", "PERU", "PINK", "PLUM", "POWDERBLUE", "PURPLE", "REBECCAPURPLE", "RED", "ROSYBROWN", "ROYALBLUE", 
        "SADDLEBROWN", "SALMON", "SANDYBROWN", "SEAGREEN", "SEASHELL", "SIENNA", "SILVER", "SKYBLUE", "SLATEBLUE", "SLATEGRAY", "SLATEGREY", "SNOW", 
        "SPRINGGREEN", "STEELBLUE", "TAN", "TEAL", "THISTLE", "TOMATO", "TURQUOISE", "VIOLET", "WHEAT", "WHITE", "WHITESMOKE", "YELLOW", "YELLOWGREEN",
    ],

    getHexValue(hex, start, end){
        return parseInt(hex.slice(start, end), 16)
    },

    isHexColor(color){
        return color && color[0] === '#'
    },

    isRgb(color){
        return color && color instanceof Array || color.includes(",")
    },

    isHtmlColor(color){
        return color && color[0] !== "#" && isNaN(color[0])
    },

    // Thanks! - https://css-tricks.com/converting-color-spaces-in-javascript/
    nameToRgb(name, alphaGray = 255) {
        // Create fake div
        const fakeDiv = document.createElement("div")
        fakeDiv.style.color = name
        document.body.appendChild(fakeDiv)
        // Get color of div
        const cs = window.getComputedStyle(fakeDiv)
        const rgbString = cs.getPropertyValue("color")
        // Remove div after obtaining desired color value
        document.body.removeChild(fakeDiv)
        const start = rgbString.indexOf("(") + 1
        const end = rgbString.indexOf(")")
        const rawString = rgbString.substring(start, end)
        const rgbArray = rawString.split(",").map(item => Number(item))

        rgbArray.push(alphaGray)

        return rgbArray
    },

    hexToRgb(hex, alphaGray = 255) {
        if(hex.length === 7){
            hex += alphaGray === 255 ? "ff" : "00"
        }
        const r = this.getHexValue(hex, 1, 3)
        const g = this.getHexValue(hex, 3, 5)
        const b = this.getHexValue(hex, 5, 7)
        const a = this.getHexValue(hex, 7, 9)
        const color = [r, g, b, a]

        return color
    },

    rgbToHex(color, alphaGray = 255){
        if(typeof color === 'string'){
            color = color.split(",")
        }
        let [r, g, b, a] = color.map(item => Number(item))
        a = a || alphaGray

        r = r.toString(16)
        g = g.toString(16)
        b = b.toString(16)
        a = a.toString(16)
        
        if (r.length === 1) r = "0" + r
        if (g.length === 1) g = "0" + g
        if (b.length === 1) b = "0" + b
        if (a.length === 1) a = "0" + a

        return "#" + r + g + b + a
    },

    formatRgbToArray(color, alphaGray = 255){
        if(typeof color === "string"){
            color = color.split(",")
        }

        if(color.length === 3) color.push(alphaGray)

        return color.map(item => Number(item))
    },

    getHexOrName(color){
        if(this.isRgb(color)){
            color = this.rgbToHex(color)
        }

        return color
    },

    getRgb(color, alphaGray = 255){
        if(this.isHtmlColor(color)){
            return this.nameToRgb(color, alphaGray)

        }else if(this.isHexColor(color)){
            return this.hexToRgb(color, alphaGray)

        } else if(this.isRgb(color)){
            return this.formatRgbToArray(color, alphaGray)

        }else {
            return [0, 0, 0, alphaGray]
        }
    },

    getRgbForBlend(color){
        // If ommited, the Alpha value will be 255
        return this.getRgb(color, 255)
    },

    getRgbForTone(color){
        // If ommited, the Gray value will be 0
        return this.getRgb(color, 0)
    },

}

/* -------------------------------- ELI BOOK -------------------------------- */
Eli.Book = {

    Parameters: class {
        constructor(parameters){
            this.engine = this.createEngine(JSON.parse(parameters.engine))
            this.playtest = this.createPlaytest(JSON.parse(parameters.playtest))
        }

        createEngine(param){
            return {
                pixelPerfect: param.pixelPerfect === "true",
                disableEffekseer: param.disableEffekseer === "true",
                styleOverflow: param.styleOverflow === "true",
                fixBitmapStartLoad: param.fixBitmapStartLoad === "true"
            }
        }
    
        createPlaytest(param){
            return {
                openDevTools: param.openDevTools === "true",
                gameFocus: param.gameFocus === "true",
                quickRestart: param.quickRestart === "true",
                startFps: param.startFps === "true",
                nwWindowPos: param.nwWindowPos,
            }
        }
    },
    
    initialize(){
        const parameters = PluginManager.parameters(Eli.PluginManager.getPluginName())
        this.parameters = new this.Parameters(parameters)
        this.setDocumentStyle()
        window.addEventListener("load", this.onWindowLoad.bind(this))
    },

    setDocumentStyle(){
        if(this.engine().styleOverflow){
            document.body.style.overflow = "hidden"
        }
    },

    getParam(){
        return this.parameters
    },

    engine(){
        return this.parameters.engine
    },

    playtest(){
        return this.parameters.playtest
    },

    isPixelPerfect(){
        return this.parameters.engine.pixelPerfect
    },

    onWindowLoad(){
        if(Utils.isNwjs() && Utils.isOptionValid("test")){

            if(this.playtest().openDevTools){
                nw.Window.get().showDevTools()
                setTimeout(() => {nw.Window.get().focus()}, 1500)
            }

            const [x, y] =  this.playtest().nwWindowPos.split(",").map(item => Number(item))

            if(x > -1){
                nw.Window.get().x = x
                nw.Window.get().y = y
            }
            
        }
    },

}

Eli.Book.initialize()

/* ========================================================================== */
/*                                  SAVE DATA                                 */
/* ========================================================================== */

function Eli_SavedContents() {
    this.initialize.apply(this, arguments)
}

Eli_SavedContents.prototype.initialize = function(){
    this.contents = {}
}

Eli_SavedContents.prototype.createNewContent = function(pluginName){
    this.contents[pluginName] = {}
}

Eli_SavedContents.prototype.addNewDataToContent = function(pluginName, newData, value){
    this.contents[pluginName][newData] = value
}

var $eliData = null

{

const Alias = {}

/* ---------------------------- DISABLE EFFEKSEER --------------------------- */
if(Eli.Book.engine().disableEffekseer){

    SceneManager.updateEffekseer = function(){}

    EffectManager.isReady = function() {
        return true
    }

    EffectManager.clear = function() {
        this._cache = {}
    }

}

/* ========================================================================== */
/*                                    CORE                                    */
/* ========================================================================== */

/* -------------------------------- GRAPHICS -------------------------------- */
if(Eli.Book.isPixelPerfect()){

    Alias.Graphics_createCanvas = Graphics._createCanvas
    Graphics._createCanvas = function() {
        Alias.Graphics_createCanvas.call(this)
        this.setCanvasToPixelPerfect()
    }

    Alias.Graphics_updateCanvas = Graphics._updateCanvas
    Graphics._updateCanvas = function() {
        Alias.Graphics_updateCanvas.call(this)
        this.setCanvasToPixelPerfect()
    }

    Graphics.setCanvasToPixelPerfect = function() {
        document.body.style.imageRendering = "pixelated"
        this._canvas.style.imageRendering = "pixelated"
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
    }
}

Alias.Graphics_setupPixi = Graphics._setupPixi
Graphics._setupPixi = function() {
    Alias.Graphics_setupPixi.call(this)
    this.onPixiSetup()
}

Graphics.onPixiSetup = function() {
    if(Eli.Book.isPixelPerfect()){
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
    }
    if(Utils.isOptionValid("test") && Eli.Book.playtest().startFps){
        Graphics._switchFPSCounter()
    }
}

/* --------------------------------- BITMAP --------------------------------- */
Alias.Bitmap_initialize = Bitmap.prototype.initialize
Bitmap.prototype.initialize = function(width, height){
    Alias.Bitmap_initialize.call(this, width, height)
    this.initMembers()
    this.refreshPixelPerfect()
}

Bitmap.prototype.initMembers = function(){
    this.fontBold = false
}

Bitmap.prototype.refreshPixelPerfect = function(){
    if(Eli.Book.isPixelPerfect()){
        this._smooth = false
    }
}

Alias.Bitmap_updateScaleMode = Bitmap.prototype._updateScaleMode
Bitmap.prototype._updateScaleMode = function() {
    this.refreshPixelPerfect()
    Alias.Bitmap_updateScaleMode.call(this)
}

if(Eli.Book.engine().fixBitmapStartLoad){

    Bitmap.prototype._startLoading = function() {
        this._image = new Image()
        this._image.onload = this._onLoad.bind(this)
        this._image.onerror = this._onError.bind(this)
        this._destroyCanvas()
        this._loadingState = "loading"

        if(Utils.hasEncryptedImages()){
            this._startDecrypting()
        }else{
            this._image.src = this._url
        }
    }
}

/* --------------------------------- WINDOW --------------------------------- */
Alias.Window_initialize = Window.prototype.initialize
Window.prototype.initialize = function() {
    Alias.Window_initialize.call(this)
    Eli.Utils.windowMargin = this._margin
}

/* --------------------------------- SPRITE --------------------------------- */
Alias.Sprite_initialize = Sprite.prototype.initialize
Sprite.prototype.initialize = function(bitmap){
    this.initInnerAnimations()
    Alias.Sprite_initialize.call(this, bitmap)
    this.createMainRect()
}

/* ------------------------------- MAIN SPRITE ------------------------------ */
Sprite.prototype.createMainRect = function(){
    this.mainRect = new Rectangle(this.x, this.y, this.width, this.height)
}

Sprite.prototype.refreshMainRect = function(skipUpdate){
    const global = this.getGlobalPosition(new Point(), skipUpdate)
    this.mainRect = new Rectangle(global.x, global.y, this.width, this.height)
}

Sprite.prototype.scaledWidth = function(){
    return this.scale.x * this.width
}

Sprite.prototype.scaledHeight = function(){
    return this.scale.y * this.height
}

Sprite.prototype.centerPositionX = function(relativeWidth){
    const x = Eli.Utils.centerXPos(this.scaledWidth(), relativeWidth)
    this.x = x
}

Sprite.prototype.centerPositionY = function(relativeHeight){
    const y = Eli.Utils.centerYPos(this.scaledHeight(), relativeHeight)
    this.y = y
}

Sprite.prototype.centerPositionTo = function(relativeWidth, relativeHeight){
    const x = Eli.Utils.centerXPos(this.scaledWidth(), relativeWidth)
    const y = Eli.Utils.centerYPos(this.scaledHeight(), relativeHeight)
    this.move(x, y)
}

Sprite.prototype.stretchScaleTo = function(keepRatio, baseWidth = Graphics.width, baseHeight = Graphics.height){
    const bitmapWidth = this.width
    const bitmapHeight = this.height
    
    if(keepRatio){
        const widthRatio = baseWidth / bitmapWidth
        const heightRatio = baseHeight / bitmapHeight
        const finalScale = Math.min(widthRatio, heightRatio)

        this.scale.set(finalScale, finalScale)

    }else{
        const upScale = baseWidth > bitmapWidth || baseHeight > bitmapHeight
        const widthRatio = Math.max(bitmapWidth, baseWidth) / Math.min(bitmapWidth, baseWidth)
        const heightRatio = Math.max(bitmapHeight, baseHeight) / Math.min(bitmapHeight, baseHeight)
        const scaleX = Math.abs(1 - widthRatio)
        const scaleY = Math.abs(1 - heightRatio)

        if(upScale){
            this.scale.set(1 + scaleX, 1 + scaleY)
        }else{
            this.scale.set(1 - scaleX, 1 - scaleY)
        }
    }
}

Sprite.prototype.isMainRectClicked = function(){
    return TouchInput.isTriggered() && this.mainRect.contains(TouchInput._x, TouchInput._y)
}

Sprite.prototype.isMainRectHovered = function(){
    return this.mainRect.contains(TouchInput._movingX, TouchInput._movingY)
}

/* ----------------------------- INNER ANIMATION ---------------------------- */
Sprite.prototype.initInnerAnimations = function(){
    this._innerAnimationsMZ = []
    this._innerAnimationsMV = []
    this._effectTarget = this
}

Sprite.prototype.updateInnerMVAnimationSprites = function() {
    if (this.isInnerAnimationPlaying()) {
        const sprites = this._innerAnimationsMV.clone()
        this._innerAnimationsMV = []

        for (const sprite of sprites){

            if (sprite.isPlaying()) {
                this._innerAnimationsMV.push(sprite)

            }else{
                sprite.destroy()
            }
        }
    }
}

Sprite.prototype.updateInnerMZAnimationSprites = function(){
    for(const sprite of this._innerAnimationsMZ){

        if(!sprite.isPlaying()){
            this.removeInnerAnimation(sprite)
        }
    }
}

Sprite.prototype.isInnerAnimationPlaying = function(){
    return this._innerAnimationsMV.length > 0 || this._innerAnimationsMZ.length > 0
}

Sprite.prototype.startInnerAnimation = function(animationId, mirror, delay){
    const animation = JSON.parse(JSON.stringify($dataAnimations[animationId]))
    
    if(animation) {

        if(Eli.Utils.isMVAnimation(animation)){
            this.startInnerAnimationMV(animation, mirror, delay)
        }else{
            this.startInnerAnimationMZ(animation, mirror, delay)
        }
    }
}

Sprite.prototype.startInnerAnimationMV = function(animation, mirror, delay){
    const sprite = new Sprite_InnerAnimationMV()

    sprite.setup(this._effectTarget, animation, mirror, delay)
    this.parent.addChild(sprite)
    this._innerAnimationsMV.push(sprite)
}

Sprite.prototype.startInnerAnimationMZ = function(animation, mirror, delay){
    const sprite = new Sprite_Animation()
    const targetSprites = [this]
    const baseDelay = this.innerAnimationBaseDelay()
    const previous = delay > baseDelay ? this.lastInnerAnimationSprite() : null

    // if (this.innerAnimationShouldMirror(targetSprites[0])) {
    //     mirror = !mirror
    // }

    sprite._targets = [this]
    animation.offsetX += this.width/2
    animation.offsetY += this.height
    sprite.setup(targetSprites, animation, mirror, delay, previous)
    this.parent.addChild(sprite)
    this._innerAnimationsMZ.push(sprite)
}

Sprite.prototype.lastInnerAnimationSprite = function() {
    return this._innerAnimationsMZ[this._innerAnimationsMZ.length - 1]
}

Sprite.prototype.isInnerAnimationForEach = function(animation) {
    const mv = Eli.Utils.isMVAnimation(animation)
    return mv ? animation.position !== 3 : animation.displayType === 0
}

Sprite.prototype.innerAnimationBaseDelay = function() {
    return 8
}

Sprite.prototype.innerAnimationNextDelay = function() {
    return 12
}

Sprite.prototype.innerAnimationShouldMirror = function(target) {
    return target && target.isActor && target.isActor()
}

Sprite.prototype.removeInnerAnimation = function(sprite) {
    this._innerAnimationsMZ.remove(sprite)
    this.removeChild(sprite)

    for (const target of sprite._targets) {
        if (target.endAnimation) {
            target.endAnimation()
        }
    }
    sprite.destroy()
}

Sprite.prototype.removeAllInnerAnimations = function() {
    for (const sprite of this._innerAnimationsMZ.clone()) {
        this.removeInnerAnimation(sprite)
    }
}

/* ------------------------------- TOUCH INPUT ------------------------------ */
Alias.TouchInput_initialize = TouchInput.initialize
TouchInput.initialize = function() {
    this.initMembers()
    Alias.TouchInput_initialize.call(this)
}

TouchInput.initMembers = function() {
    this._movingX = -1
    this._movingY = -1
}

Alias.TouchInput_onMouseMove = TouchInput._onMouseMove
TouchInput._onMouseMove = function(event) {
    this.storeMouseCoordinates(event)
    Alias.TouchInput_onMouseMove.call(this, event)
}

TouchInput.storeMouseCoordinates = function(event) {
    this._movingX = Graphics.pageToCanvasX(event.pageX)
    this._movingY = Graphics.pageToCanvasY(event.pageY)
}

/* ========================================================================== */
/*                                    SCENE                                   */
/* ========================================================================== */

/* ------------------------------- SCENE BOOT ------------------------------- */
Alias.Scene_Boot_onDatabaseLoaded = Scene_Boot.prototype.onDatabaseLoaded
Scene_Boot.prototype.onDatabaseLoaded = function() {
    Alias.Scene_Boot_onDatabaseLoaded.call(this)
    this.processDatabaseNotesAndMetas()
}

Scene_Boot.prototype.processDatabaseNotesAndMetas = function(){
    for(let i = 1; i < $dataActors.length; i++){
        this.processDataActors($dataActors[i])
    }
    for(let i = 1; i < $dataClasses.length; i++){
        this.processDataClasses($dataClasses[i])
    }
    for(let i = 1; i < $dataSkills.length; i++){
        this.processDataSkills($dataSkills[i])
    }
    for(let i = 1; i < $dataItems.length; i++){
        this.processDataItems($dataItems[i])
    }
    for(let i = 1; i < $dataWeapons.length; i++){
        this.processDataWeapons($dataWeapons[i])
    }
    for(let i = 1; i < $dataArmors.length; i++){
        this.processDataArmors($dataArmors[i])
    }
    for(let i = 1; i < $dataEnemies.length; i++){
        this.processDataEnemies($dataEnemies[i])
    }
    for(let i = 1; i < $dataTroops.length; i++){
        this.processDataTroops($dataTroops[i])
    }
    for(let i = 1; i < $dataStates.length; i++){
        this.processDataStates($dataStates[i])
    }
    for(let i = 1; i < $dataTilesets.length; i++){
        this.processDataTilesets($dataTilesets[i])
    }
}

Scene_Boot.prototype.processDataActors = function(data){}
Scene_Boot.prototype.processDataClasses = function(data){}
Scene_Boot.prototype.processDataSkills = function(data){}
Scene_Boot.prototype.processDataItems = function(data){}
Scene_Boot.prototype.processDataWeapons = function(data){}
Scene_Boot.prototype.processDataArmors = function(data){}
Scene_Boot.prototype.processDataEnemies = function(data){}
Scene_Boot.prototype.processDataTroops = function(data){}
Scene_Boot.prototype.processDataStates = function(data){}
Scene_Boot.prototype.processDataTilesets = function(data){}

/* -------------------------------- SCENE MAP ------------------------------- */
Alias.Scene_Map_start = Scene_Map.prototype.start
Scene_Map.prototype.start = function() {
    if(this._transfer){
        this.beforeStartAndTransferIsOn()
    }
    Alias.Scene_Map_start.call(this)
}

Scene_Map.prototype.beforeStartAndTransferIsOn = function() {}

/* ========================================================================== */
/*                                   MANAGER                                  */
/* ========================================================================== */

/* ------------------------------ DATA MANAGER ------------------------------ */
Alias.DataManager_createGameObjects = DataManager.createGameObjects
DataManager.createGameObjects = function() {
    $eliData = new Eli_SavedContents()
    Alias.DataManager_createGameObjects.call(this)
}

Alias.DataManager_makeSaveContents = DataManager.makeSaveContents
DataManager.makeSaveContents = function() {
    const alias = Alias.DataManager_makeSaveContents.call(this)
    alias.eli = $eliData ?? new Eli_SavedContents();

    return alias
}

Alias.DataManager_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
    Alias.DataManager_extractSaveContents.call(this, contents)
    $eliData = contents.eli ?? new Eli_SavedContents();
}

/* ------------------------------ SCENE MANAGER ----------------------------- */
if(Eli.Book.playtest().gameFocus){

    Alias.SceneManager_isGameActive = SceneManager.isGameActive
    SceneManager.isGameActive = function() {
        return Alias.SceneManager_isGameActive.call(this) || Utils.isOptionValid("test")
    }
}

if(Eli.Book.playtest().quickRestart){

    Alias.SceneManager_reloadGame = SceneManager.reloadGame
    SceneManager.reloadGame = function() {
        if(Utils.isNwjs()){
            location.reload()
        }else{
            Alias.SceneManager_reloadGame.call(this)
        }
    }
}

/* ========================================================================== */
/*                                   OBJECTS                                  */
/* ========================================================================== */

/* --------------------------- GAME CHARACTER BASE -------------------------- */
Game_CharacterBase.prototype.hasMapSprite = function(){
    return !!this.getMapSprite()
}

Game_CharacterBase.prototype.getSpriteId = function() {}

Game_CharacterBase.prototype.getMapSprite = function() {}

Game_CharacterBase.prototype.getCurrentBattler = function() {}

Game_CharacterBase.prototype.getGlobalKey = function() {
    return "undefined"
}

/* ------------------------------- GAME PLAYER ------------------------------ */
Game_Player.prototype.getSpriteId = function() {
    return -1
}

Game_Player.prototype.getMapSprite = function() {
    return Eli.Utils.spriteCharacters[this.getSpriteId()]
}

Game_Player.prototype.getCurrentBattler = function() {
    return $gameParty.leader()
}

Game_Player.prototype.getGlobalKey = function(forActor) {
    if(forActor){
        return `Actor_${$gameParty.leader()?.actorId()}`
    }else{
        return `Player`
    }
}

/* ----------------------------- GAME FOLLOWERS ----------------------------- */
Alias.Game_Follower_initialize = Game_Follower.prototype.initialize
Game_Follower.prototype.initialize = function(memberIndex) {
    this._memberIndex = memberIndex
    Alias.Game_Follower_initialize.call(this, memberIndex)
}

Game_Follower.prototype.getSpriteId = function() {
    return -(this._memberIndex+1)
}

Game_Follower.prototype.getMapSprite = function() {
    const sprites = SceneManager._scene._spriteset._characterSprites
    const followerSprite = sprites.find(item => item._character && item._character._memberIndex === this._memberIndex)

    return followerSprite
}

Game_Follower.prototype.getCurrentBattler = function() {
    return this.actor()
}

Game_Follower.prototype.getGlobalKey = function(forActor) {
    if(forActor){
        return `Actor_${this.actor()?.actorId()}`
    }else{
        return `Follower_${this._memberIndex}`
    }
}

/* ------------------------------- GAME EVENT ------------------------------- */
Alias.Game_Event_initialize = Game_Event.prototype.initialize
Game_Event.prototype.initialize = function(mapId, eventId) {
    this._mapId = mapId
    this._eventId = eventId
    Alias.Game_Event_initialize.call(this, mapId, eventId)
}

Alias.Game_Event_initMembers = Game_Event.prototype.initMembers
Game_Event.prototype.initMembers = function(){
    Alias.Game_Event_initMembers.call(this)
    this.initMetaMembers()
}

Game_Event.prototype.initMetaMembers = function(){
    this.metaEli = {}
    this.needBuildMetaData = true
}

Game_Event.prototype.extractEliMetaData = function(){
    const regExp = /<([^<>:]+)(:?)([^>]*)>/g

    for(;;){
        const match = regExp.exec(this.event().note)

        if(match){
            if(match[2] === ":"){
                const key = match[1]
                const value = match[3]
                const dummy = (arg) => arg
                const parseMethod = this[`parseMeta_${key}`]
                const func = (parseMethod || dummy).bind(this)

                this.metaEli[match[1]] = func(value)

            }else{
                this.metaEli[match[1]] = true
            }

        }else{
            break
        }
    }
}

Alias.Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings
Game_Event.prototype.setupPageSettings = function(){
    this.beforeSetupPage()
    Alias.Game_Event_setupPageSettings.call(this)
    this.afterSetupPage()
    this.checkListIteration()
}

Game_Event.prototype.beforeSetupPage = function(){
    if(this.needBuildMetaData && this.event().note.length > 0){
        this.extractEliMetaData()
        this.needBuildMetaData = false
    }
}

Game_Event.prototype.afterSetupPage = function(){}

Game_Event.prototype.checkListIteration = function(){
    if(this.canIterateList()){
        this.startIterateList()
    }
    this.afterListIteration()
}

Game_Event.prototype.canIterateList = function(){
    return this.metaEli.hasOwnProperty("IterateList")
}

Game_Event.prototype.startIterateList = function(){
    for(let i = 0; i < this.list().length; i++){
        i = this.onListIteration(i)
    }
}

Game_Event.prototype.onListIteration = function(index){
    return index
}

Game_Event.prototype.afterListIteration = function(){}

Game_Event.prototype.getSpriteId = function() {
    return this.eventId()
}

Game_Event.prototype.getMapSprite = function() {
    return Eli.Utils.spriteCharacters[this.getSpriteId()]
}

Game_Event.prototype.getGlobalKey = function(forActor) {
    return `Map_${this._mapId}_Event_${this.eventId()}`
}

/* ------------------------------ GAME VEHICLE ------------------------------ */
Alias.Game_Vehicle_initialize = Game_Vehicle.prototype.initialize
Game_Vehicle.prototype.initialize = function(type) {
    this._type = type
    Alias.Game_Vehicle_initialize.call(this, type)
}

Game_Vehicle.prototype.getSpriteId = function() {
    return this._type.toLowerCase()
}

Game_Vehicle.prototype.getMapSprite = function() {
    return Eli.Utils.spriteCharacters[this.getSpriteId()]
}

Game_Vehicle.prototype.getGlobalKey = function() {
    return `Vehicle_${this._type}`
}

/* ------------------------------ GAME MESSAGE ------------------------------ */
Alias.Game_Message_initialize = Game_Message.prototype.initialize
Game_Message.prototype.initialize = function() {
    Alias.Game_Message_initialize.call(this)
    this.initMembers()
}

Game_Message.prototype.initMembers = function(){
    this.interpreter = null
    this.eventId = 0
    this.commonEventId = 0
}

Game_Message.prototype.setInterpreter = function(interpreter){
    this.interpreter = interpreter
}

Alias.Game_Message_clear = Game_Message.prototype.clear
Game_Message.prototype.clear = function() {
    Alias.Game_Message_clear.call(this)
    this.clearEventIds()
}

Game_Message.prototype.clearEventIds = function(){
    this.setEventIds(0, 0)
}

Game_Message.prototype.setEventIds = function(eventId, commonEventId){
    this.eventId = eventId
    this.commonEventId = commonEventId
}

Game_Message.prototype.getEventId = function(){
    return this.eventId
}

Game_Message.prototype.getCommonEventId = function(){
    return this.commonEventId
}

Game_Message.prototype.getInterpreter = function(){
    return this.interpreter
}

/* ------------------------------ GAME BATTLER ------------------------------ */
Game_Battler.prototype.getDatabase = function(){
    return null // To be overwrite by Game Enemy and Game Actor
}

/* ------------------------------- GAME ACTOR ------------------------------- */
Game_Actor.prototype.getDatabase = function(){
    return this.actor()
}

/* ------------------------------- GAME ENEMY ------------------------------- */
Game_Enemy.prototype.getDatabase = function(){
    return this.enemy()
}

/* ---------------------------- GAME INTERPRETER ---------------------------- */
Alias.Game_Interpreter_clear = Game_Interpreter.prototype.clear
Game_Interpreter.prototype.clear = function() {
    Alias.Game_Interpreter_clear.call(this)
    this.clearCommonEventId()
}

Game_Interpreter.prototype.clearCommonEventId = function() {
    this._commonEventId = 0
}

Alias.Game_Interpreter_setup = Game_Interpreter.prototype.setup
Game_Interpreter.prototype.setup = function(list, eventId) {
    Alias.Game_Interpreter_setup.call(this, list, eventId)
    this.setupCommonEventId(list, eventId)
}

Game_Interpreter.prototype.setupCommonEventId = function(list, eventId) {
    if(!eventId){
        this.setCommonEventId(list)
    }
}

Game_Interpreter.prototype.setCommonEventId = function(list){
    for(let i = 1; i < $dataCommonEvents.length; i++){
        this.onDataCommonEventLoop(list, i)
        if(this._commonEventId > 0){
            break
        }
    }
}

Game_Interpreter.prototype.onDataCommonEventLoop = function(list, i){
    const ce = $dataCommonEvents[i]
    const ceList = ce.list

    if(ceList === list){
        this._commonEventId = i
    }
}

// Show Text
Alias.Game_Interpreter_command101 = Game_Interpreter.prototype.command101
Game_Interpreter.prototype.command101 = function(params) {
    if(!$gameMessage.isBusy()) {
        this.assignMesssageInterpreterAndIds()
    }
    
    return Alias.Game_Interpreter_command101.call(this, params)
}

// Show Choices
Alias.Game_Interpreter_setupChoices = Game_Interpreter.prototype.setupChoices
Game_Interpreter.prototype.setupChoices = function(params){
    this.assignMesssageInterpreterAndIds()
    Alias.Game_Interpreter_setupChoices.call(this, params)
}

Alias.Game_Interpreter_setupNumInput = Game_Interpreter.prototype.setupNumInput
Game_Interpreter.prototype.setupNumInput = function(params) {
    this.assignMesssageInterpreterAndIds()
    Alias.Game_Interpreter_setupNumInput.call(this, params)
}

Alias.Game_Interpreter_setupItemChoice = Game_Interpreter.prototype.setupItemChoice
Game_Interpreter.prototype.setupItemChoice = function(params) {
    this.assignMesssageInterpreterAndIds()
    Alias.Game_Interpreter_setupItemChoice.call(this, params)
}

Game_Interpreter.prototype.assignMesssageInterpreterAndIds = function() {
    $gameMessage.setInterpreter(this)
    $gameMessage.setEventIds(this._eventId, this._commonEventId)
}

// Plugin Command
Alias.Game_Interpreter_command357 = Game_Interpreter.prototype.command357
Game_Interpreter.prototype.command357 = function(params){
    this.setPluginCommandInterpreter()
    return Alias.Game_Interpreter_command357.call(this, params)
}

Game_Interpreter.prototype.setPluginCommandInterpreter = function(){
    Eli.PluginManager.currentInterpreter = this
    if(this._eventId > 0){
        Eli.PluginManager.currentEventId = this._eventId
    }
}

Alias.Game_Interpreter_terminate = Game_Interpreter.prototype.terminate
Game_Interpreter.prototype.terminate = function() {
    Alias.Game_Interpreter_terminate.call(this)
    this.onInterpreterEnd()

}

Game_Interpreter.prototype.onInterpreterEnd = function(){
    if(this._eventId > 0){
        this.onEventEnd()
    }

    if(this._commonEventId > 0){
        this.onCommonEventEnd()
    }
}

Game_Interpreter.prototype.onEventEnd = function(){}

Game_Interpreter.prototype.onCommonEventEnd = function(){}

Game_Interpreter.prototype.getVehicleCharacter = function(vehicleType){
    return $gameMap.vehicles().find(vehicle => {
        const type = Eli.String.removeSpaces(vehicle._type).toLowerCase()
        const targetType = Eli.String.removeSpaces(vehicleType).toLowerCase()
        return type === targetType 
    })
}

Game_Interpreter.prototype.getFollowerCharacter = function(followerId){
    const index = followerId < 0 ? Math.abs(followerId) - 2 : followerId
    return $gamePlayer.followers().data()[index]
}

Game_Interpreter.prototype.isMessageInterpreter = function(){
    return this === $gameMessage.getInterpreter()
}

Game_Interpreter.prototype.getCurrentCommandCode = function(){
    if(this._list){
        return this.currentCommand()?.code || 0
    }else{
        return 0
    }
}

Game_Interpreter.prototype.getNextEventCommand = function(){
    return this._list[this._index + 1]
}

Game_Interpreter.prototype.isOnMessage = function(){
    if(this._list){
        const nextCode = this.nextEventCode()
        const currentCode = this.getCurrentCommandCode()
        const msgCodes = [101, 401]
        const isCurrentMessage = msgCodes.includes(currentCode)
        const isNextMessage = msgCodes.includes(nextCode)
    
        return isCurrentMessage || isNextMessage
    }else{
        return false
    }

}

/* ========================================================================== */
/*                                   SPRITES                                  */
/* ========================================================================== */

/* ------------------------------ SPRITESET MAP ----------------------------- */
Alias.Spriteset_Map_createCharacters = Spriteset_Map.prototype.createCharacters
Spriteset_Map.prototype.createCharacters = function() {
    this.beforeCreateCharacters()
    Alias.Spriteset_Map_createCharacters.call(this)
}

Spriteset_Map.prototype.beforeCreateCharacters = function() {
    Eli.Utils.spriteCharacters = {}
}

/* ---------------------------- SPRITE CHARACTER ---------------------------- */
Alias.Sprite_Character_initialize = Sprite_Character.prototype.initialize
Sprite_Character.prototype.initialize = function(character) {
    Alias.Sprite_Character_initialize.call(this, character)
    this.checkToAddMapSprite(character)
}

Sprite_Character.prototype.checkToAddMapSprite = function(character) {
    if(this.isValidCharacterToSetMapSprite(character)){
        this.setMapSprite(character)
    }
}

Sprite_Character.prototype.isValidCharacterToSetMapSprite = function(character) {
    return  character && 
            ["Game_Player", "Game_Event", "Game_Vehicle"].includes(character.constructor.name)
}

Sprite_Character.prototype.setMapSprite = function(character){
    const spriteId = character.getSpriteId()
    Eli.Utils.spriteCharacters[spriteId] = this
}

Alias.Sprite_Character_setTileBitmap = Sprite_Character.prototype.setTileBitmap
Sprite_Character.prototype.setTileBitmap = function() {
    Alias.Sprite_Character_setTileBitmap.call(this)
    this.addLoadListenerOnTileBitmap()
}

Sprite_Character.prototype.addLoadListenerOnTileBitmap = function(){
    this.bitmap.addLoadListener(() => {
        this.onTileBitmapLoad()
    })
}

Sprite_Character.prototype.onTileBitmapLoad = function(){}

Alias.Sprite_Character_setCharacterBitmap = Sprite_Character.prototype.setCharacterBitmap
Sprite_Character.prototype.setCharacterBitmap = function() {
    Alias.Sprite_Character_setCharacterBitmap.call(this)
    this.addLoadListenerOnCharacterBitmap()
}

Sprite_Character.prototype.addLoadListenerOnCharacterBitmap = function(){
    this.bitmap.addLoadListener(() => {
        this.onCharacterBitmapLoad()
    })
}

Sprite_Character.prototype.onCharacterBitmapLoad = function(){}

/* ------------------------------ SPRITE ENEMY ------------------------------ */
Alias.Sprite_Enemy_loadBitmap = Sprite_Enemy.prototype.loadBitmap
Sprite_Enemy.prototype.loadBitmap = function(name, hue){
    Alias.Sprite_Enemy_loadBitmap.call(this, name, hue)
    this.checkBitmap(name, hue)
}

Sprite_Enemy.prototype.checkBitmap = function(name, hue){
    if(this.bitmap){
        this.bitmap.addLoadListener(() => {
            this.onBitmapLoad(name, hue)
        })
    }
}

Sprite_Enemy.prototype.onBitmapLoad = function(name, hue){}

/* ----------------------------- SPRITE PICTURE ----------------------------- */
Alias.Sprite_Picture_loadBitmap = Sprite_Picture.prototype.loadBitmap
Sprite_Picture.prototype.loadBitmap = function(){
    Alias.Sprite_Picture_loadBitmap.call(this)
    this.addBitmapLoadListener()
}

Sprite_Picture.prototype.addBitmapLoadListener = function(){
    this.bitmap.addLoadListener(() => {
        this.onBitmapLoad()
    })
}

Sprite_Picture.prototype.onBitmapLoad = function(){}

/* ---------------------------- SPRITE BATTLEBACK --------------------------- */
Alias.Sprite_Battleback_initialize = Sprite_Battleback.prototype.initialize
Sprite_Battleback.prototype.initialize = function(type) {
    Alias.Sprite_Battleback_initialize.call(this, type)
    this.checkForBitmap(type)
}

Sprite_Battleback.prototype.checkForBitmap = function(type){
    if(this.bitmap){ // Fix for Visu Visual Battle Env
        this.bitmap.addLoadListener(() => {
            this.onBitmapLoad(type)
        })
    }
}

Sprite_Battleback.prototype.onBitmapLoad = function(type){}

/* ========================================================================== */
/*                                   WINDOW                                   */
/* ========================================================================== */

/* ------------------------------- WINDOW BASE ------------------------------ */
Alias.Window_Base_setBackgroundType = Window_Base.prototype.setBackgroundType
Window_Base.prototype.setBackgroundType = function(type){
    if(type >= 3){
        this.showExtraBackgroundDimmer(type)
    }else{
        Alias.Window_Base_setBackgroundType.call(this, type)
    }
}

Window_Base.prototype.showExtraBackgroundDimmer = function(type) {
    this.opacity = 0
    if (!this._dimmerSprite) {
        this.createDimmerSprite()
    }
    const bitmap = this._dimmerSprite.bitmap
    if (bitmap.width !== this.width || bitmap.height !== this.height) {
        this.refreshExtraBackgroundDimmer(type)
    }
    this._dimmerSprite.visible = true
    this.updateBackgroundDimmer()
}

Window_Base.prototype.refreshExtraBackgroundDimmer = function(type) {
    const options = {
        3: "createStrongBackground",
        4: "createLightGradientVerticalBackground",
        5: "createFadedHorizontalBackground",
    }
    const func = options[type]

    if(this[func]){
        this[func]()
    }else{
        this.hideBackgroundDimmer()
    }
}

Window_Base.prototype.getTextSize = function(rawText){
    return this.textSizeEx(rawText.substring(0))
}

Window_Base.prototype.getTextWidth = function(rawText){
    return this.textSizeEx(rawText.substring(0)).width
}

Window_Base.prototype.getTextHeight = function(rawText){
    return this.textSizeEx(rawText.substring(0)).height
}

Window_Base.prototype.createStrongBackground = function(){
    const bitmap = this._dimmerSprite.bitmap
    const width = this.width > 0 ? this.width + 8 : 0
    const height = this.height
    const margin = this.padding
    const color1 = ColorManager.dimColor1()
    const color2 = ColorManager.dimColor2()

    bitmap.resize(width, height)
    bitmap.fillRect(0, margin, width, height - margin * 2, color1)
    this._dimmerSprite.setFrame(0, 0, width, height)
}

Window_Base.prototype.createLightGradientVerticalBackground = function(){
    const bitmap = this._dimmerSprite.bitmap
    const margin = this.padding
    const width = this.width > 0 ? this.width + 8 : 0
    const height = this.height
    const color1 = "rgba(0, 0, 0, 0.7)"
    const color2 = ColorManager.dimColor2()
    const gradHeight = (height - margin * 2)/2
    
    bitmap.resize(width, height)
    bitmap.gradientFillRect(0, margin, width, gradHeight, color1, color2, true)
    //bitmap.fillRect(0, margin, width, height - margin * 2, color1)
    bitmap.gradientFillRect(0, margin + gradHeight, width, gradHeight, color2, color1, true)
    this._dimmerSprite.setFrame(0, 0, width, height)
}

Window_Base.prototype.createFadedHorizontalBackground = function(){
    const bitmap = this._dimmerSprite.bitmap
    const width = this.width > 0 ? this.width + 8 : 0
    const height = this.height
    const margin = this.padding
    const color1 = ColorManager.dimColor1()
    const color2 = ColorManager.dimColor2()

    bitmap.resize(width, height)
    bitmap.gradientFillRect(0, margin, width + width/2, height - margin * 2, color1, color2, false)
    this._dimmerSprite.setFrame(0, 0, width, height)
}

Window_Base.prototype.getItemPadding = function(){
    return this.itemPadding()
}

Window_Base.prototype.getTextLineRect = function(index){
    // The equivalent for MV itemRectForText whould be itemRectWithPadding.
    // But MZ only uses that a few times..
    return this.itemLineRect(index)
}

Window_Base.prototype.updateHorizontalOpenness = function(widthAlign){
    switch(widthAlign){
        case "Left to Right":
            this._container.scale.x = this._openness / 255
            this._container.x = (1 - this._openness / 255)
            break
        case "Centered":
            this._container.scale.x = this._openness / 255
            this._container.x = (this.width / 2) * (1 - this._openness / 255)
            break
        case "Right to Left":
            this._container.scale.x = this._openness / 255
            this._container.x = this.width * (1 - this._openness / 255)
            break
        default:
            this._container.scale.x = 1
            this._container.x = 0
    }
}

Window_Base.prototype.updateVerticalOpenness = function(heightAlign){
    switch(heightAlign){
        case "Top to Bottom":
            this._container.scale.y = this._openness / 255
            this._container.y = (1 - this._openness / 255)
            break
        case "Centered":
            this._container.scale.y = this._openness / 255
            this._container.y = (this.height / 2) * (1 - this._openness / 255)
            break
        case "Bottom to Top":
            this._container.scale.y = this._openness / 255
            this._container.y = this.height * (1 - this._openness / 255)
            break
        default:
            this._container.scale.y = 1
            this._container.y = 0
    }
}


/* ----------------------------- WINDOW MESSAGE ----------------------------- */
Alias.Window_Message_initMembers = Window_Message.prototype.initMembers
Window_Message.prototype.initMembers = function(){
    Alias.Window_Message_initMembers.call(this)
    this.initEliBookMembers()
}

Window_Message.prototype.initEliBookMembers = function(){
    this.isRunning = false
}

Alias.Window_Message_startMessage = Window_Message.prototype.startMessage
Window_Message.prototype.startMessage = function(){
    Alias.Window_Message_startMessage.call(this)
    this.startFirstMessage()
}

Window_Message.prototype.startFirstMessage = function(){
    if(!this.isRunning){
        this.onFirstMessage()
    }
}

Window_Message.prototype.onFirstMessage = function(){
    this.isRunning = true
}

Alias.Window_Message_terminateMessage = Window_Message.prototype.terminateMessage
Window_Message.prototype.terminateMessage = function(){
    Alias.Window_Message_terminateMessage.call(this)
    this.terminateLastMessage()
}

Window_Message.prototype.terminateLastMessage = function(){
    if(this.hasNoMessageToShow()){
        this.onLastMessage()
    }
}

Window_Message.prototype.hasNoMessageToShow = function(){
    if($gameMessage.getInterpreter()){
        return !$gameMessage.getInterpreter().isOnMessage() && this.isOpen()
    }else{
        return true
    }
}

Window_Message.prototype.onLastMessage = function(){
    this.isRunning = false
    
}

/* ------------------------------ CHOICE WINDOW ----------------------------- */
Alias.Window_ChoiceList_close = Window_ChoiceList.prototype.close
Window_ChoiceList.prototype.close = function() {
    Alias.Window_ChoiceList_close.call(this)
    this.clearMessageEventIds()
}

Window_ChoiceList.prototype.clearMessageEventIds = function() {
    $gameMessage.clearEventIds()
}

/* ------------------------------- SCROLL TEXT ------------------------------ */
Alias.Window_ScrollText_close = Window_ScrollText.prototype.close
Window_ScrollText.prototype.close = function() {
    Alias.Window_ScrollText_close.call(this)
    this.clearMessageEventIds()
}

Window_ScrollText.prototype.clearMessageEventIds = function() {
    $gameMessage.clearEventIds()
}

}