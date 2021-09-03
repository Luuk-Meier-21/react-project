import Matter from "matter-js";
import P5 from 'p5';

export type RenderType = 'matter' | 'static';
export type TargetEnum = 'bodies' | 'effects';
export interface RenderDeps {
	w: Matter.World,
	e: Matter.Engine,
	p: P5	
}

export abstract class PRendererBody {
	public type: 'p5' | 'html' | 'none' = 'p5';
	public visible = this.options?.render?.visible === false ? this.options.render.visible : true;

	constructor(
		public deps: RenderDeps,
		public options: Matter.IChamferableBodyDefinition
	) {}
}