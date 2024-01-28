

class Main {
  constructor() {
    this.DOM = {};
    this.DOM.frame = document.querySelector('.js-frame');
    this.DOM.canvas = document.querySelector('.js-canvas');

    this.viewport = {
      width: this.DOM.canvas.clientWidth,
      height: this.DOM.canvas.clientHeight,
    }

    this.lineCount = 40;
    this.baseParams = {
      height: this.viewport.height / this.lineCount,
    }

    this.lines = {};
    this.lines2 = {};


    this.app = new PIXI.Application({
      width: this.viewport.width,
      height: this.viewport.height,
      view: this.DOM.canvas,
      backgroundAlpha: 0,
      resolution: window.devicePixelRatio || 1,
    });
    this.app.stage.eventMode = 'static';


    // this.app.ticker.add((delta) => this.update(delta));

    this._setupContainer();

    this._setupBgVideo();
    this._setupBgVideo2();

    this._setupLines();
    this._setupLines2();

    this._setupAnimation();

    // this._setupFilter();

    this._addEvent();
  }

  _setupContainer() {
    this.container = new PIXI.Container();
    this.container.name = 'container';
    this.app.stage.addChild(this.container);

    this.maskContainer = new PIXI.Container();
    this.maskContainer.name = 'maskContainer';
    this.container.addChild(this.maskContainer);

    this.maskChildrenContainer = new PIXI.Container();
    this.maskChildrenContainer.name = 'maskChildrenContainer';
    // this.container.addChild(this.maskContainer);
    this.maskContainer.addChild(this.maskChildrenContainer);



    this.maskContainer2 = new PIXI.Container();
    this.maskContainer2.name = 'maskContainer2';
    this.container.addChild(this.maskContainer2);

    this.maskChildrenContainer2 = new PIXI.Container();
    this.maskChildrenContainer2.name = 'maskChildrenContainer2';
    this.maskContainer2.addChild(this.maskChildrenContainer2);
  }

  _setupBgVideo() {
    const videoTexture = PIXI.Texture.from('assets/images/video02.mp4');
    const videoSprite = new PIXI.Sprite(videoTexture);

    // ビデオのHTML要素にアクセスし、ミュートに設定します。
    const videoElement = videoTexture.baseTexture.resource.source;
    videoElement.muted = true; // ビデオをミュートに設定します。
    videoElement.loop = true; // ビデオをループに設定します。

    this._resizeVideoSprite(videoSprite);
    // this.container.addChild(videoSprite);
    this.maskContainer.addChild(videoSprite);
  }

  _setupBgVideo2() {
    const videoTexture = PIXI.Texture.from('assets/images/video01.mp4');
    const videoSprite = new PIXI.Sprite(videoTexture);

    // ビデオのHTML要素にアクセスし、ミュートに設定します。
    const videoElement = videoTexture.baseTexture.resource.source;
    videoElement.muted = true; // ビデオをミュートに設定します。
    videoElement.loop = true; // ビデオをループに設定します。

    this._resizeVideoSprite(videoSprite);
    // this.container.addChild(videoSprite);
    this.maskContainer2.addChild(videoSprite);
  }

  _resizeVideoSprite(videoSprite) {
    const aspectRatio = 16 / 9;
    const height = this.viewport.height;
    const width = height * aspectRatio;

    videoSprite.width = width;
    videoSprite.height = height;
    videoSprite.x = (this.viewport.width - width) / 2;
  }

  _createLine(name, height, positionY) {
    const line = new PIXI.Graphics();
    line.beginFill(0x000000);
    // line.drawRect(0, 0, this.viewport.width, 50);
    line.drawRect(0, positionY, this.viewport.width, height);
    line.endFill();
    line.name = name;
    // this.lines[name] = line;

    return line;
  }

  _setupLines() {
    for(let i = 0; i < this.lineCount * 0.5; i++) {
      const line = this._createLine(`line${i}`, this.baseParams.height, this.baseParams.height * 2 * i);
      line.scale.x = 0;
      this.lines[`line${i}`] = line;
      this.maskChildrenContainer.addChild(line);
    }

    // this.container.mask = this.maskContainer;
    this.maskContainer.mask = this.maskChildrenContainer;
  }

  _setupLines2() {
    for(let i = 0; i < this.lineCount * 0.5; i++) {
      const line = this._createLine(`line${i}`, this.baseParams.height, this.baseParams.height * 2 * i);
      line.scale.x = 0;
      this.lines2[`line${i}`] = line;
      this.maskChildrenContainer2.addChild(line);
    }

    // this.container.mask = this.maskContainer;
    this.maskContainer2.mask = this.maskChildrenContainer2;
  }


  _setupFilter() {
    const displacementSprite = PIXI.Sprite.from('https://pixijs.com/assets/pixi-filters/displacement_map_repeat.jpg');
    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);

    this.container.filters = [displacementFilter];
    // this.maskContainer.filters = [displacementFilter];

    displacementFilter.scale.x = 30;
    displacementFilter.scale.y = 30;
  }

  _setupAnimation() {
    Object.keys(this.lines).forEach((key, index) => {
      const lineBody = this.lines[key];
      const tl = gsap.timeline({ repeat: -1, delay: index * 0.1 });
      tl.to(lineBody, {
        pixi: {
          scaleX: 1,
        },
        duration: 1.5,
        ease: 'power2.inOut',
      })
      .to(lineBody, {
        x: this.viewport.width,
        duration: 1.5,
        ease: 'power2.inOut',
      }, '+=2.0')
    });

    Object.keys(this.lines2).forEach((key, index) => {
      const lineBody = this.lines2[key];
      const tl = gsap.timeline({ repeat: -1, delay: 2.5 + index * 0.1 });
      tl.to(lineBody, {
        pixi: {
          scaleX: 1,
        },
        duration: 1.5,
        ease: 'power2.inOut',
      })
      .to(lineBody, {
        x: this.viewport.width,
        duration: 1.5,
        ease: 'power2.inOut',
      }, '+=2.0')
    });
  }

  update(delta) {

  }

  reseize() {
    this.viewport.width = this.DOM.canvas.clientWidth;
    this.viewport.height =this.DOM.canvas.clientHeight;
    this.app.renderer.resize(this.viewport.width, this.viewport.height);
  }

  _addEvent() {
    window.addEventListener('resize', this.reseize.bind(this));
  }
}
window.addEventListener('load', () => {
  new Main();
});