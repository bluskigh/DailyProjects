import os
from playsound import playsound
from moviepy.editor import *

files = [f for f in os.listdir('.') if os.path.isfile(f)]

'''
os.path.isfile(file) -> checks whether the file path given is a regular file, or if its not. What does this mean?
It means that a file path like so can be given: "/c/users/mario/Desktop/", is that a file? No, its a path to the desktop, not a path to a regular file. So the method will return False.
'''

play_this = None
for f in files:
    if ".mp4" in f:
        play_this = f
        break
# converting the mp4 file to mp3, so we can play it
mp3_file = play_this[:len(play_this)-4] + ".mp3"

def convert_to_mp3():
    videoclip = VideoFileClip(os.path.join((play_this)))
    audioclip = videoclip.audio
    audioclip.write_audiofile(os.path.join((mp3_file)))
    audioclip.close()
    videoclip.close()

playsound(mp3_file)
