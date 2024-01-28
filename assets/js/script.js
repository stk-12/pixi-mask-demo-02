

class Main {
  constructor() {
    this.DOM = {};
    this.DOM.frame = document.querySelector('.js-frame');
    this.DOM.canvas = document.querySelector('.js-canvas');

    this.viewport = {
      width: this.DOM.canvas.clientWidth,
      height: this.DOM.canvas.clientHeight,
    }

    this.lineCount = 30;
    this.baseParams = {
      height: this.viewport.height / this.lineCount,
    }


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

    this._setupLines();

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
  }

  _setupBgVideo() {
    // const videoTexture = PIXI.Texture.from('https://pixijs.com/assets/video.mp4');
    const videoTexture = PIXI.Texture.from('assets/images/movie01.mp4');
    const videoSprite = new PIXI.Sprite(videoTexture);

    
    // ビデオのHTML要素にアクセスし、ミュートに設定します。
    const videoElement = videoTexture.baseTexture.resource.source;
    videoElement.muted = true; // ビデオをミュートに設定します。
    videoElement.loop = true; // ビデオをループに設定します。

    this._resizeVideoSprite(videoSprite);
    this.container.addChild(videoSprite);
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

    return line;
  }

  _setupLines() {
    for(let i = 0; i < this.lineCount * 0.5; i++) {
      const line = this._createLine(`line${i}`, this.baseParams.height, this.baseParams.height * 2 * i);
      this.maskChildrenContainer.addChild(line);
    }

    this.container.mask = this.maskContainer;
  }


  _setupFilter() {
    const displacementSprite = PIXI.Sprite.from('https://pixijs.com/assets/pixi-filters/displacement_map_repeat.jpg');
    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);

    this.container.filters = [displacementFilter];
    // this.maskContainer.filters = [displacementFilter];

    displacementFilter.scale.x = 200;
    displacementFilter.scale.y = 200;
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