import { MouseEventHandler, useState } from 'react';

export type HighlightProps = {
  width: number;
  height: number;
  color: string;
  opacity?: number;
  onDragEnd?: (area: { left: number; right: number }) => void;
};

const getLocs = (evt: MouseEvent) => {
  const xLoc = evt.type === 'touchstart' ? evt.pageX : evt.offsetX;
  const yLoc = evt.type === 'touchstart' ? evt.pageY : evt.offsetY;

  return { xLoc, yLoc };
};

export const Highlight = ({ height, width, color, opacity, onDragEnd }: HighlightProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isBrushing, setIsBrushing] = useState(false);
  const [highlightArea, setHighlightArea] = useState({
    startX: 0,
    left: 0,
    right: 0,
    height,
    width: 0,
  });

  const isOnBrush = (value: number) => value >= highlightArea.left && value <= highlightArea.right;

  const startBrushing: MouseEventHandler<SVGRectElement> = (e) => {
    const { xLoc } = getLocs(e.nativeEvent);
    const _isOnBrush = isOnBrush(xLoc);

    if (!_isOnBrush) {
      setHighlightArea({
        ...highlightArea,
        startX: xLoc,
        left: xLoc,
        right: _isOnBrush ? highlightArea.right : 0,
        width: _isOnBrush ? highlightArea.width : 0,
      });
    } else {
      setHighlightArea({ ...highlightArea, startX: xLoc });
    }

    setIsDragging(!_isOnBrush);
    setIsBrushing(_isOnBrush);
  };

  const onBrush: MouseEventHandler<SVGRectElement> = (e) => {
    if (!isDragging && !isBrushing) {
      return;
    }

    const { xLoc } = getLocs(e.nativeEvent);

    if (isDragging) {
      if (xLoc > highlightArea.startX) {
        setHighlightArea({
          ...highlightArea,
          left: highlightArea.startX,
          right: xLoc,
          width: xLoc - highlightArea.startX,
        });
      } else {
        setHighlightArea({
          ...highlightArea,
          left: xLoc,
          right: highlightArea.startX,
          width: highlightArea.startX - xLoc,
        });
      }
    } else if (isBrushing) {
      setHighlightArea({
        ...highlightArea,
        left: highlightArea.left + (xLoc - highlightArea.startX),
        right: highlightArea.left + highlightArea.width,
        startX: xLoc,
      });
    }
  };

  const stopBrushing = () => {
    if (highlightArea.width) {
      onDragEnd?.({ left: highlightArea.left, right: highlightArea.right });
    }

    setIsBrushing(false);
    setIsDragging(false);
  };

  return (
    <g className="rv-highlight-container">
      <rect
        className="rv-mouse-target"
        fill="black"
        opacity="0"
        x="0"
        y="0"
        width={width}
        height={height}
        onMouseDown={startBrushing}
        onMouseMove={onBrush}
        onMouseUp={stopBrushing}
        onMouseLeave={stopBrushing}
        onTouchEnd={(e) => {
          e.preventDefault();
          stopBrushing();
        }}
        onTouchCancel={(e) => {
          e.preventDefault();
          stopBrushing();
        }}
        onContextMenu={(e) => e.preventDefault()}
        onContextMenuCapture={(e) => e.preventDefault()}
      />
      <rect
        className="rv-highlight"
        pointerEvents="none"
        opacity={opacity || 1}
        fill={color}
        x={highlightArea.left}
        y={0}
        width={highlightArea.width}
        height={highlightArea.height}
      />
    </g>
  );
};

Highlight.requiresSVG = true;
