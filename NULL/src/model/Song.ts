export default interface Song {
    Title: string;
    Song: Section[]
  }

interface Section {
    Instrument: string;
    Notes: number[]
}