// ogg (theora, vorbis) preset

exports.load = function(cmd) {

  cmd

    // Video
    .withVideoCodec('libtheora')
    .addOption('-q:v', '6')

    // Audio
    .withAudioCodec('libvorbis')
    .addOption('-q:a', '4')

    .toFormat('ogg');

}
