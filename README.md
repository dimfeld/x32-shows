This utility reads in a scene file, extracts the names on the channels, and then reads a `cues.txt`
file to generate cues that mute and unmute those channels at the appropriate time.

You can also reference preset snippets.

The output is a X32 show which contains the originally referenced scene and cues and snippets that correspond to the
settings in `cues.txt`.

This is intentionally simple, but there's a lot more you could probably do with this given the easy-to-read format of
the snippets.
