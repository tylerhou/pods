# Pods

An app to let people listen to music simultaneously.  Each pod has a central
playlist which people can add to by using SoundCloud's library. Listening
progress, current track, and play/pause are synced across all participants.
Just enter a room and start playing music!

## Screenshots

List of pods
![List of pods](https://raw.githubusercontent.com/tylerhou/pods/master/screenshots/podlist.png)

A pod
![A pod](https://raw.githubusercontent.com/tylerhou/pods/master/screenshots/podview.png)

Search
![Search](https://raw.githubusercontent.com/tylerhou/pods/master/screenshots/search.png)

## Requirements
`yarn`, `brew`, `npm`, `watchman` (installed with `brew install watchman`). OS
X.  Android should be supported, but it is untested. Xcode is required for iOS
Simulator and compiling to a iPhone.

## Installation Instructions

```
# clone the repository
$ git clone https://github.com/tylerhou/pods && cd pods/native
# install dependencies
$ yarn
# install react-native-cli
$ npm install -g react-native-cli
# build
$ react-native run-ios
# run the packager if it isn't already started
$ react-native start

These steps should open an iOS Simulator.


