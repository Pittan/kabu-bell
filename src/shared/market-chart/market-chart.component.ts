import { Component, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core'

const GRAPH_FILL_COLOR = '#427B00'
const GRAPH_STROKE_COLOR = '#427B00'

const BG_1 = '#FFEFDD'
const BG_2 = '#E8D4BD'

const BASE_PRICE_COLOR = 'rgb(129,55,0)'
const BASE_PRICE_COLOR_TRANSPARENT = 'rgba(129,55,0, .6)'
const FOOTER_HEIGHT = 20

// const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const WEEKDAYS = ['月', '火', '水', '木', '金', '土']

interface Radius {
  tl: number
  tr: number
  br: number
  bl: number
}

@Component({
  selector: 'app-market-chart',
  templateUrl: './market-chart.component.html',
  styleUrls: ['./market-chart.component.sass']
})
export class MarketChartComponent implements AfterViewInit {

  @ViewChild('graph', { read: ElementRef }) graph: ElementRef<HTMLCanvasElement>

  private context: CanvasRenderingContext2D

  @Input() islandName: string

  @Input()
  set data (d: number[]) {
    this._data = d
    this.render()
  }

  get data () {
    return this._data
  }

  @Input()
  set basePrice (p: number) {
    this._basePrice = Number(p || 0)
    this.render()
  }

  get basePrice () {
    return this._basePrice
  }

  @Input()
  set referencePrice (p: number) {
    this._referencePrice = Number(p || 0)
    this.render()
  }

  get referencePrice () {
    return this._referencePrice
  }

  private _referencePrice = 0
  private _data: number[] = []
  private _basePrice = 0

  private graphRect = { width: 0, height: 0 }
  private graphBase = { x: 0, y: 0 }
  private offSetY = 0
  private offSetX = 0

  private heightPerUnit = 0

  private pitchX = 0

  private initialized = false

  private static truncateString (str: string, len: number = 20) {
    return str.length <= len ? str : (str.substr(0, len) + '...')
  }

  /**
   * Setup canvas with hi-DPI support
   */
  setupCanvas (): CanvasRenderingContext2D {
    const canvas = this.graph.nativeElement
    const context = canvas.getContext('2d')
    // let dpr = window.devicePixelRatio || 1
    let dpr = 4 // for hi-quality png export, set to 4x
    let rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    context.scale(dpr, dpr)
    return context
  }

  /**
   * Render background with nice stripes
   */
  private renderBackground (context: CanvasRenderingContext2D): void {
    const width = this.graphRect.width / 6
    const height = this.graphRect.height
    WEEKDAYS.forEach((val, i) => {
      context.fillStyle = i % 2 ? BG_2 : BG_1
      context.fillRect((i * width) + this.offSetX, this.offSetY, width, height - FOOTER_HEIGHT)
    })

    const logo = new Image()
    logo.onload = () => {
      context.drawImage(logo, 0, 0, 96, 96, this.offSetX + 10, this.offSetY + 10, 20, 20)
    }
    logo.src = 'assets/icons/graph-watermark.png'

  }

  private renderLine (context: CanvasRenderingContext2D, bellPrice: number, lineWidth: number, dash: number): void {
    if (!bellPrice) return
    context.beginPath()
    context.setLineDash([dash, dash])
    context.moveTo(this.offSetX, this.graphBase.y - this.heightPerUnit * bellPrice)
    context.lineTo(this.offSetX + this.graphRect.width, this.graphBase.y - this.heightPerUnit * bellPrice)
    context.strokeStyle = BASE_PRICE_COLOR_TRANSPARENT
    context.fillStyle = BASE_PRICE_COLOR_TRANSPARENT
    context.lineWidth = lineWidth
    context.stroke()  // サブパスを描画
  }

  private renderGuide (basePrice?: number, referencePrice?: number) {
    const WIDTH_PER_DATA = 100
    if (!basePrice && !referencePrice) return

    let width = 0
    if (basePrice) width += WIDTH_PER_DATA
    if (referencePrice) width += WIDTH_PER_DATA

    this.context.fillStyle = 'rgba(255, 255, 255, .8)'
    const height = 20
    const padding = 10
    const x = this.graphRect.width - padding - width + this.offSetX
    this.roundRect(this.context, x, this.offSetY + padding, width, height, 5, true, false)

    this.context.strokeStyle = BASE_PRICE_COLOR_TRANSPARENT
    this.context.fillStyle = BASE_PRICE_COLOR_TRANSPARENT

    const renderPrice = (context, text, subText, pointX, pointY) => {
      this.context.fillStyle = BASE_PRICE_COLOR
      context.font = '10px sans-serif'
      const numberTxt = `${text}`
      this.context.fillText(numberTxt , pointX, pointY)
      const textWidth = this.context.measureText(numberTxt).width
      this.context.font = '8px sans-serif'
      this.context.fillText(`${subText}` , pointX + textWidth, pointY)
    }

    if (basePrice) {
      this.context.beginPath()
      this.context.setLineDash([4, 4])
      this.context.moveTo(x + 8, this.offSetY + padding + 10.5)
      this.context.lineTo(x + 28, this.offSetY + padding + 10.5)
      this.context.lineWidth = 2
      this.context.stroke()  // サブパスを描画
      renderPrice(this.context, basePrice, 'ベル(買値)', x + 28 + 4, this.offSetY + padding + 14)
    }

    if (referencePrice) {
      this.context.beginPath()
      this.context.setLineDash([2, 2])
      this.context.lineWidth = 1
      this.context.moveTo(x + WIDTH_PER_DATA + 8, this.offSetY + padding + 11)
      this.context.lineTo(x + WIDTH_PER_DATA + 28, this.offSetY + padding + 11)
      this.context.stroke()  // サブパスを描画
      renderPrice(this.context, referencePrice, 'ベル(参考)', x + WIDTH_PER_DATA + 28 + 4, this.offSetY + padding + 14)
    }
  }

  private renderPlotLabel (context: CanvasRenderingContext2D, data: number[], baseBellPrice: number, referencePrice?: number) {
    // label
    this.context.textBaseline = 'bottom'
    this.context.textAlign = 'center'
    this.context.fillStyle = '#424242'
    data.forEach((val, i) => {
      if (this.data[i] === 0) return
      let x = this.graphBase.x + i * this.pitchX
      let y = this.graphBase.y - this.heightPerUnit * data[i] - 8
      const isNextDataIsGreater = data[i + 1] && data[i + 1] >= data[i]
      const isPreviousDataIsGreater = data[i - 1] && data[i - 1] >= data[i]
      const isNextDataIsVeryDecreasing = !data[i + 1] || (data[i + 1] && data[i + 1] * 2 > data[i])

      const isVeryIncreasing = data[i - 1] * 1.8 <= data[i]
      let isShowingUnder = false

      if (isNextDataIsGreater || (isPreviousDataIsGreater && isNextDataIsVeryDecreasing)) {
        // 下に表示する
        y = this.graphBase.y - this.heightPerUnit * data[i] + 18
        isShowingUnder = true
      }

      if (isShowingUnder && isVeryIncreasing) {
        x -= 16
        y = this.graphBase.y - this.heightPerUnit * data[i] + 5
      }

      context.fillText(`${data[i]}`, x, y)
    })
  }

  ngAfterViewInit () {
    this.initialized = true
    this.context = this.setupCanvas()
    this.render()
  }

  clear () {
    const element = this.graph.nativeElement
    this.context.clearRect(0, 0, element.width, element.height)
  }

  render () {
    if (!this.initialized) return
    this.clear()
    const element = this.graph.nativeElement
    this.offSetX = 8
    let groundW = element.clientWidth - this.offSetX * 2 // グラフ領域W
    this.offSetY = (element.clientHeight / 10)
    let groundH = element.clientHeight - this.offSetY // グラフ領域H
    let groundX0 = 16 + this.offSetX      // 原点位置(16)
    let groundY0 = groundH + this.offSetY - FOOTER_HEIGHT   // 原点位置(300)

    this.graphRect = { height: groundH, width: groundW }
    this.graphBase = { x: groundX0, y: groundY0 }

    let pichX = groundW / this.data.length
    this.pitchX = pichX

    const DmYMx = Math.max(...this.data, this.basePrice)
    this.heightPerUnit = (groundH - 90) / DmYMx

    this.context.fillStyle = '#ffffff'
    this.roundRect(this.context, 0, 0, element.clientWidth, element.clientHeight, 5, true, false)

    this.context.beginPath()                  // 現在のパスをリセット
    this.context.save()                       // 現在の描画条件を保管


    const baseBellPrice = this.basePrice
    const referencePrice = this.referencePrice
    this.renderBackground(this.context)

    this.renderLine(this.context, baseBellPrice, 2, 4)
    this.renderLine(this.context, referencePrice, 1, 2)
    this.renderGuide(baseBellPrice, referencePrice)

    // X軸描画
    this.context.restore()
    this.context.textAlign = 'center'
    this.context.textBaseline = 'top'
    this.context.fillStyle = '#616161'
    const pitch = groundW / WEEKDAYS.length
    WEEKDAYS.forEach((val, i) => {
      const textWidth = this.context.measureText(val).width
      this.context.fillText(val , groundX0 + (i * pitch) + (pitch / 2) - textWidth - 4, groundH + this.offSetY - FOOTER_HEIGHT + 4)
    })

    this.context.textAlign = 'left'
    this.context.textBaseline = 'bottom'
    this.context.font = '12px sans-serif'
    const islandName = `${MarketChartComponent.truncateString(this.islandName)}`
    const textWidth = this.context.measureText(islandName).width

    this.context.font = '10px sans-serif'
    const suffix = '島のカブ価'
    const suffixWidth = this.context.measureText(suffix).width


    const labelStartX = (this.graphRect.width / 2) - ((textWidth + suffixWidth) / 2) + 6
    this.context.font = '12px sans-serif'
    this.context.fillText(islandName, labelStartX, this.offSetY)

    this.context.font = '10px sans-serif'
    this.context.fillText(suffix , labelStartX + textWidth, this.offSetY)

    // line
    this.context.restore()                    // 描画条件を元に戻す
    this.context.beginPath()                  // 現在のパスをリセット
    this.context.fillStyle = GRAPH_FILL_COLOR
    this.context.strokeStyle = GRAPH_STROKE_COLOR
    this.context.lineWidth = 2
    for (let i = 0; i < this.data.length; i++) {
      if (!this.data[i]) continue
      this.context.moveTo(this.graphBase.x + i * pichX, this.graphBase.y - this.heightPerUnit * this.data[i])
      if (i !== 0) {
        const candidate = this.data.map((d, index) => ({ value: d, index })).filter(v => {
          if (v.index >= i) return false
          return v.value > 0
        })
        if (!candidate.length) continue
        const targetIndex = candidate[candidate.length - 1].index
        this.context.lineTo(this.graphBase.x + (targetIndex) * pichX, this.graphBase.y - this.heightPerUnit * this.data[targetIndex])
      }
    }
    this.context.stroke()                     // サブパスを描画

    // dot
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i] === 0) continue
      this.context.beginPath()
      const x = this.graphBase.x + i * pichX
      const y = this.graphBase.y - (this.heightPerUnit * this.data[i])
      this.context.arc(x, y, 4, 0, Math.PI * 2, false)
      this.context.fill()
    }

    this.renderPlotLabel(this.context, this.data, baseBellPrice, referencePrice)
    this.context.restore()                    // 描画条件を元に戻す
  }

  // tslint:disable-next-line:max-line-length
  private roundRect (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: Radius | number, fill: boolean, stroke: boolean) {
    if (typeof stroke === 'undefined') {
      stroke = true
    }
    if (typeof radius === 'undefined') {
      radius = 5
    }
    if (typeof radius === 'number') {
      radius = { tl: radius, tr: radius, br: radius, bl: radius }
    } else {
      const defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 }
      for (const side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side]
      }
    }
    ctx.beginPath()
    ctx.moveTo(x + radius.tl, y)
    ctx.lineTo(x + width - radius.tr, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
    ctx.lineTo(x + width, y + height - radius.br)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height)
    ctx.lineTo(x + radius.bl, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
    ctx.lineTo(x, y + radius.tl)
    ctx.quadraticCurveTo(x, y, x + radius.tl, y)
    ctx.closePath()
    if (fill) {
      ctx.fill()
    }
    if (stroke) {
      ctx.stroke()
    }

  }
}
