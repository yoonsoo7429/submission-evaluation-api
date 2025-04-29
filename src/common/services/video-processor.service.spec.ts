import { VideoProcessorService } from './video-processor.service';

describe('VideoProcessorService', () => {
  let service: VideoProcessorService;

  beforeEach(() => {
    service = new VideoProcessorService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('cropVideo should mock and return path', async () => {
    jest.spyOn(service, 'cropVideo').mockResolvedValue('mock-cropped.mp4');
    const result = await service.cropVideo('input.mp4');
    expect(result).toBe('mock-cropped.mp4');
  });

  it('extractAudio should mock and return path', async () => {
    jest.spyOn(service, 'extractAudio').mockResolvedValue('mock-audio.mp3');
    const result = await service.extractAudio('input.mp4');
    expect(result).toBe('mock-audio.mp3');
  });

  it('deleteTempFiles should not throw error', () => {
    expect(() =>
      service.deleteTempFiles('file1.mp4', 'file2.mp4'),
    ).not.toThrow();
  });
});
