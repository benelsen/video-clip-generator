// png preset

exports.load = function(cmd) {

  cmd
    .addOption('-vframes', '1')
    .addOption('-r', '1')
    .toFormat('image2');

}
