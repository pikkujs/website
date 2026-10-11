import React, { useEffect, useRef, useState } from 'react';
import type { Options } from 'asciinema-player';
import 'asciinema-player/dist/bundle/asciinema-player.css';

const sessions = {
    'installing': '/terminals/install.cast'
}

// Derived from the player's own Options rather than restated: the hand-kept
// copy had drifted (cols/rows as string, fit as a bare string) and only the
// typecheck noticed.
type AsciinemaPlayerProps = { type: keyof typeof sessions } & Options;

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