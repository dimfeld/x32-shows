#!/bin/bash
set -ex
# cp '/Volumes/NO NAME/Rosie2024.000.scn' ./Rosie2024Input.scn
../generate_cues.mts
cp Rosie2024.* '/Volumes/USB DISK/Rosie2024/'
