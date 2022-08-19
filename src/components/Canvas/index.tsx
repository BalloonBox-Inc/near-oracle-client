import React, { useEffect, useRef } from 'react';

interface ICanvasProps {
  draw: (props: CanvasRenderingContext2D) => void;
  height: number;
  width: number;
}
const Canvas = ({ draw, height, width }: ICanvasProps) => {
  const canvas = useRef(null);

  useEffect(() => {
    //@ts-ignore: Object is possibly 'null'.
    const context = canvas?.current.getContext('2d');
    draw(context);
  });

  return (
    <canvas ref={canvas} height={height} width={width} className={`absolute`} />
  );
};

export default Canvas;
