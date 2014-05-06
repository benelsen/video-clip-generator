
# video-clip-generator

## Install

ffmpeg needs to be installed.

```
npm install -g video-clip-generator
```

## Usage

```
video-clip-generator \
  -s hh:mm:ss.sss \ # start time (complete verbose format currently required)
  -d hh:mm:ss.sss \ # duration
  --title 'Your title' \ # optional title, defaults to “Video”
  ./path/to/input/file.mkv \ # input file
  ./path/to/outputfolder # output folder, files will be writen here (can’t be an exisiting folder right now)
```
