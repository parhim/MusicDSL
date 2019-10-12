# Parses text into a list of track objects
import re
import midi2mp3
import midifier
# Opens input textfi;e
input = open("input.txt")
#first line has 2 arguments of interest title and tempo
l = input.readline()
args = re.split(',',l[l.find('(')+1:l.find(')')])
title = args[0]
tempo = int(args[1])

print("title is " + title)
print("tempo is " + str(tempo) + "\n---------")

# start going over all the lines until you reach 'end'
while True:
    line = input.readline()
    if line.startswith('end'):
        midi2mp3.start(title)
    else:
        if not line: 
            break
        midifier.create(line,tempo)
        

# gotta have a function that counts the maximum 
# amount of measures across all tracks at the end 
# of parsing, and appends silence MIDI for 
# the tracks with less than maxMeasures measures