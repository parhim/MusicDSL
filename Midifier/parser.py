# Parses text into a list of track objects
import re
import midi2mp3
import midifier
import json
import merge as m
# Opens input textfile
input = open("song.json")
#first line has 2 arguments of interest title and tempo
json_data = json.load(input)
title = json_data["Title"]
tracks = json_data["Song"]
length = 0
kick = []
organ = []
snare = []
guitar = []
hihat = []
for t in tracks:
    length=len(t["Notes"])
    if (t["Instrument"] == "Kick"):
        kick.append(t["Notes"])
    elif (t["Instrument"] == "Snare"):
        snare.append(t["Notes"])
    elif (t["Instrument"] == "Organ"):
        organ.append(t["Notes"])
    elif (t["Instrument"] == "HiHat"):
        hihat.append(t["Notes"])
    elif (t["Instrument"] == "Guitar"):
        guitar.append(t["Notes"])



midifier.create(kick, 'kick') 
midifier.create(snare, 'snare') 
midifier.create(organ, 'organ') 
midifier.create(hihat, 'hihat')
midifier.create(guitar, 'guitar')

midi2mp3.start(title)   
##
# gotta have a function that counts the maximum 
# amount of measures across all tracks at the end 
# of parsing, and appends silence MIDI for 
# the tracks with less than maxMeasures measures