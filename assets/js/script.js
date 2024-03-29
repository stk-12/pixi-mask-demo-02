

class Main {
  constructor() {
    this.DOM = {};
    this.DOM.frame = document.querySelector('.js-frame');
    this.DOM.canvas = document.querySelector('.js-canvas');

    this.viewport = {
      width: this.DOM.canvas.clientWidth,
      height: this.DOM.canvas.clientHeight,
    }

    this.lineCount = 16;
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


    this.app.ticker.add((delta) => this.update(delta));

    this.displacementFilter = null;

    this._setupContainer();

    this._initBgVideo();

    this._initLines();

    this._initAnimation();

    this._setupFilter();

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

  _initBgVideo() {
    this._setupBgVideo('assets/images/video02.mp4', this.maskContainer);
    this._setupBgVideo('assets/images/video01.mp4', this.maskContainer2);
  }

  _setupBgVideo(path, parentContainer) {
    const videoTexture = PIXI.Texture.from(path);
    const videoSprite = new PIXI.Sprite(videoTexture);

    // ビデオのHTML要素にアクセスし設定を変更
    const videoElement = videoTexture.baseTexture.resource.source;
    videoElement.muted = true; // ミュート設定
    videoElement.loop = true; // ループ設定

    this._resizeVideoSprite(videoSprite);
    parentContainer.addChild(videoSprite);
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
    line.drawRect(0, positionY, this.viewport.width, height);
    line.endFill();
    line.name = name;

    return line;
  }

  _initLines() {
    this._setupLines(this.lines, this.maskContainer, this.maskChildrenContainer);
    this._setupLines(this.lines2, this.maskContainer2, this.maskChildrenContainer2);
  }

  _setupLines(linesGroup, maskContainer, parentContainer) {
    for(let i = 0; i < this.lineCount * 0.5; i++) {
      const line = this._createLine(`line${i}`, this.baseParams.height, this.baseParams.height * 2 * i);
      line.scale.x = 0;
      linesGroup[`line${i}`] = line;
      parentContainer.addChild(line);
    }

    maskContainer.mask = parentContainer;
  }


  _setupFilter() {
    const displacementSprite = PIXI.Sprite.from('https://pixijs.com/assets/pixi-filters/displacement_map_repeat.jpg');
    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    this.displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);

    this.container.filters = [this.displacementFilter];
    // this.maskContainer.filters = [displacementFilter];

    // this.displacementFilter.scale.x = 0;
    // this.displacementFilter.scale.y = 30;
  }

  _setupFilterAnimation() {
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(this.displacementFilter, {
      duration: 2,
      pixi: {
        scaleY: 30.0,
      },
      ease: 'power2.inOut',
    })
    .to(this.displacementFilter, {
      duration: 2,
      pixi: {
        scaleY: 0,
      },
      ease: 'power2.inOut',
    });
  }

  _initAnimation() {
    this._setupAnimation(this.lines, 0);
    this._setupAnimation(this.lines2, 2.5);
    this._setupFilterAnimation();
  }

  _setupAnimation(linesGroup, delay) {
    Object.keys(linesGroup).forEach((key, index) => {
      const lineBody = linesGroup[key];
      const tl = gsap.timeline({ repeat: -1, delay: delay + index * 0.1 });
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
    // this.displacementFilter.scale.y += 0.1;
    // this.displacementFilter.scale.y = 30 * Math.cos(0.01 * delta);

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