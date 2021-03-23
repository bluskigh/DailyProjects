from pytube import YouTube

# making an object of YouTube
video = YouTube("https://www.youtube.com/watch?v=QW1hrsJ9BsI")
print("Video Title: {}".format(video.title))
thumbnail_url = video.thumbnail_url
print(thumbnail_url)

available_media_formats = video.streams
print("Available media formats: {}".format(available_media_formats))

# getting the first stream
first_stream = available_media_formats.first()
print("First stream   {}".format(first_stream))

# to download it simply
###first_stream.download()
# to donwload it in a specified path
print("Downlolading....")
# first_stream.download("videos/")
print("Finished downloading...")

# streams
# - progressive download, streams which contain both vcodeac, and acodec, which contains the video and audio.

progressive_download_streams = available_media_formats.filter(progressive=True)
# progressive downloads are not very high quality.
print(progressive_download_streams)

dash_streams = available_media_formats.filter(adaptive=True)
print("Dash streams : {}".format(dash_streams))

# donqwloading the lowest quality to test
dash_streams.order_by("resolution").first().download()

