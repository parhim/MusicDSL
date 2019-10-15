# combines multiple midi tracks with corresponding sounds for each midi into one wav/mp3 file 
from midi2audio import FluidSynth
from pydub import AudioSegment

def start(title):
    
    fs = FluidSynth('soundfonts/Scratch_2_0.sf2')
    fs.midi_to_audio('MIDIout/kick.mid', 'kick.wav')

    fs = FluidSynth('soundfonts/FluidR3_GS.sf2')
    fs.midi_to_audio('MIDIout/guitar.mid', 'guitar.wav')

    fs.midi_to_audio('MIDIout/hihat.mid', 'hihat.wav')

    fs = FluidSynth('soundfonts/FluidR3_GS.sf2')
    fs.midi_to_audio('MIDIout/organ.mid', 'organ.wav')

    fs.midi_to_audio('MIDIout/snare.mid', 'snare.wav')

    sound1 = AudioSegment.from_file("kick.wav")
    sound2 = AudioSegment.from_file("guitar.wav")
    sound3 = AudioSegment.from_file("hihat.wav")
    sound4 = AudioSegment.from_file("organ.wav")
    sound5 = AudioSegment.from_file("snare.wav")


    sound12 = sound1.overlay(sound2)
    sound123 = sound12.overlay(sound3)
    sound1234 = sound123.overlay(sound4)
    sound12345 = sound1234.overlay(sound5)

    combined = sound1.overlay(sound2).overlay(sound3).overlay(sound4).overlay(sound5)


    combined.export("title.wav", format='wav')