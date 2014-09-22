var stage, 
	renderer;
	
function init() {
	stage = new PIXI.Stage(0x04BEA8, true);
	renderer = PIXI.autoDetectRenderer(480, 320);
	document.body.appendChild(renderer.view);

/*draw shape */
	var shape = new PIXI.Graphics();
	shape.drawRect(0,0,200,200);
	shape.setInteractive(true);
	stage.addChild(shape);
/*draw shape */
	
	var texture = shape.generateTexture();
	var sprite = new PIXI.Sprite(texture);
	sprite.setInteractive(true);
    sprite.buttonMode = true;
	sprite.anchor.set(0.5, 0.5);
	sprite.position.set(340, 160);
	sprite.mouseover = function(mouseData){
	
		stage1 = PIXI.texture(0xf0f0f0, true);

		this.isdown = true;
		this.texture(stage1);
		
		console.log(stage);
	};
	sprite.mouseout = function(mouseData){
		console.log(stage);
	};
	sprite.click = function(mouseData){
		console.log('MOUSE CLICK SPRITE');
	};
	stage.addChild(sprite);
	update();
}
function update() {
	requestAnimFrame(update);
	renderer.render(stage);
}
init();