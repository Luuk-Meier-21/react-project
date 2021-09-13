import React from 'react';
import Matter from 'matter-js';
import Opentype from 'opentype.js';
import p5 from 'p5';
import { PRendererBody, RenderDeps } from './_core.render'

export default class Char extends PRendererBody {
	public initialX: number = 0;
	public initialY: number = 0;

    public compStyle: any = window.getComputedStyle(this.element);;
    public fontSize: number = this.pxToNum(this.compStyle.fontSize);;
    public text: string = this.element.innerText;
    public points: p5.Vector[][] = this.font.textToPoints(this.text, 0, 0, this.fontSize, {
        sampleFactor: 1,
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
        console.log(console.log(Opentype))
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
        
        // Element measurements
        const [ew, eh] = [this.element.offsetWidth, this.element.offsetHeight];
        const [ex, ey] = [this.element.offsetLeft, this.element.offsetTop];

        // Global measurements
        this.initialX = ex + (ew / 2);
        this.initialY = ey + (eh / 2);
        const fontY = (bounds.h / 2) + pointsCenter.y

        // Bodies
        const elementBox = Matter.Bodies.rectangle(this.initialX, this.initialY, ew, eh, {
            isSensor: true
        });
        const convex: any = Matter.Bodies.fromVertices(0, 0, convexPoints as any, {
            position: {
                x: convexCenter.x - bounds.x,
                y: fontY + baselineCenterY
            },
            isSensor: true,
            mass: 0
        });
        

        const fontConvex = Matter.Body.create({
            vertices: points,
            position: {
                x: pointsCenter.x - bounds.x,
                y: fontY + baselineCenterY
            },
            slop: 100,
            mass: 10
        })

        Matter.Body.translate(convex, {
            x: this.initialX - ew / 2 + this.bounds.x,
            y: 0
        })

        // Translate
        Matter.Body.translate(fontConvex, {
            x: this.initialX - ew / 2 + this.bounds.x,
            y: 0
        })

        // Combine all bodies
        const body = Matter.Body.create({
            parts: [
                // elementBox,
                // boundBox,
                convex,
                fontConvex
            ],
            // isStatic: true
            // isStatic: true
        });
        // Set center to center of span element.
        Matter.Body.setCentre(body, {
            x: ex + (ew / 2),
            y: ey  + (eh / 2)
        })
        return body;
    }

    public render(): void {
        if(this.visible) {
			const {x, y} = this.matterBody.position;
			const angle = this.matterBody.angle;
			this.element.style.transform = 
				this.translate(
                    x - this.initialX, 
                    y - (this.initialY)
                ) + 
				this.rotate(angle);
		}

        // const p = this.deps.p;
        // p.push()
        // const ox = (this.center.x - this.bounds.x)
        // console.log(ox)
        // const oy = 0;
        // const offx = 400 - (this.center.x)
        // p.translate(400, 400)
        // p.fill('green')
        // p.beginShape();
        // for (let i = 0; i < this.points.length; i++) {
        //     const point: any = this.points[i];
        //     p.vertex(point.x, point.y)
        // }
        // p.endShape(p.CLOSE);
        // p.pop()
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