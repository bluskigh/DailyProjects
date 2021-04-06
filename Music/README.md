# Youtube Video Downloader

## To run this application you need:
### Python 3.x or higher.
Download python by going to python.org
### PyTube python library installed (for API to communicate with youtube)
pip3 install pytube 
### Tkinter installed (for gui)
pip3 install tkinter 
## Run the program but typing the following in your terminal:
python3 main.py
## That's it! Easy pea zee lemon squeeze!

## What can you do?
You can download videos either by low, medium, or low resolution.

You can download videos in a playlist! It only downloads the audio though. If you want to download the video, then here is a little challenge(just oneline to change)... Go into the source code of "main.py" and go to the "download_playlist" function, in there commit the "download_audio" function call and uncomment the "download_video" function call.
- Though, it should be noted, that before download a video you need to specify the quality by clicking on the one of the three resolution radio buttons (on the GUI).

You can download videos by only their audio.

You can download video / captions (SRT). 

Videos are downloaded into the playlist title, a new directory is made based on the playlist title, and videos are put into that playlist title!

## What would I like to add?
### File conversion (mp4 -> mp3)
When using audio only, using the file type of mp4 is quite redundant... It would be better to just use an  mp3 file type header.
### Better user interface.
Tkinter does not provide the most beautiful interface, but its alright for now.
Would like to use electron in the future though. Use HTML/CSS to style the GUI better.

