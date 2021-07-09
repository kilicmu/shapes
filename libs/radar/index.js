import {createLayer} from "../utils/helpers.js"

export class Radar {
    constructor(target, width, height, states, options = {angleCount: 6, strokeColor: "#aaa", fillColor: "rgba(100, 200, 0, 0.5)"}) {
        this.target = typeof target === 'string' ? document.querySelector(target) : target
        this.canvas = null
        this.ctx = null
        this.width = width
        this.height = height
        this._centerPoint = {x: width / 2, y: height / 2}
        this.states = states
        this._radius = Math.min(height / 2, width / 2) - 20
        this.angleCount = options.angleCount
        this.strokeColor = options.strokeColor
        this.fillColor = options.fillColor
        this.tier = 4 // 层级
        this.stateVertices = null // a array likes [{x: undefined, y: undefined}]
        this.initializeCanvas()
        this.initStateVertices()
        this.initEvents(this.canvas)
        this.draw()
        
    }

    initializeCanvas() {
        const canvas = document.createElement('canvas')
        canvas.width = this.width
        canvas.height = this.height
        this.target.appendChild(canvas)
        this.canvas = canvas
        const ctx = canvas.getContext('2d')
        this.ctx = ctx
    }

    initEvents(dom) {
        // TODO add dom Events
        dom && dom.addEventListener('mousemove', ({clientX, clientY}) => {
            const rect = dom.getBoundingClientRect()
            const x = clientX - rect.left
            const y = clientY - rect.top
            for(const p of this.stateVertices) {
                if(
                    p.x + 4 > x &&
                    p.x - 4 < x &&
                    p.y + 4 > y &&
                    p.y - 4 < y 
                ){
                    const ctx = this.ctx
                    this.draw(1)
                    ctx.beginPath()
                    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2, true)
                    
                    ctx.fillStyle = this.fillColor
                    ctx.fill()
                    ctx.beginPath()
                    ctx.fillStyle = 'green'
                    ctx.font = '16px serif'
                    ctx.fillText(p.label, p.x + 10, p.y + 10, this.width / 2)
                    ctx.fill()
                    dom.style = "cursor: pointer;"
                    return
                }
            }
            dom.style = ""
            this.draw(1)
        })
        
    }

    draw(percent = 0) {
        if(percent > 1.01) {
            return
        }
        const ctx = this.ctx
        const n = this.tier
        let vertices = this.stateVertices
        ctx.clearRect(0, 0, this.width, this.height)
        ctx.beginPath()
        ctx.save()

        for(let i = 0; i < n; i++) {
            const ratio = 1 / n * (n - i)
            if(i === 0) {
                vertices = this.drawRadar(ratio)
            } else {
                this.drawRadar(ratio)
            }
        }

        this.drawLines({x: this.width / 2, y: this.height / 2}, vertices)
        this.drawStates(percent);
        ctx.restore()
        // this.drawLabels(vertices)
        requestAnimationFrame(() => this.draw(percent + 1 / this.angleCount))
    }

    drawStates(percent) {
        const canvas = createLayer(this.width, this.height)
        const ctx = canvas.getContext('2d')
        const parentCtx = this.ctx
        const r = this._radius
        const vertices = this.stateVertices
        
        ctx.clearRect(0, 0, this.width, this.height)
        ctx.beginPath()
        ctx.arc(r, r, r, 0, Math.PI * 2 * percent, false)
        ctx.lineTo(this.width / 2, this.height / 2)
        ctx.clip()
        ctx.beginPath()
        ctx.moveTo(vertices[0].x, vertices[0].y)
        for(let i = 1; i < this.angleCount; i++) {
            const v = vertices[i]
            ctx.lineTo(v.x, v.y)
        }
        ctx.fillStyle = this.fillColor
        ctx.fill()
        parentCtx.drawImage(canvas, 0, 0)
    }

    generateVerticesByRadiusAndRadian(radius, radian) {
        return {
            x: radius * Math.cos(radian) + this.width / 2,
            y: radius * Math.sin(radian) + this.height / 2
        }
    }

    initStateVertices() {
        const states = this.states
        console.log(states)
        const vertices = []
        const ctx = this.ctx
        const baseLen = this._radius
        const n = this.angleCount
        if(n > states.length) {
            throw new Error('states count less then angle count, check your states counts')
        }
        for (let i = 0; i < n; i++) {
            console.log(states[i].proportion)
          const r = states[i].proportion * baseLen
          const p = this.generateVerticesByRadiusAndRadian(r, 2 * Math.PI * i / n)
          p.label = this.states[i].label
          vertices.push(p)
        }
        this.stateVertices = vertices
        return vertices
    }

    drawLabels(labelPositions) {
        const ctx = this.ctx;
        ctx.save()
        
        const canvas = createLayer(this.width, this.height)
        const fontCtx = canvas.getContext("2d")
        for(let p of labelPositions) {
            const {x, y} = p
            fontCtx.fillText('hello', x, y)
        }
        
        
        fontCtx.translate(this._centerPoint.x, this._centerPoint.y)
        fontCtx.rotate(-Math.PI/2)
        fontCtx.translate(-this._centerPoint.x, -this._centerPoint.y)
        ctx.drawImage(canvas, 0, 0)
        ctx.restore()
    }

    drawLines(from, points) {
        const ctx = this.ctx
        ctx.strokeStyle = this.strokeColor
        for(const point of points) {
            ctx.beginPath()
            const { x,y } = point
            ctx.moveTo(from.x, from.y)
            ctx.lineTo(x, y)
            ctx.stroke()
        }
    }

    drawRadar(ratio = 1) {
        const r = this._radius * ratio
        const n = this.angleCount
        const ctx = this.ctx
        const vertices = []

        ctx.beginPath()
        ctx.save()

        for (let i = 0; i < this.angleCount + 1; i++) {
          const { x,y } = this.generateVerticesByRadiusAndRadian(r, 2 * Math.PI * i / n)
          ctx.lineTo(x, y)
          ctx.strokeStyle = this.strokeColor
          vertices.push({x, y})
        }
        ctx.stroke()
       
        ctx.restore()
        return vertices
    }
}