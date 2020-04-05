import { Component, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core'

const GRAPH_FILL_COLOR = '#427B00'
const GRAPH_STROKE_COLOR = '#427B00'

const BG_1 = '#FFEFDD'
const BG_2 = '#E8D4BD'

const FOOTER_HEIGHT = 20

// const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const WEEKDAYS = ['月', '火', '水', '木', '金', '土']

@Component({
  selector: 'app-market-chart',
  templateUrl: './market-chart.component.html',
  styleUrls: ['./market-chart.component.sass']
})
export class MarketChartComponent implements AfterViewInit {

  @ViewChild('graph', { read: ElementRef }) graph: ElementRef<HTMLCanvasElement>

  private context: CanvasRenderingContext2D

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
    this._basePrice = Number(p)
    this.render()
  }

  get basePrice () {
    return this._basePrice
  }

  private _data: number[] = []
  private _basePrice = 0

  private graphRect = { width: 0, height: 0 }

  private graphBase = { x: 0, y: 0 }

  private heightPerUnit = 0

  private pitchX = 0

  private initialized = false

  /**
   * Setup canvas with hi-DPI support
   */
  setupCanvas (): CanvasRenderingContext2D {
    const canvas = this.graph.nativeElement
    const context = canvas.getContext('2d')
    let dpr = window.devicePixelRatio || 1
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
    const width = this.graph.nativeElement.clientWidth / 6
    const height = this.graph.nativeElement.clientHeight
    WEEKDAYS.forEach((val, i) => {
      context.fillStyle = i % 2 ? BG_2 : BG_1
      context.fillRect(i * width, 0, width, height - FOOTER_HEIGHT)
    })
  }

  private renderBaseline (context: CanvasRenderingContext2D, bellPrice: number, section: number): void {
    // baseline
    this.context.beginPath()
    this.context.setLineDash([4, 4])
    this.context.moveTo(0, this.graphBase.y - this.heightPerUnit * bellPrice)
    this.context.lineTo(this.graphRect.width, this.graphBase.y - this.heightPerUnit * bellPrice)
    this.context.strokeStyle = '#813700'
    this.context.fillStyle = '#813700'
    this.context.font = '12px sans-serif'
    this.context.lineWidth = 2
    this.context.stroke()  // サブパスを描画

    const sectionWidth = this.graphRect.width / this.data.length
    // let offSet = section * sectionWidth

    let offSet = section * sectionWidth
    // if (section > 0) { offSet += (sectionWidth / 4) }

    const numberTxt = `${bellPrice}`
    this.context.fillText(numberTxt , offSet + 2, this.graphBase.y - this.heightPerUnit * bellPrice - 2)
    const textWidth = this.context.measureText(numberTxt).width
    this.context.font = '10px sans-serif'
    this.context.fillText('ベル' , offSet + textWidth + 2, this.graphBase.y - this.heightPerUnit * bellPrice - 2)
  }

  private renderPlotLabel (context: CanvasRenderingContext2D, data: number[], baseBellPrice: number) {
    // label
    this.context.textBaseline = 'bottom'
    this.context.textAlign = 'center'
    this.context.fillStyle = '#626262'
    data.forEach((val, i) => {
      if (this.data[i] === 0) return
      let x = this.graphBase.x + i * this.pitchX
      let y = this.graphBase.y - this.heightPerUnit * data[i] - 8

      const isNextDataIsGreater = data[i + 1] && data[i + 1] >= data[i]
      const isPreviousDataIsGreater = data[i - 1] && data[i - 1] >= data[i]
      const isNextDataIsVeryDecreasing = !data[i + 1] || (data[i + 1] && data[i + 1] * 2 > data[i])


      if (isNextDataIsGreater || (isPreviousDataIsGreater && isNextDataIsVeryDecreasing)) {
        // 下に表示する
        y = this.graphBase.y - this.heightPerUnit * data[i] + 18
      } else if (data[i] <= baseBellPrice && data[i] + 16 > baseBellPrice) {
        // 下に表示する
        y = this.graphBase.y - this.heightPerUnit * data[i] + 5
        x += 14
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
    let groundW = element.clientWidth // グラフ領域W
    let groundH = element.clientHeight// グラフ領域H
    let groundX0 = 16      // 原点位置(16)
    let groundY0 = groundH - FOOTER_HEIGHT   // 原点位置(300)

    this.graphRect = { height: groundH, width: groundW }
    this.graphBase = { x: groundX0, y: groundY0 }

    let pichX = groundW / this.data.length
    this.pitchX = pichX

    const DmYMx = Math.max(...this.data, this.basePrice)
    this.heightPerUnit = (groundH - 90) / DmYMx

    this.context.beginPath()                  // 現在のパスをリセット
    this.context.save()                       // 現在の描画条件を保管


    const baseBellPrice = this.basePrice
    this.renderBackground(this.context)

    const sectionCandidates = this.data.map((val,i) => {
      return {
        previous: this.data[i - 1],
        start: val,
        end: this.data[i + 1],
        next: this.data[i + 2],
      }
    })
    .map((v, i) => ({ ...v, section: i }))
    .filter((val, i) => {
      if (i === this.data.length - 1 || i === 0) return false
      const foo = val.start < baseBellPrice
      const bar = baseBellPrice < val.end
      if (foo && bar) return false

      const foo2 = val.previous > baseBellPrice && baseBellPrice > val.start
      const bar2 = val.previous < baseBellPrice && baseBellPrice < val.start
      return !(foo2 || bar2)
    })
    .map(v => v.section)
    this.renderBaseline(this.context, baseBellPrice, sectionCandidates[0] || 0)


    // X軸描画
    this.context.restore()
    this.context.textAlign = 'center'
    this.context.textBaseline = 'top'
    this.context.fillStyle = '#616161'
    const pitch = groundW / WEEKDAYS.length
    WEEKDAYS.forEach((val, i) => {
      const textWidth = this.context.measureText(val).width
      this.context.fillText(val , groundX0 + (i * pitch) + (pitch / 2) - textWidth, groundH - FOOTER_HEIGHT + 4)
    })

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

    this.renderPlotLabel(this.context, this.data, baseBellPrice)
    this.context.restore()                    // 描画条件を元に戻す
  }

}
