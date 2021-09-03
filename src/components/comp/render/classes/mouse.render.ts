import Matter from "matter-js";

export default class Mouse {
	mouse = Matter.Mouse.create(this.render.canvas);
	mouseConstraint = Matter.MouseConstraint.create(this.engine, {
		mouse: this.mouse,
		constraint: {
			stiffness: 0.2,
			render: {
				visible: false
			}
		}
	} as any);
	
	constructor(
		public render: Matter.Render, 
		public engine: Matter.Engine
	) {
		this.mouseConstraint.mouse.element.addEventListener("mousewheel", ()=> {});
		this.mouseConstraint.mouse.element.addEventListener("DOMMouseScroll", ()=> {});
		Matter.World.add(engine.world, this.mouseConstraint);
	}
}