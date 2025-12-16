class SoundManager {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private enabled: boolean = true;

    constructor() {
        if (typeof window !== 'undefined') {
            const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
                this.masterGain = this.ctx.createGain();
                this.masterGain.connect(this.ctx.destination);
                this.masterGain.gain.value = 0.3; // Default volume
            }
        }
    }

    private ensureContext() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    public toggleSound(enabled: boolean) {
        this.enabled = enabled;
        if (this.masterGain) {
            this.masterGain.gain.value = enabled ? 0.3 : 0;
        }
    }

    // --- Synthesizers ---

    public playUiClick() {
        if (!this.enabled || !this.ctx || !this.masterGain) return;
        this.ensureContext();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain);

        // High pitch "pip"
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    public playSuccess() {
        if (!this.enabled || !this.ctx || !this.masterGain) return;
        this.ensureContext();

        const t = this.ctx.currentTime;

        // Arpeggio
        this.playTone(600, t, 0.1, 'sine');
        this.playTone(800, t + 0.1, 0.1, 'sine');
        this.playTone(1200, t + 0.2, 0.3, 'sine');
    }

    public playError() {
        if (!this.enabled || !this.ctx || !this.masterGain) return;
        this.ensureContext();

        // Low "Buzz"
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.linearRampToValueAtTime(100, t + 0.3);

        gain.gain.setValueAtTime(0.5, t);
        gain.gain.linearRampToValueAtTime(0.01, t + 0.3);

        osc.start();
        osc.stop(t + 0.3);
    }

    public playExplosion() {
        if (!this.enabled || !this.ctx || !this.masterGain) return;
        this.ensureContext();

        // White Noise Burst
        const bufferSize = this.ctx.sampleRate * 0.5; // 0.5 sec
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 1000;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

        noise.connect(noiseFilter);
        noiseFilter.connect(gain);
        gain.connect(this.masterGain);

        noise.start();
    }

    public playPurchase() {
        if (!this.enabled || !this.ctx || !this.masterGain) return;
        this.ensureContext();
        // "Ka-ching" like sound
        // Two quick high tones
        const t = this.ctx.currentTime;
        this.playTone(1500, t, 0.1, 'square', 0.1);
        this.playTone(2000, t + 0.1, 0.2, 'square', 0.1);
    }

    private playTone(freq: number, startTime: number, duration: number, type: OscillatorType = 'sine', vol = 0.5) {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.type = type;
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(vol, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        osc.start(startTime);
        osc.stop(startTime + duration);
    }
}

// Singleton Instance
export const soundManager = new SoundManager();
