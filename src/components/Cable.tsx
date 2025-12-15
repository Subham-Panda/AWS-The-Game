'use client';

import { QuadraticBezierLine } from '@react-three/drei';
import { Vector3 } from 'three';
import { useRef } from 'react';

interface CableProps {
    start: [number, number, number];
    end: [number, number, number];
}

export function Cable({ start, end }: CableProps) {
    const vStart = new Vector3(...start);
    const vEnd = new Vector3(...end);

    // Calculate mid point with a "hang" (gravity effect)
    const mid = vStart.clone().add(vEnd).multiplyScalar(0.5);
    mid.y -= 2; // The droop factor

    return (
        <QuadraticBezierLine
            start={vStart}
            end={vEnd}
            mid={mid}
            color="#ffffff" // Bright white for visibility on dark background
            lineWidth={2}
            dashed={false}
        />
    );
}
