# Creates midi files and stores them in MIDIout folder
from midiutil import MIDIFile
import os.path
import json
import re

def create(t,instrument):
    tempo = 120
    channel  = 0
    duration = 1    # In beats
    volume   = 100  # 0-127, as per the MIDI standard
   
    track = MIDIFile(1)
    track.addTempo(track,0,tempo)

    for i in range(len(t)): # for each set of notes
        time = 0
        for n in range(len(t[i])): # for each count
            if (t[i][n] == 1):
                track.addNote(0, channel, 50, time, duration, volume)
            elif (t[i][n] != 0):
                print(str(t[i][n]) + " time is " + str(time) )
                track.addNote(0, channel, t[i][n], time, duration, volume)
            time = time + 1
 # 
    
    with open("MIDIout/"+instrument+".mid", "wb") as output_file:
        track.writeFile(output_file)
   





