This utility is designed to work with the Behringer X32 sound mixer board. It reads in an X32 scene file, extracts the names on the channels, and then reads a `cues.txt`
file to generate cues that mute and unmute those channels at the appropriate time.

You can also reference preset snippets.

The output is a X32 show which contains the originally referenced scene and cues and snippets that correspond to the
settings in `cues.txt`.

This is intentionally simple, but there's a lot more you could probably do with this given the easy-to-read format of
the snippets.

Requirements:

- Node.js 16 or greater
- An X32 sound board
- A USB drive to copy files between your computer and the board.
