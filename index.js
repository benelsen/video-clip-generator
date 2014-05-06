#!/usr/bin/env node

var FFmpeg = require('fluent-ffmpeg'),
    moment = require('moment'),
    fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    Mustache = require('mustache'),
    UUID = require('node-uuid'),
    slug = require('slug');

var argv = require('minimist')(process.argv.slice(2));

var inputPath = path.resolve( argv._[0] ),
    inputBasename = path.basename( inputPath, path.extname(inputPath) );

var filename, outputDirectory;

var uuid = UUID.v4();

if ( argv._[1] ) {

  outputDirectory = path.resolve( argv._[1] );

  if ( argv.title ) {
    filename = slug( argv.title ).toLowerCase();
  } else {
    filename = outputDirectory.slice( outputDirectory.lastIndexOf('/')+1 );
  }

} else {

  if ( argv.title ) {

    filename = slug( argv.title ).toLowerCase();

  } else {

    filename = 'video';

  }

  outputDirectory = path.resolve( __dirname, 'output', filename );

}

outputDirectory += '-' + uuid.slice( 0, uuid.indexOf('-') );
outputBase = path.join(outputDirectory, filename);

mkdirp.sync( outputDirectory );

// Get ffmpeg rolling

// mp4: h264 + aac
var mp4Command = new FFmpeg({ source: inputPath });

if ( argv.s ) {
  mp4Command.setStartTime(argv.s);
}

if ( argv.d ) {
  mp4Command.setDuration(argv.d);
}

mp4Command
  .usingPreset(x264Preset)
  .withSize('?x720')
  .on('start', startEvent)
  .on('codecData', codecDataEvent)
  .on('progress', progressEvent)
  .on('error', errorEvent)
  .on('end', endEvent)
  .saveToFile(outputBase+'.mp4');

// webm: vpx + vorbis
var webmCommand = new FFmpeg({ source: inputPath });

if ( argv.s ) {
  webmCommand.setStartTime(argv.s);
}

if ( argv.d ) {
  webmCommand.setDuration(argv.d);
}

webmCommand
  .usingPreset(webmPreset)
  .withSize('?x720')
  .on('start', startEvent)
  .on('codecData', codecDataEvent)
  .on('progress', progressEvent)
  .on('error', errorEvent)
  .on('end', endEvent)
  .saveToFile(outputBase+'.webm');

// ogg: theora + vorbis
var oggCommand = new FFmpeg({ source: inputPath });

if ( argv.s ) {
  oggCommand.setStartTime(argv.s);
}

if ( argv.d ) {
  oggCommand.setDuration(argv.d);
}

oggCommand
  .usingPreset(oggPreset)
  .withSize('?x720')
  .on('start', startEvent)
  .on('codecData', codecDataEvent)
  .on('progress', progressEvent)
  .on('error', errorEvent)
  .on('end', endEvent)
  .saveToFile(outputBase+'.ogg');


var pngCommand = new FFmpeg({ source: inputPath });

if ( argv.s ) {
  pngCommand.setStartTime(argv.s);
}

if ( argv.d ) {
  pngCommand.setDuration(argv.d);
}

pngCommand
  .withSize('?x720')
  .addOption('-vframes', '1')
  .addOption('-r', '1')
  .toFormat('image2')
  .on('start', startEvent)
  .on('codecData', codecDataEvent)
  .on('progress', progressEvent)
  .on('error', errorEvent)
  .on('end', endEvent)
  .saveToFile(outputBase+'.png');

// create the html
var template = fs.readFileSync(path.resolve(__dirname, 'templates/index.html'), 'utf8');

Mustache.parse( template );

var html = Mustache.render(template, {
  title: argv.title || filename || 'Video',
  filename: filename,
  width: 1280,
  height: 720
});

fs.writeFileSync( path.join(outputDirectory, 'index.html'), html, 'utf8');

// Presets
function x264Preset(cmd) {

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

  if ( argv.tune ) {
    cmd.addOption('-tune', argv.tune);
  }

}

function webmPreset(cmd) {

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

function oggPreset(cmd) {

  cmd

    // Video
    .withVideoCodec('libtheora')
    .addOption('-q:v', '6')

    // Audio
    .withAudioCodec('libvorbis')
    .addOption('-q:a', '4')

    .toFormat('ogg');

}

function startEvent(commandLine) {
  console.log(commandLine, '\n');
}

function endEvent() {
  console.log('Processing finished!');
}

function errorEvent(err) {
  console.error('Error: ' + err.message, '\n');
}

function progressEvent(progress) {
  var done = moment.duration(progress.timemark + '0').asMilliseconds();
  var duration = moment.duration(argv.d).asMilliseconds();
  var percent = 100 * done / duration;
  console.log('Processing: ' + percent.toFixed(3) + '% done');
}

function codecDataEvent(data) {
  console.log('codecData', data, '\n');
}
