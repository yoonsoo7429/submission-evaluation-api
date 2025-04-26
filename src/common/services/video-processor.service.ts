import { Injectable } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';

ffmpeg.setFfmpegPath(ffmpegPath);

@Injectable()
export class VideoProcessorService {
  async cropVideo(inputPath: string): Promise<string> {
    const outputPath = path.join(
      path.dirname(inputPath),
      `${uuidv4()}-cropped.mp4`,
    );

    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .videoFilters('crop=in_w-200:in_h:0:0')
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .run();
    });
  }

  async extractAudio(inputPath: string): Promise<string> {
    const outputPath = path.join(
      path.dirname(inputPath),
      `${uuidv4()}-audio.mp3`,
    );

    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .noVideo()
        .audioCodec('libmp3lame')
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .run();
    });
  }

  async deleteTempFiles(...paths: string[]) {
    paths.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  }
}
