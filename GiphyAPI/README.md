# Giphy API
## Purpose.
I decided to start this project for the sole purpose of learning how to use Express/MongoDB together.
Of course, it's a very simple application, so I still have much to learn but for now, the goal has been met. 
I used **express** for server-side operations, and with the help of **mongoose**, I stored information such as: *sign up*, *log in*, and *favorites*. When I have free-time/more knowledge I would like to further the
the potential of this program!
## Features to be added in the future
### 1) Algorithm to show gifs based on the past searches (learn?)
### 2) Folders for certain gifs.
### x) more to come...
## Roadblocks?
I encountered many roadblocks throughout the development of the program. First I had to decide whether I wanted to use SQL or MongoDB
for my database storage. With much research, it came down to MongoDB as it had a package named **Mongoose** that
made it easier for node to communicate with MongoDB. If I were using Python/Flask then my choice would be SQL.
## Major problem
I took inspiration from the Giphy layout of their gifs. So I had to create three separate columns which would store all
the gifs. By looping over each gif, I could find the index and module by x amount of columns there are on the page.
Successfully placing each gif in the right column, thus giving me the Giphy layout; with the help of flexbox, I was able to
make the page responsive too.
## Medium Problem
I had to learn a bit about *Sessions* from express, as from previous knowledge sessions help store vital information of 
the current user in the browser. It should be assumed that password should not be stored in the browser, but a certain identifier
to figure out who is currently browsing the website. So, with the help of **express-session** I was able to keep track of the
user's id and Mongoose helped me get relevant information from the database based on the id.
# Knowledge expanded
### 1) Sessions (beginner)
### 2) Routes (confident)
### 3) Templates (confident)
### 4) EJS (confident)
### 5) FlexBox (confident)
### 6) Express (beginner)
### 7) Mongoose/MongoDB (child)

# Examples
## Signed Out Home Page
![Home Screen](https://github.com/theloneprogrammer729/DailyProjects/blob/main/GiphyAPI/images/signedOut.PNG?raw=true)
## Signed In Home Page
![Signed In](https://github.com/theloneprogrammer729/DailyProjects/blob/main/GiphyAPI/images/signedIn.PNG?raw=true)
## Hovered
![Hovered](https://github.com/theloneprogrammer729/DailyProjects/blob/main/GiphyAPI/images/hovered.PNG?raw=true)
## Liked
![Liked](https://github.com/theloneprogrammer729/DailyProjects/blob/main/GiphyAPI/images/liked.PNG?raw=true)
## Favorite's Page
![Favorites](https://github.com/theloneprogrammer729/DailyProjects/blob/main/GiphyAPI/images/favorites.PNG?raw=true)

I really liked this project ;) **The layout came out amazing!!!!!**
Mario Molinito
