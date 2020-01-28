import * as React from 'react'
import * as P5 from 'p5'
import styled from "styled-components"
// @ts-ignore
import P5Canvas from 'react-p5-wrapper'

const CanvasBorder = styled.div`
  height: 280px;
  width: 280px;
  border: 10px solid darkgray;
  border-radius: 5px;
`

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 100px auto;
  width: fit-content;
  justify-content: center;
`

const Button = styled.div`
  font-size: 1.25rem;
  height: 40px;
  width: 100px;
  background: darkgray;
  border: 2px solid darkgray;
  border-radius: 4px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    color: yellow;
  }
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 2rem 0;
`

const HeadingText = styled.div`
  font-size: 1.3rem;
  color: lightgray;
  margin: 1rem auto;
  width: fit-content;
`

const PredictionText = styled.div`
  font-size: 1.5rem;
  color: white;
  margin: auto;
`

let canvas;
let _p5: P5 | null;

export function sketch(p5: P5) {
  // set up the sketch
  p5.setup = () => {
    _p5 = p5;
    p5.pixelDensity(0.5)
    canvas = p5.createCanvas(280, 280);
    canvas.style('display', 'block')
    p5.background(p5.color(1))
  }

  p5.touchMoved = () => {
    p5.stroke(p5.color(255, 255, 255))
    p5.strokeWeight(20)
    p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY)
  }
}

function onReset() {
  _p5?.clear()
  _p5?.background(_p5?.color(1))
}

async function onAnalyze(setPrediction: any) {
  const canvas = document.getElementsByTagName('canvas')[0]
  const imgData = canvas.toDataURL()
  const response = await fetch('http://localhost:5000/predict', {
    method: 'POST',
    body: imgData,
    headers: {
      'Content-Type': 'image/png'
    }
  })
  const { prediction } = await response.json()
  setPrediction(prediction)
}

type IPrediction = {
  label: number,
  probability: number
}

export const Home = () => {
  // @ts-ignore
  const [prediction, setPrediction] = React.useState<IPrediction|null>(null)

  const handleAnalyze = () => {
    onAnalyze(setPrediction)
  }

  const handleReset = () => {
    setPrediction(null)
    onReset()
  }

  return (
    <HomeContainer>
      <HeadingText>Draw a digit between 0-9</HeadingText>
      <CanvasBorder>
        <P5Canvas sketch={sketch} />
      </CanvasBorder>
      <ButtonWrapper>
        <Button onClick={handleReset}>Reset</Button>
        <Button onClick={handleAnalyze}>Analyze</Button>
      </ButtonWrapper>
      {
        prediction && (
          <PredictionText>
            {`I'm ${Number(prediction?.probability).toFixed(2)}% sure it's a "${prediction?.label}".`}
          </PredictionText>
        )
      }
    </HomeContainer>
  )
}
