// webm (vpx, vorbis) preset

exports.load = function (cmd) {

  cmd

    // Video
    .withVideoCodec('libvpx')
    .addOption('-b:v', '1.5M')
    .addOption('-crf', '9')
    .addOption('-keyint_min', '0')
    .addOption('-g', '250')
    .addOption('-skip_threshold', '0')
    .addOptions(['-qmin 0', '-qmax 50'])

    // Audio
    .withAudioCodec('libvorbis')
    .addOption('-q:a', '4')

    .toFormat('webm');

}
