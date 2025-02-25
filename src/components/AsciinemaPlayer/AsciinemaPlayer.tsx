import React, { useEffect, useRef, useState } from 'react';
import 'asciinema-player/dist/bundle/asciinema-player.css';

const sessions = {
    'installing': '/terminals/install.cast'
}

type AsciinemaPlayerProps = {
    type: keyof typeof sessions,
    // START asciinemaOptions
    cols?: string;
    rows?: string;
    autoPlay?: boolean
    preload?: boolean;
    loop?: boolean | number;
    startAt?: number | string;
    speed?: number;
    idleTimeLimit?: number;
    theme?: string;
    poster?: string;
    fit?: string;
    fontSize?: string;
    // END asciinemaOptions
};

function AsciinemaPlayer({ type, ...asciinemaOptions }: AsciinemaPlayerProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [player, setPlayer] = useState<typeof import("asciinema-player")>()
    useEffect(() => {
        import("asciinema-player").then(p => { setPlayer(p) })
    }, [])
    useEffect(() => {
        const currentRef = ref.current
        const instance = player?.create(sessions[type], currentRef, asciinemaOptions);
        return () => { instance?.dispose() }
    }, [type, player, asciinemaOptions]);

    return <div ref={ref} />;
}

export default AsciinemaPlayer