import Matter from 'matter-js';
import { PRendererBody, RenderDeps } from './_core.render'

export default class Rect extends PRendererBody {
	private matterBody: Matter.Body;

	constructor(
		public x: number, 
		public y: number, 
		public w: number, 
		public h: number,
		public deps: RenderDeps,
		public options: Matter.IChamferableBodyDefinition
	) {
		super(deps, options);
		this.type = 'p5';
		
		this.deps.p.rectMode(this.deps.p.CENTER);
		this.matterBody = Matter.Bodies.rectangle(x, y, w, h, options);
		Matter.World.add(this.deps.w, this.matterBody);
	}

	render(): void {
		if(this.visible) {
			const {x, y} = this.matterBody.position;
			const angle = this.matterBody.angle;
			const p = this.deps.p;

			// const color: string = this.options?.render?.fillStyle || '#ffffff';
			// console.log(color)

			// p.fill(color)
			p.push();
			p.translate(x, y);
			p.rotate(angle);
			p.rect(0, 0, this.w, this.h);
			p.pop();
		}
	};
}