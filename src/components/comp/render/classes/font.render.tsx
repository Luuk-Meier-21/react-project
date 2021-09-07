import React from 'react';
import Matter from 'matter-js';
import p5 from 'p5';
import { PRendererBody, RenderDeps } from './_core.render'

export default class Char extends PRendererBody {
	public initialX: number = 0;
	public initialY: number = 0;
    public offset = {
        x: 0,
        y: 0
    }
    public center = {
        x: 0,
        y: 0
    }
    

    public compStyle: any = window.getComputedStyle(this.element);;
    public fontSize: number = this.pxToNum(this.compStyle.fontSize);;
    public text: string = this.element.innerText;
    public points: p5.Vector[][] = this.font.textToPoints(this.text, 0, 0, this.fontSize, {
        sampleFactor: .5    ,
        simplifyThreshold: 0
    });
    private matterBody: Matter.Body;
    public bounds: any = this.font.textBounds(this.text, 0, 0, this.fontSize);

	constructor(
		public element: any,
        public font: p5.Font,
        public canvas: any,
		public deps: RenderDeps,
		public options: Matter.IChamferableBodyDefinition
	) {
		super(deps, options);

		this.matterBody = this.createBody(true);
            
        this.awaitFonts(() => {
            this.matterBody = this.createBody(false);
            Matter.World.add(this.deps.w, this.matterBody);
            this.element.classList = 'is-active';
        })
    }

    public createBody(isStatic: boolean) {
        // Verticle declarations
        const points: any = this.points;
        const convexPoints = Matter.Vertices.hull(points);

        // Font measurements
        const bounds: any = this.bounds;
        const pointsCenter: any = this.convexCenter(this.points);
        const convexCenter: any = this.convexCenter(convexPoints);
        const baselineY = this.measureBaseline();
        const baselineCenterY = baselineY - bounds.h / 2;
        console.log(bounds)
        const offset: any = {
            x: pointsCenter.x - bounds.x - (bounds.w / 2),
            // x: (center.x - bounds.x) - (bounds.w / 2),
            y: (bounds.h / 2) + pointsCenter.y
        }
        
        // Element measurements
        const [ew, eh] = [this.element.offsetWidth, this.element.offsetHeight];
        const [ex, ey] = [this.element.offsetLeft, this.element.offsetTop];

        // Global measurements
        this.initialX = ex + (ew / 2);
        this.initialY = ey + (eh / 2);
        this.offset = offset;
        this.center = pointsCenter;
        this.offset = offset;

        // Bodies
        const elementBox = Matter.Bodies.rectangle(this.initialX, this.initialY, ew, eh, {
            isSensor: true
        });
        const boundBox = Matter.Bodies.rectangle(0, baselineCenterY, bounds.w, bounds.h, {
            isSensor: true
        });
        // const fontConvex: any = Matter.Bodies.fromVertices(0, 0, convexPoints as any, {
        //     position: {
        //         x: offset.x,
        //         y: offset.y + baselineCenterY
        //     }
        // });
        const fontConvex = Matter.Body.create({
            vertices: points,
            position: {
                x: this.center.x - this.bounds.x,
                y: offset.y + baselineCenterY
            },
            isStatic: true
        })
        Matter.Body.translate(fontConvex, {
            x: this.initialX,
            y: 0
        })
        console.log(this.text, bounds.x, pointsCenter.x, bounds.h, bounds.h/2);
        // console.log(this.text+ " x: ", (offset.x - bounds.x) - (bounds.w / 2),);
        
        const body = Matter.Body.create({
            parts: [
                elementBox,
                // boundBox,
                fontConvex
            ],
            isStatic: true
        });

        // // Transforms
        // Matter.Body.translate(body, {
        //     x: this.initialX,
        //     y: 0
        // });
        // Matter.Body.setCentre(body, {
        //     x: ex + (ew / 2),
        //     y: ey  + (eh / 2)
        // })
        return body;
    }

    public render(): void {
        // if(this.visible) {
		// 	const {x, y} = this.matterBody.position;
		// 	const angle = this.matterBody.angle;
		// 	this.element.style.transform = 
		// 		this.translate(
        //             x - this.initialX + this.offset.x, 
        //             y - (this.initialY)
        //         ) + 
		// 		this.rotate(angle);
		// }

        const p = this.deps.p;
        p.push()
        const ox = (this.center.x - this.bounds.x)
        console.log(ox)
        const oy = 0;
        const offx = 400 - (this.center.x)
        p.translate(400, 400)
        p.fill('green')
        p.beginShape();
        for (let i = 0; i < this.points.length; i++) {
            const point: any = this.points[i];
            p.vertex(point.x, point.y)
        }
        p.endShape(p.CLOSE);
        p.pop()
    }

    /**
     * Calculates offset 
     * @param center center vector of convex shape
     * @param bounds bounds object given 
     * @returns {Matter.Vector} of calculated offset to position center
     */
    private fontOffset(center: Matter.Vector, bounds: any): Matter.Vector {
        return {
            x: (bounds.w / 2) - center.x,
            // x: (center.x - bounds.x) - (bounds.w / 2),
            y: (bounds.h / 2) + center.y
        }
    }

    /**
     * 
     * @param points points verticles
     * @returns {Matter.Vector} of convex centriod(center) relative to points
     */

    private convexCenter(points: any): Matter.Vector {
        return Matter.Vertices.centre(points as any);
    }

    private measureBaseline(): number {
        let measured = false;
        const span = this.element.querySelector('span');
        return span.getBoundingClientRect().top;
    }

    public async awaitFonts(callback: any) {
        await (document as any).fonts.ready
        callback();
    }

    private translate(x: number, y: number): string {
		return `translate(${x}px, ${y}px)`;
	}

	private rotate(angle: number): string {
		const degs = this.deps.p.degrees(angle);
		return `rotate(${degs}deg)`;
	}

    private pxToNum(pxValue: string): number {
        return Number(pxValue.replace(/px$/, ''));
    }

    private numToPx(value: number): string {
        return `${value}px`;
    }
}