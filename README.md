#PlugSimple
##How to Use
Currently plugSimple is still in an early developmental state.  What does this mean?  Well, many of the features are not fully implemented and some usage features won't exist yet.  For example currently to change any settings you need to know some basic Javscript and ChromeDevTools.  Currently I would not suggest using this unless you know both of those listed before.

If you are congratulations you can now start using plugSimple.  I highly recommend you check out the [usage](#usage) section in this pose to learn the basics of how to utilize plugSimple to it's fullest.

Now to the part you were waiting for...

####Download and Bookmarklet
You can download the extension from this repository, or directly get it here, or if you just plan on using plugSimple you can get the bookmarklet by dragging this link to your bookmarks bar [plugSimple](javascript:alert("Hi").

##Reasoning
Down to brass tacks, I got tired of my badly coded, lazily written pluggedIn.  I didn't like at all how I did things.

I really wanted to change it, but a full code rewrite would be simpler than going through **a ton of code** literally 26,000 characters which technically isn't much but it's a lot to have to just go and fix stuff that already worked.

In the end the only reason plugSimple exists is because, I was not the best at writing good runtime programs at the time I made pluggedIn.  An example is, the update() method, ran every time a user changed their settings, but it took 15ms+ to go through the method.  Way to long when someone can just spam click the settings to freeze the tab.

##What's Different
Mostly it's all in the code, all the major items like the initialization methods, take ~1ms to complete on a good computer, vs the 15ms+ of the old version.  I wanted to separate certain aspects off as well.

Likewise I didn't want to make GUI item like in pluggedIn when I could just make a separate class that has all of the items in it.  This cleaned up so much code, the space a Chat() method takes up, ~30 or more lines, than just having other methods like notify and confirm just clogged up the code.  I removed these and placed them in a separate class, [in this repo](https://github.com/itotallyrock/PlugInterfaceAPI).  Another good reason for this is if any of you or anyone out there wants to effectively use the existing plug.dj GUI they would need to scan through the code to find the right methods to call *which I did* than just call `$.getScript("url")` to import the class and call a method from that.  Way simpler.

I also created a CommandAPI I really did this because I noticed many currently existing plug.dj addons have commands.  And each of them have their own command-handling-methods which I found clogged my code as well.  It wasn't necessary but it was simple to make and it will be used in this addon, I hope other developers use it as well.

Doing this makes plugSimple more of an engine of currently existing APIs that other developers can utilize.  I hope this let's more people make interesting addons for [plug.dj](https://plug.dj).
###New Features
Currently nothing else major, most of the changes have been logic rewrites, I mean a few small things.

I added a tick method that will loop every tickPerSecond.  I use this to call a getETA() method that will show the ETA to DJ.  I can also add stuff here in the future to be called.

I did remove the old GUI, it is unnecessary for this addon at this point.  If you are using this at this point you are slightly tech savy and probably know how to open the Javascript console and call a method.  There will be some form of more user friendly access to change your settings, ~~at the moment I have a command that you can type to change your settings, but it is currently in work-in-progress and most likely not work~~.

##Why Use This
Well, you don't have to, I do this as a personal project, just because I like plug.dj and I enjoy coding.  I mean it is really simple compared to other options out there.  There is no data saving, plugCubed for example saves your IP, and sends messages to a socks server which can use up network, or computer resources.  All plugSimple does is send a small query to a server to track how many times this script is activated, but even if you don't want this feature you can disable it.  If you want to use something like [RadiantCommunity Script](https://rcs.radiant.dj/) or [plugCubed](https://plugcubed.net/) by all means go ahead, but first you should give this a shot.
###Features
More coming soon you can see here at my [trello](https://trello.com/b/c3ioChoJ/plugsimple).
But current features include
* AutoDJ
* AutoWoot
* ETA Timer
* Configurable Settings
* Chat Status Bars (Just a border next the message to shows your relation with the sender.)
* Verbose/Debug (This will make sense if you are developer)

##Usage
###Console Usage
To Change a setting, you have to type two console commands
```javascript
plugSimple.settings./*YOUR SETTING*/;//Replace YOUR SETTING with any setting value ie. autodj, autowoot, verbose, etc.
plugSimple.init.update();//Update the settings so they apply to the current instance (also saves your settings)
```
To utilize some of the other features like the ETA Timer you need to call one method that will return the time estimated till you can DJ
```javascript
plugSimple.core.getETA();//Returns time in milliseconds
plugSimple.util.formatTime(plugSimple.core.getETA());//Return formated ETA HH:MM:SS
```
To stop all of plugSimple only one method is required
```javascript
plugSimple.init.stop(EXIT_CODE);
//EXIT_CODE can be 0-4
//Refering to ["undefined","Relaunching","Unknown Crash","Syntax Crash","Stuck in loop"]
```
This will stop the tick loop, the autoDJ, autoWoot, and ETA features.  It will also delete the plugSimple variable.
