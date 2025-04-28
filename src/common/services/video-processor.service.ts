import { Injectable } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';

const ffmpegPath = require('ffmpeg-static') as string;
const ffprobePath = require('ffprobe-static').path as string;
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

@Injectable()
export class VideoProcessorService {
  async cropVideo(inputPath: string): Promise<string> {
    const outputPath = path.join(
      path.dirname(inputPath),
      `${uuidv4()}-cropped.mp4`,
    );

    let width = 1280; // 기본 width
    let height = 720;

    try {
      // ffprobe로 영상 크기 읽기
      const metadata = await new Promise<{ width: number; height: number }>(
        (resolve, reject) => {
          ffmpeg.ffprobe(inputPath, (err, metadata) => {
            if (err) return reject(err);
            const { width, height } = metadata.streams[0];
            resolve({ width, height });
          });
        },
      );

      width = metadata.width;
      height = metadata.height;
    } catch (error) {
      console.log(error);
      // this.logger.error(`ffprobe 실패: ${error.message}`);
    }

    // 좌측 그림
    const leftImageWidth = Math.floor(width * 0.5);

    // crop 파라미터 생성
    const cropWidth = width - leftImageWidth;
    const cropHeight = height;
    const xOffset = leftImageWidth;
    const yOffset = 0;

    const cropFilter = `crop=${cropWidth}:${cropHeight}:${xOffset}:${yOffset}`;

    // ffmpeg 실행
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .videoFilters(cropFilter)
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
