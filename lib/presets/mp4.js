// mp4 (x264, aac) preset

exports.load = function (cmd) {

  cmd

    // Video
    .withVideoCodec('libx264')
    .addOption('-preset', 'slow')
    .addOption('-profile:v', 'high')
    .addOption('-level', '4.2')
    .addOptions(['-qmin 0', '-qmax 50'])
    .addOption('-crf', '19')

    // Audio
    .withAudioCodec('libfdk_aac')
    .addOption('-vbr', '4')

    .toFormat('mp4')

    .addOption('-movflags', '+faststart');

}
