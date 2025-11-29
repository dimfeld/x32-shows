#!/bin/bash
set -ex
# cp '/Volumes/NO NAME/Rosie2025.000.scn' ./Rosie2025Input.scn
../generate_cues.mts
cp Rosie2025.* '/Volumes/USB DISK/Rosie2025/'
