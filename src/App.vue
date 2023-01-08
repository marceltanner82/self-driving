<template>
  <div id="app">
    <div class="world">
      <canvas class="world-canvas" ref="canvas" :width="worldWidth" :height="worldHeight"></canvas>
      <div class="training" v-if="training"><span>TRAINING<br>{{trainingProgress}}% ({{trainingSamples.length}})</span></div>
    </div>
    <canvas class="car-snapshot-canvas" ref="carSnapshotCanvas" :width="car.length*1.5" :height="car.length*1.5"></canvas>
    <canvas class="view-snapshot-canvas" ref="viewSnapshotCanvas" :width="viewSize*1.5" :height="viewSize*1.5"></canvas>
    <canvas class="car-canvas" ref="carCanvas" :width="car.width" :height="car.length"></canvas>
    <canvas class="view-canvas" ref="viewCanvas" :width="viewSize" :height="viewSize"></canvas>
    <canvas class="view-canvas-reduced" ref="viewCanvasReduced" :width="reducedViewSize" :height="reducedViewSize"></canvas>
    <span class="fps">{{ fps }} fps</span>
    <div class="highscores">
      <div class="duration">
        <label>Total Duration</label>
        {{durationString}}
      </div>
      <label>Highscores ({{highscores.length}})</label>
      <ul>
        <li v-for="(highscore,index) in highscoresShown" :key="index"><b>{{models[highscore.modelIndex].name}} - </b> {{highscore.score}}</li>
        <!-- <li v-if="highscores.length">last: {{highscores[highscores.length-1].score}}</li> -->
      </ul>
    </div>
    <div class="score">
      <div class="current">
        <label>Current Score</label>
        {{score}}
      </div>
      <div class="last">
        <label>Last Score</label>
        {{lastScore}}
      </div>
    </div>
    <div class="stats">
      <canvas class="stats-canvas" ref="statsCanvas" :width="40" :height="500"></canvas>
    </div>
    <div class="models">
      <label>Drivers</label>
      <ul>
        <li v-for="(model,index) in models" :key="index" :class="{'active':index === modelIndex}">
          <template v-if="model">
            {{ model.name }}
            <span class="layers">
              [
              <template v-for="(layer) in model.layers">{{layer.units}} {{layer.activation}}, </template>
              ]
            </span>{{model.highscore||"–"}} (t: {{model.trainings}})
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

const tf = require('@tensorflow/tfjs');

export default {
  name: 'App',
  data() {
    return {
      ctx: null,
      worldWidth: 256,
      worldHeight: 256,
      imgWorld: null,
      worldLoaded: false,
      fps: null,
      fpsCounter: null,
      tick: true,
      tickTime: null,
      duration: -1,
      durationString: null,
      car: {
        width: 8,
        length: 16,
        x: 256 / 2 * 0.25,
        y: 256 / 2 * 1.5,
        speed: 0.5,
        steeringSpeed: 0.025,
        angle: 0
      },
      viewSize: 32,
      viewReduction: 3,
      viewReducedSize: null,
      viewPixels: null,
      steering: null,
      samples: [],
      samplesMaxLength: 4096,
      trainingSamples: null,
      trainingSamplesMaxLength: 4096,
      badRewards: 0,
      badRewardsInARow: 0,
      score: 0,
      lastScore: null,
      highscores: [],
      highscoresMaxLength: 15,
      highscoresMaxShown: 15,
      training: false,
      trainingProgress: 0,
      models: undefined,
      numberOfModels: 10,
      modelIndex: 0
    }
  },
  computed: {
    reducedViewSize() {
      let reducedSize = this.viewSize;
      for( let i = 0; i < this.viewReduction; i++ ) {
        reducedSize = reducedSize / 2;
      }
      return reducedSize;
    },
    highscoresShown() {
      return this.highscores.slice(0,this.highscoresMaxShown);
    }
  },
  mounted() {
    this.ctx = this.$refs.canvas.getContext("2d");
    this.imgWorld = new Image(this.worldWidth,this.worldHeight);
    this.imgWorld.src = require('/src/assets/world4.jpg');
    const app = this;
    this.imgWorld.onload = function() {
      app.worldLoaded = true;
    }
    //document.addEventListener('keydown', this.keyDown);
    //document.addEventListener('keyup', this.keyUp);

    this.ctxViewSnapshot = this.$refs.viewSnapshotCanvas.getContext("2d");
    this.ctxCarSnapshot = this.$refs.carSnapshotCanvas.getContext("2d");

    this.ctxCar = this.$refs.carCanvas.getContext("2d");
    this.ctxView = this.$refs.viewCanvas.getContext("2d");
    this.ctxViewReduced = this.$refs.viewCanvasReduced.getContext("2d");

    this.ctxStats = this.$refs.statsCanvas.getContext("2d");


    this.viewReducedSize = this.viewSize;
    for( let i = 0; i < this.viewReduction; i++ ) {
      this.viewReducedSize = this.viewReducedSize / 2;
    }

    this.models = new Array(this.numberOfModels);
    this.createModel(this.modelIndex);

    this.refreshLoop();
  },
  methods: {
    createModel( modelIndex ) {
      console.log("creating model ...");
      const numberOfLayers =  2 + Math.round(Math.random());
      let layers = new Array( numberOfLayers );
      for( let i = numberOfLayers-1; i >= 0; i-- ) {
        if( i === numberOfLayers-1 ) {
          // last layer
          layers[i] = {
            units: 1,
            activation: "sigmoid"
          };
        }
        else {
          layers[i] = {
            units: 3 + Math.ceil( Math.random()*15 ),
            activation: ["relu","sigmoid"][Math.round(Math.random())]
          };
        }
      }
      this.models[modelIndex] = {
        layers: layers,
        trainings: 0,
        highscore: undefined,
        name: modelIndex+1,
        children: 0
      };

      // create model with layers
      this.models[modelIndex].model = tf.sequential();
      for( let i = 0; i < layers.length; i++ ) {
        if( i === 0 ) {
          // first layer
          this.models[modelIndex].model.add(tf.layers.dense({inputShape: this.viewReducedSize*this.viewReducedSize, activation: layers[i].activation, units: layers[i].units}));
        }
        else {
          this.models[modelIndex].model.add(tf.layers.dense({activation: layers[i].activation, units: layers[i].units}));
        }
      }
      /*
      this.models[i].model.add(tf.layers.dense({inputShape: this.viewReducedSize*this.viewReducedSize, activation: "relu", units: 10}));
      this.models[i].model.add(tf.layers.dense({activation: "relu", units: 5}));
      this.models[i].model.add(tf.layers.dense({activation: "sigmoid", units: 1}));
      */
      //this.models[i].add(tf.layers.dense({activation: "relu", units: 1}));
      this.models[modelIndex].model.compile({loss:'binaryCrossentropy',optimizer:tf.train.rmsprop(0.1),metrics:['accuracy']});
      //this.model.compile({loss:'categoricalCrossentropy',optimizer:tf.train.adam(),metrics:['accuracy']});
    },
    async train() {

      // check if new highscore:
      let highscoreOfModel = this.highscores.find(el => el.modelIndex === this.modelIndex );
      if( highscoreOfModel ) {
        this.models[this.modelIndex].highscore = highscoreOfModel.score;
      }

      // switch to next model
      this.modelIndex = (this.modelIndex +1) % this.numberOfModels;

      // create or make clone, if necessary
      if( !this.models[this.modelIndex] ) {
        this.createModel(this.modelIndex);
      }
      else {
        // check for new highscore
        let highscoreOfModel = this.highscores.find(el => el.modelIndex === this.modelIndex );
        if( !highscoreOfModel ) {
          // replace model

          let random = Math.random();
          let highscoreIndex;
          if( random > 1-0.182 ) {
            highscoreIndex = 0;
          }
          else if( random > 1 - 0.182 - 0.163) {
            highscoreIndex = 1;
          }
          else if( random > 1 - 0.182 - 0.163 - 0.146 ) {
            highscoreIndex = 2;
          }
          else if( random > 1 - 0.182 - 0.163 - 0.146 - 0.127 ) {
            highscoreIndex = 3;
          }
          else if( random > 1 - 0.182 - 0.163 - 0.146 - 0.127 - 0.109 ) {
            highscoreIndex = 4;
          }
          else if( random > 1 - 0.182 - 0.163 - 0.146 - 0.127 - 0.109 - 0.091 ) {
            highscoreIndex = 5;
          }
          else if( random > 1 - 0.182 - 0.163 - 0.146 - 0.127 - 0.109 - 0.091 - 0.073 ) {
            highscoreIndex = 6;
          }
          else if( random > 1 - 0.182 - 0.163 - 0.146 - 0.127 - 0.109 - 0.091 - 0.073 - 0.054 ) {
            highscoreIndex = 7;
          }
          else if( random > 1 - 0.182 - 0.163 - 0.146 - 0.127 - 0.109 - 0.091 - 0.073 - 0.054 - 0.037 ) {
            highscoreIndex = 8;
          }
          else if( random > 1 - 0.182 - 0.163 - 0.146 - 0.127 - 0.109 - 0.091 - 0.073 - 0.054 - 0.037 - 0.018 ) {
            highscoreIndex = 9;
          }

          const mother = this.models[ this.highscores[highscoreIndex].modelIndex ];
          this.models[this.modelIndex] = {...mother};
          this.models[this.modelIndex].trainings = 0;
          this.models[this.modelIndex].highscore = undefined;
          mother.children++;
          this.models[this.modelIndex].name = mother.name+"."+mother.children;
        }

      }

      this.training = true;

      this.trainingSamples = [];
      for( let i = 0; i < this.highscores.length; i++ ) {
        let samples = [];
        for( let j = 0; j < this.highscores[i].samples.length; j++ ) {
          if( this.highscores[i].samples[j].reward > 0.5 ) {
            // use only good rewards
            samples.push( this.highscores[i].samples[j] );
          }
        }
        this.trainingSamples.push(...samples);
      }
      // randomise and slice
      this.trainingSamples.sort(function(){return 0.5 - Math.random()});
      this.trainingSamples = this.trainingSamples.slice(0,this.trainingSamplesMaxLength);

      console.log("total number of samples: "+this.trainingSamples.length);

      let featureValuesTraining = [];
      let labelValuesTraining = [];
      for( let i = 0; i < this.trainingSamples.length; i++ ) {
        let featureValueTraining = [...this.trainingSamples[i].state];
        //featureValueTraining.push( this.trainingSamples[i].reward );
        featureValuesTraining.push( featureValueTraining );
        labelValuesTraining.push( this.trainingSamples[i].action );
      }
      const featureTensorTraining = tf.tensor2d( featureValuesTraining, [featureValuesTraining.length, featureValuesTraining[0].length] );
      const labelTensorTraining = tf.tensor2d( labelValuesTraining, [labelValuesTraining.length, 1] );

      console.log("train model ...");
      await this.trainModel( this.modelIndex, featureTensorTraining, labelTensorTraining, Math.min(10, this.trainingSamplesMaxLength/this.trainingSamples.length)*10 );

      this.training = false;
      this.trainingProgress = 0;

      this.models[this.modelIndex].trainings += 1;
    },
    async trainModel( modelIndex, featureTensorTraining, labelTensorTraining, epochs ) {
      const ref = this;
      return this.models[modelIndex].model.fit( featureTensorTraining, labelTensorTraining, {
        epochs,
        //validationSplit: 0.2,
        callbacks: {
          onEpochEnd: function(epoch) {
            ref.trainingProgress = Math.round( epoch / epochs * 100 );
          },
          onTrainEnd: function() {
            console.log("done");
          }
        }
      });
    },
    async predict( modelIndex, input ) {
      return tf.tidy( () => {
        const inputTensor = tf.tensor2d([input],[1, this.viewReducedSize*this.viewReducedSize]);
        const outputTensor = this.models[modelIndex].model.predict( inputTensor );
        const outputValue = outputTensor.dataSync();

        return outputValue;
      });
    },
    async getSteering() {
      this.prediction = await this.predict( this.modelIndex, this.testingDataInput );
      this.prediction = Math.max( 0, this.prediction  )
      return this.prediction;
    },
    refreshLoop() {
      window.requestAnimationFrame(() => {
        const now = performance.now();
        if( this.tick ) {
          this.tickTime = now;
          this.fps = this.fpsCounter;
          this.fpsCounter = 0;
          this.tick = false;

          this.duration++;
          const date = new Date(0);
          date.setSeconds(this.duration); // specify value for SECONDS here
          this.durationString = date.toISOString().substr(11, 8);
        }
        else {
          this.fpsCounter++;
          if( now >= this.tickTime + 1000 ) {
            this.tick = true;
          }
        }

        this.enterFrame();

        this.refreshLoop();
      });
    },
    enterFrame() {
      if( this.worldLoaded && !this.training ) {
        this.drawWorld();
        this.getView();
        this.moveCar();
      }
    },
    drawStats() {
      this.ctxStats.clearRect( 0, 0, this.ctxStats.canvas.width, this.ctxStats.canvas.height );
      //this.ctxStats.fillRect(0, 0, this.ctxStats.canvas.width, this.ctxStats.canvas.height);
      //this.ctxStats.strokeStyle = "#ffffff";
      const numberOfsamplesDrawn = Math.min(512, this.samples.length);
      for( let i = 0; i < numberOfsamplesDrawn; i++ ) {
        /*
        this.ctxStats.moveTo( this.samples[i].action * this.ctxStats.canvas.width, this.ctxStats.canvas.height/this.samples.length * i );
        this.ctxStats.lineTo( this.samples[i+1].action * this.ctxStats.canvas.width, this.ctxStats.canvas.height/this.samples.length * (i+1) );
        */
        this.ctxStats.beginPath();
        this.ctxStats.fillStyle = "#ffffff";
        this.ctxStats.arc(this.samples[i].actionPredicted * this.ctxStats.canvas.width, this.ctxStats.canvas.height/numberOfsamplesDrawn * i, 1, 0, 2 * Math.PI);
        this.ctxStats.fill();

        this.ctxStats.beginPath();
        let rgb;
        if( this.samples[i].reward >= 0.5 ) {
          //rgb = "#00ff00";
          rgb = "#00"+ Math.round( this.samples[i].reward * 255 ).toString(16) + "00";
          this.ctxStats.fillStyle = rgb;
          this.ctxStats.arc(this.samples[i].action * this.ctxStats.canvas.width, this.ctxStats.canvas.height/numberOfsamplesDrawn * i, 1, 0, 2 * Math.PI);
          this.ctxStats.fill();
        }
        else {
          //rgb = "#ff0000";
          rgb = "#"+ Math.round( (1-this.samples[i].reward) * 255 ).toString(16) + "0000";
          this.ctxStats.fillStyle = rgb;
          this.ctxStats.arc(this.samples[i].action * this.ctxStats.canvas.width, this.ctxStats.canvas.height/numberOfsamplesDrawn * i, 1, 0, 2 * Math.PI);
          this.ctxStats.fill();
        }
      }
      //this.ctxStats.stroke();
    },
    moveCar() {
      this.testingDataInput = [...this.viewPixels];
      //this.testingDataInput.push(1.0);
      const ref = this;
      this.getSteering().then( function(value) {
        //console.log("predicted steering: "+value);
        value = Math.min( value, 1 );
        value = Math.max( value, 0 );
        //console.log("predicted steering: "+value);
        ref.car.steeringPredicted = value;

        let randomisation = 0;
        if( ref.samples[0] ) {
          if( ref.samples[0].reward < 0.5 ) {
            randomisation = Math.min( 0.75, (ref.badRewards/ref.samples.length) * ref.badRewardsInARow );
          }
          else {
            randomisation = 0.05;
          }
        }
        else {
          randomisation = 0.75;
        }

        //console.log("randomisation: "+randomisation);
        const random = Math.random();
        let randomisedValue = value - randomisation*1 + random * randomisation*2;
        randomisedValue = Math.min( randomisedValue, 1 );
        randomisedValue = Math.max( randomisedValue, 0 );
        ref.car.steering = randomisedValue;
        //console.log("new steering: "+randomisedValue);

        if( ref.car.steering < 0.5 ) {
          // left
          const steeringStrength = (0.5 - ref.car.steering) * 2
          ref.car.angle -= ref.car.steeringSpeed * steeringStrength;
        }
        else if( ref.car.steering > 0.5 ){
          // right
          const steeringStrength = (ref.car.steering - 0.5) * 2
          ref.car.angle += ref.car.steeringSpeed * steeringStrength;
        }

        ref.car.x += Math.sin( ref.car.angle ) *ref.car.speed;
        ref.car.y -= Math.cos( ref.car.angle ) *ref.car.speed;

        ref.checkCarCollision();
      });
    },
    getView() {
      // view
      this.car.viewX = this.car.x + Math.sin( this.car.angle ) * (this.car.length*0+this.viewSize/2);
      this.car.viewY = this.car.y - Math.cos( this.car.angle ) * (this.car.length*0+this.viewSize/2);
      // get view image
      this.snapshotWhereViewIs = this.ctx.getImageData( this.car.viewX - this.ctxViewSnapshot.canvas.width/2, this.car.viewY - this.ctxViewSnapshot.canvas.height/2, this.ctxViewSnapshot.canvas.width, this.ctxViewSnapshot.canvas.height );
      // read pixels
      let viewSnapshotPixels = [];
      for( let i = 0; i < this.snapshotWhereViewIs.data.length; i += 4 ) {
        const r = this.snapshotWhereViewIs.data[i];
        const g = this.snapshotWhereViewIs.data[i+1];
        const b = this.snapshotWhereViewIs.data[i+2];
        viewSnapshotPixels.push( [r,g,b] );
      }
      // draw rotated image
      this.ctxViewSnapshot.save();
      this.ctxViewSnapshot.clearRect( 0, 0, this.ctxViewSnapshot.canvas.width, this.ctxViewSnapshot.canvas.height );
      this.ctxViewSnapshot.translate( this.ctxViewSnapshot.canvas.width/2, this.ctxViewSnapshot.canvas.height/2 );
      this.ctxViewSnapshot.rotate( -this.car.angle );
      this.ctxViewSnapshot.translate( -this.ctxViewSnapshot.canvas.width/2, -this.ctxViewSnapshot.canvas.height/2 );
      for( let y = 0; y < this.ctxViewSnapshot.canvas.height; y++ ) {
        for( let x = 0; x < this.ctxViewSnapshot.canvas.width; x++ ) {
          const pixelIndex = y*this.ctxViewSnapshot.canvas.width + x;
          const color = this.rgbToHex( viewSnapshotPixels[pixelIndex][0], viewSnapshotPixels[pixelIndex][1], viewSnapshotPixels[pixelIndex][2] );
          this.ctxViewSnapshot.fillStyle = color;
          this.ctxViewSnapshot.fillRect( x, y, 1.5, 1.5 );
        }
      }
      this.ctxViewSnapshot.restore();
      // get view image
      this.imgWhereViewIs = this.ctxViewSnapshot.getImageData( this.ctxViewSnapshot.canvas.width/2 - this.ctxView.canvas.width/2, this.ctxViewSnapshot.canvas.height/2 - this.ctxView.canvas.height/2, this.ctxView.canvas.width, this.ctxView.canvas.height );
      this.ctxView.putImageData(this.imgWhereViewIs, 0, 0);
      // read pixels
      let viewPixels = [];
      for( let i = 0; i < this.imgWhereViewIs.data.length; i += 4 ) {
        const r = this.imgWhereViewIs.data[i];
        const g = this.imgWhereViewIs.data[i+1];
        const b = this.imgWhereViewIs.data[i+2];
        viewPixels.push( [r,g,b] );
      }
      let viewPixelsReduced = viewPixels;
      for( let i = 0; i < this.viewReduction; i++ ) {
        viewPixelsReduced = this.reducePixels( viewPixelsReduced, Math.sqrt(viewPixelsReduced.length) );
      }
      // draw reduced view
      for( let y = 0; y < this.ctxViewReduced.canvas.height; y++ ) {
        for( let x = 0; x < this.ctxViewReduced.canvas.width; x++ ) {
          const pixelIndex = y*this.ctxViewReduced.canvas.width + x;
          const color = this.rgbToHex( viewPixelsReduced[pixelIndex][0], viewPixelsReduced[pixelIndex][1], viewPixelsReduced[pixelIndex][2] );
          this.ctxViewReduced.fillStyle = color;
          this.ctxViewReduced.fillRect( x, y, 1.5, 1.5 );
        }
      }

      let previousTotalBrightness;
      // create sample
      if( this.viewPixels ) {
        // has previous state
        this.samples.unshift( {
          state: this.viewPixels,
          action: this.car.steering,
          actionPredicted: this.car.steeringPredicted
        } );
        //this.samples = this.samples.slice(0,this.samplesMaxLength);
        previousTotalBrightness = this.totalBrightness;
      }

      // save new view pixels
      this.viewPixels = [];
      this.totalBrightness = 0;
      for( let i = 0; i < viewPixelsReduced.length; i++ ) {
        const brightness = (viewPixelsReduced[i][0] + viewPixelsReduced[i][1] + viewPixelsReduced[i][2]) / 765;
        this.viewPixels.push( brightness );
        this.totalBrightness += brightness;
      }
      this.totalBrightness = this.totalBrightness / this.viewPixels.length;

      if( this.samples.length ) {
        const brightnessChange = this.totalBrightness - previousTotalBrightness;
        console.log("---");
        //console.log( "totalBrightness: "+ this.totalBrightness );
        //console.log( "previousTotalBrightness: "+ previousTotalBrightness );
        //console.log( "brightnessChange: "+ brightnessChange );
        let reward;
        if( brightnessChange >= 0 ) {
          // better
          /*
          if( this.totalBrightness > 0.5 ) {
            // not so bad situation
            reward = 1;
          }
          else {
            // bad situation
            reward = 0.75 + Math.min( 0.25, brightnessChange*10 * this.totalBrightness );
          }
          */
          reward = 1;
          //console.log(reward+": better");
        }
        else {
          /*
          // worse
          if( this.totalBrightness < 0.5 ) {
            // bad situation
            reward = 0;
          }
          else {
            // bad situation
            reward = Math.min( 0.25, Math.abs(brightnessChange)*10 * this.totalBrightness );
          }
          */
          reward = 0;
          //console.log(reward+": worse");
        }
        this.samples[0].reward = reward;


        // calculate total accuarcy
        if( reward < 0.5 ) {
          this.badRewards++;
          this.badRewardsInARow++;
        }
        else {
          this.badRewardsInARow = 0;
        }


        // trim samples:
        if( this.samples.length === this.samplesMaxLength ) {
          //console.log("max length reached: "+this.samples.length);
          if( this.samples[this.samples.length-1].reward < 0.5 ) {
            //console.log("last is badReward");
            this.badRewards--;
          }
          //console.log("remove");
          this.samples = this.samples.slice(0,this.samplesMaxLength-1);
          //console.log("new length: " +this.samples.length);
        }
        console.log( "good samples: "+(this.samples.length-this.badRewards) +" of "+this.samples.length);

      }
      else {
        // first cycle
        this.badRewards = 0;
        this.badRewardsInARow = 0;
      }

    },
    checkCarCollision() {
      // get car image
      this.snapshotWhereCarIs = this.ctx.getImageData( this.car.x - this.ctxCarSnapshot.canvas.width/2, this.car.y - this.ctxCarSnapshot.canvas.height/2, this.ctxCarSnapshot.canvas.width, this.ctxCarSnapshot.canvas.height );
      // read pixels
      let carSnapshotPixels = [];
      for( let i = 0; i < this.snapshotWhereCarIs.data.length; i += 4 ) {
        const r = this.snapshotWhereCarIs.data[i];
        const g = this.snapshotWhereCarIs.data[i+1];
        const b = this.snapshotWhereCarIs.data[i+2];
        carSnapshotPixels.push( [r,g,b] );
      }
      // draw rotated image
      this.ctxCarSnapshot.save();
      this.ctxCarSnapshot.clearRect( 0, 0, this.ctxCarSnapshot.canvas.width, this.ctxCarSnapshot.canvas.height );
      this.ctxCarSnapshot.translate( this.ctxCarSnapshot.canvas.width/2, this.ctxCarSnapshot.canvas.height/2 );
      this.ctxCarSnapshot.rotate( -this.car.angle );
      this.ctxCarSnapshot.translate( -this.ctxCarSnapshot.canvas.width/2, -this.ctxCarSnapshot.canvas.height/2 );
      for( let y = 0; y < this.ctxCarSnapshot.canvas.height; y++ ) {
        for( let x = 0; x < this.ctxCarSnapshot.canvas.width; x++ ) {
          const pixelIndex = y*this.ctxCarSnapshot.canvas.width + x;
          const color = this.rgbToHex( carSnapshotPixels[pixelIndex][0], carSnapshotPixels[pixelIndex][1], carSnapshotPixels[pixelIndex][2] );
          this.ctxCarSnapshot.fillStyle = color;
          this.ctxCarSnapshot.fillRect( x, y, 1.5, 1.5 );
        }
      }
      this.ctxCarSnapshot.restore();
      // get car image
      this.imgWhereCarIs = this.ctxCarSnapshot.getImageData( this.ctxCarSnapshot.canvas.width/2 - this.ctxCar.canvas.width/2, this.ctxCarSnapshot.canvas.height/2 - this.ctxCar.canvas.height/2, this.ctxCar.canvas.width, this.ctxCar.canvas.height );
      this.ctxCar.putImageData(this.imgWhereCarIs, 0, 0);



      this.drawCarAndViewSquare();


      // read pixels
      let totalR = 0;
      let totalG = 0;
      let totalB = 0;
      for( let i = 0; i < this.imgWhereCarIs.data.length; i += 4 ) {
        totalR += this.imgWhereCarIs.data[i];
        totalG += this.imgWhereCarIs.data[i+1];
        totalB += this.imgWhereCarIs.data[i+2];
      }
      totalR = Math.round( totalR / (this.imgWhereCarIs.data.length /4) );
      totalG = Math.round( totalG / (this.imgWhereCarIs.data.length /4) );
      totalB = Math.round( totalB / (this.imgWhereCarIs.data.length /4) );
      if( totalR + totalG + totalB < 760 ) {
        console.log("collision!");

        this.viewPixels = null;
        this.car.steering = undefined;
        this.resetCar();

        if( this.highscores.length < this.highscoresMaxLength || this.score > this.highscores[this.highscoresMaxLength-1].score ) {
          console.log("new highscore");

          this.highscores.push( {
            score: this.score,
            samples: [...this.samples],
            modelIndex: this.modelIndex
          } );
          this.highscores.sort(function(a, b){return b.score - a.score});
          this.highscores = this.highscores.slice(0,this.highscoresMaxLength);
        }
        console.log("train");
        this.train();

        this.drawStats();

        this.samples = [];
        this.lastScore = this.score;
        this.score = 0;

        //this.refreshLoop = null;
      }
      else {
        this.score++;
        this.drawStats();
      }
    },
    drawCarAndViewSquare() {
      // draw car
      this.ctx.save();
      this.ctx.translate( this.car.x, this.car.y );
      this.ctx.rotate( this.car.angle );
      this.ctx.translate( -this.car.x, -this.car.y );
      this.ctx.fillRect( this.car.x -this.car.width/2, this.car.y -this.car.length/2, this.car.width, this.car.length );
      this.ctx.restore();

      // draw view rect
      this.ctx.save();
      this.ctx.translate( this.car.viewX, this.car.viewY );
      this.ctx.rotate( this.car.angle );
      this.ctx.translate( -this.car.viewX, -this.car.viewY );
      this.ctx.strokeStyle = "#ff0000";
      this.ctx.beginPath();
      this.ctx.rect( this.car.viewX -this.ctxView.canvas.width/2, this.car.viewY -this.ctxView.canvas.height/2, this.ctxView.canvas.width, this.ctxView.canvas.height );
      this.ctx.stroke();
      this.ctx.restore();
    },
    componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    },
    rgbToHex(r, g, b) {
      return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    },
    reducePixels(pixels,size) {
      // reduce resolution
      let pixelsReduced = [];
      for( let y = 0; y < size; y+=2 ) {
        for( let x = 0; x < size; x+=2 ) {
          const pixelIndexes = [
            y*size + x,
            y*size + x +1,
            (y+1)*size + x,
            (y+1)*size + x +1,
          ];

          let totalR = 0;
          let totalG = 0;
          let totalB = 0;
          for( let i = 0; i < pixelIndexes.length; i++ ) {
            totalR += pixels[pixelIndexes[i]][0];
            totalG += pixels[pixelIndexes[i]][1];
            totalB += pixels[pixelIndexes[i]][2];
          }
          totalR = Math.round( totalR / pixelIndexes.length );
          totalG = Math.round( totalG / pixelIndexes.length );
          totalB = Math.round( totalB / pixelIndexes.length );
          pixelsReduced.push( [totalR,totalG,totalB] );
        }
      }
      return pixelsReduced;
    },
    drawWorld() {
      this.ctx.clearRect( 0, 0, this.ctx.canvas.width, this.ctx.canvas.height );
      this.ctx.drawImage( this.imgWorld, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height );
    },
    resetCar() {
      console.log( "reset car");
      this.car.x = this.worldWidth / 2 * 0.25;
      this.car.y = this.worldHeight / 2 * 1.5;
      this.car.angle = 0;
    },
    /*
    keyDown(e) {
      if( e.code === "ArrowLeft" ) {
        this.car.steering = 0;
      }
      else if( e.code === "ArrowRight" ) {
        this.car.steering = 1;
      }
    },
    keyUp(e) {
      if( e.code === "ArrowLeft" ) {
        this.car.steering = undefined;
      }
      else if( e.code === "ArrowRight" ) {
        this.car.steering = undefined;
      }
    }
    */
  }
}
</script>

<style lang="scss">

body {
  margin: 0;
  height: 100vh;
  font-family: sans-serif;
  font-size: 16px;
  line-height: 150%;
  background-color: black;
  color: white;
}
label {
  font-size: 13px;
}
#app {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  max-width: 100vh;
}

.world {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 100%;
  .world-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .training {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20%;
    height: 20%;
    position: absolute;
    top: 40%;
    left: 40%;
    span {
      text-align: center;
    }
  }
}


.car-snapshot-canvas {
  position: absolute;
  top: 8px;
  left: 8px;
  border: 1px solid white;
  image-rendering: pixelated;
  width: 10%;
  display: none;
}
.car-canvas {
  position: absolute;
  bottom: 8px;
  left: 8px;
  border: 1px solid white;
  image-rendering: pixelated;
  width: 15%;
  display: none;
}
.view-snapshot-canvas {
  position: absolute;
  top: 8px;
  right: 8px;
  border: 1px solid white;
  image-rendering: pixelated;
  width: 10%;
  display: none;
}
.view-canvas {
  position: absolute;
  bottom: 8px;
  right: 8px;
  border: 1px solid white;
  image-rendering: pixelated;
  width: 10%;
  display: none;
}
.view-canvas-reduced {
  position: absolute;
  bottom: 8px;
  right: 8px;
  border: 1px solid red;
  image-rendering: pixelated;
  width: 15%;
}



.fps {
  position: absolute;
  top: 8px;
  left: 50%;
  color: #333333;
}

.highscores {
  position: absolute;
  top: 16px;
  right: 16px;
  text-align: right;

  .duration {
    margin-bottom: 16px;
  }

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 8px;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      &:first-child {
        font-size: 20px;
        line-height: 150%;
      }
      &:nth-child(2),
      &:nth-child(3) {
        font-size: 16px;
        line-height: 20px;
      }
      display: block;
      font-size: 13px;
      line-height: 16px;
    }
  }

}


.score {
  position: absolute;
  right: calc( 15% + 48px);
  bottom: 48px;
  text-align: right;
  label {
    display: block;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .last {
    margin-top: 16px;
    font-size: 25px;
    label {
      font-size: 16px;
    }
  }
}

.stats {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  .stats-canvas {
    height: 100%;
    border-right: 1px solid #333;
  }
  &:before {
    content: '';
    position: absolute;
    display: block;
    width: 50%;
    height: 100%;
    border-right: 1px solid #666666;
  }
}

.models {
  position: absolute;
  top: 0;
  left: 7.5%;
  label {
    display: block;
    font-weight: bold;
    margin-bottom: 8px;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      color: #cccccc;
      font-size: 13px;
      line-height: 125%;
      &.active {
        font-weight: bold;
        font-size: 25px;
      }
      .layers {
        font-size: 10px;
      }
    }
  }
}

</style>
