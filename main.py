'''
TODO: 
    Add option for captions
    - language of the captions.
    Add option for downloading playlist
    Add option for creating playlist
    Add option for download either video and or audio only 
''' 
import tkinter as tk
from tkinter import messagebox
from pytube import YouTube
from threading import Thread

window = tk.Tk()

label = tk.Label(window, text="Youtube Video Downloader")
label.grid(row=0, column=0)
link = tk.Entry(window)
link.grid(row=1, column=0)
def down():
    global link
    link_string = link.get()
    if len(link_string) >= 7:
        print("Downloading....")
        YouTube(link_string).streams.filter(progressive=True).order_by("resolution").first().download()
        print("Finished wodnloading....")
    else:
        messagebox.showerror("Invalid Link", "Error processing your link....")

def get_video():
    global window
    # dlwonload the video now
    # TODO: provide optoin to download at given qqualities
    # TODO: provide option to download audion only
    print("downloading...")
    # print("Availabel videos: {}".format(video.streams.filter(type="video").order_by("resolution")))
    # download only
    t = Thread(target=down)
    t.start()
    print("Finished downloading")

download = tk.Button(window, text="Download", command=get_video)
download.grid(row=1, column=1)


window.mainloop()

