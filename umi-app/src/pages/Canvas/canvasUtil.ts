const getRandom = (min: number, max: number) => {
	return Math.floor(Math.random() * (max + 1 - min) + min);
};

class Point {
	r: number;
	x: number;
	y: number;
	xSpeed: number;
	ySpeed: number;
	ctx: CanvasRenderingContext2D;
	lastDrawTime: number;
	cvs: HTMLCanvasElement;
	constructor(
		cvs: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
		speed = 30
	) {
		this.ctx = ctx;
		this.cvs = cvs;
		this.r = 3 * devicePixelRatio;
		this.x = getRandom(this.r / 2, cvs.width - this.r / 2);
		this.y = getRandom(this.r / 2, cvs.height - this.r / 2);
		this.xSpeed = getRandom(-speed, speed);
		this.ySpeed = getRandom(-speed, speed);
		this.lastDrawTime = 0;
	}

	draw() {
		//更新坐标
		if (this.lastDrawTime) {
			const duration = (Date.now() - this.lastDrawTime) / 1000;
			const xDis = this.xSpeed * duration,
				yDis = this.ySpeed * duration;
			let x = this.x + xDis,
				y = this.y + yDis;
			if (x > this.cvs.width - this.r) {
				x = this.cvs.width - this.r;
				this.xSpeed = -this.xSpeed;
			} else if (x < this.r) {
				x = this.r;
				this.xSpeed = -this.xSpeed;
			}
			if (y > this.cvs.height - this.r) {
				y = this.cvs.height - this.r;
				this.ySpeed = -this.ySpeed;
			} else if (y < this.r) {
				y = this.r;
				this.ySpeed = -this.ySpeed;
			}
			this.x = x;
			this.y = y;
		}
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, true);
		this.ctx.fillStyle = '#333';
		this.ctx.fill();
		this.lastDrawTime = Date.now();
	}
}

class Graph {
	pointNumber: number;
	maxPath: number;
	cvs: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	points: Point[];
	constructor(pointNumber = 50, maxPath = 200) {
		this.maxPath = maxPath;
		this.pointNumber = pointNumber;
		this.cvs = document.querySelector('canvas')!;
		this.ctx = this.cvs.getContext('2d')!;
		const root = document.getElementById('root')!;
		this.cvs.width = root.scrollWidth * devicePixelRatio;
		this.cvs.height = window.innerHeight * devicePixelRatio;
		this.points = new Array(this.pointNumber)
			.fill(0)
			.map(() => new Point(this.cvs, this.ctx));
	}

	init() {
		requestAnimationFrame(() => {
			this.init();
		});
		this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
		this.points.forEach((item, index) => {
			item.draw();
			this.points.forEach((nextItem, nextIndex) => {
				const length = Math.sqrt(
					Math.pow(item.x - nextItem.x, 2) + Math.pow(item.y - nextItem.y, 2)
				);
				if (index !== nextIndex && length < this.maxPath) {
					this.ctx.beginPath();
					this.ctx.lineTo(item.x, item.y);
					this.ctx.lineTo(nextItem.x, nextItem.y);
					this.ctx.closePath();
					this.ctx.strokeStyle = `rgba(0,0,0,${1 - length / this.maxPath})`;
					this.ctx.stroke();
				}
			});
		});
	}

	draw() {}
}

export { Point, Graph };
