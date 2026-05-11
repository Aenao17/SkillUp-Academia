const SOUND_KEY = "skillup_sound_effects";

export const isSoundEnabled = (): boolean =>
    localStorage.getItem(SOUND_KEY) !== "false";

export const setSoundEnabled = (enabled: boolean): void =>
    localStorage.setItem(SOUND_KEY, String(enabled));

/** Play a short synthesized tone using the Web Audio API. */
function playTone(
    frequency: number,
    duration: number,
    type: OscillatorType,
    gain: number,
    fadeOut = true
): void {
    if (!isSoundEnabled()) return;

    try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);
        gainNode.gain.setValueAtTime(gain, ctx.currentTime);

        if (fadeOut) {
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        }

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
        osc.onended = () => ctx.close();
    } catch {
        // Audio not available in this environment — fail silently
    }
}

/** Uplifting two-note chime — played when a test is passed. */
export function playSuccessSound(): void {
    playTone(523.25, 0.15, "sine", 0.3); // C5
    setTimeout(() => playTone(783.99, 0.3, "sine", 0.25), 160); // G5
}

/** Low dull tone — played when a test is failed. */
export function playFailSound(): void {
    playTone(220, 0.4, "triangle", 0.25); // A3
}
