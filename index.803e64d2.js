function t(t){return t&&t.__esModule?t.default:t}var e,s,i,a,r,h=globalThis,o={},n={},l=h.parcelRequired258;null==l&&((l=function(t){if(t in o)return o[t].exports;if(t in n){var e=n[t];delete n[t];var s={id:t,exports:{}};return o[t]=s,e.call(s.exports,s,s.exports),s.exports}var i=Error("Cannot find module '"+t+"'");throw i.code="MODULE_NOT_FOUND",i}).register=function(t,e){n[t]=e},h.parcelRequired258=l),(0,l.register)("dRo73",function(t,e){Object.defineProperty(t.exports,"register",{get:()=>s,set:t=>s=t,enumerable:!0,configurable:!0});var s,i=new Map;s=function(t,e){for(var s=0;s<e.length-1;s+=2)i.set(e[s],{baseUrl:t,path:e[s+1]})}}),l("dRo73").register(new URL("",import.meta.url).toString(),JSON.parse('["50T4R","index.803e64d2.js","izIfw","stockholm_map.2976de6e.png","8iljz","zombie_spritesheet.cc0599cc.png","4SA1F","mami_spritesheet.b49e3f9a.png","bQWk6","papi_spritesheet.5fe8d860.png","fyi2M","ahlens_map.e96a496f.png","l8cJ8","player.8afcec90.png","9iMz8","sheath_upper_body_spritesheet-Sheet.8e4fb366.png","ic9tz","sprint_sheathed_upper_body_sprites-Sheet.dc979dd3.png","iBEtK","walking_equipped_upper_body_sprites-Sheet.ff7d06b8.png","dVSfy","stale_sheathed_upper_body.da9d3a63.png","lUSVs","stale_equipped_upper_body.29fdfd6b.png","7uTuz","walking_equipped_legs_sprites-Sheet.95249350.png","dQRQ3","stale_legs.8e2974fd.png"]'));var p={};p=new URL("stockholm_map.2976de6e.png",import.meta.url).toString();const c=(t,e)=>{let s=Math.ceil(t);return Math.floor(Math.random()*(Math.floor(e)-s+1)+s)};s=class{position;size;rotation;constructor(t,e,s=0){this.position=t,this.size=e,this.rotation=s}distanceTo(t){return Math.sqrt(Math.pow(this.position.x-t.x,2)+Math.pow(this.position.y-t.y,2))}draw(t,e){throw Error("#draw not implemented yet!")}};const d={archeologist:{type:"archeologist",skills:[{name:"Hit",validTarget:["enemy"],numberOfTargets:1,generateSkillEffect:({multiplier:t=0,fixedBonus:e=0})=>({type:"damage",points:10*t+e}),unlockLvl:1},{name:"Throw Dirt",validTarget:["enemy"],numberOfTargets:1,generateSkillEffect:()=>({type:"blind",duration:2}),unlockLvl:1},{name:"Examine",validTarget:["enemy"],numberOfTargets:-1,generateSkillEffect:()=>({type:"weaken",duration:1}),unlockLvl:2},{name:"Dig",validTarget:["allies"],numberOfTargets:1,generateSkillEffect:()=>({type:"evade",duration:2}),unlockLvl:3}]},medic:{type:"medic",skills:[{name:"Stitch",validTarget:["allies","self"],numberOfTargets:1,generateSkillEffect:()=>({type:"heal",points:15}),unlockLvl:1},{name:"Cut",validTarget:["enemy"],numberOfTargets:1,generateSkillEffect:({multiplier:t=0,fixedBonus:e=0})=>({type:"damage",points:15*t+e}),unlockLvl:1},{name:"Drain Blood",validTarget:["enemy"],numberOfTargets:1,generateSkillEffect:()=>({type:"bleed",points:10,duration:3}),unlockLvl:2},{name:"Restrain",validTarget:["enemy"],numberOfTargets:1,generateSkillEffect:()=>({type:"snare",duration:1}),unlockLvl:3},{name:"Drug",validTarget:["enemy"],numberOfTargets:2,generateSkillEffect:()=>({type:"confuse",duration:1}),unlockLvl:4}]},zombie:{type:"zombie",skills:[{name:"Scratch",validTarget:["enemy"],numberOfTargets:1,generateSkillEffect:({multiplier:t=0,fixedBonus:e=0})=>({type:"damage",points:15*t+e}),unlockLvl:1}]}};var m={};m=new URL("zombie_spritesheet.cc0599cc.png",import.meta.url).toString();class g extends s{lvl;size={height:100,width:100};name="Zombie";role=d.zombie;hp;stats;effects=[];spritesheet=new Image;constructor(e,s,i=0,a={height:50,width:50}){super(s,a,i),this.lvl=e,this.spritesheet.src=t(m);let r=this.generateStatsFromLvl(e);this.hp=r.maxHp,this.stats=r}generateStatsFromLvl(t){return{maxHp:40*t,maxStamina:40*t,strength:1*t,intelligence:1*t,hitRate:1-.4*t,dodgeChance:1-.9*t}}draw({ctx:t,offsetX:e=0,offsetY:s=0},i=!1){if(t.save(),t.translate(e,s),t.imageSmoothingEnabled=!1,i){t.shadowColor="yellow",t.shadowBlur=0;let e=[-2,2];for(let s=0;s<e.length;s++){t.shadowOffsetX=e[s];for(let s=0;s<e.length;s++)t.shadowOffsetY=e[s],t.drawImage(this.spritesheet,this.position.x-this.size.width/2,this.position.y-this.size.height,this.size.width,this.size.height)}}t.drawImage(this.spritesheet,this.position.x-this.size.width/2,this.position.y-this.size.height,this.size.width,this.size.height),t.resetTransform(),t.restore()}}var u={};u=new URL("mami_spritesheet.b49e3f9a.png",import.meta.url).toString();class f extends s{lvl;stats;name="Mami";role=d.medic;hp;effects=[];spritesheet=new Image;constructor(e,s,i,a=0,r={height:96,width:96}){super(i,r,a),this.lvl=e,this.stats=s,this.spritesheet.src=t(u),this.hp=s.maxHp}draw({ctx:t,offsetX:e=0,offsetY:s=0},i=!1){if(t.save(),t.translate(e,s),t.imageSmoothingEnabled=!1,i){t.shadowColor="yellow",t.shadowBlur=0;let e=[-2,2];for(let s=0;s<e.length;s++){t.shadowOffsetX=e[s];for(let s=0;s<e.length;s++)t.shadowOffsetY=e[s],t.drawImage(this.spritesheet,this.position.x-this.size.width/2,this.position.y-this.size.height,this.size.width,this.size.height)}}t.drawImage(this.spritesheet,this.position.x-this.size.width/2,this.position.y-this.size.height,this.size.width,this.size.height),t.resetTransform(),t.restore()}}var y={};y=new URL("papi_spritesheet.5fe8d860.png",import.meta.url).toString();class S extends s{lvl;stats;name="Papi";role=d.archeologist;hp;effects=[];spritesheet=new Image;constructor(e,s,i,a=0,r={height:96,width:96}){super(i,r,a),this.lvl=e,this.stats=s,this.spritesheet.src=t(y),this.hp=s.maxHp}draw({ctx:t,offsetX:e=0,offsetY:s=0},i=!1){if(t.save(),t.translate(e,s),t.imageSmoothingEnabled=!1,i){t.shadowColor="yellow",t.shadowBlur=0;let e=[-2,2];for(let s=0;s<e.length;s++){t.shadowOffsetX=e[s];for(let s=0;s<e.length;s++)t.shadowOffsetY=e[s],t.drawImage(this.spritesheet,this.position.x-this.size.width/2,this.position.y-this.size.height,this.size.width,this.size.height)}}t.drawImage(this.spritesheet,this.position.x-this.size.width/2,this.position.y-this.size.height,this.size.width,this.size.height),t.resetTransform(),t.restore()}}class w{background;foes;players;constructor(t,e,s){this.background=s,this.foes=this.generateFoes(t,e.foes),this.players=this.generatePlayers(t,e.players)}generateFoes(t,e){let s=c(e.min,e.max),i=[];for(let t=0;t<s;t++){let t=Math.floor(Math.random()*e.types.length),s=e.types[t];if(!s)continue;let a=c(s.lvl.min,s.lvl.max);i.push({type:s.type,lvl:a})}let a=t.gameHeight/3,r=i.length%3==0?3:i.length%3;return i.map((t,e)=>{let s=Math.floor(e/3)+1,h=Math.ceil(i.length/3)===s?r:3,o=a/h;switch(t.type){case"zombie":case"brute":return new g(t.lvl,{x:40+70*s-e%3*(60/h),y:e%3*o+o/2+2*a})}})}generatePlayers(t,e){let s=t.gameHeight/3,i=e.length%3==0?3:e.length%3;return e.map((a,r)=>{let h=Math.floor(r/3)+1,o=Math.ceil(e.length/3)===h?i:3,n=s/o,l=r%3*n+n/2+2*s,p=t.gameWidth-70*h-r%3*(60/o);switch(a.name){case"mami":return new f(a.lvl,a.stats,{x:p,y:l});case"papi":return new S(a.lvl,a.stats,{x:p,y:l})}})}drawBackground({game:t,ctx:e,offsetX:s=0,offsetY:i=0}){let a=Math.min(t.gameWidth/this.background.width,t.gameHeight/this.background.height),r=(t.gameWidth-this.background.width*a)/2,h=(t.gameHeight-this.background.height*a)/2;e.translate(s,i),e.drawImage(this.background,0,0,this.background.width,this.background.height,r,h,this.background.width*a,this.background.height*a),e.resetTransform()}}var k={};k=new URL("ahlens_map.e96a496f.png",import.meta.url).toString();class b extends w{constructor(e,s){let i=new Image;i.src=t(k),super(e,{players:s,foes:{min:3,max:4,types:[{type:"zombie",lvl:{min:1,max:2}},{type:"brute",lvl:{min:1,max:2}}]}},i)}}(e=i||(i={}))[e.BATTLE=0]="BATTLE";class x{texture;stops=[{type:i.BATTLE,setupBattle:t=>new b(t.game,t.players),x:577,y:206},{type:i.BATTLE,setupBattle:t=>new b(t.game,t.players),x:548,y:252},{type:i.BATTLE,setupBattle:t=>new b(t.game,t.players),x:467,y:310},{type:i.BATTLE,setupBattle:t=>new b(t.game,t.players),x:493,y:376},{type:i.BATTLE,setupBattle:t=>new b(t.game,t.players),x:335,y:384},{type:i.BATTLE,setupBattle:t=>new b(t.game,t.players),x:362,y:460},{type:i.BATTLE,setupBattle:t=>new b(t.game,t.players),x:430,y:452}];currentStop=this.stops[0];player={originPos:{x:this.stops[0].x,y:this.stops[0].y},queue:[]};constructor(){let e=new Image;e.src=t(p),this.texture=e}}var v={};v=new URL("player.8afcec90.png",import.meta.url).toString(),a=class{constructor(){}};class T extends a{x;y;constructor(t,e){super(),this.x=t,this.y=e}magnitude(){return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2))}dot(t){return this.x*t.x+this.y*t.y}norm(){return{x:this.x/this.magnitude(),y:this.y/this.magnitude()}}normalize(){let t=this.norm();return new T(t.x,t.y)}}const _=["up","left","down","right","esc","enter"];class E{game;map=new x;playerTexture;constructor(e){this.game=e;let s=new Image;s.src=t(v),this.playerTexture=s}update(t){if(_.some(t=>this.game.input.has(t))&&this.game.input.forEach(t=>{let e=this.map.stops.indexOf(this.map.currentStop),s=this.map.stops.length-1===e?null:{stop:this.map.stops[e+1],vectorTo:new T(this.map.stops[e+1].x-this.map.currentStop.x,this.map.stops[e+1].y-this.map.currentStop.y)},i=0===e?null:{stop:this.map.stops[e-1],vectorTo:new T(this.map.stops[e-1].x-this.map.currentStop.x,this.map.stops[e-1].y-this.map.currentStop.y)};switch(t){case"up":(s&&s.vectorTo.y<0||i&&i.vectorTo.y<0)&&(s&&i?s.vectorTo.norm().y<i.vectorTo.norm().y?this.map.currentStop=s.stop:this.map.currentStop=i.stop:s?this.map.currentStop=s.stop:i&&(this.map.currentStop=i.stop));break;case"down":(s&&s.vectorTo.y>0||i&&i.vectorTo.y>0)&&(s&&i?s.vectorTo.norm().y>i.vectorTo.norm().y?this.map.currentStop=s.stop:this.map.currentStop=i.stop:s?this.map.currentStop=s.stop:i&&(this.map.currentStop=i.stop));break;case"left":(s&&s.vectorTo.x<0||i&&i.vectorTo.x<0)&&(s&&i?s.vectorTo.norm().x<i.vectorTo.norm().x?this.map.currentStop=s.stop:this.map.currentStop=i.stop:s?this.map.currentStop=s.stop:i&&(this.map.currentStop=i.stop));break;case"right":(s&&s.vectorTo.x>0||i&&i.vectorTo.x>0)&&(s&&i?s.vectorTo.norm().x>i.vectorTo.norm().x?this.map.currentStop=s.stop:this.map.currentStop=i.stop:s?this.map.currentStop=s.stop:i&&(this.map.currentStop=i.stop));break;case"esc":this.game.state="PAUSE_SCREEN",this.game.pauseScreen.show();break;case"enter":{let t=this.map.currentStop.setupBattle({game:this.game,players:this.game.players});this.game.battleSystem.battle.active=t,this.game.state="BATTLE_SCENE"}}let a=this.map.player.queue.indexOf(this.map.currentStop);a>=0?this.map.player.queue=this.map.player.queue.slice(0,a+1):(this.map.currentStop.x!==this.map.player.originPos.x||this.map.currentStop.y!==this.map.player.originPos.y)&&this.map.player.queue.push(this.map.currentStop)}),0!==this.map.player.queue.length){let e=new T(this.map.player.queue[0].x-this.map.player.originPos.x,this.map.player.queue[0].y-this.map.player.originPos.y),s=e.norm(),i=new T(170*s.x*t,170*s.y*t);i.magnitude()>e.magnitude()?(this.map.player.originPos.x=this.map.player.queue[0].x,this.map.player.originPos.y=this.map.player.queue[0].y,this.map.player.queue.shift()):(this.map.player.originPos.x+=i.x,this.map.player.originPos.y+=i.y)}}draw(t){let e=Math.min(this.game.gameWidth/this.map.texture.width,this.game.gameHeight/this.map.texture.height),s=(this.game.gameWidth-this.map.texture.width*e)/2,i=(this.game.gameHeight-this.map.texture.height*e)/2;t.clearRect(0,0,this.game.gameWidth,this.game.gameHeight),t.drawImage(this.map.texture,0,0,this.map.texture.width,this.map.texture.height,s,i,this.map.texture.width*e,this.map.texture.height*e);for(let e=0;e<this.map.stops.length;e++)this.map.stops[e+1]&&(t.save(),t.beginPath(),t.setLineDash([5,3]),t.moveTo(this.map.stops[e].x+s,this.map.stops[e].y+i),t.lineTo(this.map.stops[e+1].x+s,this.map.stops[e+1].y+i),t.lineWidth=3,t.stroke(),t.restore()),t.save(),t.fillStyle=this.map.currentStop===this.map.stops[e]?"red":"orange",t.beginPath(),t.arc(this.map.stops[e].x+s,this.map.stops[e].y+i,5,0,2*Math.PI),t.fill(),t.restore();t.drawImage(this.playerTexture,this.map.player.originPos.x+s-17.5,this.map.player.originPos.y+i-40,35,35)}}const M=t=>{let e=document.getElementById(t);if(null===e)throw Error(`Could not find element with id ${t}`);return e},R=M("pauseScreen"),L=M("options"),A=["up","left","down","right","enter","esc"];class H{game;options=[{id:"continue",text:"Continue"},{id:"map",text:"Map"},{id:"settings",text:"Settings"},{id:"credits",text:"Credits"}];selectedOption="continue";constructor(t){this.game=t;let e=M("options");for(let t of this.options){let s=document.createElement("span");t.id===this.selectedOption&&s.setAttribute("data-selected","selected"),s.setAttribute("data-optionId",t.id),s.textContent=t.text,s.addEventListener("mouseenter",()=>{this.handleSwitchSelectedOption(()=>t)}),s.addEventListener("click",()=>{this.handleSubmitOption()}),e.appendChild(s)}}show(){R.style.display="flex"}hide(){R.style.display="none"}handleSwitchSelectedOption(t){let e=L.querySelector("[data-selected='selected']");if(e){e.removeAttribute("data-selected");let s=e.getAttribute("data-optionId"),i=this.options.findIndex(t=>t.id===s),a=t(-1===i?null:i),r=L.querySelector(`[data-optionId='${a.id}']`);r&&(this.selectedOption=a.id,r.setAttribute("data-selected","selected"))}}handleSubmitOption(){switch(this.selectedOption){case"continue":this.hide(),this.game.state="RUNNING";break;case"map":this.hide(),this.game.state="MAP_SCREEN"}}update(){A.some(t=>this.game.input.has(t))&&this.game.input.forEach(t=>{switch(t){case"up":this.handleSwitchSelectedOption(t=>0===t||null===t?this.options[this.options.length-1]:this.options[t-1]);break;case"down":this.handleSwitchSelectedOption(t=>t===this.options.length-1||null===t?this.options[0]:this.options[t+1]);break;case"esc":this.hide(),this.game.state="RUNNING";break;case"enter":this.handleSubmitOption()}})}}const I=["up","left","down","right","esc","enter"];class B{game;battle={active:null,queue:[]};state={name:"SLEEP"};animations=[{type:"commence-battle",durationMs:1200,timePassedMs:0}];constructor(t){this.game=t}update(t){if(this.battle.active&&(this.updateAnimations(t).deleted.some(t=>"commence-battle"===t.type)&&(this.state=this.calculateNextState(this.battle.active)),I.some(t=>this.game.input.has(t))))for(let t of this.game.input)switch(this.state.name){case"SLEEP":case"ENEMY_TURN":break;case"PLAYER_SELECT_SKILL":switch(t){case"up":{let t=this.mapToSkillSet(this.state.characterTurn.role.skills),e=this.state.focusedSkill,s=t.find(t=>t.some(t=>t===e));if(!s)throw Error("#columnWithFocusedSkill is undefined");let i=s.indexOf(e),a=s.at(i-1);a&&(this.state.focusedSkill=a);break}case"down":{let t=this.mapToSkillSet(this.state.characterTurn.role.skills),e=this.state.focusedSkill,s=t.find(t=>t.some(t=>t===e));if(!s)throw Error("#columnWithFocusedSkill is undefined");let i=s.indexOf(e),a=s.at(i-2+1);a&&(this.state.focusedSkill=a);break}case"left":{let t=this.mapToSkillSet(this.state.characterTurn.role.skills),e=this.state.focusedSkill,s=t.find(t=>t.some(t=>t===e));if(!s)throw Error("#columnWithFocusedSkill is undefined");let i=t.findIndex(t=>t.some(t=>t===e)),a=s.indexOf(e),r=t.at(i-1)?.at(a);r&&(this.state.focusedSkill=r);break}case"right":{let t=this.mapToSkillSet(this.state.characterTurn.role.skills),e=this.state.focusedSkill,s=t.find(t=>t.some(t=>t===e));if(!s)throw Error("#columnWithFocusedSkill is undefined");let i=t.findIndex(t=>t.some(t=>t===e)),a=s.indexOf(e),r=t.at(i-t.length)?.at(a);r&&(this.state.focusedSkill=r);break}case"esc":this.game.state="PAUSE_SCREEN",this.game.pauseScreen.show();break;case"enter":this.state={name:"PLAYER_SELECT_TARGET",characterTurn:this.state.characterTurn,selectedSkill:this.state.focusedSkill,selectedTargets:[],focusedTarget:this.battle.active.foes[0]}}break;case"PLAYER_SELECT_TARGET":{let e=[...this.battle.active.players,...this.battle.active.foes],s=e.indexOf(this.state.focusedTarget),[i]=e.splice(s,1);if(!i)throw Error("#currentlySelectedTarget is undefined!");let a=e.map(t=>({target:t,vectorTo:new T(t.position.x-i.position.x,t.position.y-i.position.y)}));switch(t){case"up":{let t=a.filter(t=>{let e=t.vectorTo.norm();return Math.abs(e.y)>Math.abs(e.x)}).filter(t=>t.vectorTo.y<0);if(0===t.length)break;let[e]=t.sort((t,e)=>t.vectorTo.magnitude()-e.vectorTo.magnitude());this.state.focusedTarget=e.target;break}case"down":{let t=a.filter(t=>{let e=t.vectorTo.norm();return Math.abs(e.y)>Math.abs(e.x)}).filter(t=>t.vectorTo.y>0);if(0===t.length)break;let[e]=t.sort((t,e)=>t.vectorTo.magnitude()-e.vectorTo.magnitude());this.state.focusedTarget=e.target;break}case"left":{let t=a.filter(t=>{let e=t.vectorTo.norm();return Math.abs(e.x)>Math.abs(e.y)}).filter(t=>t.vectorTo.x<0);if(0===t.length)break;let[e]=t.sort((t,e)=>t.vectorTo.magnitude()-e.vectorTo.magnitude());this.state.focusedTarget=e.target;break}case"right":{let t=a.filter(t=>{let e=t.vectorTo.norm();return Math.abs(e.x)>Math.abs(e.y)}).filter(t=>t.vectorTo.x>0);if(0===t.length)break;let[e]=t.sort((t,e)=>t.vectorTo.magnitude()-e.vectorTo.magnitude());this.state.focusedTarget=e.target;break}case"enter":this.state.selectedTargets.push(this.state.focusedTarget),this.state.selectedTargets.length>=2&&this.executeAction(this.state);break;case"esc":this.game.state="PAUSE_SCREEN",this.game.pauseScreen.show()}}}}updateAnimations(t){this.animations=this.animations.map(e=>({...e,timePassedMs:e.timePassedMs+1e3*t}));let e=this.animations.reduce((t,e)=>e.timePassedMs>=e.durationMs?{...t,finished:[...t.finished,e]}:{...t,inProgress:[...t.inProgress,e]},{inProgress:[],finished:[]});return this.animations=e.inProgress,{deleted:e.finished}}calculateNextState(t){let e=t.players[0],s=e.role.skills;return{name:"PLAYER_SELECT_SKILL",characterTurn:e,focusedSkill:s[0]}}mapToSkillSet(t){let e=Array(t.length%2==0?t.length:t.length+t.length%2).fill(null);for(let s=0;s<e.length;s++)t[s]&&(e[s]=t[s]);let s=e.length/2,i=[];for(let t=0;t<s;t++)i.push(e.slice(2*t,2));return i}executeAction(t){t.selectedTargets.forEach(e=>{e.effects.push(t.selectedSkill.generateSkillEffect({}))})}draw(t){if(this.battle.active){if(t.clearRect(0,0,this.game.gameWidth,this.game.gameHeight),!this.animations.some(t=>"commence-battle"===t.type))for(let e of(t.imageSmoothingEnabled=!1,this.battle.active.drawBackground({ctx:t,game:this.game}),[...this.battle.active.foes,...this.battle.active.players])){let s="PLAYER_SELECT_TARGET"===this.state.name&&this.state.focusedTarget===e;e.draw({ctx:t},s)}for(let e of this.animations){let s=Math.min(e.timePassedMs/e.durationMs,1);if("commence-battle"===e.type){let e=this.game.gameWidth*s-this.game.gameWidth;t.imageSmoothingEnabled=!1,this.battle.active.drawBackground({ctx:t,game:this.game,offsetX:-e,offsetY:0});let i=this.game.gameWidth-this.game.gameWidth*s;for(let e of[...this.battle.active.foes,...this.battle.active.players])e.draw({ctx:t,offsetX:-i,offsetY:0})}}if("PLAYER_SELECT_SKILL"===this.state.name){let e=this.mapToSkillSet(this.state.characterTurn.role.skills);for(let s=0;s<e.length;s++)for(let i=0;i<2;i++){let a=this.game.gameWidth/e.length;t.save(),t.fillStyle="lightgray",t.lineWidth=5,t.strokeStyle="black",t.fillRect(a*s,50*i,a,50),t.strokeRect(a*s+2.5,50*i+2.5,a-5,45),t.restore();let r=e[s][i];r&&(t.save(),t.font="30px serif",t.textAlign="center",t.fillStyle="black",t.fillText(r.name,a*s+a/2,50*i+40),t.restore())}for(let s=0;s<e.length;s++)for(let i=0;i<2;i++){let a=this.game.gameWidth/e.length;t.save(),t.lineWidth=5,t.strokeStyle="red",e[s][i]===this.state.focusedSkill&&t.strokeRect(a*s+2.5,50*i+2.5,a-5,45),t.restore()}}}}}var P={};P=new URL("sheath_upper_body_spritesheet-Sheet.8e4fb366.png",import.meta.url).toString();var z={};z=new URL("sprint_sheathed_upper_body_sprites-Sheet.dc979dd3.png",import.meta.url).toString();var O={};O=new URL("walking_equipped_upper_body_sprites-Sheet.ff7d06b8.png",import.meta.url).toString();var F={};F=new URL("stale_sheathed_upper_body.da9d3a63.png",import.meta.url).toString();var q={};q=new URL("stale_equipped_upper_body.29fdfd6b.png",import.meta.url).toString();var C={};C=new URL("walking_equipped_legs_sprites-Sheet.95249350.png",import.meta.url).toString();var U={};U=new URL("stale_legs.8e2974fd.png",import.meta.url).toString();class W extends s{vector=new T(0,0);direction="right";isSheathed=!1;action={duck:{state:"not-in-use",progressMs:0},walk:{state:"not-in-use",progressMs:0},fall:{state:"not-in-use",progressMs:0},sheath:{state:"not-in-use",progressMs:0}};sheathBodySheet=new Image;walkingBodySheet=new Image;sprintSheathedBodySheet=new Image;staleSheathedBodySprite=new Image;staleEquippedBodySprite=new Image;walkingLegsSheet=new Image;staleLegsSprite=new Image;constructor(e,s=0,i={height:28,width:17}){super(e,i,s),this.sheathBodySheet.src=t(P),this.walkingBodySheet.src=t(O),this.sprintSheathedBodySheet.src=t(z),this.staleSheathedBodySprite.src=t(F),this.staleEquippedBodySprite.src=t(q),this.walkingLegsSheet.src=t(C),this.staleLegsSprite.src=t(U)}update(t,e){for(let s of(e.some(t=>"duck"===t)||(this.action.duck.progressMs=0,this.action.duck.state="not-in-use"),e.some(t=>"move"===t)||(this.action.walk.state="not-in-use",this.action.walk.progressMs=0),"in-use"===this.action.sheath.state&&(this.action.sheath.progressMs+1e3*t>750?(this.action.sheath.progressMs=0,this.action.sheath.state="not-in-use"):this.action.sheath.progressMs+=1e3*t,e.some(t=>"sheath"===t)&&e.splice(e.indexOf("sheath"),1)),this.action.fall.state="not-in-use",this.action.fall.progressMs=0,e))"move"===s&&(0!==this.vector.x&&(this.vector.x>0?this.direction="right":this.direction="left"),this.action.walk.state="in-use",this.action.walk.progressMs+=1e3*t),"sheath"===s&&(this.isSheathed=!this.isSheathed,this.action.sheath.progressMs+=1e3*t,this.action.sheath.state="in-use"),"duck"===s&&(this.action.duck.progressMs+=1e3*t,this.action.duck.state=this.action.duck.progressMs>=1200?"complete":"in-use");this.position.x+=this.vector.x*t,this.position.y+=this.vector.y*t}draw({ctx:t}){switch(t.save(),t.imageSmoothingEnabled=!1,"right"===this.direction&&t.scale(-1,1),!0){case"in-use"===this.action.fall.state:break;case"in-use"===this.action.sheath.state:{let e=this.action.sheath.progressMs>750?this.action.sheath.progressMs%750/750:this.action.sheath.progressMs/750,s=this.isSheathed?Math.floor(15*e):14-Math.floor(15*e);switch(this.direction){case"left":t.drawImage(this.sheathBodySheet,17*s,0,17,28,this.position.x-85,this.position.y-280,170,280);break;case"right":t.drawImage(this.sheathBodySheet,17*s,0,17,28,-this.position.x-85,this.position.y-280,170,280)}break}case"in-use"===this.action.walk.state&&this.isSheathed&&"not-in-use"===this.action.sheath.state:{let e=Math.floor((this.action.walk.progressMs>600?this.action.walk.progressMs%600/600:this.action.walk.progressMs/600)*10);switch(this.direction){case"left":t.drawImage(this.sprintSheathedBodySheet,17*e,0,17,28,this.position.x-85,this.position.y-280,170,280);break;case"right":t.drawImage(this.sprintSheathedBodySheet,17*e,0,17,28,-this.position.x-85,this.position.y-280,170,280)}break}case"in-use"===this.action.walk.state:{let e=Math.floor((this.action.walk.progressMs>1125?this.action.walk.progressMs%1125/1125:this.action.walk.progressMs/1125)*9);switch(this.direction){case"left":t.drawImage(this.walkingBodySheet,17*e,0,17,28,this.position.x-85,this.position.y-280,170,280);break;case"right":t.drawImage(this.walkingBodySheet,17*e,0,17,28,-this.position.x-85,this.position.y-280,170,280)}break}default:switch(this.direction){case"left":t.drawImage(this.isSheathed?this.staleSheathedBodySprite:this.staleEquippedBodySprite,0,0,17,28,this.position.x-85,this.position.y-280,170,280);break;case"right":t.drawImage(this.isSheathed?this.staleSheathedBodySprite:this.staleEquippedBodySprite,0,0,17,28,-this.position.x-85,this.position.y-280,170,280)}}switch(!0){case"in-use"===this.action.fall.state:break;case"in-use"===this.action.walk.state&&this.isSheathed&&"not-in-use"===this.action.sheath.state:{let e=Math.floor((this.action.walk.progressMs>550?this.action.walk.progressMs%550/550:this.action.walk.progressMs/550)*9);switch(this.direction){case"left":t.drawImage(this.walkingLegsSheet,17*e,0,17,28,this.position.x-85,this.position.y-280,170,280);break;case"right":t.drawImage(this.walkingLegsSheet,17*e,0,17,28,-this.position.x-85,this.position.y-280,170,280)}break}case"in-use"===this.action.walk.state:{let e=Math.floor((this.action.walk.progressMs>1125?this.action.walk.progressMs%1125/1125:this.action.walk.progressMs/1125)*9);switch(this.direction){case"left":t.drawImage(this.walkingLegsSheet,17*e,0,17,28,this.position.x-85,this.position.y-280,170,280);break;case"right":t.drawImage(this.walkingLegsSheet,17*e,0,17,28,-this.position.x-85,this.position.y-280,170,280)}break}default:switch(this.direction){case"left":t.drawImage(this.staleLegsSprite,0,0,17,28,this.position.x-85,this.position.y-280,170,280);break;case"right":t.drawImage(this.staleLegsSprite,0,0,17,28,-this.position.x-85,this.position.y-280,170,280)}}t.restore()}}const N=["left","right","down","up"];class Y{game;player;constructor(t){this.game=t,this.player=new W({x:t.gameWidth/2,y:t.gameHeight/2},0)}update(t){let e=[];if(this.game.input.has("left")||this.game.input.has("right")||(this.player.vector.x=0),N.some(t=>this.game.input.has(t)))for(let t of this.game.input)switch(t){case"left":{let t="in-use"!==this.player.action.sheath.state&&this.player.isSheathed?800:250;this.player.vector.x=-t,e.push("move");break}case"right":{let t="in-use"!==this.player.action.sheath.state&&this.player.isSheathed?800:250;this.player.vector.x=t,e.push("move");break}case"down":e.push("duck");break;case"up":e.push("sheath")}this.player.update(t,e)}draw(t){this.player.draw({ctx:t})}}r=class{gameWidth;gameHeight;mainCtx;mousePos;players=[{name:"mami",lvl:1,stats:{maxHp:60,maxStamina:60,strength:1,intelligence:1,dodgeChance:.1,hitRate:.9}},{name:"papi",lvl:1,stats:{maxHp:60,maxStamina:60,strength:1,intelligence:1,dodgeChance:.1,hitRate:.9}}];mapScreen=new E(this);pauseScreen=new H(this);battleSystem=new B(this);marioSystem;input=new Set;state="RUNNING";constructor(t,e,s,i={x:t/2,y:e/2}){this.gameWidth=t,this.gameHeight=e,this.mainCtx=s,this.mousePos=i;let a=M("gameScreen");this.marioSystem=new Y(this),a.addEventListener("click",()=>{this.input.add("leftClick")}),document.addEventListener("keydown",t=>{switch(console.log(t.key),t.key){case"Escape":this.input.add("esc");break;case"ArrowUp":this.input.add("up");break;case"ArrowLeft":this.input.add("left");break;case"ArrowDown":this.input.add("down");break;case"ArrowRight":this.input.add("right");break;case"Enter":this.input.add("enter")}}),document.addEventListener("keyup",t=>{switch(t.key){case"Escape":this.input.delete("esc");break;case"ArrowUp":this.input.delete("up");break;case"ArrowLeft":this.input.delete("left");break;case"ArrowDown":this.input.delete("down");break;case"ArrowRight":this.input.delete("right");break;case"Enter":this.input.delete("enter")}}),this.start()}start(){}update(t){this.marioSystem.update(t)}clearInput(){this.input.clear()}draw(t){this.marioSystem.draw(t)}};const D=document.querySelector("#gameScreen"),X=D.getContext("2d");X.imageSmoothingEnabled=!0,X.imageSmoothingQuality="high",D.width=800,D.height=600;const G=new r(800,600,X);let K=0;requestAnimationFrame(function t(e){let s=(e-K)/1e3;K=e,X.clearRect(0,0,800,600),G.update(s),G.draw(X),requestAnimationFrame(t)});