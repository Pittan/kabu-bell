import { Component, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core'
import {
  BASE_PRICE_COLOR,
  BASE_PRICE_COLOR_TRANSPARENT,
  BG_1,
  BG_2, BG_WHITE, CHART_EXTERNAL_PADDING_X, CHART_INTERNAL_PADDING_X, FONT_SIZE_10PX, FONT_SIZE_12PX, FONT_SIZE_8PX,
  FOOTER_HEIGHT,
  GRAPH_FILL_COLOR, GRAPH_PLOT_COLOR,
  GRAPH_STROKE_COLOR, GUIDE_BACKGROUND_COLOR, WEEKDAY_LABEL_COLOR
} from './market-chart-design'

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
  private _basePrice = 0
  private _data: number[] = []

  // チャートのサイズ
  private graphRect = { width: 0, height: 0 }
  // チャートの原点
  private graphBase = { x: 0, y: 0 }
  private offSetY = 0
  private offSetX = CHART_EXTERNAL_PADDING_X

  // 1ベルあたりのheight
  private heightPerUnit = 0
  // 1プロットするごとにx方向にいくつ進むか
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

    // Render watermark logo
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

  /**
   * Render Guide
   */
  private renderGuide (context: CanvasRenderingContext2D, basePrice?: number, referencePrice?: number) {
    const WIDTH_PER_DATA = 100
    if (!basePrice && !referencePrice) return

    let width = 0
    if (basePrice) width += WIDTH_PER_DATA
    if (referencePrice) width += WIDTH_PER_DATA

    context.fillStyle = GUIDE_BACKGROUND_COLOR
    const height = 20
    const padding = 10
    const x = this.graphRect.width - padding - width + this.offSetX
    this.roundRect(context, x, this.offSetY + padding, width, height, 5, true, false)

    context.strokeStyle = BASE_PRICE_COLOR_TRANSPARENT
    context.fillStyle = BASE_PRICE_COLOR_TRANSPARENT

    /**
     * Render price
     */
    const renderPriceText = (context: CanvasRenderingContext2D, text: number, subText: string, pointX: number, pointY: number) => {
      context.fillStyle = BASE_PRICE_COLOR
      context.font = FONT_SIZE_10PX
      const numberTxt = `${text}`
      const textWidth = context.measureText(numberTxt).width
      context.fillText(numberTxt , pointX, pointY)
      context.font = FONT_SIZE_8PX
      context.fillText(`${subText}` , pointX + textWidth, pointY)
    }

    if (basePrice) {
      context.beginPath()
      context.setLineDash([4, 4])
      context.moveTo(x + 8, this.offSetY + padding + 10.5)
      context.lineTo(x + 28, this.offSetY + padding + 10.5)
      context.lineWidth = 2
      context.stroke()  // サブパスを描画
      renderPriceText(context, basePrice, 'ベル(買値)', x + 28 + 4, this.offSetY + padding + 14)
    }

    if (referencePrice) {
      context.beginPath()
      context.setLineDash([2, 2])
      context.lineWidth = 1
      context.moveTo(x + WIDTH_PER_DATA + 8, this.offSetY + padding + 11)
      context.lineTo(x + WIDTH_PER_DATA + 28, this.offSetY + padding + 11)
      context.stroke()  // サブパスを描画
      renderPriceText(context, referencePrice, 'ベル(参考)', x + WIDTH_PER_DATA + 28 + 4, this.offSetY + padding + 14)
    }
  }

  private renderPlotLabel (context: CanvasRenderingContext2D, data: number[]) {
    // label
    context.textBaseline = 'bottom'
    context.textAlign = 'center'
    context.fillStyle = GRAPH_PLOT_COLOR
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
    this.offSetY = (element.clientHeight / 10)

    this.graphRect = {
      height: element.clientHeight - this.offSetY,  // グラフ領域H
      width: element.clientWidth - this.offSetX * 2 // グラフ領域W
    }
    this.graphBase = {
      x: CHART_INTERNAL_PADDING_X + this.offSetX,                                     // 原点位置(x)
      y: this.graphRect.height + this.offSetY - FOOTER_HEIGHT   // 原点位置(y)
    }

    this.pitchX = this.graphRect.width / this.data.length

    const DmYMx = Math.max(...this.data, this.basePrice)
    this.heightPerUnit = (this.graphRect.height - 90) / DmYMx

    this.context.fillStyle = BG_WHITE
    this.roundRect(this.context, 0, 0, element.clientWidth, element.clientHeight, 5, true, false)

    this.context.beginPath()                  // 現在のパスをリセット
    this.context.save()                       // 現在の描画条件を保管

    const baseBellPrice = this.basePrice
    const referencePrice = this.referencePrice
    this.renderBackground(this.context)

    this.renderLine(this.context, baseBellPrice, 2, 4)
    this.renderLine(this.context, referencePrice, 1, 2)
    this.renderGuide(this.context, baseBellPrice, referencePrice)

    // X軸描画
    this.context.restore()
    this.context.textAlign = 'center'
    this.context.textBaseline = 'top'
    this.context.fillStyle = WEEKDAY_LABEL_COLOR
    const pitch = this.graphRect.width / WEEKDAYS.length
    /* tslint:disable:max-line-length */
    WEEKDAYS.forEach((val, i) => {
      const textWidth = this.context.measureText(val).width
      this.context.fillText(val , this.graphBase.x + (i * pitch) + (pitch / 2) - textWidth - 4, this.graphRect.height + this.offSetY - FOOTER_HEIGHT + 4)
    })
    /* tslint:enable */

    this.context.textAlign = 'left'
    this.context.textBaseline = 'bottom'
    this.context.font = FONT_SIZE_12PX
    const islandName = `${MarketChartComponent.truncateString(this.islandName)}`
    const textWidth = this.context.measureText(islandName).width

    this.context.font = FONT_SIZE_10PX
    const suffix = '島のカブ価'
    const suffixWidth = this.context.measureText(suffix).width

    const labelStartX = (this.graphRect.width / 2) - ((textWidth + suffixWidth) / 2) + 6
    this.context.font = FONT_SIZE_12PX
    this.context.fillText(islandName, labelStartX, this.offSetY)

    this.context.font = FONT_SIZE_10PX
    this.context.fillText(suffix , labelStartX + textWidth, this.offSetY)

    // line
    this.context.restore()                    // 描画条件を元に戻す
    this.context.beginPath()                  // 現在のパスをリセット
    this.context.fillStyle = GRAPH_FILL_COLOR
    this.context.strokeStyle = GRAPH_STROKE_COLOR
    this.context.lineWidth = 2
    for (let i = 0; i < this.data.length; i++) {
      if (!this.data[i]) continue
      this.context.moveTo(this.graphBase.x + i * this.pitchX, this.graphBase.y - this.heightPerUnit * this.data[i])
      if (i !== 0) {
        const candidate = this.data.map((d, index) => ({ value: d, index })).filter(v => {
          if (v.index >= i) return false
          return v.value > 0
        })
        if (!candidate.length) continue
        const targetIndex = candidate[candidate.length - 1].index
        this.context.lineTo(this.graphBase.x + (targetIndex) * this.pitchX, this.graphBase.y - this.heightPerUnit * this.data[targetIndex])
      }
    }
    this.context.stroke() // サブパスを描画

    // dot
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i] === 0) continue
      this.context.beginPath()
      const x = this.graphBase.x + i * this.pitchX
      const y = this.graphBase.y - (this.heightPerUnit * this.data[i])
      this.context.arc(x, y, 4, 0, Math.PI * 2, false)
      this.context.fill()
    }

    this.renderPlotLabel(this.context, this.data)
    this.context.restore() // 描画条件を元に戻す
  }

  // tslint:disable-next-line:max-line-length
  private roundRect (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: Radius | number = 5,
    fill?: boolean,
    stroke = true
  ) {
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
    if (fill) { ctx.fill() }
    if (stroke) { ctx.stroke() }
  }
}
