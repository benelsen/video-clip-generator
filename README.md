
# video-clip-generator

## Install

ffmpeg needs to be installed.

```
npm install -g video-clip-generator
```

## Usage

```
video-clip-generator [options] inputfile outputfolder

inputfile: A ffmpeg readable video file

outputfolder: files will be writen here (can’t be an exisiting folder right now)

Options:

   --start, -s  hh:mm:ss.sss                   Start time (verbose format currently required)

--duration, -d  hh:mm:ss.sss                   Duration (verbose format currently required)

   --title, -t  String                         Title / Name [default: Video]

  --upload, -u  user@example.com:~/html/video  Destination for rsync

 --baseurl, -b  http://example.com/html/video

    --open      Boolean                        Open url upon upload completion [default: true]
                                               Only works if --upload and --baseurl are set correctly

    --tune      String                         tune option for x264 (e.g. animation, film)
```
