(function(t){function e(e){for(var i,r,h=e[0],c=e[1],o=e[2],d=0,g=[];d<h.length;d++)r=h[d],Object.prototype.hasOwnProperty.call(a,r)&&a[r]&&g.push(a[r][0]),a[r]=0;for(i in c)Object.prototype.hasOwnProperty.call(c,i)&&(t[i]=c[i]);l&&l(e);while(g.length)g.shift()();return n.push.apply(n,o||[]),s()}function s(){for(var t,e=0;e<n.length;e++){for(var s=n[e],i=!0,h=1;h<s.length;h++){var c=s[h];0!==a[c]&&(i=!1)}i&&(n.splice(e--,1),t=r(r.s=s[0]))}return t}var i={},a={app:0},n=[];function r(e){if(i[e])return i[e].exports;var s=i[e]={i:e,l:!1,exports:{}};return t[e].call(s.exports,s,s.exports,r),s.l=!0,s.exports}r.m=t,r.c=i,r.d=function(t,e,s){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},r.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(r.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)r.d(s,i,function(e){return t[e]}.bind(null,i));return s},r.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="/selfdriving/";var h=window["webpackJsonp"]=window["webpackJsonp"]||[],c=h.push.bind(h);h.push=e,h=h.slice();for(var o=0;o<h.length;o++)e(h[o]);var l=c;n.push([0,"chunk-vendors"]),s()})({0:function(t,e,s){t.exports=s("56d7")},1:function(t,e){},2:function(t,e){},3:function(t,e){},4:function(t,e){},5:function(t,e){},"56d7":function(t,e,s){"use strict";s.r(e);s("e260"),s("e6cf"),s("cca6"),s("a79d");var i=s("2b0e"),a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{attrs:{id:"app"}},[s("div",{staticClass:"world"},[s("canvas",{ref:"canvas",staticClass:"world-canvas",attrs:{width:t.worldWidth,height:t.worldHeight}}),t.training?s("div",{staticClass:"training"},[s("span",[t._v("TRAINING"),s("br"),t._v(t._s(t.trainingProgress)+"% ("+t._s(t.trainingSamples.length)+")")])]):t._e()]),s("canvas",{ref:"carSnapshotCanvas",staticClass:"car-snapshot-canvas",attrs:{width:1.5*t.car.length,height:1.5*t.car.length}}),s("canvas",{ref:"viewSnapshotCanvas",staticClass:"view-snapshot-canvas",attrs:{width:1.5*t.viewSize,height:1.5*t.viewSize}}),s("canvas",{ref:"carCanvas",staticClass:"car-canvas",attrs:{width:t.car.width,height:t.car.length}}),s("canvas",{ref:"viewCanvas",staticClass:"view-canvas",attrs:{width:t.viewSize,height:t.viewSize}}),s("canvas",{ref:"viewCanvasReduced",staticClass:"view-canvas-reduced",attrs:{width:t.reducedViewSize,height:t.reducedViewSize}}),s("span",{staticClass:"fps"},[t._v(t._s(t.fps)+" fps")]),s("div",{staticClass:"highscores"},[s("div",{staticClass:"duration"},[s("label",[t._v("Total Duration")]),t._v(" "+t._s(t.durationString)+" ")]),s("label",[t._v("Highscores ("+t._s(t.highscores.length)+")")]),s("ul",t._l(t.highscoresShown,(function(e,i){return s("li",{key:i},[s("b",[t._v(t._s(t.models[e.modelIndex].name)+" - ")]),t._v(" "+t._s(e.score))])})),0)]),s("div",{staticClass:"score"},[s("div",{staticClass:"current"},[s("label",[t._v("Current Score")]),t._v(" "+t._s(t.score)+" ")]),s("div",{staticClass:"last"},[s("label",[t._v("Last Score")]),t._v(" "+t._s(t.lastScore)+" ")])]),s("div",{staticClass:"stats"},[s("canvas",{ref:"statsCanvas",staticClass:"stats-canvas",attrs:{width:40,height:500}})]),s("div",{staticClass:"models"},[s("label",[t._v("Drivers")]),s("ul",t._l(t.models,(function(e,i){return s("li",{key:i,class:{active:i===t.modelIndex}},[e?[t._v(" "+t._s(e.name)+" "),s("span",{staticClass:"layers"},[t._v(" [ "),t._l(e.layers,(function(e){return[t._v(t._s(e.units)+" "+t._s(e.activation)+", ")]})),t._v(" ] ")],2),t._v(t._s(e.highscore||"–")+" (t: "+t._s(e.trainings)+") ")]:t._e()],2)})),0)])])},n=[],r=s("2909"),h=s("5530"),c=s("1da1"),o=(s("96cf"),s("fb6a"),s("7db0"),s("d3b7"),s("b0c0"),s("4e82"),s("cb29"),s("25f0"),s("ce1a")),l={name:"App",data:function(){return{ctx:null,worldWidth:256,worldHeight:256,imgWorld:null,worldLoaded:!1,fps:null,fpsCounter:null,tick:!0,tickTime:null,duration:-1,durationString:null,car:{width:8,length:16,x:32,y:192,speed:.5,steeringSpeed:.025,angle:0},viewSize:32,viewReduction:4,viewReducedSize:null,viewPixels:null,steering:null,samples:[],samplesMaxLength:4096,trainingSamples:null,trainingSamplesMaxLength:4096,badRewards:0,badRewardsInARow:0,score:0,lastScore:null,highscores:[],highscoresMaxLength:10,highscoresMaxShown:10,training:!1,trainingProgress:0,models:void 0,numberOfModels:5,modelIndex:0}},computed:{reducedViewSize:function(){for(var t=this.viewSize,e=0;e<this.viewReduction;e++)t/=2;return t},highscoresShown:function(){return this.highscores.slice(0,this.highscoresMaxShown)}},mounted:function(){this.ctx=this.$refs.canvas.getContext("2d"),this.imgWorld=new Image(this.worldWidth,this.worldHeight),this.imgWorld.src=s("dfef");var t=this;this.imgWorld.onload=function(){t.worldLoaded=!0},this.ctxViewSnapshot=this.$refs.viewSnapshotCanvas.getContext("2d"),this.ctxCarSnapshot=this.$refs.carSnapshotCanvas.getContext("2d"),this.ctxCar=this.$refs.carCanvas.getContext("2d"),this.ctxView=this.$refs.viewCanvas.getContext("2d"),this.ctxViewReduced=this.$refs.viewCanvasReduced.getContext("2d"),this.ctxStats=this.$refs.statsCanvas.getContext("2d"),this.viewReducedSize=this.viewSize;for(var e=0;e<this.viewReduction;e++)this.viewReducedSize=this.viewReducedSize/2;this.models=new Array(this.numberOfModels),this.createModel(this.modelIndex),this.refreshLoop()},methods:{createModel:function(t){console.log("creating model ...");for(var e=2,s=new Array(e),i=e-1;i>=0;i--)s[i]=i===e-1?{units:1,activation:"sigmoid"}:{units:3+Math.ceil(15*Math.random()),activation:["relu","sigmoid"][Math.round(Math.random())]};this.models[t]={layers:s,trainings:0,highscore:void 0,name:t+1,children:0},this.models[t].model=o.sequential();for(var a=0;a<s.length;a++)0===a?this.models[t].model.add(o.layers.dense({inputShape:this.viewReducedSize*this.viewReducedSize,activation:s[a].activation,units:s[a].units})):this.models[t].model.add(o.layers.dense({activation:s[a].activation,units:s[a].units}));this.models[t].model.compile({loss:"binaryCrossentropy",optimizer:o.train.rmsprop(.1),metrics:["accuracy"]})},train:function(){var t=this;return Object(c["a"])(regeneratorRuntime.mark((function e(){var s,i,a,n,c,l,d,g,u,v,p,w,x,m,f;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:for(s=t.highscores.find((function(e){return e.modelIndex===t.modelIndex})),s&&(t.models[t.modelIndex].highscore=s.score),t.modelIndex=(t.modelIndex+1)%t.numberOfModels,t.models[t.modelIndex]?(i=t.highscores.find((function(e){return e.modelIndex===t.modelIndex})),i||(a=Math.random(),a>1-.182?n=0:a>.655?n=1:a>.509?n=2:a>.382?n=3:a>.273?n=4:a>.273-.091?n=5:a>.273-.091-.073?n=6:a>.05500000000000003?n=7:a>.01800000000000003?n=8:a>3122502256758253e-32&&(n=9),c=t.models[t.highscores[n].modelIndex],t.models[t.modelIndex]=Object(h["a"])({},c),t.models[t.modelIndex].trainings=0,t.models[t.modelIndex].highscore=void 0,c.children++,t.models[t.modelIndex].name=c.name+"."+c.children)):t.createModel(t.modelIndex),t.training=!0,t.trainingSamples=[],l=0;l<t.highscores.length;l++){for(g=[],u=0;u<t.highscores[l].samples.length;u++)t.highscores[l].samples[u].reward>.5&&g.push(t.highscores[l].samples[u]);(d=t.trainingSamples).push.apply(d,g)}for(t.trainingSamples.sort((function(){return.5-Math.random()})),t.trainingSamples=t.trainingSamples.slice(0,t.trainingSamplesMaxLength),console.log("total number of samples: "+t.trainingSamples.length),v=[],p=[],w=0;w<t.trainingSamples.length;w++)x=Object(r["a"])(t.trainingSamples[w].state),v.push(x),p.push(t.trainingSamples[w].action);return m=o.tensor2d(v,[v.length,v[0].length]),f=o.tensor2d(p,[p.length,1]),console.log("train model ..."),e.next=18,t.trainModel(t.modelIndex,m,f,10*Math.min(10,t.trainingSamplesMaxLength/t.trainingSamples.length));case 18:t.training=!1,t.trainingProgress=0,t.models[t.modelIndex].trainings+=1;case 21:case"end":return e.stop()}}),e)})))()},trainModel:function(t,e,s,i){var a=this;return Object(c["a"])(regeneratorRuntime.mark((function n(){var r;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return r=a,n.abrupt("return",a.models[t].model.fit(e,s,{epochs:i,callbacks:{onEpochEnd:function(t){r.trainingProgress=Math.round(t/i*100)},onTrainEnd:function(){console.log("done")}}}));case 2:case"end":return n.stop()}}),n)})))()},predict:function(t,e){var s=this;return Object(c["a"])(regeneratorRuntime.mark((function i(){return regeneratorRuntime.wrap((function(i){while(1)switch(i.prev=i.next){case 0:return i.abrupt("return",o.tidy((function(){var i=o.tensor2d([e],[1,s.viewReducedSize*s.viewReducedSize]),a=s.models[t].model.predict(i),n=a.dataSync();return n})));case 1:case"end":return i.stop()}}),i)})))()},getSteering:function(){var t=this;return Object(c["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.predict(t.modelIndex,t.testingDataInput);case 2:return t.prediction=e.sent,t.prediction=Math.max(0,t.prediction),e.abrupt("return",t.prediction);case 5:case"end":return e.stop()}}),e)})))()},refreshLoop:function(){var t=this;window.requestAnimationFrame((function(){var e=performance.now();if(t.tick){t.tickTime=e,t.fps=t.fpsCounter,t.fpsCounter=0,t.tick=!1,t.duration++;var s=new Date(0);s.setSeconds(t.duration),t.durationString=s.toISOString().substr(11,8)}else t.fpsCounter++,e>=t.tickTime+1e3&&(t.tick=!0);t.enterFrame(),t.refreshLoop()}))},enterFrame:function(){this.worldLoaded&&!this.training&&(this.drawWorld(),this.getView(),this.moveCar())},drawStats:function(){this.ctxStats.clearRect(0,0,this.ctxStats.canvas.width,this.ctxStats.canvas.height);for(var t=Math.min(512,this.samples.length),e=0;e<t;e++){this.ctxStats.beginPath(),this.ctxStats.fillStyle="#ffffff",this.ctxStats.arc(this.samples[e].actionPredicted*this.ctxStats.canvas.width,this.ctxStats.canvas.height/t*e,1,0,2*Math.PI),this.ctxStats.fill(),this.ctxStats.beginPath();var s=void 0;this.samples[e].reward>=.5?(s="#00"+Math.round(255*this.samples[e].reward).toString(16)+"00",this.ctxStats.fillStyle=s,this.ctxStats.arc(this.samples[e].action*this.ctxStats.canvas.width,this.ctxStats.canvas.height/t*e,1,0,2*Math.PI),this.ctxStats.fill()):(s="#"+Math.round(255*(1-this.samples[e].reward)).toString(16)+"0000",this.ctxStats.fillStyle=s,this.ctxStats.arc(this.samples[e].action*this.ctxStats.canvas.width,this.ctxStats.canvas.height/t*e,1,0,2*Math.PI),this.ctxStats.fill())}},moveCar:function(){this.testingDataInput=Object(r["a"])(this.viewPixels);var t=this;this.getSteering().then((function(e){e=Math.min(e,1),e=Math.max(e,0),t.car.steeringPredicted=e;var s=0;s=t.samples[0]?t.samples[0].reward<.5?Math.min(1,t.badRewards/t.samples.length*t.badRewardsInARow):.05:1;var i=Math.random(),a=e-1*s+i*s*2;if(a=Math.min(a,1),a=Math.max(a,0),t.car.steering=a,t.car.steering<.5){var n=2*(.5-t.car.steering);t.car.angle-=t.car.steeringSpeed*n}else if(t.car.steering>.5){var r=2*(t.car.steering-.5);t.car.angle+=t.car.steeringSpeed*r}t.car.x+=Math.sin(t.car.angle)*t.car.speed,t.car.y-=Math.cos(t.car.angle)*t.car.speed,t.checkCarCollision()}))},getView:function(){this.car.viewX=this.car.x+Math.sin(this.car.angle)*(0*this.car.length+this.viewSize/2),this.car.viewY=this.car.y-Math.cos(this.car.angle)*(0*this.car.length+this.viewSize/2),this.snapshotWhereViewIs=this.ctx.getImageData(this.car.viewX-this.ctxViewSnapshot.canvas.width/2,this.car.viewY-this.ctxViewSnapshot.canvas.height/2,this.ctxViewSnapshot.canvas.width,this.ctxViewSnapshot.canvas.height);for(var t=[],e=0;e<this.snapshotWhereViewIs.data.length;e+=4){var s=this.snapshotWhereViewIs.data[e],i=this.snapshotWhereViewIs.data[e+1],a=this.snapshotWhereViewIs.data[e+2];t.push([s,i,a])}this.ctxViewSnapshot.save(),this.ctxViewSnapshot.clearRect(0,0,this.ctxViewSnapshot.canvas.width,this.ctxViewSnapshot.canvas.height),this.ctxViewSnapshot.translate(this.ctxViewSnapshot.canvas.width/2,this.ctxViewSnapshot.canvas.height/2),this.ctxViewSnapshot.rotate(-this.car.angle),this.ctxViewSnapshot.translate(-this.ctxViewSnapshot.canvas.width/2,-this.ctxViewSnapshot.canvas.height/2);for(var n=0;n<this.ctxViewSnapshot.canvas.height;n++)for(var r=0;r<this.ctxViewSnapshot.canvas.width;r++){var h=n*this.ctxViewSnapshot.canvas.width+r,c=this.rgbToHex(t[h][0],t[h][1],t[h][2]);this.ctxViewSnapshot.fillStyle=c,this.ctxViewSnapshot.fillRect(r,n,1.5,1.5)}this.ctxViewSnapshot.restore(),this.imgWhereViewIs=this.ctxViewSnapshot.getImageData(this.ctxViewSnapshot.canvas.width/2-this.ctxView.canvas.width/2,this.ctxViewSnapshot.canvas.height/2-this.ctxView.canvas.height/2,this.ctxView.canvas.width,this.ctxView.canvas.height),this.ctxView.putImageData(this.imgWhereViewIs,0,0);for(var o=[],l=0;l<this.imgWhereViewIs.data.length;l+=4){var d=this.imgWhereViewIs.data[l],g=this.imgWhereViewIs.data[l+1],u=this.imgWhereViewIs.data[l+2];o.push([d,g,u])}for(var v,p=o,w=0;w<this.viewReduction;w++)p=this.reducePixels(p,Math.sqrt(p.length));for(var x=0;x<this.ctxViewReduced.canvas.height;x++)for(var m=0;m<this.ctxViewReduced.canvas.width;m++){var f=x*this.ctxViewReduced.canvas.width+m,S=this.rgbToHex(p[f][0],p[f][1],p[f][2]);this.ctxViewReduced.fillStyle=S,this.ctxViewReduced.fillRect(m,x,1.5,1.5)}this.viewPixels&&(this.samples.unshift({state:this.viewPixels,action:this.car.steering,actionPredicted:this.car.steeringPredicted}),v=this.totalBrightness),this.viewPixels=[],this.totalBrightness=0;for(var C=0;C<p.length;C++){var b=(p[C][0]+p[C][1]+p[C][2])/765;this.viewPixels.push(b),this.totalBrightness+=b}if(this.totalBrightness=this.totalBrightness/this.viewPixels.length,this.samples.length){var I,M=this.totalBrightness-v;console.log("---"),M>=0?I=this.totalBrightness>.5?1:.75+Math.min(.25,10*M*this.totalBrightness):(I=this.totalBrightness<.5?0:Math.min(.25,10*Math.abs(M)*this.totalBrightness),I=0),this.samples[0].reward=I,I<.5?(this.badRewards++,this.badRewardsInARow++):this.badRewardsInARow=0,this.samples.length===this.samplesMaxLength&&(this.samples[this.samples.length-1].reward<.5&&this.badRewards--,this.samples=this.samples.slice(0,this.samplesMaxLength-1)),console.log("good samples: "+(this.samples.length-this.badRewards)+" of "+this.samples.length)}else this.badRewards=0,this.badRewardsInARow=0},checkCarCollision:function(){this.snapshotWhereCarIs=this.ctx.getImageData(this.car.x-this.ctxCarSnapshot.canvas.width/2,this.car.y-this.ctxCarSnapshot.canvas.height/2,this.ctxCarSnapshot.canvas.width,this.ctxCarSnapshot.canvas.height);for(var t=[],e=0;e<this.snapshotWhereCarIs.data.length;e+=4){var s=this.snapshotWhereCarIs.data[e],i=this.snapshotWhereCarIs.data[e+1],a=this.snapshotWhereCarIs.data[e+2];t.push([s,i,a])}this.ctxCarSnapshot.save(),this.ctxCarSnapshot.clearRect(0,0,this.ctxCarSnapshot.canvas.width,this.ctxCarSnapshot.canvas.height),this.ctxCarSnapshot.translate(this.ctxCarSnapshot.canvas.width/2,this.ctxCarSnapshot.canvas.height/2),this.ctxCarSnapshot.rotate(-this.car.angle),this.ctxCarSnapshot.translate(-this.ctxCarSnapshot.canvas.width/2,-this.ctxCarSnapshot.canvas.height/2);for(var n=0;n<this.ctxCarSnapshot.canvas.height;n++)for(var h=0;h<this.ctxCarSnapshot.canvas.width;h++){var c=n*this.ctxCarSnapshot.canvas.width+h,o=this.rgbToHex(t[c][0],t[c][1],t[c][2]);this.ctxCarSnapshot.fillStyle=o,this.ctxCarSnapshot.fillRect(h,n,1.5,1.5)}this.ctxCarSnapshot.restore(),this.imgWhereCarIs=this.ctxCarSnapshot.getImageData(this.ctxCarSnapshot.canvas.width/2-this.ctxCar.canvas.width/2,this.ctxCarSnapshot.canvas.height/2-this.ctxCar.canvas.height/2,this.ctxCar.canvas.width,this.ctxCar.canvas.height),this.ctxCar.putImageData(this.imgWhereCarIs,0,0),this.drawCarAndViewSquare();for(var l=0,d=0,g=0,u=0;u<this.imgWhereCarIs.data.length;u+=4)l+=this.imgWhereCarIs.data[u],d+=this.imgWhereCarIs.data[u+1],g+=this.imgWhereCarIs.data[u+2];l=Math.round(l/(this.imgWhereCarIs.data.length/4)),d=Math.round(d/(this.imgWhereCarIs.data.length/4)),g=Math.round(g/(this.imgWhereCarIs.data.length/4)),l+d+g<760?(console.log("collision!"),this.viewPixels=null,this.car.steering=void 0,this.resetCar(),(this.highscores.length<this.highscoresMaxLength||this.score>this.highscores[this.highscoresMaxLength-1].score)&&(console.log("new highscore"),this.highscores.push({score:this.score,samples:Object(r["a"])(this.samples),modelIndex:this.modelIndex}),this.highscores.sort((function(t,e){return e.score-t.score})),this.highscores=this.highscores.slice(0,this.highscoresMaxLength)),console.log("train"),this.train(),this.drawStats(),this.samples=[],this.lastScore=this.score,this.score=0):(this.score++,this.drawStats())},drawCarAndViewSquare:function(){this.ctx.save(),this.ctx.translate(this.car.x,this.car.y),this.ctx.rotate(this.car.angle),this.ctx.translate(-this.car.x,-this.car.y),this.ctx.fillRect(this.car.x-this.car.width/2,this.car.y-this.car.length/2,this.car.width,this.car.length),this.ctx.restore(),this.ctx.save(),this.ctx.translate(this.car.viewX,this.car.viewY),this.ctx.rotate(this.car.angle),this.ctx.translate(-this.car.viewX,-this.car.viewY),this.ctx.strokeStyle="#ff0000",this.ctx.beginPath(),this.ctx.rect(this.car.viewX-this.ctxView.canvas.width/2,this.car.viewY-this.ctxView.canvas.height/2,this.ctxView.canvas.width,this.ctxView.canvas.height),this.ctx.stroke(),this.ctx.restore()},componentToHex:function(t){var e=t.toString(16);return 1==e.length?"0"+e:e},rgbToHex:function(t,e,s){return"#"+this.componentToHex(t)+this.componentToHex(e)+this.componentToHex(s)},reducePixels:function(t,e){for(var s=[],i=0;i<e;i+=2)for(var a=0;a<e;a+=2){for(var n=[i*e+a,i*e+a+1,(i+1)*e+a,(i+1)*e+a+1],r=0,h=0,c=0,o=0;o<n.length;o++)r+=t[n[o]][0],h+=t[n[o]][1],c+=t[n[o]][2];r=Math.round(r/n.length),h=Math.round(h/n.length),c=Math.round(c/n.length),s.push([r,h,c])}return s},drawWorld:function(){this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height),this.ctx.drawImage(this.imgWorld,0,0,this.ctx.canvas.width,this.ctx.canvas.height)},resetCar:function(){console.log("reset car"),this.car.x=this.worldWidth/2*.25,this.car.y=this.worldHeight/2*1.5,this.car.angle=0}}},d=l,g=(s("5c0b"),s("2877")),u=Object(g["a"])(d,a,n,!1,null,null,null),v=u.exports;i["a"].config.productionTip=!1,new i["a"]({render:function(t){return t(v)}}).$mount("#app")},"5c0b":function(t,e,s){"use strict";s("9c0c")},6:function(t,e){},7:function(t,e){},8:function(t,e){},"9c0c":function(t,e,s){},dfef:function(t,e,s){t.exports=s.p+"img/world4.00d00251.jpg"}});
//# sourceMappingURL=app.9e46249e.js.map