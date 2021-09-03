import React from 'react';
import Matter from 'matter-js';
import p5 from 'p5';
import { PRendererBody, RenderDeps } from './_core.render'

export default class Char extends PRendererBody {
	public initialX: number = 0;
	public initialY: number = 0;

    public compStyle: any = window.getComputedStyle(this.element);;
    public fontSize: number = this.pxToNum(this.compStyle.fontSize);;
    public text: string = this.element.innerText;
    public points: p5.Vector[][] = this.font.textToPoints(this.text, 0, 0, this.fontSize, {
        sampleFactor: .5    ,
        simplifyThreshold: 0
    });
    private matterBody: Matter.Body;

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
        const bounds: any = this.font.textBounds(this.text, 0, 0, this.fontSize);
        const center: any = Matter.Vertices.centre(this.points as any);
        const baselineY = this.measureBaseline();

        const [ew, eh] = [this.element.offsetWidth, this.element.offsetHeight];
        const [ex, ey] = [this.element.offsetLeft, this.element.offsetTop];
        const coX = (center.x - bounds.x) - (bounds.w / 2);
        const coY = (bounds.h / 2) + center.y;
        
        this.initialX = ex + (ew / 2);
        this.initialY = ey + (eh / 2);   

        const elementBox = Matter.Bodies.rectangle(0, this.initialY, ew, eh);
        const boundBox = Matter.Bodies.rectangle(0, baselineY - (bounds.h /2), bounds.w, bounds.h);
        // Mouse contraint not working on bodys
        const fontVertex: any = Matter.Body.create({
            position: {
                x: coX,
                y: coY
            },
            vertices: this.points as any,
            // isStatic: true,
        });
        const fontConvex: any = Matter.Bodies.fromVertices(coX, coY, this.points, {
            isStatic: true
        });  

        Matter.Body.translate(fontConvex, {
            x: 0,
            y: baselineY - bounds.h / 2
        });

        const body = Matter.Body.create({
            parts: [
                fontVertex,
                fontConvex,
                // boundBox
            ],
            isStatic: true
        });
        Matter.Body.translate(body, {
            x: this.initialX,
            y: 0
        });
        return body;
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

    public render(): void {
        // TODO: Align element y to position of body (avoid the sink probleem)
        // if(this.visible) {
		// 	const {x, y} = this.matterBody.position;
		// 	const angle = this.matterBody.angle;
		// 	this.element.style.transform = 
		// 		this.translate(x - this.initialX, y - (this.initialY)) + 
		// 		this.rotate(angle);
		// }
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

class ConvexBody {

} 

// export class Font extends PRendererBody {
// 	private matterBody: Matter.Body;
//     public points: any;
//     public bounds: any;

// 	constructor(
// 		public initialX: number, 
// 		public initialY: number, 
//         public font: p5.Font,
//         public text: string,
//         public size: number,
// 		public deps: RenderDeps,
// 		public options: Matter.IChamferableBodyDefinition
// 	) {
// 		super(deps, options);
//         this.points = this.font.textToPoints(this.text, 0, 0, this.size, {
//             sampleFactor: 1
//         })
//         this.bounds = this.font.textBounds(this.text, 0, 0, this.size);
//         const [bw, bh] = [this.bounds.w, this.bounds.h];
        
//         const fontCollider = Matter.Bodies.fromVertices(0, 0, this.points, {
//             isStatic: true
//         });
//         console.log(this.text, this.bounds.x, this.bounds.h + this.bounds.y)
       
        
//         const {min, max} = fontCollider.bounds;
//         const w = max.x - min.x;
//         const h = max.y - min.y;
        
//         const fontBounds = Matter.Bodies.rectangle(0, 0, w, h)

//         Matter.Body.setCentre(fontCollider, {
//             x: 100,
//             y: 100
//         })
//         // Matter.Body.translate(fontCollider, {
//         //     x: 0,
//         //     y: 0
//         // })
        
//         this.matterBody = Matter.Body.create({
//             parts: [fontCollider, fontBounds],
//             isStatic: true
//         });

//         Matter.Body.translate(this.matterBody, {
//             x: this.initialX,
//             y: this.initialY
//         })

//         console.log()

//         // TODO: add matterbody to world
// 		// this.matterBody = Matter.Bodies.rectangle(x, y, w, h, options);
// 		Matter.World.add(this.deps.w, this.matterBody);
// 	}

// 	render(): void {
// 		if(this.visible) {
// 			const {x, y} = this.matterBody.position;
//             const b = this.bounds      
// 			const angle = this.matterBody.angle;
// 			const p = this.deps.p;

//             p.push();
//             // p.translate(x, y);
// 			// p.rotate(angle);
//             // p.textSize(this.size);
//             // p.textFont('Roboto');
//             // p.fill(10, 10, 10);
//             // p.text(this.text, - this.bounds.w / 2, this.bounds.h / 2);


//             // p.rectMode(this.deps.p.CENTER);
		
// 		}
// 	};
// }