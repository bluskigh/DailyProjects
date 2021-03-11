from pytube import YouTube

class Downloader:
    def __init__(self):
        pass

    def get_title(self, title, extension):
        replicates = 0
        temp = title
        while True:
            try:
                f = open(temp+extension, 'r')
                # if you can open it, then that means it already exist.
                replicates += 1
                temp = title + ("({})".format(replicates))
            except:
                return temp 

    # downloads a video that is going to be capped at resolution of 1080p, removing the res tag from the filter method, will produce the highest quality, which is what the video has set.
    def download_video(self, link, resolution):
        video = YouTube(link)
        title = self.get_title("{}-video-".format(video.title), ".mp4")
        print("Streams : {}".format(video.streams))
        download_this = video.streams.filter(mime_type="video/mp4").order_by("resolution")
        if resolution == "high":
            download_this = download_this.filter(res="1080p").first()
            return None
        elif resolution == "mid":
            download_this = download_this[len(download_this)//2]
        else:
            download_this = download_this.first()
        download_this.download(filename=title)
        audio_title = self.download_audio(link)

    def download_audio(self, link):
        video = YouTube(link)
        title = self.get_title("{}-audio".format(video.title), ".mp4")
        # I see, when only downloadint the audio, we are still downloadint the video, but zero frames, just the audio, but its still beign saved as mp4. So when we go to conver it, the error "fps" error will occur. 
        # video.streams.filter(only_audio=True).first().download(filename=title)
        video.streams.filter(progressive=True).order_by("resolution").first().download(filename=title)

downloader = Downloader()
# downloader.download_video("https://youtu.be/XXYlFuWEuKI", "low")
downloader.download_audio("https://youtu.be/7IK_safV6pc")
