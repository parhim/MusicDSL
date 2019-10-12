# Creates midi files and stores them in MIDIout folder
from midiutil import MIDIFile
import json
data = {
    "drum1":[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    "drum2":[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
    "silence":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "full":[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    "actually": [64,64,64,0,64,64,64,0,64,67,60,62,64,0,0,0]
}

def create(line, tempo):
    tSeq = line.split(' track:')
    instrument = tSeq[0][7:]
    sequence = tSeq[1].strip()[:-1].split(',')
    print(instrument + " with the following sequence of measures")
    print(sequence)

    channel  = 0
    time     = 0    # first beat
    duration = 1    # In beats
    volume   = 100  # 0-127, as per the MIDI standard
    track = MIDIFile(1)
    track.addTempo(track,time,tempo)

    for el in sequence:
        degrees = data[el]
        for pitch in degrees:
            if pitch != 0:
                track.addNote(0, channel, pitch, time, duration, volume)
            time = time + 1

    with open("MIDIout/"+instrument+".mid", "wb") as output_file:
        track.writeFile(output_file)





