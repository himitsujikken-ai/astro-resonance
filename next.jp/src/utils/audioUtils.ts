
export function createReverb(ctx: AudioContext | OfflineAudioContext) {
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let i = 0; i < len; i++) {
        const d = Math.pow(1 - i / len, 3);
        buf.getChannelData(0)[i] = (Math.random() * 2 - 1) * d;
        buf.getChannelData(1)[i] = (Math.random() * 2 - 1) * d;
    }
    return buf;
}

export function bufferToWave(abuffer: AudioBuffer, len: number) {
    let numOfChan = abuffer.numberOfChannels,
        length = len * numOfChan * 2 + 44,
        buffer = new ArrayBuffer(length),
        view = new DataView(buffer),
        channels = [],
        i, sample, offset = 0, pos = 0;

    function setUint16(data: number) { view.setUint16(pos, data, true); pos += 2; }
    function setUint32(data: number) { view.setUint32(pos, data, true); pos += 4; }

    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8);
    setUint32(0x45564157); // "WAVE"
    setUint32(0x20746d66); // "fmt "
    setUint32(16);
    setUint16(1);
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16);
    setUint32(0x61746164); // "data"
    setUint32(length - pos - 4);

    for (i = 0; i < abuffer.numberOfChannels; i++) channels.push(abuffer.getChannelData(i));

    while (pos < length) {
        for (i = 0; i < numOfChan; i++) {
            // Check bounds
            let val = channels[i][(pos - 44) / 2 / numOfChan | 0];
            if (val === undefined) val = 0;

            sample = Math.max(-1, Math.min(1, val));
            sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
            view.setInt16(44 + offset, sample, true);
            offset += 2;
        }
        pos += 2 * numOfChan; // Corrected increment
    }
    return buffer;
}
