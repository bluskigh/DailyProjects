"""
This is the only file you have to run to run this program.
"""
import tkinter as tk
from tkinter import messagebox, ttk
from pytube import YouTube, Playlist
from time import sleep
# from threading import Thread

window = tk.Tk()

label = tk.Label(window, text="Youtube Video Downloader",
                 font=("Arial Bold", 20))
label.grid(row=0, column=0)

link = tk.Entry(window)
link.grid(row=1, column=1)
# default link to be provided as an example
link.insert(0, "https://youtu.be/9shByOh8fVE")

string_values = tk.StringVar()
options = ttk.Combobox(window, textvariable=string_values)
options["values"] = ["Playlist", "Video", "Video/Captions", "Audio"]
options.current(0)
options.grid(row=1, column=0)

def selected():
    global v
    print("You have selected: {}".format(v.get()))
    # can update labels here. TODO: do this later after implemtning the download accordint to selected radiobutton


# ------- Radio buttons (resolutions)
v = tk.IntVar()
low_resolution = tk.Radiobutton(
    window, variable=v, text="Low Resolution", value=1, command=selected)
low_resolution.grid(row=2, column=0)
mid_resolution = tk.Radiobutton(
    window, variable=v, text="Mid Resolution", value=2, command=selected)
mid_resolution.grid(row=2, column=1)
high_resolution = tk.Radiobutton(
    window, variable=v, text="High Resolution", value=3, command=selected)
high_resolution.grid(row=2, column=3)
# ------- End of radio buttons

# --------- Status label (tells whether we are downloading video still or not
status_label = tk.Label(window, text="Status: Not Downloading")
status_label.grid(row=4, column=0)

# --------- Caption Language
languages_label = tk.Label(window, text="Caption Language: ")
languages_label.grid(row=3, column=0)
languages = ttk.Combobox(window)
languages.grid(row=3, column=1)
language_pair = []  # holds language pair
# generates possibel captions languages


def generate(link):
    global languages, language_pair
    video = YouTube(link.get())
    captions = video.captions
    print(captions)
    for caption in captions:
        final = str(caption).split('"')
        language_pair.append((final[1], final[3]))
    # adding the values to languages
    languages["values"] = [language[0] for language in language_pair]
    languages.current(0)


# creating a button that runs generate method above
language_generate = tk.Button(window, text="Generate", command=generate)
language_generate.grid(row=3, column=3)
# ------- End of languages layer

# downloads the audio version of given youtube video link


def download_audio(link, location):
    global status_label
    try:
        video = YouTube(link)
        print(video.streams.filter(type="audio"))
        # no such thing as resolution for the aduio streams.
        streams = video.streams.filter(only_audio=True)
        # streams = video.streams.filter(type="audio")
        # doesn't matter if its low, mid, high res
        status_label.config(
            text=f"Status: Downloading '{video.title}' (audio only)...")
        streams.first().download(location)
        status_label.config(
            text="Status: Finished Downloading '{video.title}' (audio only)")
        # TODO find the error that is raised when an invalid link is given in the YouTube constructor
    except:
        messagebox.showerror("Invalid Link", "Invalid audio link given...")

# given an array of streams, returns either a low res or high res version of a possible video streams. User has to have a resolution selected though, error is thrown if no resolution is selected, since this method relies on it.


def get_resolution(streams):
    global v
    # getting value used by the radio buttons
    res = v.get()
    final = None
    if res == 1:
        final = streams.first()
    elif res == 2:
        final = streams[int(len(streams)/2)]
    elif res == 3:
        final = streams.last()
    if final == None:
        messagebox.showerror("Missing Resolution",
                             "Please select a resolution to continue")
    return final


def download_video(link, location):
    global v, status_label
    # v is the res value
    try:
        video = YouTube(link)
        # progressive part of YouTube double streaming options. Progressive contains both video and audio. Documentation https://python-pytube.readthedocs.io/en/latest/user/quickstart.html#dash-vs-progressive-streams
        streams = video.streams.filter(progressive=True).order_by("resolution")
        # final video that is going to be downloaded, getting video based on resolution choosen
        video = get_resolution(streams)
        status_label.config(text="Status: Downloading '{video.title}'...")
        # download the video
        if location != None:
            # downloadin in folder
            video.download(location)
        else:
            # download int current directory.
            video.download()
        status_label.config(text="Status: Finished Downloading....")
    except Exception as e:
        messagebox.showerror("Invalid Link", "Invalid video link given...")
        # stack trace
        print(e)

def download_playlist(link):
    global status_label
    try:
        playlist = Playlist(link)
        status_label.config(
            text=f"Status: Downloading '{playlist.title}' playlist...")
        # sleep(1)
        for url in playlist:
            download_audio(url, playlist.title)
            # download_video(url, playlist.title)
        status_label.config(text=f"Status: Finished downloading playlist.")
    except:
        messagebox.showerror("Invalid Link", "Invalid playlist link given...")

# downloads a video and its relative captions


def download_captions_video(link):
    global languages, language_pair
    location = link[0:5]
    download_video(link, location)
    # find the according caption code
    picked_language = languages.get()
    picked_language_code = None
    print("Picked language: {}".format(picked_language))
    for language in language_pair:
        if language[0] == picked_language:
            picked_language_code = language[1]
            break
    if picked_language_code == None:
        status_label.config(text=f"Could not download captions")
        return
    caption = YouTube(link).captions.get_by_language_code(picked_language_code)
    # the code was found, so now write the captions srt type to its file
    with open("{}/{}.srt".format(location, location), 'w') as file:
        file.write(caption.generate_srt_captions())
        # with, closes it for me automatically, kind of like the using statement in C#


def download():
    global options, link
    print('Now downloading the video...')
    selected = options.get()
    link_string = link.get()
    # link_string link.cget(type="text")
    # decide to remove this check, because int he acutal method of implemtnation we are going to check them there.
    if len(link_string) < 8:
        print("Invalid length given...")
        return
    if selected == "Playlist":
        download_playlist(link_string)
    elif selected == "Video":
        download_video(link_string, None)
    elif selected == "Audio":
        download_audio(link_string, None)
    else:
        download_captions_video(link_string)


submit = tk.Button(window, text="Submit", command=download)
submit.grid(row=1, column=2)

window.mainloop()
