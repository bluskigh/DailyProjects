import tkinter as tk
from tkinter import messagebox
from tkinter import ttk
from pytube import YouTube
from pytube import Playlist
# from threading import Thread 

window = tk.Tk()

label = tk.Label(window, text="Youtube Video Downloader", font=("Arial Bold", 20))
label.grid(row=0, column=0)

link = tk.Entry(window)
link.grid(row=1, column=1)
# link.insert(0, "https://youtube.com/playlist?list=PLsNEO8Z9dpP9eKI1lQ3k5roPBoWHMnPBg")
# link.insert(0, "https://youtu.be/6P20npkvcb8")
link.insert(0, "https://youtu.be/9shByOh8fVE")
# link.insert(0, "https://youtube.com/playlist?list=PLsNEO8Z9dpP9eKI1lQ3k5roPBoWHMnPBg")

string_values = tk.StringVar()
options = ttk.Combobox(window, textvariable=string_values)
options["values"] = ["Playlist", "Video", "Video/Captions", "Audio"]
options.current(0)
options.grid(row=1, column=0)

def selected():
	global v
	print("You have selected: {}".format(v.get()))
	# can update labels here. TODO: do this later after implemtning the download accordint to selected radiobutton

v = tk.IntVar()
low_resolution = tk.Radiobutton(window, variable=v, text="Low Resolution", value=1, command=selected)
low_resolution.grid(row=2, column=0)

mid_resolution = tk.Radiobutton(window, variable=v, text="Mid Resolution", value=2, command=selected)
mid_resolution.grid(row=2, column=1)

high_resolution = tk.Radiobutton(window, variable=v, text="High Resolution", value=3, command=selected)
high_resolution.grid(row=2, column=3)

status_label = tk.Label(window, text="Status: Not Downloading")
status_label.grid(row=4, column=0)

languages_label = tk.Label(window, text="Caption Language: ")
languages_label.grid(row=3, column=0)
languages = ttk.Combobox(window)
languages.grid(row=3, column=1)
language_pair = [] # holds language pair

def generate():
	global languages, language_pair, link
	video = YouTube(link.get())
	captions = video.captions
	print(captions)
	for caption in captions:
		final = str(caption).split('"')
		language_pair.append((final[1], final[3]))
	# adding the values to languages
	languages["values"] = [language[0] for language in language_pair]
	languages.current(0)

language_generate = tk.Button(window, text="Generate", command=generate)
language_generate.grid(row=3, column=3)

def download_audio(link):
	global status_label
	try:
		video = YouTube(link)
		print(video.streams.filter(type="audio"))
		# no such thing as resolution for the aduio streams.
		streams = video.streams.filter(only_audio=True)
		# streams = video.streams.filter(type="audio")
		# doesn't matter if its low, mid, high res
		status_label.config(text="Status: Downloading...")
		streams.first().download()
		status_label.config(text="Status: Finished Downloadin...")
		# TODO find the error that is raised when an invalid link is given in the YouTube constructor
	except: 
		messagebox.showerror("Invalid Link", "Invalid audio link given...")

def get_resolution(streams):
	global v
	res = v.get()
	# low res
	final = None
	if res == 1:
		# TODO: find a way to put ontification on using the notify2 module
		final = streams.first()
	elif res == 2:
		final = streams[int(len(streams)/2)]
	elif res == 3:
		final = streams.last()
	return final

def download_video(link, location):
	# TODO file management, if the file already exist, then create another with (number) next to it, so that the file does not get overwritten.
	global v, status_label
	# v is the res value
	try:
		video = YouTube(link)
		# progressive part of YouTube double streaming options. Progressive contains both video and audio. Documentation https://python-pytube.readthedocs.io/en/latest/user/quickstart.html#dash-vs-progressive-streams
		streams = video.streams.filter(progressive=True).order_by("resolution")
		# final video that is going to be downloaded
		final = get_resolution(streams)
		print("Downlaoding: {}".format(video.title))
		status_label.config(text="Status: Downloading....")
		# download the video 
		if location != None:
			# downloadin in folder
			final.download(location)
		else:
			# download int current directory.
			final.download()
		status_label.config(text="Status: Finished Downloading....")
		
	except:
		messagebox.showerror("Invalid Link", "Invalid video link given...")

def download_playlist(link):
	global status_label
	try:
		playlist = Playlist(link)
		print(playlist.title)
		for url in playlist:
			# TODO show the videos being downloaded, with their approdpiarate images shown beside them.
			download_video(url, playlist.title)
			
	except:
		messagebox.showerror("Invalid Link", "Invalid playlist link given...")
	
def download_captions_video(link):
	global languages, language_pair
	print("this ran")
	location = link[0:5]
	download_video(link, location)
	# find the according caption code
	picked_language = languages.get()
	picked_language_code = None
	print("Picked alnagge: {}".format(picked_language))
	for language in language_pair:
		if language[0] == picked_language:
			picked_language_code = language[1]
			break
	if picked_language_code == None:
		print("The code ws not found in download_captions_video()")
		return
	

	caption = YouTube(link).captions.get_by_language_code(picked_language_code)
	# the code was found, so now write the captions srt type to its file
	with open("{}/{}.srt".format(location, location), 'w') as file:
		file.write(caption.generate_srt_captions())
		# with, closes it for me automatically, kind of like the using statement in C#

def download():
	global options, link
	selected  = options.get()
	link_string = link.get()
	# link_string link.cget(type="text")
	# decide to remove this check, because int he acutal method of implemtnation we are going to check them there.
	if len(link_string) < 8:
		print("INvalid length given...")
		return
	if selected == "Playlist":
		print("ran")
		download_playlist(link_string)
	elif selected == "Video":
		download_video(link_string, None)
	elif selected == "Audio":
		download_audio(link_string)
	else:
		print("downloading the captions and the video")
		download_captions_video(link_string)

submit = tk.Button(window, text="Submit", command=download)
submit.grid(row=1, column=2)

window.mainloop()
